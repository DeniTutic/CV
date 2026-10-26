import Image from "next/image";
import {
  ArrowUpRight,
  Check,
  FlaskConical,
  LayoutTemplate,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { moreProjects, profile, projects, type MoreProject, type Project } from "@/data/profile";
import { GithubIcon } from "./icons";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

function hostOf(url: string) {
  return new URL(url).host;
}

const moreIcon: Record<MoreProject["kind"], LucideIcon> = {
  ai: Sparkles,
  web: LayoutTemplate,
  mobile: Smartphone,
  qa: FlaskConical,
};

function MoreCard({ project }: { project: MoreProject }) {
  const Icon = moreIcon[project.kind];
  const link = "inline-flex items-center gap-1.5 text-fg-soft transition hover:text-accent";
  const visual = project.image ? (
    <Image
      src={project.image}
      alt={`Screenshot of ${project.name}`}
      placeholder="blur"
      sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
      className="size-full object-cover object-top transition duration-700 ease-out group-hover:scale-[1.04]"
    />
  ) : (
    // No live site to screenshot: a large icon on a faint grid keeps the row even.
    <div className="relative grid size-full place-items-center">
      <div
        aria-hidden
        className="bg-grid absolute inset-0"
        style={{
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(circle at 50% 50%, #000 25%, transparent 75%)",
        }}
      />
      <span className="relative grid size-14 place-items-center rounded-2xl border border-line-strong bg-surface text-accent shadow-card">
        <Icon className="size-6" />
      </span>
    </div>
  );
  return (
    <article className="glow-card group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface/60 transition hover:border-line-strong">
      <div
        className={`relative overflow-hidden border-b border-line bg-bg-soft ${
          project.image ? "aspect-[16/10]" : "aspect-[16/6] sm:aspect-[16/10]"
        }`}
      >
        {project.live ? (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.name} live site`}
            tabIndex={-1}
            className="block size-full"
          >
            {visual}
          </a>
        ) : (
          visual
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-5">
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-bg-soft text-accent">
            <Icon className="size-4" />
          </span>
          <div className="min-w-0">
            <h4 className="font-semibold text-fg">{project.name}</h4>
            <p className="font-mono text-[11px] text-muted">{project.kicker}</p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span key={s} className="rounded-md border border-line bg-bg-soft px-2 py-0.5 font-mono text-[11px] text-fg-soft">
              {s}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center gap-4 pt-5 font-mono text-xs">
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" className={link}>
              live site
              <ArrowUpRight className="size-3.5" />
            </a>
          )}
          {project.code && (
            <a href={project.code} target="_blank" rel="noopener noreferrer" className={link}>
              <GithubIcon className="size-3.5" />
              code
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function ProjectCard({ project, priority }: { project: Project; priority?: boolean }) {
  return (
    <article className="glow-card group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface/70 transition duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-card">
      <a
        href={project.live}
        target="_blank"
        rel="noopener noreferrer"
        className="block border-b border-line"
        aria-label={`Open ${project.name} live site`}
        tabIndex={-1}
      >
        <div className="flex items-center gap-2 bg-surface-2/70 px-3 py-2">
          <span className="size-2 rounded-full bg-line-strong" />
          <span className="size-2 rounded-full bg-line-strong" />
          <span className="size-2 rounded-full bg-line-strong" />
          <span className="ml-2 min-w-0 truncate rounded bg-bg-soft px-2 py-0.5 font-mono text-[11px] text-muted">
            {hostOf(project.live)}
          </span>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden bg-bg-soft">
          <Image
            src={project.image}
            alt={`Screenshot of ${project.name}`}
            placeholder="blur"
            priority={priority}
            sizes="(min-width: 1024px) 540px, 100vw"
            className="size-full object-cover object-top transition duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/40 to-transparent" />
        </div>
      </a>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-xs text-accent">{project.kicker}</p>
          {project.badge && (
            <span className="rounded-full border border-accent-2/40 bg-accent-2/10 px-2.5 py-0.5 font-mono text-[11px] text-accent-2">
              {project.badge}
            </span>
          )}
        </div>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-fg">{project.name}</h3>
        <p className="mt-3 leading-relaxed text-fg-soft">{project.description}</p>

        <ul className="mt-4 space-y-2">
          {project.highlights.map((h) => (
            <li key={h} className="flex gap-2.5 text-sm text-muted">
              <Check className="mt-0.5 size-4 shrink-0 text-ok" />
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span key={s} className="rounded-md border border-line bg-bg-soft px-2 py-0.5 font-mono text-[11px] text-fg-soft">
              {s}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-2 pt-6">
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-fg px-3.5 py-2 text-sm font-medium text-bg transition hover:opacity-90"
          >
            Live site
            <ArrowUpRight className="size-4" />
          </a>
          {project.code && (
            <a
              href={project.code}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-sm font-medium text-fg transition hover:border-line-strong"
            >
              <GithubIcon className="size-4" />
              Code
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="03"
          label="projects"
          title="Things I've built and shipped."
          intro="Live products: AI apps that put LLMs into real workflows, and client work that had to be right on day one."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={(i % 2) * 0.1} className="h-full min-w-0">
              <ProjectCard project={p} priority={i < 2} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h3 className="font-mono text-sm text-muted">
              <span className="text-accent">{"//"}</span> more builds
            </h3>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 font-mono text-sm text-fg-soft transition hover:text-accent"
            >
              everything on GitHub
              <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {moreProjects.map((p) => (
              <div key={p.name} className="min-w-0">
                <MoreCard project={p} />
              </div>
            ))}
          </div>
          <p className="mt-8 text-center font-mono text-sm text-muted">…and many more.</p>
        </Reveal>
      </div>
    </section>
  );
}
