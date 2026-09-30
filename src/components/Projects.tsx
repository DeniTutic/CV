import Image from "next/image";
import { ArrowUpRight, Check, FolderGit2 } from "lucide-react";
import { moreProjects, profile, projects, type Project } from "@/data/profile";
import { GithubIcon } from "./icons";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

function hostOf(url: string) {
  return new URL(url).host;
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
          intro="Live products — AI apps that put LLMs into real workflows, and client work that had to be right on day one."
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
            {moreProjects.map((p) => {
              const inner = (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <FolderGit2 className="size-5 text-accent" />
                    {p.href && <ArrowUpRight className="size-4 text-muted transition group-hover:text-fg" />}
                  </div>
                  <h4 className="mt-3 font-semibold text-fg">{p.name}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{p.description}</p>
                  <p className="mt-3 font-mono text-[11px] text-fg-soft">{p.stack.join(" · ")}</p>
                </>
              );
              const cls =
                "glow-card group block h-full rounded-xl border border-line bg-surface/60 p-5 transition hover:border-line-strong";
              return p.href ? (
                <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" className={cls}>
                  {inner}
                </a>
              ) : (
                <div key={p.name} className={cls}>
                  {inner}
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
