"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Briefcase, Code2, GraduationCap, Laptop, MapPin } from "lucide-react";
import { journey, type JourneyKind } from "@/data/profile";
import { SectionHeading } from "./SectionHeading";

const kindIcon: Record<JourneyKind, typeof Briefcase> = {
  work: Briefcase,
  education: GraduationCap,
  freelance: Laptop,
  milestone: Code2,
};

export function Journey() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 25, restDelta: 0.001 });

  return (
    <section id="journey" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="02"
          label="journey"
          title="From first lines of HTML to shipping AI in production."
          intro="Remote work with U.S. teams since 2023, crypto payment products, a university internship and a steady stream of freelance builds."
        />

        <ol ref={listRef} className="relative">
          {/* rail + scroll-linked progress */}
          <div aria-hidden className="absolute top-2 bottom-2 left-[19px] w-px bg-line md:left-[calc(11rem+19px)]" />
          <motion.div
            aria-hidden
            style={{ scaleY }}
            className="absolute top-2 bottom-2 left-[19px] w-px origin-top bg-gradient-to-b from-accent via-accent-2 to-accent md:left-[calc(11rem+19px)]"
          />

          {journey.map((item) => {
            const Icon = kindIcon[item.kind];
            return (
              <motion.li
                key={`${item.title}-${item.period}`}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
                className="relative grid grid-cols-[40px_1fr] gap-x-5 pb-10 last:pb-0 md:grid-cols-[11rem_40px_1fr]"
              >
                <p className="hidden pt-2.5 text-right font-mono text-xs leading-5 text-muted md:block">
                  {item.period}
                </p>

                <div className="relative z-10 flex justify-center pt-0.5">
                  <span
                    className={`grid size-10 place-items-center rounded-full border bg-surface ${
                      item.current
                        ? "border-ok/60 text-ok shadow-[0_0_0_4px_color-mix(in_oklab,var(--ok)_15%,transparent)]"
                        : item.kind === "education" || item.kind === "milestone"
                          ? "border-accent-2/50 text-accent-2"
                          : "border-line-strong text-accent"
                    }`}
                  >
                    <Icon className="size-4" />
                  </span>
                </div>

                <div className="glow-card min-w-0 rounded-2xl border border-line bg-surface/70 p-5 transition-colors hover:border-line-strong sm:p-6">
                  <p className="mb-2 font-mono text-xs text-muted md:hidden">{item.period}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="text-lg font-semibold text-fg">{item.title}</h3>
                    {item.current && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-ok/10 px-2 py-0.5 font-mono text-[11px] text-ok">
                        <span className="pulse-dot size-1.5 rounded-full bg-ok" /> now
                      </span>
                    )}
                  </div>
                  {item.org && (
                    <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-fg-soft">
                      {item.orgUrl ? (
                        <a href={item.orgUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-accent hover:underline">
                          {item.org}
                        </a>
                      ) : (
                        <span className="font-medium text-accent">{item.org}</span>
                      )}
                      {item.location && (
                        <>
                          <span className="hidden text-line-strong sm:inline">/</span>
                          <span className="inline-flex items-center gap-1 text-muted">
                            <MapPin className="size-3.5" />
                            {item.location}
                          </span>
                        </>
                      )}
                    </p>
                  )}
                  {item.points && (
                    <ul className="mt-4 space-y-2">
                      {item.points.map((pt) => (
                        <li key={pt} className="flex gap-3 text-[15px] leading-relaxed text-fg-soft">
                          <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-accent" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.tags && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {item.tags.map((t) => (
                        <span key={t} className="rounded-md border border-line bg-bg-soft px-2 py-0.5 font-mono text-[11px] text-muted">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
