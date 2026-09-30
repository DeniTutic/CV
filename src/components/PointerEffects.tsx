"use client";

import { useEffect } from "react";

// One pointer listener that feeds the CSS spotlight/glow variables:
// --mx/--my on [data-spotlight] and --cx/--cy on every .glow-card.
export function PointerEffects() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        document.querySelectorAll<HTMLElement>("[data-spotlight]").forEach((el) => {
          const r = el.getBoundingClientRect();
          el.style.setProperty("--mx", `${e.clientX - r.left}px`);
          el.style.setProperty("--my", `${e.clientY - r.top}px`);
        });
        document.querySelectorAll<HTMLElement>(".glow-card").forEach((el) => {
          const r = el.getBoundingClientRect();
          el.style.setProperty("--cx", `${e.clientX - r.left}px`);
          el.style.setProperty("--cy", `${e.clientY - r.top}px`);
        });
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return null;
}
