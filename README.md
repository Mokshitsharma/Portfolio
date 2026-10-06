# Mokshit Sharma — Portfolio

Personal portfolio of Mokshit Sharma, applied agentic AI engineer. Live at **[mokshitsharma27.vercel.app](https://mokshitsharma27.vercel.app)**.

## What's on it

- **Agent systems** — five flagship write-ups (SettleAI, ToolForge, Naman, VoiceDesk, docIQ), each with its guardrail, evidence and stack.
- **How I build** — the engineering principles behind those agents.
- **Also built** — production platforms (Movigo, FieldOps AI, Hyperlocal Marketplace), applied ML, full-stack products, BI dashboards and CLI tools. `/projects` lists every project by group.
- **Experience** — current role at Movigo Innovations plus every internship; `/internships` links each one's offer letter, certificate or recommendation.
- **Skills, certifications and a contact form** that emails submissions through a serverless function.

## Stack

React 19, TypeScript, Vite 6, Tailwind CSS 4, React Router 7, GSAP and Motion for animation, lucide-react icons. The contact form is a Vercel serverless function (`api/contact.ts`) using Nodemailer; locally the same handler runs inside an Express + Vite dev server (`server.ts`).

## Editing content

All site content lives in one file: [`src/data/portfolio.ts`](src/data/portfolio.ts).

| Export | Drives |
|---|---|
| `profile` | Name, role, pitch, links, education |
| `flagships` | The "Agent systems" section |
| `principles` | "How I build" |
| `catalog` | "Also built" and `/projects` (`highlight: true` shows a card on the home page) |
| `experience` | Experience section and `/internships` (`featured: true` gets a full timeline entry; `documents` adds proof links) |
| `skills`, `certifications` | Their sections |

## Running locally

```bash
npm install
cp .env.example .env.local   # fill in CONTACT_EMAIL_USER / CONTACT_EMAIL_PASS (a Gmail app password)
npm run dev                  # http://localhost:3000
npm run lint                 # type-check
npm run build                # production build into dist/
```

## Deployment

Pushing to `main` deploys to Vercel. Set `CONTACT_EMAIL_USER`, `CONTACT_EMAIL_PASS` and optionally `CONTACT_EMAIL_TO` in the Vercel project's environment variables.

## Contact

- Email: sharman48520@gmail.com
- LinkedIn: [mokshit-sharma](https://www.linkedin.com/in/mokshit-sharma-75b5ab305/)
- GitHub: [Mokshitsharma](https://github.com/Mokshitsharma)
