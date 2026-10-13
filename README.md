# Deni Tutić — Portfolio

Personal portfolio / CV site. Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Motion. Every page is static; the only server code is the AI assistant's `/api/chat` route.

## Run it

```bash
npm install
cp .env.example .env.local   # then paste your free Gemini API key
npm run dev      # http://localhost:3000
npm run build    # production build (all routes prerendered)
```

## Edit content

Everything you'd want to change lives in **`src/data/profile.ts`**: contact links, hero roles, about text, stats, the journey timeline, projects, skills and languages.

- **Add your photo:** put it at `public/profile.jpg` and set `photo: "/profile.jpg"` in `profile.ts`. The "DT" monogram is replaced automatically.
- **Update the résumé:** replace `public/Deni-Tutic-Resume.pdf` (keep the filename, or change `resume` in `profile.ts`).
- **Project screenshots:** `src/assets/projects/*.webp` (1440×900).

## AI assistant

The "ask about deni" button opens a chat that answers visitors' questions using Google's Gemini API on its free tier.

- **Knowledge:** it reads the same `src/data/profile.ts` the site renders (`src/lib/assistant-prompt.ts` turns it into the system prompt). To teach it something that isn't on the page (age, availability, work authorization, hobbies), add a question and answer to `src/data/knowledge.ts`. It's told never to answer beyond these facts, so when it says it doesn't know something, that's the file to update.
- **Key:** create a free key at [Google AI Studio](https://aistudio.google.com/apikey) (no card needed). Set `GEMINI_API_KEY` in `.env.local` locally and in Vercel → Project → Settings → Environment Variables, then redeploy. Without a key, or once the free daily quota is used up, the chat replies with your email instead.
- **Cost:** $0 on the free tier. Don't add billing to the Google Cloud project behind the key, or it stops being free. Google may use free-tier chats to improve its products. Models are listed in `MODELS` in `src/app/api/chat/route.ts`: it starts with `gemini-3.8-flash` and falls back to the next free model when one is overloaded or out of quota.
- **Chat log (`/admin`):** every question and answer is saved to a private Vercel Blob store (`deni-tutic-chats`) with the time, rough location, device and the site the visitor came from (no IP addresses). Open `/admin` on the live site, enter any username and your `ADMIN_PASSWORD`, and use the "Not answered" tab to see what to add to `knowledge.ts`. Visitors see a note in the chat that conversations are saved.
- **Abuse limits:** 1,000 characters per question, last 12 messages of history, 20 questions per IP per 10 minutes (in memory, per instance), so one visitor can't burn the daily quota.

## Structure

```
src/
  app/            layout, page, globals.css (design tokens), icon.svg, opengraph-image.tsx
  app/api/chat/   AI assistant endpoint (streams Gemini's answer)
  components/     Nav, Hero, Terminal, About, Journey, Projects, Stack, Contact, Footer, AskDeni …
  data/profile.ts all site content (also the assistant's knowledge)
  data/knowledge.ts extra Q&A only the assistant knows
  app/admin/      password-protected chat log
  lib/            assistant system prompt, chat log storage
  assets/         project screenshots
public/           résumé PDF
```

Dark theme by default; the toggle stores the choice in `localStorage`. All animations respect `prefers-reduced-motion`.

## Deploy

Push to GitHub and import the repo in Vercel (framework preset: **Next.js**). Add `GEMINI_API_KEY` as an environment variable before deploying.
