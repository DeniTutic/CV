import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/components/Providers";
import { profile } from "@/data/profile";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "latin-ext"],
});

const description =
  "Deni Tutić — Full-Stack & AI Engineer relocating from Sarajevo to Denver, CO. React, Node.js, Next.js and LLM integrations. 4+ years shipping web apps with U.S.-based teams.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${profile.name} — ${profile.role}`,
  description,
  alternates: { canonical: "/" },
  keywords: [
    "Deni Tutić",
    "Full-Stack Developer",
    "AI Engineer",
    "React",
    "Node.js",
    "Next.js",
    "LLM",
    "Sarajevo",
    "Denver",
  ],
  authors: [{ name: profile.name, url: profile.github }],
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07090d" },
    { media: "(prefers-color-scheme: light)", color: "#f6f8fa" },
  ],
};

// Structured data so search engines can tie "Deni Tutić" to this site and profiles.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  url: siteUrl,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Sarajevo", addressCountry: "BA" },
  worksFor: { "@type": "Organization", name: profile.currently.company },
  alumniOf: { "@type": "CollegeOrUniversity", name: "International Burch University" },
  knowsAbout: ["React", "Node.js", "Next.js", "TypeScript", "LLM integrations", "Full-stack development"],
  sameAs: [profile.github, profile.linkedin],
};

// Runs before paint so the saved theme never flashes. Dark is the default.
const themeScript = `try{var t=localStorage.getItem("theme");document.documentElement.dataset.theme=t==="light"?"light":"dark"}catch(e){document.documentElement.dataset.theme="dark"}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrains.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
