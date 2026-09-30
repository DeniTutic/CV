import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  index: string;
  label: string;
  title: React.ReactNode;
  intro?: string;
};

export function SectionHeading({ index, label, title, intro }: SectionHeadingProps) {
  return (
    <Reveal className="mb-12 max-w-2xl">
      <p className="mb-3 font-mono text-sm text-accent">
        <span className="text-muted">{index}.</span> {"// "}
        {label}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">{title}</h2>
      {intro && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{intro}</p>}
    </Reveal>
  );
}
