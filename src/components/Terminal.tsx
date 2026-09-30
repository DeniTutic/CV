"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

type Line = { cmd: string; out: React.ReactNode };

const lines: Line[] = [
  {
    cmd: "whoami",
    out: (
      <>
        deni tutić — <span className="text-accent">full-stack & ai engineer</span>
      </>
    ),
  },
  {
    cmd: "cat now.txt",
    out: (
      <>
        <span className="text-ok">→</span> building AI features @ <span className="text-fg">Cybermetis</span> (U.S., remote)
      </>
    ),
  },
  {
    cmd: "ls ~/stack",
    out: (
      <span className="flex flex-wrap gap-x-3 gap-y-0.5">
        {["react", "next.js", "node", "express", "mongodb", "postgres", "claude-api"].map((s) => (
          <span key={s} className="text-accent-2">
            {s}/
          </span>
        ))}
      </span>
    ),
  },
  {
    cmd: "echo $STATUS",
    out: (
      <>
        <span className="text-ok">✓</span> B.Sc. IT (IBU &apos;26) · open to relocation → U.S.
      </>
    ),
  },
];

const TYPE_MS = 45;
const PAUSE_MS = 380;

export function Terminal() {
  const reduce = useReducedMotion();
  // step = index of the line being typed; chars = characters typed of that command
  const [step, setStep] = useState(0);
  const [chars, setChars] = useState(0);
  const [showOut, setShowOut] = useState(false);

  useEffect(() => {
    if (reduce || step >= lines.length) return;
    const cmd = lines[step].cmd;
    let t: ReturnType<typeof setTimeout>;
    if (chars < cmd.length) {
      t = setTimeout(() => setChars((c) => c + 1), step === 0 && chars === 0 ? 700 : TYPE_MS);
    } else if (!showOut) {
      t = setTimeout(() => setShowOut(true), 160);
    } else {
      t = setTimeout(() => {
        setStep((s) => s + 1);
        setChars(0);
        setShowOut(false);
      }, PAUSE_MS);
    }
    return () => clearTimeout(t);
  }, [step, chars, showOut, reduce]);

  const done = Boolean(reduce) || step >= lines.length;

  return (
    <div className="glow-card overflow-hidden rounded-2xl border border-line bg-surface/80 shadow-card backdrop-blur">
      <div className="flex items-center gap-2 border-b border-line bg-surface-2/60 px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-xs text-muted">deni@sarajevo: ~</span>
      </div>
      <div
        className="min-h-[19rem] space-y-3 p-5 font-mono text-[13px] leading-relaxed sm:text-sm"
        aria-label="Terminal introducing Deni"
      >
        {lines.map((line, i) => {
          if (!done && i > step) return null;
          const typed = i < step || done ? line.cmd : line.cmd.slice(0, chars);
          const outVisible = i < step || done || (i === step && showOut);
          const typing = i === step && !done;
          return (
            <div key={line.cmd}>
              <div className="text-fg">
                <span className="text-ok">➜</span> <span className="text-accent">~</span>{" "}
                <span className={typing && !showOut ? "caret" : ""}>{typed}</span>
              </div>
              {outVisible && <div className="mt-1 pl-4 text-fg-soft">{line.out}</div>}
            </div>
          );
        })}
        {done && (
          <div className="text-fg">
            <span className="text-ok">➜</span> <span className="text-accent">~</span> <span className="caret" />
          </div>
        )}
      </div>
    </div>
  );
}
