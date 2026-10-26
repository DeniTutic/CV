"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { nav } from "@/data/profile";

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

type Theme = "dark" | "light";

// Reads the theme from <html data-theme> (set before paint in layout.tsx).
function subscribeTheme(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const getTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");
const getServerTheme = (): Theme => "dark";

function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
      className="grid size-9 place-items-center rounded-lg border border-line bg-surface/60 text-muted transition hover:border-line-strong hover:text-fg"
    >
      {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </button>
  );
}

const ids = nav.map((n) => n.id);

export function Nav() {
  const active = useActiveSection(ids);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // A link's own jump doesn't scroll while the menu is open or closing,
  // so close the menu first and jump once it's gone.
  const pendingJump = useRef<string | null>(null);
  const closeMenuThenJump = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!open) return;
    e.preventDefault();
    pendingJump.current = e.currentTarget.hash;
    setOpen(false);
  };
  const jump = () => {
    const hash = pendingJump.current;
    pendingJump.current = null;
    if (!hash) return;
    history.pushState(null, "", hash);
    document.getElementById(hash.slice(1))?.scrollIntoView();
  };
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "border-b border-line bg-bg/75 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-[-1px] h-px origin-left bg-gradient-to-r from-accent to-accent-2"
        style={{ scaleX: progress }}
      />
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="group font-mono text-sm font-medium text-fg" aria-label="Back to top">
          <span className="text-accent">~</span>/deni
          <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-accent opacity-0 transition group-hover:opacity-100" />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`relative rounded-md px-3 py-2 font-mono text-sm transition-colors ${
                  active === item.id ? "text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {active === item.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-md bg-surface-2"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="text-accent/70">.</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            onClick={closeMenuThenJump}
            className="inline-flex rounded-lg bg-fg px-3 py-1.5 text-sm font-medium text-bg transition hover:opacity-90"
          >
            Let&apos;s talk
          </a>
          <ThemeToggle />
          <button
            type="button"
            className="grid size-9 place-items-center rounded-lg border border-line bg-surface/60 text-muted md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence onExitComplete={jump}>
        {open && (
          <motion.ul
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-line px-4 md:hidden"
          >
            {nav.map((item, i) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
              >
                <a
                  href={`#${item.id}`}
                  onClick={closeMenuThenJump}
                  className="flex items-center gap-3 py-3.5 font-mono text-sm text-fg-soft"
                >
                  <span className="text-muted">0{i + 1}</span>
                  {item.label}
                </a>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
