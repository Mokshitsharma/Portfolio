# Mokshit Sharma — Portfolio

Personal site of Mokshit Sharma, Founding Engineer & Tech Lead at Movigo, working across applied AI, machine
learning and full-stack software. Live at **[mokshitsharma27.vercel.app](https://mokshitsharma27.vercel.app)**.

The home page is a walk through a daylit house, built in three.js: a gateway with the nameplate, a gallery of skill
boards, four project rooms (machine learning, agentic AI, data, software), a study with the credentials wall and a
courtyard with the contact details. Every fact on the page is ordinary HTML; the 3D scene is never needed to read
or reach anything.

## Pages

| Route | Content |
|---|---|
| `/` | The house: gallery of skills, four project rooms with their evidence, study, courtyard |
| `/projects` | Every published project: search by name, technology or idea, filter by area and status, or show case studies only (filters live in the URL) |
| `/projects/:slug` | Case studies, for example Movigo, SettleAI, ToolForge, Naman, docIQ, RouteCore and CricXAI |
| `/roles`, `/roles/:slug` | One page per role (data analyst, ML engineer, agentic AI engineer, full-stack developer and more), each with five projects and the matching résumé |
| `/experience` | Current role and internships; `/internships` redirects here |
| `/skills` | Skills by domain, each linked to the projects that use it |
| `/achievements` | Certificates and the PayPal AI Hackathon 2026 entry |
| `/about`, `/contact` | Background and education; contact form |

## How it is built

- **Stack:** React 19, TypeScript, Vite 6, Tailwind CSS 4, React Router 7, three.js, lucide-react. Fonts are
  self-hosted.
- **Prerendered routes:** every route is rendered to static HTML at build time (`src/entry-server.tsx` and
  `scripts/prerender.mjs`) with its own title, description, canonical URL, Open Graph tags and a sitemap, then
  hydrated in the browser.
- **The 3D house** (`src/scene/`) is procedural: no downloaded models or textures; walls, wood, stone and every
  printed board are drawn on canvases. It loads as its own chunk after first paint, builds in small steps, compiles
  shaders and uploads textures without blocking scrolling, and is driven by one number taken from the scroll
  position, so scrolling back reverses every movement. Until it is ready, the page shows a still rendered from the
  scene itself, which is also the backdrop on devices without WebGL2.
- **Accessibility:** reduced-motion mode shows still frames with no camera travel; detail views are native dialogs
  with focus return; Lighthouse accessibility, best practices and SEO score 100.
- **Contact form:** posts to a Vercel function (`api/contact.ts`) that validates input, drops honeypot submissions
  and sends mail with Nodemailer. Locally the same handler runs inside the Express server (`server.ts`).

## Editing content

Content lives in `src/data/`, separate from the pages:

| File | Drives |
|---|---|
| `profile.ts` | Name, role, links, education, certificates |
| `projects.ts` | The project archive, the rooms on the home page (`featured`, `caseStudy`, `archiveOnly`) |
| `caseStudies.ts` | Case-study pages; every figure traces to code, tests or a public listing |
| `rolePages.ts` | The role pages and which résumé each links |
| `experience.ts`, `skills.ts`, `achievements.ts` | The matching pages and home-page sections |
| `types.ts` | The content model |

A new case study needs an entry in `caseStudies.ts` and `caseStudy: true` on the project; the prerender step picks
it up automatically. Design notes for the house are in `docs/redesign/DESIGN.md`.

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
Set `CONTACT_EMAIL_USER`, `CONTACT_EMAIL_PASS` and optionally `CONTACT_EMAIL_TO` in the Vercel project's environment
variables. The contact function needs Node.js 20 or newer.

## Contact

- Email: mokshitsharmalaptop@gmail.com
- LinkedIn: [mokshit-sharma](https://www.linkedin.com/in/mokshit-sharma-75b5ab305/)
- GitHub: [Mokshitsharma](https://github.com/Mokshitsharma)
