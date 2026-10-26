import type { StaticImageData } from "next/image";
import aqualuxShot from "@/assets/projects/aqualux.webp";
import cvlensShot from "@/assets/projects/cvlens.webp";
import carinaShot from "@/assets/projects/carina.webp";
import hirehandShot from "@/assets/projects/hirehand.webp";
import velaShot from "@/assets/projects/vela.webp";
import vocarShot from "@/assets/projects/vocar.webp";

// All site content lives here. Edit this file to update the portfolio.

export const profile = {
  name: "Deni Tutić",
  initials: "DT",
  role: "Full-Stack & AI Engineer",
  tagline: "React · Node.js · LLM Integrations",
  location: "Sarajevo, Bosnia and Herzegovina",
  // Shown in the hero status line, the About card and the contact section.
  movingTo: "Denver, CO",
  availableFrom: "May 2027",
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
    "I'm a full-stack and AI engineer with 4+ years of shipping web applications end to end, from the data model to deployment. Since 2023 I've worked remotely with U.S.-based teams, contributing to two crypto payment products: a multi-currency wallet and a point-of-sale system.",
    "These days I build AI apps that put LLM APIs into real user workflows, not demos. I care about clean architecture, fast and friendly UIs, and getting a solid V1 in front of users quickly. I graduated with a B.Sc. in Information Technology from International Burch University in July 2026.",
  ],
  stats: [
    { value: 4, suffix: "+", label: "years shipping web apps" },
    { value: 10, suffix: "+", label: "freelance apps delivered" },
    { value: 2, suffix: "", label: "crypto payment products" },
    { value: 2023, suffix: "", label: "started shipping with U.S. teams", plain: true },
  ],
};

// Recruiter-facing snapshot in the About section. Keep in sync with src/data/knowledge.ts.
export const seeking = [
  { label: "Roles", value: "Full-stack & AI engineering" },
  { label: "Type", value: "Full-time, contract, or freelance" },
  { label: "Where", value: "Remote, hybrid, or on-site in Denver" },
  { label: "Available", value: profile.availableFrom },
  { label: "Work auth", value: "No U.S. visa sponsorship needed" },
];

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
    period: "Sep 2026 - Present",
    title: "Full-Stack & AI Engineer",
    org: "Cybermetis",
    location: "Remote · U.S.-based",
    current: true,
    points: [
      "Build full-stack features and AI-powered capabilities for a B2B/B2C platform in the cybersecurity space (details under NDA).",
      "Work across the full stack, from front end and back end to LLM integration, with a U.S. team through daily standups and a pull-request review workflow.",
    ],
    tags: ["React", "Node.js", ".NET", "PostgreSQL", "Docker", "Azure DevOps", "LLM APIs"],
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
    period: "Aug 2025 - Oct 2025",
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
    period: "Jan 2024 - Jan 2025",
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
    period: "May 2023 - Jan 2024",
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
    period: "Jun 2021 - Present",
    title: "Founder & Full-Stack Developer",
    org: "Flowforge Systems",
    orgUrl: "https://flowforge-systems.vercel.app/",
    location: "Remote",
    points: [
      "Started freelancing in 2021, building web apps for local businesses, and after 10+ delivered projects turned it into Flowforge Systems, a small web and AI agency.",
      "Design and ship conversion-focused websites, landing pages and AI automations end to end, like Hirehand, an AI phone assistant that answers calls, books appointments and sends reminders.",
      "Build with Next.js, React and Tailwind CSS on the front end, Node.js/Express REST APIs secured with JWT and OAuth 2.0 (Auth0), and LLM APIs for the AI features.",
    ],
    tags: ["Next.js", "React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "LLM APIs"],
  },
  {
    kind: "milestone",
    period: "2020",
    title: "Hello, world",
    points: ["Where it all started: first lines of HTML, then never stopped building."],
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
    name: "Hirehand",
    kicker: "AI phone assistant for small businesses",
    description:
      "An AI employee for restaurants, cafés, salons and clinics: it answers the phone in Bosnian and English, books and cancels appointments, reminds clients and writes the reports.",
    highlights: [
      "Bookings and reminders flow into the owner's own Google Sheets, Gmail and Calendar",
      "Bilingual landing site with a page and missed-calls calculator for each business type",
    ],
    stack: ["Next.js", "Three.js", "Voice AI", "Google Workspace", "Playwright"],
    image: hirehandShot,
    live: "https://gethirehand.vercel.app/en",
    badge: "Flowforge product",
  },
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
    live: "https://getvela.vercel.app",
  },
  {
    name: "Voćar",
    kicker: "Company website & product catalog",
    description:
      "A bilingual website for a family snack producer from Gornji Rahić, BiH: 42 products across 12 product families, a quality story and where-to-buy.",
    highlights: [
      "Built for a real client, from scope to deployment",
      "Bosnian / English i18n, product catalog and detail pages",
    ],
    stack: ["Next.js", "i18n", "Responsive UI"],
    image: vocarShot,
    live: "https://vocar-website.vercel.app",
    badge: "Client work",
  },
  {
    name: "Aqua Lux",
    kicker: "Car wash website concept",
    description:
      "A website for a premium car wash: pick a package from a lit menu board, build your wash with add-ons and send a booking request in a few taps.",
    highlights: [
      "The chosen package and add-ons carry straight into the booking form",
      "Scroll-linked \"wash tunnel\" nav lights up each stage, from foam to dry",
    ],
    stack: ["React", "TypeScript", "TanStack Start", "Tailwind CSS", "shadcn/ui"],
    image: aqualuxShot,
    live: "https://aqua-lux-wash.vercel.app",
  },
];

// Smaller cards under the featured projects. `kind` picks the card's icon;
// the first two (with screenshots) get the wide cards on desktop.
export type MoreProject = {
  name: string;
  kind: "ai" | "web" | "mobile" | "qa";
  kicker: string;
  description: string;
  stack: string[];
  image?: StaticImageData;
  live?: string;
  code?: string;
};

export const moreProjects: MoreProject[] = [
  {
    name: "Carina",
    kind: "ai",
    kicker: "AI health insights app",
    description:
      "A weekly health check-in that compares your sleep, mood, energy and movement with your usual week, then writes one calm AI briefing in English or Bosnian.",
    stack: ["Next.js", "PostgreSQL", "Prisma", "Claude API"],
    image: carinaShot,
    live: "https://carina-three.vercel.app",
  },
  {
    name: "CVlens",
    kind: "ai",
    kicker: "AI CV analyzer",
    description:
      "Upload a CV (PDF or DOCX) and get a prioritised action plan: what to add, remove and modify, why it matters, and paste-ready replacement text.",
    stack: ["React", "Express", "MongoDB", "Auth0", "Gemini API"],
    image: cvlensShot,
    live: "https://ai-cv-cc.vercel.app",
  },
  {
    name: "Ironclad Construction",
    kind: "web",
    kicker: "Landing page",
    description:
      "Conversion-focused landing page for a construction company: services, projects, process, testimonials, FAQ and a quick-quote form.",
    stack: ["React", "TypeScript", "Vite", "shadcn/ui"],
    live: "https://sturdy-site-shine.vercel.app",
  },
  {
    name: "Personal Budget Tracker",
    kind: "mobile",
    kicker: "Android app",
    description:
      "Track income, expenses and monthly budgets. Built on MVVM and clean architecture, with Room persistence and Firebase backup.",
    stack: ["Kotlin", "Jetpack Compose", "Room", "Firebase"],
    code: "https://github.com/DeniTutic/Personal-Budget-Tracker",
  },
  {
    name: "SVVT Test Suite",
    kind: "qa",
    kicker: "QA automation",
    description:
      "15+ automated browser tests for a live web app, covering navigation, forms and security, plus performance, accessibility and usability.",
    stack: ["Java", "Selenium WebDriver"],
    code: "https://github.com/DeniTutic/SVVT-Project-2025",
  },
];

export const skills = [
  { group: "Languages", items: ["JavaScript", "TypeScript", "Java", "Python", "Kotlin", "SQL"] },
  { group: "Frontend", items: ["React", "Next.js", "Vite", "HTML5", "CSS", "Responsive UI", "i18n"] },
  { group: "Backend", items: ["Node.js", "Express", "Spring Boot", "REST APIs", "Socket.io", "JWT", "OAuth 2.0", "Auth0"] },
  { group: "Databases", items: ["MongoDB", "Mongoose", "PostgreSQL", "Prisma", "MySQL", "MS SQL Server"] },
  { group: "AI & Cloud", items: ["Claude API", "OpenAI Whisper", "Vercel", "Railway", "Azure", "Stripe", "Cloudinary"] },
  { group: "Tools", items: ["Git", "GitHub", "Docker", "Postman", "Selenium", "Agile/Scrum"] },
];

export const spokenLanguages = [
  { name: "English", level: "Professional working" },
  { name: "Bosnian / Croatian / Serbian", level: "Native" },
];

// The "ask about Deni" AI chat. It answers from everything in this file plus
// src/data/knowledge.ts (facts that aren't on the site), and never beyond them.
export const assistant = {
  // So the assistant doesn't have to guess from the name.
  pronouns: "he/him",
  greeting: "Hi! I'm an AI assistant that knows Deni's experience, projects and stack. What would you like to know?",
  suggestions: [
    "What is Deni working on right now?",
    "Which AI projects has Deni built?",
    "What kind of role is Deni looking for?",
    "What's Deni's strongest tech stack?",
  ],
};

export const nav = [
  { id: "about", label: "about" },
  { id: "journey", label: "journey" },
  { id: "projects", label: "projects" },
  { id: "stack", label: "stack" },
  { id: "contact", label: "contact" },
];
