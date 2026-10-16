import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Tests the model fallback in src/app/api/chat/route.ts against a fake Gemini, so no
// API key, quota or network is needed. Each test loads a fresh copy of the route,
// because it remembers the last working model in module state.

type Call = { model: string; signal: AbortSignal };

const gemini = vi.hoisted(() => ({
  calls: [] as { model: string; signal: AbortSignal }[],
  // Decides what each model does; set per test.
  respond: (() => new Promise(() => {})) as (call: { model: string; signal: AbortSignal }) => Promise<unknown>,
}));

vi.mock("@google/genai", () => {
  class ApiError extends Error {
    status: number;
    constructor({ message, status }: { message: string; status: number }) {
      super(message);
      this.status = status;
    }
  }
  class GoogleGenAI {
    models = {
      generateContentStream: ({ model, config }: { model: string; config: { abortSignal: AbortSignal } }) => {
        const call = { model, signal: config.abortSignal };
        gemini.calls.push(call);
        return gemini.respond(call);
      },
    };
  }
  return { ApiError, GoogleGenAI, ThinkingLevel: { LOW: "LOW" } };
});

vi.mock("next/server", () => ({ after: () => {}, connection: async () => {} }));
vi.mock("@/lib/chat-log", () => ({ describeDevice: () => "test", saveChat: async () => {} }));
vi.mock("@/lib/preferred-model", () => ({
  loadPreferredModel: async () => undefined,
  savePreferredModel: async () => {},
}));

const { ApiError } = await import("@google/genai");

const answer = (text: string) =>
  Promise.resolve(
    (async function* () {
      yield { text };
    })(),
  );
const fail = (status: number) => Promise.reject(new ApiError({ message: `HTTP ${status}`, status }));
// A model that never starts answering, until it's cancelled.
const hang = ({ signal }: Call) =>
  new Promise((_, reject) => signal.addEventListener("abort", () => reject(new Error("aborted"))));

function ask(POST: (request: Request) => Promise<Response>) {
  return POST(
    new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "203.0.113.7" },
      body: JSON.stringify({ messages: [{ role: "user", content: "What does Deni do?" }] }),
    }),
  );
}

async function loadRoute() {
  vi.resetModules();
  return (await import("@/app/api/chat/route")).POST;
}

describe("chat model fallback", () => {
  beforeEach(() => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    vi.spyOn(console, "error").mockImplementation(() => {});
    gemini.calls = [];
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("answers with the first model when it responds", async () => {
    gemini.respond = ({ model }) => answer(`hi from ${model}`);
    const res = await ask(await loadRoute());

    expect(res.status).toBe(200);
    expect(gemini.calls).toHaveLength(1);
    expect(await res.text()).toBe(`hi from ${gemini.calls[0].model}`);
  });

  it("moves to the next model right away when one fails", async () => {
    gemini.respond = ({ model }) => (gemini.calls.length === 1 ? fail(503) : answer(`hi from ${model}`));
    const res = await ask(await loadRoute());

    expect(gemini.calls).toHaveLength(2);
    expect(gemini.calls[1].model).not.toBe(gemini.calls[0].model);
    expect(await res.text()).toBe(`hi from ${gemini.calls[1].model}`);
  });

  it("starts a second model when the first hangs, and cancels the first", async () => {
    vi.useFakeTimers();
    gemini.respond = (call) => (gemini.calls.length === 1 ? hang(call) : answer(`hi from ${call.model}`));
    const pending = ask(await loadRoute());

    await vi.advanceTimersByTimeAsync(1_999);
    expect(gemini.calls).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(gemini.calls).toHaveLength(2);

    const res = await pending;
    expect(await res.text()).toBe(`hi from ${gemini.calls[1].model}`);
    expect(gemini.calls[0].signal.aborted).toBe(true);
  });

  it("asks the model that answered last first next time", async () => {
    gemini.respond = ({ model }) => (gemini.calls.length === 1 ? fail(503) : answer(`hi from ${model}`));
    const POST = await loadRoute();
    await (await ask(POST)).text();
    const winner = gemini.calls[1].model;

    gemini.calls = [];
    gemini.respond = ({ model }) => answer(`hi from ${model}`);
    await (await ask(POST)).text();

    expect(gemini.calls[0].model).toBe(winner);
  });

  it("says the daily quota is used up when every model is rate limited", async () => {
    gemini.respond = () => fail(429);
    const res = await ask(await loadRoute());

    expect(res.status).toBe(429);
    expect((await res.json()).error).toMatch(/out of answers for today/);
  });

  it("returns the email fallback when models fail for other reasons", async () => {
    gemini.respond = () => fail(503);
    const res = await ask(await loadRoute());

    expect(res.status).toBe(503);
    expect((await res.json()).error).toMatch(/isn't available right now/);
  });
});
