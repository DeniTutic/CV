"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, Copy, Download, Mail, MapPin, Phone } from "lucide-react";
import { profile } from "@/data/profile";
import { GithubIcon, LinkedinIcon } from "./icons";
import { Reveal } from "./Reveal";

const channels = [
  { label: "LinkedIn", value: "in/deni-tutic", href: profile.linkedin, Icon: LinkedinIcon },
  { label: "GitHub", value: "DeniTutic", href: profile.github, Icon: GithubIcon },
  { label: "Phone · WhatsApp · Viber", value: profile.phone, href: profile.phoneHref, Icon: Phone },
  { label: "Based in", value: "Sarajevo, BiH · open to U.S.", Icon: MapPin },
];

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="glow-card relative overflow-hidden rounded-3xl border border-line bg-surface/80 p-8 sm:p-12 lg:p-16">
            <div aria-hidden className="bg-grid absolute inset-0 -z-10 opacity-70" />
            <div aria-hidden className="blob -z-10 -top-20 -right-20 size-80 bg-[var(--glow-2)]" />

            <p className="font-mono text-sm text-accent">
              <span className="text-muted">05.</span> {"// contact"}
            </p>
            <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-fg sm:text-5xl lg:text-6xl">
              Let&apos;s build <span className="text-gradient">something good.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-soft">
              Hiring for a full-stack or AI role, or have a product that needs shipping? I reply fast — the inbox is
              the quickest way to reach me.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 rounded-lg bg-fg px-5 py-3 text-sm font-medium text-bg transition hover:opacity-90"
              >
                <Mail className="size-4" />
                {profile.email}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="relative inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-3 text-sm font-medium text-fg transition hover:border-line-strong"
                aria-label="Copy email address"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {copied ? (
                    <motion.span key="ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="inline-flex items-center gap-2 text-ok">
                      <Check className="size-4" /> Copied
                    </motion.span>
                  ) : (
                    <motion.span key="copy" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="inline-flex items-center gap-2">
                      <Copy className="size-4" /> Copy
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <a
                href={profile.resume}
                download
                className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-3 text-sm font-medium text-fg transition hover:border-line-strong"
              >
                <Download className="size-4" /> Résumé
              </a>
              <span role="status" aria-live="polite" className="sr-only">
                {copied ? "Email copied to clipboard" : ""}
              </span>
            </div>

            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {channels.map(({ label, value, href, Icon }) => {
                const body = (
                  <>
                    <Icon className="size-5 text-accent" />
                    <p className="mt-3 text-xs text-muted">{label}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-sm font-medium text-fg">
                      {value}
                      {href?.startsWith("http") && (
                        <ArrowUpRight className="size-3.5 text-muted transition group-hover:text-fg" />
                      )}
                    </p>
                  </>
                );
                const cls = "group block rounded-xl border border-line bg-bg-soft/60 p-4 transition hover:border-line-strong";
                return href ? (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className={cls}
                  >
                    {body}
                  </a>
                ) : (
                  <div key={label} className={cls}>
                    {body}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
