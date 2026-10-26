import { about, seeking } from "@/data/profile";
import { Counter } from "./Counter";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

// At-a-glance answers to what recruiters ask first. Plain rows, not code,
// so it reads the same to someone who doesn't write TypeScript.
function AvailabilityCard() {
  return (
    <div className="glow-card overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <div className="flex items-center justify-between border-b border-line bg-surface-2/60 px-4 py-2.5">
        <span className="font-mono text-xs text-muted">~/availability</span>
        <span className="font-mono text-[10px] tracking-wider text-muted uppercase">At a glance</span>
      </div>
      <dl className="divide-y divide-line">
        {seeking.map(({ label, value }) => (
          <div key={label} className="grid grid-cols-[6rem_1fr] gap-4 px-5 py-4">
            <dt className="font-mono text-xs leading-6 text-muted">{label}</dt>
            <dd className="text-[15px] leading-6 text-fg">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading index="01" label="about" title="Engineer who ships, end to end." />

        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div className="min-w-0">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className="mb-5 text-lg leading-relaxed text-fg-soft">{p}</p>
              </Reveal>
            ))}

            <div className="mt-10 grid grid-cols-2 gap-4">
              {about.stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.07}>
                  <div className="rounded-xl border border-line bg-surface/60 p-5">
                    <p className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                      {s.plain ? s.value : <Counter to={s.value} suffix={s.suffix} />}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {s.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.15} x={24} y={0} className="min-w-0">
            <AvailabilityCard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
