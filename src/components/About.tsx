import { about } from "@/data/profile";
import { Counter } from "./Counter";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

type Children = { children: React.ReactNode };
const K = ({ children }: Children) => <span className="tok-key">{children}</span>;
const S = ({ children }: Children) => <span className="tok-str">&quot;{children}&quot;</span>;
const P = ({ children }: Children) => <span className="tok-punc">{children}</span>;

function CodeCard() {
  return (
    <div className="glow-card overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <div className="flex items-center justify-between border-b border-line bg-surface-2/60 px-4 py-2.5">
        <span className="font-mono text-xs text-muted">deni.ts</span>
        <span className="font-mono text-[10px] tracking-wider text-muted uppercase">TypeScript</span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-6">
        <code>
          <span className="tok-kw">const</span> deni <P>=</P> <P>{"{"}</P>
          {"\n  "}
          <K>role</K>
          <P>:</P> <S>Full-Stack & AI Engineer</S>
          <P>,</P>
          {"\n  "}
          <K>based</K>
          <P>:</P> <S>Sarajevo, BiH</S>
          <P>,</P>
          {"\n  "}
          <K>education</K>
          <P>:</P> <S>B.Sc. IT · IBU &apos;26</S>
          <P>,</P>
          {"\n  "}
          <K>focus</K>
          <P>: [</P>
          <S>LLM apps</S>
          <P>, </P>
          <S>full-stack</S>
          <P>, </P>
          <S>clean UX</S>
          <P>],</P>
          {"\n  "}
          <K>traits</K>
          <P>: [</P>
          {"\n    "}
          <S>problem solver</S>
          <P>, </P>
          <S>team player</S>
          <P>,</P>
          {"\n    "}
          <S>always learning</S>
          <P>, </P>
          <S>clear communicator</S>
          <P>,</P>
          {"\n  "}
          <P>],</P>
          {"\n  "}
          <K>languages</K>
          <P>: {"{"} </P>
          <K>en</K>
          <P>:</P> <S>professional</S>
          <P>, </P>
          <K>bs</K>
          <P>:</P> <S>native</S>
          <P> {"}"},</P>
          {"\n  "}
          <K>openTo</K>
          <P>:</P> <S>U.S. relocation</S>
          <P>,</P>
          {"\n"}
          <P>{"}"};</P>
        </code>
      </pre>
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
                      {s.plain ? (
                        <Counter from={2015} to={s.value} />
                      ) : (
                        <Counter to={s.value} suffix={s.suffix} />
                      )}
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
            <CodeCard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
