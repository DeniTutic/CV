"use client";

import { motion } from "motion/react";
import { Brain, Code2, Database, Languages, Layout, Server, Wrench } from "lucide-react";
import { skills, spokenLanguages } from "@/data/profile";
import { SectionHeading } from "./SectionHeading";

const groupIcon: Record<string, typeof Code2> = {
  Languages: Code2,
  Frontend: Layout,
  Backend: Server,
  Databases: Database,
  "AI & Cloud": Brain,
  Tools: Wrench,
};

export function Stack() {
  return (
    <section id="stack" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="04"
          label="stack"
          title="Tools I reach for."
          intro="Comfortable across the whole stack — and picking the right tool over the familiar one."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, gi) => {
            const Icon = groupIcon[group.group] ?? Code2;
            return (
              <motion.div
                key={group.group}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -60px 0px" }}
                transition={{ duration: 0.5, delay: (gi % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="glow-card rounded-2xl border border-line bg-surface/70 p-6 transition-colors hover:border-line-strong"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-lg border border-line bg-bg-soft text-accent">
                    <Icon className="size-4" />
                  </span>
                  <h3 className="font-mono text-sm font-medium text-fg">{group.group}</h3>
                </div>
                <motion.ul
                  className="mt-5 flex flex-wrap gap-2"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035, delayChildren: 0.2 } } }}
                >
                  {group.items.map((s) => (
                    <motion.li
                      key={s}
                      variants={{ hidden: { opacity: 0, scale: 0.85 }, show: { opacity: 1, scale: 1 } }}
                      className="rounded-md border border-line bg-bg-soft px-2.5 py-1 font-mono text-xs text-fg-soft transition-colors hover:border-accent/50 hover:text-fg"
                    >
                      {s}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-line bg-surface/70 px-6 py-4"
        >
          <span className="flex items-center gap-2 font-mono text-sm text-fg">
            <Languages className="size-4 text-accent" /> Spoken
          </span>
          {spokenLanguages.map((l) => (
            <span key={l.name} className="text-sm text-fg-soft">
              {l.name} <span className="text-muted">— {l.level}</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
