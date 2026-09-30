import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Journey } from "@/components/Journey";
import { Nav } from "@/components/Nav";
import { PointerEffects } from "@/components/PointerEffects";
import { Projects } from "@/components/Projects";
import { Stack } from "@/components/Stack";

export default function Home() {
  return (
    <>
      <a
        href="#about"
        className="sr-only z-[60] rounded-md bg-fg px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <PointerEffects />
      <Nav />
      <main className="overflow-x-clip">
        <Hero />
        <About />
        <Journey />
        <Projects />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
