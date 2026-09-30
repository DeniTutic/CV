import type { StaticImageData } from "next/image";
import cvlensShot from "@/assets/projects/cvlens.webp";
import carinaShot from "@/assets/projects/carina.webp";
import velaShot from "@/assets/projects/vela.webp";
import vocarShot from "@/assets/projects/vocar.webp";

// All site content lives here. Edit this file to update the portfolio.

export const profile = {
  name: "Deni Tutić",
  initials: "DT",
  role: "Full-Stack & AI Engineer",
  tagline: "React · Node.js · LLM Integrations",
  location: "Sarajevo, Bosnia and Herzegovina",
  relocation: "Open to relocation to the U.S.",
  email: "denitutic1@gmail.com",
  phone: "+387 62 858 621",
  phoneHref: "tel:+38762858621",
  whatsapp: "https://wa.me/38762858621",
  github: "https://github.com/DeniTutic",
  linkedin: "https://www.linkedin.com/in/deni-tutic",
  resume: "/Deni-Tutic-Resume.pdf",
  // Set to "/profile.jpg" (placed in /public) to replace the monogram with a photo.
  photo: null as string | null,
  currently: { company: "Cybermetis", role: "Full-Stack & AI Engineer" },
};

export const heroRoles = [
  "full-stack web apps",
  "AI-powered products",
  "React & Node.js platforms",
  "LLM integrations that ship",
];

export const about = {
  paragraphs: [
    "I'm a full-stack and AI engineer with 4+ years of shipping web applications end to end — from the data model to deployment. Since 2023 I've worked remotely with U.S.-based teams, contributing to two crypto payment products: a multi-currency wallet and a point-of-sale system.",
    "These days I build AI apps that put LLM APIs into real user workflows, not demos. I care about clean architecture, fast and friendly UIs, and getting a solid V1 in front of users quickly. I graduated with a B.Sc. in Information Technology from International Burch University in July 2026.",
  ],
  stats: [
    { value: 4, suffix: "+", label: "years shipping web apps" },
    { value: 10, suffix: "+", label: "freelance apps delivered" },
    { value: 2, suffix: "", label: "crypto payment products" },
    { value: 2023, suffix: "", label: "started shipping with U.S. teams", plain: true },
  ],
};

export type JourneyKind = "work" | "education" | "freelance" | "milestone";

export type JourneyItem = {
  kind: JourneyKind;
  period: string;
  title: string;
  org?: string;
  orgUrl?: string;
  location?: string;
  points?: string[];
  tags?: string[];
  current?: boolean;
};

export const journey: JourneyItem[] = [
  {
    kind: "work",
    period: "Sep 2026 — Present",
    title: "Full-Stack & AI Engineer",
    org: "Cybermetis",
    location: "Remote · U.S.-based",
    current: true,
    points: [
      "Build full-stack features and AI-powered capabilities for a B2B/B2C platform in the cybersecurity space (details under NDA).",
      "Work across the stack — front end, back end and LLM integration — with a U.S. team through daily standups and a pull-request review workflow.",
    ],
    tags: ["React", "Node.js", "LLM APIs"],
  },
  {
    kind: "education",
    period: "Jul 2026",
    title: "B.Sc. in Information Technology",
    org: "International Burch University",
    orgUrl: "https://www.ibu.edu.ba/",
    location: "Sarajevo, BiH",
    points: [
      "Graduated after studying software engineering, OOP, data structures & algorithms, databases, web and mobile development, software project management, and software verification & testing.",
    ],
    tags: ["Graduated"],
  },
  {
    kind: "work",
    period: "Aug 2025 — Oct 2025",
    title: "Software Development Intern",
    org: "University Teleinformatics Center (UTIC)",
    location: "Sarajevo, BiH",
    points: [
      "Implemented backend data-validation and archiving logic for the university's academic management system.",
      "Improved the React front end's UI/UX and worked on performance optimization across the full-stack system.",
    ],
    tags: ["Spring Boot", "MS SQL Server", "React"],
  },
  {
    kind: "work",
    period: "Jan 2024 — Jan 2025",
    title: "Full-Stack Developer",
    org: "Aurora Code Factory",
    location: "Remote · U.S.-based",
    points: [
      "Contributed React and Node.js features to dPay, a crypto point-of-sale system that lets businesses accept payments in multiple cryptocurrencies.",
      "Collaborated remotely with a U.S.-based engineering team in an Agile/Scrum process.",
    ],
    tags: ["React", "Node.js", "Agile/Scrum"],
  },
  {
    kind: "work",
    period: "May 2023 — Jan 2024",
    title: "Software Development Intern → promoted",
    org: "Aurora Code Factory",
    location: "Remote · U.S.-based",
    points: [
      "Contributed Node.js backend features to Dyos Wallet, a multi-currency crypto wallet for sending, receiving and exchanging digital assets.",
      "Promoted to full-time Full-Stack Developer after 8 months.",
    ],
    tags: ["Node.js", "Crypto"],
  },
  {
    kind: "freelance",
    period: "Jun 2021 — Present",
    title: "Full-Stack Developer",
    org: "Freelance",
    location: "Remote",
    points: [
      "Delivered 10+ web applications for local businesses from concept to deployment, scoping each build to the client's needs.",
      "Built secure REST APIs with JWT and OAuth 2.0 (Auth0), paired with responsive, mobile-first React front ends.",
    ],
    tags: ["React", "Node.js", "Express", "MongoDB"],
  },
  {
    kind: "education",
    period: "2021",
    title: "Started B.Sc. in Information Technology",
    org: "International Burch University",
    orgUrl: "https://www.ibu.edu.ba/",
    location: "Sarajevo, BiH",
  },
  {
    kind: "milestone",
    period: "2020",
    title: "Hello, world",
    points: ["Where it all started — first lines of HTML, then never stopped building."],
  },
];

export type Project = {
  name: string;
  kicker: string;
  description: string;
  highlights: string[];
  stack: string[];
  image: StaticImageData;
  live: string;
  code?: string;
  badge?: string;
};

export const projects: Project[] = [
  {
    name: "Vela",
    kicker: "AI relationship-clarity app",
    description:
      "An AI chat app that reads between the lines of confusing conversations, spots red flags and helps you decide what to say next.",
    highlights: [
      "Practice mode: the AI role-plays the other person, then scores a debrief",
      "Voice input with OpenAI Whisper, Stripe payments, JWT auth and i18n",
    ],
    stack: ["React", "Node.js", "MongoDB", "Claude API", "Whisper", "Stripe"],
    image: velaShot,
    live: "https://vela-situationship-ai-tranlator.vercel.app",
    code: "https://github.com/DeniTutic/vela-situationship-ai-tranlator",
  },
  {
    name: "Carina",
    kicker: "AI health insights app",
    description:
      "A weekly health check-in that compares your sleep, mood, energy, movement and eating with your usual week and turns it into one calm, AI-generated briefing.",
    highlights: [
      "Taken from requirements to a deployed V1 in under two days",
      "Bilingual (EN / BS) with validated, number-checked AI output",
    ],
    stack: ["Next.js", "PostgreSQL", "Prisma", "Claude API"],
    image: carinaShot,
    live: "https://carina-three.vercel.app",
  },
  {
    name: "CVlens",
    kicker: "AI CV analyzer",
    description:
      "Upload a CV and get a prioritised action plan — exactly what to add, remove and modify, with the reason it matters and paste-ready replacement text.",
    highlights: [
      "Parses PDF & DOCX, schema-enforced JSON from the model",
      "Auth0 login with Google, MongoDB Atlas persistence",
    ],
    stack: ["React", "Express", "MongoDB", "Auth0", "Gemini API"],
    image: cvlensShot,
    live: "https://ai-cv-cc.vercel.app",
    code: "https://github.com/DeniTutic/ai-cv-cc",
  },
  {
    name: "Voćar",
    kicker: "Company website & product catalog",
    description:
      "A bilingual website for a family snack producer from Gornji Rahić, BiH — 42 products across 12 product families, quality story and where-to-buy.",
    highlights: [
      "Built for a real client, from scope to deployment",
      "Bosnian / English i18n, product catalog and detail pages",
    ],
    stack: ["Next.js", "i18n", "Responsive UI"],
    image: vocarShot,
    live: "https://vocar-website.vercel.app",
    badge: "Client work",
  },
];

export const moreProjects = [
  {
    name: "Personal Budget Tracker",
    description: "Native Android app on MVVM & clean architecture, Room persistence, StateFlow/Coroutines.",
    stack: ["Kotlin", "Jetpack Compose", "Room"],
  },
  {
    name: "Ironclad Construction",
    description: "Conversion-focused landing page for a construction company — services, projects, process, testimonials, FAQ and a quick-quote form.",
    stack: ["React", "TypeScript", "Vite", "shadcn/ui"],
    href: "https://sturdy-site-shine.vercel.app",
  },
  {
    name: "SVVT Test Suite",
    description: "15+ Selenium scenarios covering navigation, forms, security, performance and accessibility.",
    stack: ["Java", "Selenium WebDriver"],
    href: "https://github.com/DeniTutic/SVVT-Project-2025",
  },
];

export const skills = [
  { group: "Languages", items: ["JavaScript", "TypeScript", "Java", "Python", "Kotlin", "SQL"] },
  { group: "Frontend", items: ["React", "Next.js", "Vite", "HTML5", "CSS", "Responsive UI", "i18n"] },
  { group: "Backend", items: ["Node.js", "Express", "Spring Boot", "REST APIs", "Socket.io", "JWT", "OAuth 2.0", "Auth0"] },
  { group: "Databases", items: ["MongoDB", "Mongoose", "PostgreSQL", "Prisma", "MySQL", "MS SQL Server"] },
  { group: "AI & Cloud", items: ["Claude API", "OpenAI Whisper", "Vercel", "Railway", "AWS", "Stripe", "Cloudinary"] },
  { group: "Tools", items: ["Git", "GitHub", "Postman", "Selenium", "Agile/Scrum"] },
];

export const spokenLanguages = [
  { name: "English", level: "Professional working" },
  { name: "Bosnian / Croatian / Serbian", level: "Native" },
];

export const nav = [
  { id: "about", label: "about" },
  { id: "journey", label: "journey" },
  { id: "projects", label: "projects" },
  { id: "stack", label: "stack" },
  { id: "contact", label: "contact" },
];
