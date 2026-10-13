# Deni Tutić — Portfolio

Personal portfolio / CV site. Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Motion. Every page is static; the only server code is the AI assistant's `/api/chat` route.

## Run it

```bash
npm install
cp .env.example .env.local   # then paste your Anthropic API key
npm run dev      # http://localhost:3000
npm run build    # production build (all routes prerendered)
```

## Edit content

Everything you'd want to change lives in **`src/data/profile.ts`**: contact links, hero roles, about text, stats, the journey timeline, projects, skills and languages.

- **Add your photo:** put it at `public/profile.jpg` and set `photo: "/profile.jpg"` in `profile.ts`. The "DT" monogram is replaced automatically.
- **Update the résumé:** replace `public/Deni-Tutic-Resume.pdf` (keep the filename, or change `resume` in `profile.ts`).
- **Project screenshots:** `src/assets/projects/*.webp` (1440×900).

## AI assistant

The "ask about deni" button opens a chat that answers visitors' questions using Claude (Anthropic API).

- **Knowledge:** it reads the same `src/data/profile.ts` the site renders (`src/lib/assistant-prompt.ts` turns it into the system prompt). To teach it something that isn't on the page (availability, work authorization, hobbies), add a sentence to `assistant.notes`. It's told never to answer beyond these facts.
- **Key:** set `ANTHROPIC_API_KEY` in `.env.local` locally and in Vercel → Project → Settings → Environment Variables. Without it the chat replies with your email instead.
- **Model & cost:** `MODEL` in `src/app/api/chat/route.ts` (default `claude-haiku-5-5`, well under $0.001 per question; the profile prompt is cached). `claude-opus-5-5` gives more polished answers for ~1¢ per question.
- **Spending:** the API is prepaid. Buy $5 of credits and leave auto-reload off: the assistant can never spend more than that, and it stops answering (falling back to your email) when credits run out.
- **Abuse limits:** 1,000 characters per question, last 12 messages of history, 20 questions per IP per 10 minutes (in memory, per instance). Optionally add a rate-limit rule on `/api/chat` in the Vercel Firewall.

## Structure

```
src/
  app/            layout, page, globals.css (design tokens), icon.svg, opengraph-image.tsx
  app/api/chat/   AI assistant endpoint (streams Claude's answer)
  components/     Nav, Hero, Terminal, About, Journey, Projects, Stack, Contact, Footer, AskDeni …
  data/profile.ts all site content (also the assistant's knowledge)
  lib/            assistant system prompt
  assets/         project screenshots
public/           résumé PDF
```

Dark theme by default; the toggle stores the choice in `localStorage`. All animations respect `prefers-reduced-motion`.

## Deploy

Push to GitHub and import the repo in Vercel (framework preset: **Next.js**). Add `ANTHROPIC_API_KEY` as an environment variable before deploying.
