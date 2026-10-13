import { ApiError, GoogleGenAI, ThinkingLevel, type Content } from "@google/genai";
import { after } from "next/server";
import { profile } from "@/data/profile";
import { NO_INFO, systemPrompt } from "@/lib/assistant-prompt";
import { describeDevice, saveChat, type ChatEntry } from "@/lib/chat-log";

// Gemini API free tier (key from https://aistudio.google.com/apikey): no card, no cost,
// but daily request limits, and Google may use free-tier chats to improve its products.
// Free models, tried in order: the next one is used when one is overloaded, slow or out of quota.
const MODELS = ["gemini-3.8-flash", "gemini-3.6-flash", "gemini-3.5-flash-lite", "gemini-3-flash-preview"];
const RETRYABLE = new Set([429, 500, 503]);
const ATTEMPT_TIMEOUT_MS = 8_000; // how long a model gets to start answering
const MAX_HISTORY = 12; // most recent messages sent to the model
const MAX_QUESTION_CHARS = 1000;
const RATE_LIMIT = { max: 20, windowMs: 10 * 60_000 }; // per IP

const firstName = profile.name.split(" ")[0];
const UNAVAILABLE = `The assistant isn't available right now. You can reach ${firstName} at ${profile.email}.`;
const BLOCKED = `Sorry, I can't answer that one. Feel free to ask something else about ${firstName}'s work.`;

let ai: GoogleGenAI | undefined;

// Best-effort limiter: it lives in one server instance's memory and resets on cold
// starts. It keeps one visitor from using up the free tier's daily quota.
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  if (hits.size > 10_000) hits.clear();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT.max;
}

function parseMessages(body: unknown): Content[] | null {
  const raw = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(raw)) return null;

  const messages: Content[] = [];
  for (const item of raw) {
    const { role, content } = (item ?? {}) as Record<string, unknown>;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim();
    if (!text) continue;
    if (role === "user" && text.length > MAX_QUESTION_CHARS) return null;
    messages.push({ role: role === "user" ? "user" : "model", parts: [{ text: text.slice(0, 4000) }] });
  }

  let recent = messages.slice(-MAX_HISTORY);
  while (recent[0]?.role === "model") recent = recent.slice(1);
  return recent.at(-1)?.role === "user" ? recent : null;
}

// Where the visitor came from (e.g. linkedin.com), from the page's document.referrer.
function referrerHost(value: unknown, ownHost: string) {
  try {
    const host = new URL(String(value)).hostname.replace(/^www\./, "");
    return host && host !== ownHost ? host : undefined;
  } catch {
    return undefined;
  }
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (isRateLimited(ip)) {
    return Response.json({ error: "That's a lot of questions! Try again in a few minutes." }, { status: 429 });
  }

  const payload = await request.json().catch(() => null);
  const contents = parseMessages(payload);
  if (!contents) {
    return Response.json({ error: `Questions can be up to ${MAX_QUESTION_CHARS} characters.` }, { status: 400 });
  }

  // Who asked what, for the /admin chat log. Saved after the response is finished.
  const { session, from } = (payload ?? {}) as Record<string, unknown>;
  const visitor = {
    session: typeof session === "string" && /^[\w-]{8,64}$/.test(session) ? session : "unknown",
    question: contents.at(-1)?.parts?.[0]?.text ?? "",
    country: request.headers.get("x-vercel-ip-country") ?? undefined,
    city: decodeURIComponent(request.headers.get("x-vercel-ip-city") ?? "") || undefined,
    device: describeDevice(request.headers.get("user-agent") ?? ""),
    from: referrerHost(from, new URL(request.url).hostname),
  };
  const record = (result: () => Pick<ChatEntry, "answer" | "answered" | "model">, done?: Promise<void>) =>
    after(async () => {
      await done;
      try {
        await saveChat({ time: new Date().toISOString(), ...visitor, ...result() });
      } catch (error) {
        console.error("[chat] saving the chat failed:", error);
      }
    });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[chat] GEMINI_API_KEY is not set");
    record(() => ({ answer: UNAVAILABLE, answered: false, model: "" }));
    return Response.json({ error: UNAVAILABLE }, { status: 503 });
  }

  const abort = new AbortController();
  ai ??= new GoogleGenAI({ apiKey });
  let stream;
  let usedModel = "";
  let outOfQuota = true;
  for (const model of MODELS) {
    const attempt = new AbortController();
    const timer = setTimeout(() => attempt.abort(), ATTEMPT_TIMEOUT_MS);
    try {
      stream = await ai.models.generateContentStream({
        model,
        contents,
        config: {
          systemInstruction: `${systemPrompt}\n\nToday's date: ${new Date().toISOString().slice(0, 10)}`,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          maxOutputTokens: 2048, // includes thinking; caps how much one question can use
          abortSignal: AbortSignal.any([request.signal, abort.signal, attempt.signal]),
        },
      });
      usedModel = model;
      break;
    } catch (error) {
      if (request.signal.aborted) break;
      const timedOut = attempt.signal.aborted;
      const status = error instanceof ApiError ? error.status : undefined;
      console.error(`[chat] ${model} ${timedOut ? `timed out after ${ATTEMPT_TIMEOUT_MS / 1000}s` : "failed:"}`, timedOut ? "" : error);
      if (status !== 429) outOfQuota = false;
      if (!timedOut && !(status && RETRYABLE.has(status))) break;
    } finally {
      clearTimeout(timer);
    }
  }

  if (!stream) {
    const error = outOfQuota ? `The assistant is out of answers for today. You can reach ${firstName} at ${profile.email}.` : UNAVAILABLE;
    record(() => ({ answer: error, answered: false, model: "" }));
    return Response.json({ error }, { status: outOfQuota ? 429 : 503 });
  }

  // The reply as the visitor sees it, and whether the model flagged it as unanswerable.
  let reply = "";
  let answered = true;
  let finish!: () => void;
  const finished = new Promise<void>((resolve) => (finish = resolve));

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (text: string) => {
        if (!text) return;
        reply += text;
        controller.enqueue(encoder.encode(text));
      };
      // Hold back the start of the reply until we know whether it opens with NO_INFO.
      let head = "";
      let headSent = false;
      const sendHead = () => {
        headSent = true;
        const trimmed = head.trimStart();
        if (trimmed.startsWith(NO_INFO)) {
          answered = false;
          send(trimmed.slice(NO_INFO.length).trimStart());
        } else {
          send(head);
        }
      };

      try {
        for await (const chunk of stream) {
          const text = chunk.text;
          if (!text) continue;
          if (headSent) {
            send(text);
            continue;
          }
          head += text;
          const trimmed = head.trimStart();
          if (trimmed.length >= NO_INFO.length || !NO_INFO.startsWith(trimmed)) sendHead();
        }
        if (!headSent) sendHead();
        // Nothing came back, e.g. blocked by a safety filter.
        if (!reply) send(BLOCKED);
      } catch (error) {
        if (!request.signal.aborted && !abort.signal.aborted) {
          console.error("[chat] stream failed:", error);
          send(`${reply ? "\n\n" : ""}${UNAVAILABLE}`);
        }
      } finally {
        finish();
      }
      try {
        controller.close();
      } catch {} // already cancelled by the visitor
    },
    cancel() {
      abort.abort();
    },
  });

  record(() => ({ answer: reply, answered, model: usedModel }), finished);

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
