# Deni Tutić — Portfolio

Personal portfolio / CV site. Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Motion. Fully static — no backend.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (all routes prerendered)
```

## Edit content

Everything you'd want to change lives in **`src/data/profile.ts`**: contact links, hero roles, about text, stats, the journey timeline, projects, skills and languages.

- **Add your photo:** put it at `public/profile.jpg` and set `photo: "/profile.jpg"` in `profile.ts`. The "DT" monogram is replaced automatically.
- **Update the résumé:** replace `public/Deni-Tutic-Resume.pdf` (keep the filename, or change `resume` in `profile.ts`).
- **Project screenshots:** `src/assets/projects/*.webp` (1440×900).

## Structure

```
src/
  app/            layout, page, globals.css (design tokens), icon.svg, opengraph-image.tsx
  components/     Nav, Hero, Terminal, About, Journey, Projects, Stack, Contact, Footer …
  data/profile.ts all site content
  assets/         project screenshots
public/           résumé PDF
```

Dark theme by default; the toggle stores the choice in `localStorage`. All animations respect `prefers-reduced-motion`.

## Deploy

Push to GitHub and import the repo in Vercel (framework preset: **Next.js**).
