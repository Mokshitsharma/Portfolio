# Mokshit Sharma — Portfolio

Personal site of Mokshit Sharma, Founding Engineer & Tech Lead at Movigo and applied AI and full-stack engineer. Live at **[mokshitsharma27.vercel.app](https://mokshitsharma27.vercel.app)**.

## Pages

| Route | Content |
|---|---|
| `/` | Hero, production work at Movigo, selected work, agent principles, experience, skills summary, education, contact |
| `/projects` | Every published project, filterable by search, area and status (filters live in the URL) |
| `/projects/:slug` | Case studies (Movigo, SettleAI, ToolForge, Naman, VoiceDesk, docIQ, Refera, RouteCore, CricXAI, FieldOps, Hyperlocal Marketplace, Sensei AI, AI Business Analytics, Dairy Collection Manager) |
| `/experience` | Current role and internships; `/internships` redirects here |
| `/skills` | Skills by domain, each linked to the projects that use it |
| `/about`, `/contact` | Narrative, education, certificates; contact form |

## Stack

React 19, TypeScript, Vite 6, Tailwind CSS 4, React Router 7, lucide-react. Every route is prerendered to static HTML at build time (`src/entry-server.tsx` + `scripts/prerender.mjs`) with its own title, description, canonical URL, Open Graph tags and a sitemap; the browser then hydrates it. The contact form posts to a Vercel function (`api/contact.ts`) that validates input, drops honeypot submissions and sends mail with Nodemailer; locally the same handler runs inside the Express + Vite dev server (`server.ts`).

## Editing content

Content lives in `src/data/`, separate from the pages:

| File | Drives |
|---|---|
| `profile.ts` | Name, role, links, education, certificates, agent principles |
| `projects.ts` | The project archive and home-page selection (`featured`, `caseStudy`) |
| `caseStudies.ts` | Case-study pages; every figure should trace to code, tests or a public listing |
| `experience.ts` | Experience page and home-page summary |
| `skills.ts` | Skills page and home-page summary |
| `types.ts` | The content model |

A new case study needs an entry in `caseStudies.ts` and `caseStudy: true` on the project; the prerender step picks it up automatically.

## Running locally

```bash
npm install
cp .env.example .env.local   # fill in CONTACT_EMAIL_USER / CONTACT_EMAIL_PASS (a Gmail app password)
npm run dev                  # http://localhost:3000, with the contact API
npm run lint                 # type-check
npm run build                # prerendered production build into dist/
npm run preview              # serve dist/ at http://localhost:4173 (no contact API)
```

## Deployment

Pushing to `main` deploys to Vercel. `vercel.json` sets clean URLs, the `/internships` redirect and cache headers. Set `CONTACT_EMAIL_USER`, `CONTACT_EMAIL_PASS` and optionally `CONTACT_EMAIL_TO` in the Vercel project's environment variables.

## Contact

- Email: mokshitsharmalaptop@gmail.com
- LinkedIn: [mokshit-sharma](https://www.linkedin.com/in/mokshit-sharma-75b5ab305/)
- GitHub: [Mokshitsharma](https://github.com/Mokshitsharma)
