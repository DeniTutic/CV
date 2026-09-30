import { ArrowDown, Download, Mail, MapPin } from "lucide-react";
import { heroRoles, profile } from "@/data/profile";
import { Avatar } from "./Avatar";
import { GithubIcon, LinkedinIcon } from "./icons";
import { Terminal } from "./Terminal";
import { Typewriter } from "./Typewriter";

const socials = [
  { href: profile.github, label: "GitHub", Icon: GithubIcon },
  { href: profile.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
  { href: `mailto:${profile.email}`, label: "Email", Icon: Mail },
];

// Staggered CSS entrance: each block gets its own --i delay step.
const step = (i: number) => ({ "--i": i }) as React.CSSProperties;

export function Hero() {
  return (
    <section
      id="top"
      data-spotlight
      className="relative isolate flex min-h-dvh items-center overflow-hidden pt-24 pb-16"
    >
      {/* background layers */}
      <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
      <div aria-hidden className="hero-spotlight absolute inset-0 -z-10" />
      <div aria-hidden className="blob -z-10 top-[-10%] left-[-10%] size-[28rem] bg-[var(--glow)]" />
      <div
        aria-hidden
        className="blob -z-10 right-[-12%] bottom-[5%] size-[32rem] bg-[var(--glow-2)]"
        style={{ animationDelay: "-6s" }}
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="min-w-0">
          <div className="rise" style={step(0)}>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1.5 font-mono text-xs text-fg-soft">
              <span className="pulse-dot size-2 shrink-0 rounded-full bg-ok" />
              Currently @ {profile.currently.company} · open to U.S. relocation
            </span>
          </div>

          <div className="rise mt-8 flex items-center gap-4" style={step(1)}>
            <Avatar size={64} />
            <div className="font-mono text-sm text-muted">
              <p className="text-fg-soft">
                <span className="text-accent">hello, world</span> — I&apos;m
              </p>
              <p className="flex items-center gap-1.5">
                <MapPin className="size-3.5 shrink-0" /> {profile.location}
              </p>
            </div>
          </div>

          <h1
            className="rise mt-6 text-5xl font-semibold tracking-tight text-fg sm:text-6xl lg:text-7xl"
            style={step(2)}
          >
            {profile.name}
          </h1>

          <p className="rise mt-3 text-xl font-medium text-fg-soft sm:text-2xl" style={step(3)}>
            {profile.role}
          </p>

          <p className="rise mt-5 max-w-xl text-lg leading-relaxed text-muted" style={step(4)}>
            I build <Typewriter words={heroRoles} />
            <br /> end to end — from the data model to deployment.
          </p>

          <div className="rise mt-9 flex flex-wrap items-center gap-3" style={step(5)}>
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-lg bg-fg px-5 py-3 text-sm font-medium text-bg transition hover:opacity-90"
            >
              View my work
              <ArrowDown className="size-4 transition group-hover:translate-y-0.5" />
            </a>
            <a
              href={profile.resume}
              download
              className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface/70 px-5 py-3 text-sm font-medium text-fg transition hover:border-line-strong"
            >
              <Download className="size-4" />
              Résumé (PDF)
            </a>
            <div className="ml-1 flex items-center gap-1">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-11 place-items-center rounded-lg text-muted transition hover:bg-surface-2 hover:text-fg"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="rise-card min-w-0">
          <Terminal />
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to About"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[11px] tracking-widest text-muted uppercase transition hover:text-fg sm:flex"
      >
        scroll
        <span className="scroll-line block h-8 w-px bg-gradient-to-b from-accent to-transparent" />
      </a>
    </section>
  );
}
