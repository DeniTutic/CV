import { ApiError, GoogleGenAI, ThinkingLevel, type Content } from "@google/genai";
import { profile } from "@/data/profile";
import { systemPrompt } from "@/lib/assistant-prompt";

// Gemini API free tier (key from https://aistudio.google.com/apikey): no card, no cost,
// but daily request limits, and Google may use free-tier chats to improve its products.
// Free models, tried in order: the next one is used when one is overloaded or out of quota.
const MODELS = ["gemini-3.8-flash", "gemini-3.6-flash", "gemini-3.5-flash-lite", "gemini-2.5-flash"];
const RETRYABLE = new Set([429, 500, 503]);
const MAX_HISTORY = 12; // most recent messages sent to the model
const MAX_QUESTION_CHARS = 1000;
const RATE_LIMIT = { max: 20, windowMs: 10 * 60_000 }; // per IP

const firstName = profile.name.split(" ")[0];
const UNAVAILABLE = `The assistant isn't available right now. You can reach ${firstName} at ${profile.email}.`;
const NO_ANSWER = `Sorry, I can't answer that one. Feel free to ask something else about ${firstName}'s work.`;

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

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (isRateLimited(ip)) {
    return Response.json({ error: "That's a lot of questions! Try again in a few minutes." }, { status: 429 });
  }

  const contents = parseMessages(await request.json().catch(() => null));
  if (!contents) {
    return Response.json({ error: `Questions can be up to ${MAX_QUESTION_CHARS} characters.` }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[chat] GEMINI_API_KEY is not set");
    return Response.json({ error: UNAVAILABLE }, { status: 503 });
  }

  const abort = new AbortController();
  ai ??= new GoogleGenAI({ apiKey });
  let stream;
  let outOfQuota = true;
  for (const model of MODELS) {
    try {
      stream = await ai.models.generateContentStream({
        model,
        contents,
        config: {
          systemInstruction: `${systemPrompt}\n\nToday's date: ${new Date().toISOString().slice(0, 10)}`,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          maxOutputTokens: 2048, // includes thinking; caps how much one question can use
          abortSignal: AbortSignal.any([request.signal, abort.signal]),
        },
      });
      break;
    } catch (error) {
      const status = error instanceof ApiError ? error.status : undefined;
      console.error(`[chat] ${model} failed:`, error);
      if (status !== 429) outOfQuota = false;
      if (!status || !RETRYABLE.has(status)) break;
    }
  }

  if (!stream) {
    if (outOfQuota) {
      return Response.json({ error: `The assistant is out of answers for today. You can reach ${firstName} at ${profile.email}.` }, { status: 429 });
    }
    return Response.json({ error: UNAVAILABLE }, { status: 503 });
  }

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let answered = false;
      try {
        for await (const chunk of stream) {
          const text = chunk.text;
          if (!text) continue;
          answered = true;
          controller.enqueue(encoder.encode(text));
        }
        // Nothing came back, e.g. blocked by a safety filter.
        if (!answered) controller.enqueue(encoder.encode(NO_ANSWER));
      } catch (error) {
        if (!request.signal.aborted && !abort.signal.aborted) {
          console.error("[chat] stream failed:", error);
          controller.enqueue(encoder.encode(`${answered ? "\n\n" : ""}${UNAVAILABLE}`));
        }
      }
      try {
        controller.close();
      } catch {} // already cancelled by the visitor
    },
    cancel() {
      abort.abort();
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
