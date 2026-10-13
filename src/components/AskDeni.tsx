"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, Sparkles, Square, X } from "lucide-react";
import { assistant, profile } from "@/data/profile";

type Message = { role: "user" | "assistant"; content: string; failed?: boolean };

const firstName = profile.name.split(" ")[0];
const MAX_CHARS = 1000;

// Turns plain URLs and email addresses in an answer into links.
const LINK = /(https?:\/\/[^\s<>()]+[^\s<>().,!?;:'"]|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

function Linkified({ text }: { text: string }) {
  return text.split(LINK).map((part, i) => {
    if (i % 2 === 0) return part;
    const href = part.includes("@") && !part.startsWith("http") ? `mailto:${part}` : part;
    return (
      <a
        key={i}
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="break-words text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
      >
        {part}
      </a>
    );
  });
}

export function AskDeni() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const wasOpen = useRef(false);
  useEffect(() => {
    if (!open) {
      // The launcher re-mounts on close; hand focus back to it.
      if (wasOpen.current) launcherRef.current?.focus();
      return;
    }
    wasOpen.current = true;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const ask = async (question: string) => {
    const text = question.trim().slice(0, MAX_CHARS);
    if (!text || pending) return;

    const history = [...messages.filter((m) => !m.failed && m.content), { role: "user" as const, content: text }];
    const show = (reply: Message) => setMessages([...history, reply]);
    show({ role: "assistant", content: "" });
    setInput("");
    setPending(true);

    const controller = new AbortController();
    abortRef.current = controller;
    let reply = "";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Something went wrong. You can email ${firstName} at ${profile.email}.`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        show({ role: "assistant", content: reply });
      }
    } catch (err) {
      if (controller.signal.aborted) {
        show({ role: "assistant", content: reply || "Stopped.", failed: !reply });
      } else {
        show({ role: "assistant", content: err instanceof Error ? err.message : String(err), failed: true });
      }
    } finally {
      setPending(false);
      abortRef.current = null;
    }
  };

  const asked = messages.some((m) => m.role === "user");

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            ref={launcherRef}
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed right-4 bottom-4 z-40 inline-flex items-center gap-2 rounded-full border border-line bg-surface/90 px-4 py-3 font-mono text-sm text-fg shadow-card backdrop-blur transition-colors hover:border-line-strong sm:right-6 sm:bottom-6"
          >
            <Sparkles className="size-4 text-accent" />
            ask about {firstName.toLowerCase()}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={`Ask an AI assistant about ${firstName}`}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed inset-x-4 bottom-4 z-50 flex h-[min(34rem,calc(100dvh-2rem))] flex-col overflow-hidden rounded-2xl border border-line bg-surface/95 shadow-card backdrop-blur-xl sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[25rem]"
          >
            <div className="flex items-center gap-2 border-b border-line bg-surface-2/60 px-4 py-3">
              <span className="size-3 rounded-full bg-[#ff5f57]" />
              <span className="size-3 rounded-full bg-[#febc2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 font-mono text-xs text-muted">ask-{firstName.toLowerCase()} · ai assistant</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
                className="ml-auto grid size-7 place-items-center rounded-md text-muted transition hover:bg-surface hover:text-fg"
              >
                <X className="size-4" />
              </button>
            </div>

            <div
              ref={logRef}
              role="log"
              aria-busy={pending}
              className="flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 text-sm leading-relaxed"
            >
              <p className="text-fg-soft">{assistant.greeting}</p>

              {messages.map((m, i) =>
                m.role === "user" ? (
                  <p key={i} className="font-mono text-[13px] break-words text-fg">
                    <span className="text-ok">➜</span> <span className="text-accent">~</span> {m.content}
                  </p>
                ) : (
                  <p key={i} className={`border-l border-line pl-3 whitespace-pre-wrap ${m.failed ? "text-muted" : "text-fg-soft"}`}>
                    {m.content ? <Linkified text={m.content} /> : (
                      <>
                        <span className="caret" />
                        <span className="sr-only">Thinking…</span>
                      </>
                    )}
                  </p>
                ),
              )}

              {!asked && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {assistant.suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => ask(s)}
                      className="rounded-full border border-line bg-bg-soft/60 px-3 py-1.5 text-left text-xs text-fg-soft transition hover:border-line-strong hover:text-fg"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="border-t border-line p-3"
            >
              <div className="flex items-center gap-2 rounded-xl border border-line bg-bg-soft/60 py-1.5 pr-1.5 pl-3 transition focus-within:border-line-strong">
                <span aria-hidden className="font-mono text-sm text-ok">
                  ➜
                </span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={MAX_CHARS}
                  placeholder={`Ask anything about ${firstName}…`}
                  aria-label="Your question"
                  className="min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-muted"
                />
                {pending ? (
                  <button
                    type="button"
                    onClick={() => abortRef.current?.abort()}
                    aria-label="Stop answering"
                    className="grid size-8 shrink-0 place-items-center rounded-lg border border-line text-fg transition hover:border-line-strong"
                  >
                    <Square className="size-3.5 fill-current" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    aria-label="Send question"
                    className="grid size-8 shrink-0 place-items-center rounded-lg bg-fg text-bg transition hover:opacity-90 disabled:opacity-30"
                  >
                    <ArrowUp className="size-4" />
                  </button>
                )}
              </div>
              <p className="mt-2 px-1 text-[11px] text-muted">
                AI answers from {firstName}&apos;s profile and can make mistakes. Double-check anything important.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
