# 🧠 Mokshit Sharma — AI & Data Science Portfolio Website

> A premium, storytelling-based 3D personal portfolio that turns a resume into an immersive experience — built with React 19, Three.js, GSAP, and Gemini AI.

[![Live Demo](https://img.shields.io/badge/Live-mokshitsharma27.vercel.app-brightgreen?style=for-the-badge)](https://mokshitsharma27.vercel.app)
[![Tech](https://img.shields.io/badge/Stack-React%2019%20%7C%20Three.js%20%7C%20GSAP%20%7C%20Gemini%20AI-blue?style=for-the-badge)](https://github.com/Mokshitsharma/Portfolio)
[![Deploy](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

---

## 1. 🎯 Project Name

**Personal Portfolio Website — Mokshit Sharma | AI & Data Science Engineer**

---

## 2. 🔍 Problem Statement

Most developer portfolios are static HTML pages or generic templates that fail to communicate the depth of a candidate's work. For an AI/Data Science professional applying to competitive roles in Fintech and tech, there is a critical gap: recruiters spend an average of 7 seconds on a resume, and a flat portfolio website does nothing to make that time count. The challenge was to create a **digital first impression** that is visually distinctive, technically impressive, and informationally rich — one that could represent 13 internships, 15+ ML projects, and a unique personal brand in a way no PDF resume ever could.

---

## 3. 💡 My Solution

Built a full-stack, AI-powered 3D portfolio from scratch using a modern TypeScript + React 19 stack. The site features:

- **3D immersive visuals** powered by Three.js with real-time scene rendering
- **Smooth cinematic animations** using GSAP and Framer Motion (motion v12)
- **AI-powered interactions** via Google Gemini API (`@google/genai`)
- **Persistent data layer** using better-sqlite3 for any stateful features
- **SPA architecture** with React Router DOM for seamless multi-section navigation
- **Express + Vite hybrid server** (server.ts) supporting both dev HMR and production static serving
- Deployed on **Vercel** with environment variable management via `.env`

The result is a storytelling-based portfolio that positions the candidate as both a Data Science practitioner and a capable full-stack engineer.

---

## 4. 📐 System Architecture (Brief)

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                  │
│   React 19 SPA  ←→  React Router DOM (multi-route)  │
│   Three.js (3D Scene) + GSAP (Animations)           │
│   Framer Motion (UI transitions)                    │
│   Tailwind CSS v4 (styling)                         │
└───────────────────┬─────────────────────────────────┘
                    │ HTTP / API Calls
┌───────────────────▼─────────────────────────────────┐
│              EXPRESS SERVER (server.ts)              │
│   Dev: Vite Middleware (HMR) | Prod: Static Dist    │
│   /api/health endpoint                              │
│   better-sqlite3 (local data persistence)           │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│              EXTERNAL SERVICES                       │
│   Google Gemini API (@google/genai)                 │
│   Vercel (deployment + CDN)                         │
└─────────────────────────────────────────────────────┘
```

---

## 5. 🛠️ Skills & Tech Stack

| Category | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript 5.8, React Router DOM v7 |
| **3D & Animation** | Three.js r183, GSAP v3.14, Framer Motion (motion v12) |
| **Styling** | Tailwind CSS v4, tailwind-merge, clsx |
| **Backend / Server** | Node.js, Express v4, TypeScript (server.ts) |
| **AI Integration** | Google Gemini API (`@google/genai` v1.29) |
| **Database** | better-sqlite3 v12 |
| **Build Tooling** | Vite v6, tsx (TS execution), ESM modules |
| **Icons** | Lucide React v0.546 |
| **Deployment** | Vercel, dotenv |
| **Dev Tools** | TypeScript strict mode, ESLint via tsc --noEmit |

---

## 6. 📊 Project Metrics

| Metric | Value |
|---|---|
| Language Composition | 96.8% TypeScript, 2.6% CSS, 0.6% HTML |
| Primary Dependencies | 14 production packages |
| Dev Dependencies | 6 packages |
| Deployment Platform | Vercel (live) |
| Bundle Tool | Vite v6 (ESM-native) |
| AI Model Integrated | Google Gemini |
| Performance | SPA with code-splitting via Vite |
| Responsiveness | Mobile + Desktop (Tailwind responsive classes) |

---

## 7. 📁 Folder Structure

```
Portfolio/
├── src/                     # All React + TS source code
│   ├── components/          # UI components (sections, 3D, animations)
│   ├── pages/               # Route-level page components
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Helper functions
│   └── assets/              # Static assets (images, models)
├── server.ts                # Express + Vite hybrid server
├── index.html               # Vite HTML entry point
├── vite.config.ts           # Vite build configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies & scripts
├── metadata.json            # App metadata (name, description)
├── .env.example             # Environment variable template
└── .gitignore               # Git ignore rules
```

---

## 8. 📦 Dataset Details

This is a frontend + full-stack web application. There is no ML dataset involved. The "data" is:

- **Personal content**: Projects, internships, skills, education — all structured as TypeScript constants/config
- **AI context data**: Prompts and context fed to Gemini API for interactive portfolio features
- **SQLite data**: Managed via better-sqlite3 for any dynamic/stateful features (visitor interactions, etc.)
- **3D assets**: Three.js scene data (geometries, materials, lighting) defined inline

---

## 9. ⚙️ Why This Tech Stack?

| Choice | Reason |
|---|---|
| **React 19** | Latest concurrent rendering features; best ecosystem for component-based UI |
| **Three.js** | Industry-standard for WebGL 3D in browsers; rich documentation and community |
| **GSAP** | Most performant JS animation library; enables timeline-based storytelling animations |
| **Framer Motion** | Declarative React animations with layout animation support |
| **Tailwind CSS v4** | Utility-first, zero-runtime CSS — perfect for rapid responsive design iteration |
| **TypeScript** | Type safety across the entire codebase reduces bugs in complex state/3D logic |
| **Vite v6** | Lightning-fast HMR in dev; optimized ESM-native builds for production |
| **Express (server.ts)** | Enables API routes (Gemini proxy, health checks) without a separate backend project |
| **Gemini API** | Adds AI interaction layer differentiating this portfolio from static alternatives |
| **better-sqlite3** | Zero-config, synchronous, high-performance SQLite for lightweight persistence |
| **Vercel** | Seamless deployment from Git; global CDN; free tier ideal for portfolio hosting |

---

## 10. 🚀 Future Improvements

- Add a **visitor analytics dashboard** (heatmaps, session duration) using the SQLite layer
- Integrate a **real-time AI chat** using Gemini with full RAG over resume content, so recruiters can query projects directly
- Add **blog/writing section** powered by markdown files with syntax highlighting
- Implement **dark/light mode toggle** with GSAP-animated theme transitions
- Build a **3D project showcase** where each ML project is represented as a 3D card in the scene
- Add **contact form backend** with email delivery via Nodemailer or Resend
- Improve **Lighthouse performance score** via lazy-loading Three.js scene on scroll trigger
- Add **multilingual support** (Hindi / English toggle) for wider audience reach

---

## 11. ⭐ Rating

```
╔══════════════════════════════════════╗
║   Project Rating:  8.2 / 10         ║
║                                      ║
║  Design Ambition      ██████████  9  ║
║  Tech Stack Depth     █████████░  8  ║
║  AI Integration       ████████░░  8  ║
║  Code Quality         ████████░░  8  ║
║  Portfolio Impact     █████████░  9  ║
║  Originality          █████████░  9  ║
║  Documentation        ███████░░░  7  ║
╚══════════════════════════════════════╝
```

**Why 8.2?** The stack choice (Three.js + GSAP + Gemini + React 19) is genuinely impressive for a 20-year-old student and positions you well above the "Bootstrap template" crowd. A stronger score would come from expanding the SQLite/API usage, adding project deep-dives, and improving the README/docs within the repo itself.

---

## 12. 🎯 Preferred Role for This Project

**Frontend Engineer / Full-Stack Developer** (secondary: AI Engineer)

This project demonstrates frontend engineering depth that most Data Science candidates lack. It's best featured when applying to roles at product-first startups, Fintech companies with consumer-facing tools, or AI companies where engineers are expected to build end-to-end interfaces for ML products.

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- A Gemini API key from [Google AI Studio](https://ai.google.dev/)

### Installation

```bash
git clone https://github.com/Mokshitsharma/Portfolio.git
cd Portfolio
npm install
```

### Environment Setup

```bash
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local
```

### Run Locally

```bash
npm run dev
# Visit http://localhost:3000
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📬 Contact

**Mokshit Sharma** — AI & Data Science Engineer  
📧 sharman48520@gmail.com  
🌐 [mokshitsharma27.vercel.app](https://mokshitsharma27.vercel.app)  
📱 +91 9425950621

---

*Built with React 19, Three.js, GSAP, Gemini AI & TypeScript*
