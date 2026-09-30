import { ArrowUp } from "lucide-react";
import { profile } from "@/data/profile";
import { GithubIcon, LinkedinIcon } from "./icons";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <p className="text-center font-mono text-xs text-muted sm:text-left">
          © {new Date().getFullYear()} {profile.name} · Built with Next.js & Tailwind · Made in Sarajevo
        </p>
        <div className="flex items-center gap-1">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="grid size-9 place-items-center rounded-lg text-muted transition hover:bg-surface-2 hover:text-fg"
          >
            <GithubIcon className="size-4" />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="grid size-9 place-items-center rounded-lg text-muted transition hover:bg-surface-2 hover:text-fg"
          >
            <LinkedinIcon className="size-4" />
          </a>
          <a
            href="#top"
            aria-label="Back to top"
            className="ml-2 grid size-9 place-items-center rounded-lg border border-line text-muted transition hover:border-line-strong hover:text-fg"
          >
            <ArrowUp className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
