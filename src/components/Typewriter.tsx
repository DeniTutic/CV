"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

// Types each word, holds, deletes it, then moves to the next.
export function Typewriter({ words }: { words: string[] }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const word = words[index % words.length];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && text === word) {
      t = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && text === "") {
      t = setTimeout(() => {
        setDeleting(false);
        setIndex((i) => i + 1);
      }, 250);
    } else {
      t = setTimeout(
        () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
        deleting ? 30 : 65,
      );
    }
    return () => clearTimeout(t);
  }, [text, deleting, index, words, reduce]);

  return (
    <span aria-live="off" className="whitespace-nowrap">
      <span className="text-gradient font-medium">{reduce ? words[0] : text}</span>
      <span className="caret" aria-hidden />
    </span>
  );
}
