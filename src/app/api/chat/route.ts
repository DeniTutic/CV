import Anthropic from "@anthropic-ai/sdk";
import { profile } from "@/data/profile";
import { systemPrompt } from "@/lib/assistant-prompt";

// Haiku is the cheapest Claude model: well under $0.001 per question.
// "claude-opus-5-5" gives more polished answers at ~1¢ per question.
const MODEL = "claude-haiku-5-5";
const MAX_HISTORY = 12; // most recent messages sent to the model
const MAX_QUESTION_CHARS = 1000;
const RATE_LIMIT = { max: 20, windowMs: 10 * 60_000 }; // per IP

const firstName = profile.name.split(" ")[0];
const UNAVAILABLE = `The assistant isn't available right now. You can reach ${firstName} at ${profile.email}.`;
const DECLINED = `Sorry, I can't help with that one. Feel free to ask something else about ${firstName}'s work.`;

let client: Anthropic | undefined;

// Best-effort limiter: it lives in one server instance's memory and resets on cold
// starts. For real protection, add a rate-limit rule in the Vercel Firewall too.
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  if (hits.size > 10_000) hits.clear();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT.max;
}

function parseMessages(body: unknown): Anthropic.MessageParam[] | null {
  const raw = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(raw)) return null;

  const messages: Anthropic.MessageParam[] = [];
  for (const item of raw) {
    const { role, content } = (item ?? {}) as Record<string, unknown>;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim();
    if (!text) continue;
    if (role === "user" && text.length > MAX_QUESTION_CHARS) return null;
    messages.push({ role, content: text.slice(0, 4000) });
  }

  let recent = messages.slice(-MAX_HISTORY);
  while (recent[0]?.role === "assistant") recent = recent.slice(1);
  return recent.at(-1)?.role === "user" ? recent : null;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (isRateLimited(ip)) {
    return Response.json({ error: "That's a lot of questions! Try again in a few minutes." }, { status: 429 });
  }

  const messages = parseMessages(await request.json().catch(() => null));
  if (!messages) {
    return Response.json({ error: `Questions can be up to ${MAX_QUESTION_CHARS} characters.` }, { status: 400 });
  }

  let events;
  try {
    client ??= new Anthropic();
    events = await client.messages.create(
      {
        model: MODEL,
        max_tokens: 4096, // hard cap: this endpoint is public
        output_config: { effort: "low" },
        system: [
          { type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } },
          { type: "text", text: `Today's date: ${new Date().toISOString().slice(0, 10)}` },
        ],
        messages,
        stream: true,
      },
      { signal: request.signal },
    );
  } catch (error) {
    console.error("[chat] request failed:", error);
    if (error instanceof Anthropic.RateLimitError) {
      return Response.json({ error: "The assistant is busy. Try again in a minute." }, { status: 429 });
    }
    return Response.json({ error: UNAVAILABLE }, { status: 503 });
  }

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let stopReason: string | null = null;
      try {
        for await (const event of events) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          } else if (event.type === "message_delta") {
            stopReason = event.delta.stop_reason;
          }
        }
        if (stopReason === "refusal") controller.enqueue(encoder.encode(`\n\n${DECLINED}`));
      } catch (error) {
        if (!request.signal.aborted) {
          console.error("[chat] stream failed:", error);
          controller.enqueue(encoder.encode(`\n\n${UNAVAILABLE}`));
        }
      }
      try {
        controller.close();
      } catch {} // already cancelled by the visitor
    },
    cancel() {
      events.controller.abort();
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
