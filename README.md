<!-- readme-refresh 2026-11 -->
<div align="center">

# 🏠 Portfolio

**My portfolio: a cinematic, door-by-door tour of my work, with an AI assistant that answers from my records**

<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /> <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /> <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /> <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /> <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" /> <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />

</div>

## ✨ Highlights

- Seven painted doors, each opening a part of my work, and a "back in time" timeline of my journey
- Prerendered pages for projects, case studies and roles
- Live at [mokshitsharma27.vercel.app](https://mokshitsharma27.vercel.app/)

<!-- body -->
Personal site of Mokshit Sharma, Founding Engineer & Tech Lead at Movigo, working across applied AI, machine
learning and full-stack software. Live at **[mokshitsharma27.vercel.app](https://mokshitsharma27.vercel.app)**.

The home page is a dark, cinematic tour: a hero with flip-card roles and an annotated portrait, seven painted
panelled doors you walk into, a "let's go back in time" year timeline, a projects room of stacked case-study cards,
certificates as framed papers, and a "Got a project?" card. Moksh AI, an assistant in the corner of every page,
answers questions from the site's own records. Every fact on the page is ordinary HTML.

## Pages

| Route | Content |
|---|---|
| `/` | The tour: roles, the doors, the timeline, selected projects, certificates and contact |
| `/projects` | Every published project: search by name, technology or idea, filter by area and status, or show case studies only (filters live in the URL) |
| `/projects/:slug` | Case studies, for example Movigo, SettleAI, ToolForge, Naman, docIQ, RouteCore and CricXAI |
| `/roles`, `/roles/:slug` | One page per role (data analyst, ML engineer, agentic AI engineer, full-stack developer and more), each with five projects and the matching résumé |
| `/experience` | Current role and internships; `/internships` redirects here |
| `/skills` | Skills by domain, each linked to the projects that use it |
| `/achievements` | Certificates and the PayPal AI Hackathon 2026 entry |
| `/about`, `/contact` | Background and education; contact form |

## How it is built

- **Stack:** React 19, TypeScript, Vite 6, Tailwind CSS 4, React Router 7, lucide-react. Fonts are
  self-hosted.
- **Prerendered routes:** every route is rendered to static HTML at build time (`src/entry-server.tsx` and
  `scripts/prerender.mjs`) with its own title, description, canonical URL, Open Graph tags and a sitemap, then
  hydrated in the browser.
- **Moksh AI** (`api/chat.ts`, `src/agent/`): a chat assistant on Groq models that answers only from a knowledge
  base generated from `src/data/` at build time (`api/_lib/knowledge.gen.ts`). Without a `GROQ_API_KEY` it still
  answers by quoting the matching records.
- **Accessibility:** reduced-motion mode turns the scroll animations off; detail views are native dialogs
  with focus return; Lighthouse accessibility, best practices and SEO score 100.
- **Contact form:** posts to a Vercel function (`api/contact.ts`) that validates input, drops honeypot submissions
  and sends mail with Nodemailer. Locally the same handler runs inside the Express server (`server.ts`).

## Editing content

Content lives in `src/data/`, separate from the pages:

| File | Drives |
|---|---|
| `profile.ts` | Name, role, links, education, certificates |
| `projects.ts` | The project archive and the projects on the home page (`featured`, `caseStudy`, `archiveOnly`) |
| `caseStudies.ts` | Case-study pages; every figure traces to code, tests or a public listing |
| `rolePages.ts` | The role pages and which résumé each links |
| `experience.ts`, `skills.ts`, `achievements.ts` | The matching pages and home-page sections |
| `types.ts` | The content model |

A new case study needs an entry in `caseStudies.ts` and `caseStudy: true` on the project; the prerender step picks
it up automatically.

## Running locally

```bash
npm install
cp .env.example .env         # fill in CONTACT_EMAIL_USER / CONTACT_EMAIL_PASS (a Gmail app password)
npm run dev                  # http://localhost:3000, with the contact API
npm run lint                 # type-check
npm run build                # prerendered production build into dist/
npm run preview              # serve dist/ at http://localhost:4173 (no contact API)
```

The production build can also be served with the contact API: `npm run build`, then set `NODE_ENV=production`
and run `npx tsx server.ts`.

## Deployment

Pushing to `main` deploys to Vercel. `vercel.json` sets clean URLs, the `/internships` redirect and cache headers.
Set `GROQ_API_KEY` (for Moksh AI), `CONTACT_EMAIL_USER`, `CONTACT_EMAIL_PASS` and optionally `CONTACT_EMAIL_TO` in the Vercel project's environment
variables. The contact function needs Node.js 20 or newer.

## Contact

- Email: sharman48520@gmail.com
- LinkedIn: [mokshit-sharma](https://www.linkedin.com/in/mokshit-sharma-75b5ab305/)
- GitHub: [Mokshitsharma](https://github.com/Mokshitsharma)

---

<div align="center"><sub>Built by <a href="https://github.com/Mokshitsharma">Mokshit Sharma</a> · <a href="https://mokshitsharma27.vercel.app/">Portfolio</a> · <a href="https://www.linkedin.com/in/mokshit-sharma-75b5ab305">LinkedIn</a></sub></div>
