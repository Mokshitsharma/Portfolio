import type { Category, Project } from './types';
import { projects } from './projects';
import { profile } from './profile';

// Content for the home page sections that are not projects, experience or credentials. Every line restates a
// project or experience record, or Mokshit's own words (`personal`, `aboutRoles` descriptions).

/* ---------------------------------------------------------------- About: roles lit on the illustration */

// `region` is where on the figure the role lights up: a circle, as fractions of the figure's width and height.
export interface AboutRole {
  id: string;
  title: string;
  body: string;
  projects: string[];
  region: { x: number; y: number; r: number };
  tint: string; // the line drawn to it, in the colour of the area
}

export const aboutRoles: AboutRole[] = [
  {
    id: 'ml', title: 'Applied AI / ML Engineer',
    body: 'Builds and evaluates machine-learning systems, predictive models and AI-powered applications: leakage-safe features, validation grouped so no match or company leaks into its own test, calibration, and SHAP explanations a non-specialist can read.',
    projects: ['cricxai', 'sensei-ai', 'customer-churn-xai', 'ai-business-analytics'], region: { x: 0.53, y: 0.08, r: 0.09 }, tint: '#0d6e63',
  },
  {
    id: 'agents', title: 'Agentic AI Engineer',
    body: 'Designs tool-using agents, MCP integrations, RAG workflows, voice agents and human-in-the-loop systems, where the model proposes, plain code checks the plan, and a person approves the risky step.',
    projects: ['settleai', 'toolforge', 'naman', 'dociq', 'voicedesk'], region: { x: 0.86, y: 0.47, r: 0.075 }, tint: '#6a3daf',
  },
  {
    id: 'data', title: 'Data & ML Engineer',
    body: 'Works with data pipelines, feature engineering, analytics, model evaluation and production ML workflows: daily ingestion into DuckDB and dbt, tested data, and intervals that respect how the data clusters.',
    projects: ['job-market-tracker', 'olist-analytics', 'cricxai', 'paytm-dashboard'], region: { x: 0.24, y: 0.46, r: 0.075 }, tint: '#4a6b16',
  },
  {
    id: 'systems', title: 'Backend & Systems Engineer',
    body: 'Builds reliable APIs, databases, distributed workflows, integrations and the infrastructure behind intelligent products: ledgers, state machines, payments, and Movigo’s backend, built from zero as its only engineer.',
    projects: ['movigo', 'refera', 'hyperlocal-marketplace', 'routecore'], region: { x: 0.5, y: 0.83, r: 0.17 }, tint: '#36495e',
  },
];

/* ---------------------------------------------------------------- Projects: the bookshelf */

export interface Shelf {
  id: string;
  title: string;
  line: string;
  tint: string;
  slugs: string[]; // in display order
}

const inCats = (cats: Category[]) => projects.filter((p) => cats.includes(p.category)).map((p) => p.slug);
const caseFirst = (slugs: string[]) => {
  const by = (s: string) => projects.find((p) => p.slug === s) as Project;
  return [...slugs].sort((a, b) => Number(!!by(b).caseStudy) - Number(!!by(a).caseStudy));
};

// Five ways to read the same body of work. Categories of a portfolio, not five job titles.
export const shelves: Shelf[] = [
  { id: 'aiml', title: 'AI / ML Engineer', tint: '#0d6e63', line: 'Models with honest evaluation and explanations, and LLM systems with measured retrieval.', slugs: caseFirst(inCats(['ml', 'llm'])) },
  { id: 'agentic', title: 'Agentic AI Engineer', tint: '#6a3daf', line: 'Agents that use real tools, with code deciding anything risky and a person approving it; voice agents included.', slugs: caseFirst(inCats(['agents', 'voice'])) },
  { id: 'product', title: 'Full-Stack / Product Engineer', tint: '#a8461b', line: 'Products shipped end to end: apps on both stores, consoles, and the backend behind them.', slugs: ['movigo', 'hyperlocal-marketplace', 'dairy-collection-manager', 'fieldops-ai', 'movigo-broadcast', 'community-platform', 'ride-booking-app', 'seedsphere', 'portfolio'] },
  { id: 'data', title: 'Data Analyst / Business Analyst', tint: '#4a6b16', line: 'Questions answered with SQL, pandas and Power BI, from job markets and e-commerce to stocks and retail.', slugs: caseFirst(inCats(['data'])) },
  { id: 'backend', title: 'Backend / Systems Engineering', tint: '#36495e', line: 'Ledgers, state machines, payments and algorithms, with races, retries and restarts handled in code.', slugs: ['refera', 'hyperlocal-marketplace', 'routecore', 'settleai', 'movigo', 'stock-cli', 'stock-website', 'finance-tracker', 'whatsapp-greetings'] },
];

/* ---------------------------------------------------------------- Skills in six columns */

// Each entry is a skill backed by the named projects or role (skills.ts holds the full evidence).
export const skillColumns: { title: string; items: string[] }[] = [
  { title: 'Programming and data', items: ['Python', 'TypeScript and JavaScript', 'SQL: joins, CTEs, window functions', 'Java', 'R with tidyverse', 'pandas and NumPy'] },
  { title: 'Machine learning', items: ['Gradient boosting: LightGBM, XGBoost, CatBoost', 'scikit-learn pipelines', 'Leakage-safe features, grouped cross-validation, calibration', 'SHAP explanations', 'PyTorch sequence models, reinforcement learning', 'NLP: FinBERT, TF-IDF; OpenCV'] },
  { title: 'Agentic AI and LLM engineering', items: ['LangGraph state machines and interrupts', 'Model Context Protocol servers and clients', 'Tool calling with human approval', 'RAG: BM25, vector and hybrid retrieval with citations', 'Retrieval and refusal evaluation', 'Real-time voice: Deepgram, Whisper'] },
  { title: 'Backend and systems', items: ['Node.js, Express and FastAPI', 'PostgreSQL, MongoDB, SQLite, Chroma, Redis', 'Concurrency-safe writes and state machines', 'Payments, webhooks and ledgers', 'Pusher, WebSockets, background jobs', 'Hand-built data structures and graph search'] },
  { title: 'Cloud and infrastructure', items: ['Docker and GitHub Actions', 'Vercel and serverless functions', 'AWS (Movigo’s move from a VPS, reported)', 'Codemagic, Play Store and App Store releases', 'pytest, Vitest, JUnit, Playwright', 'MLflow tracking'] },
  { title: 'Analytics and visualisation', items: ['Power BI', 'DuckDB and dbt', 'Streamlit dashboards', 'Bootstrap intervals, Kaplan-Meier', 'KPI trees and cohort retention', 'Excel'] },
];

/* ---------------------------------------------------------------- Want to know more about me? */

// In Mokshit's own words (31 Oct 2026). Nothing personal is added beyond what he wrote.
export const personal = {
  interests: 'I have followed and traded in the stock market since 2018.',
  learning: 'I learn primarily by building. I prefer understanding a concept, implementing it in a real project, testing it against actual scenarios, and improving it based on what fails. I also learn through technical documentation, courses, open-source projects, competitions and studying how real products and systems are designed.',
  building: 'I enjoy building intelligent systems that solve practical problems: AI agents, machine-learning applications, RAG systems, automation workflows and data-driven products. I particularly enjoy taking an idea beyond a prototype: designing its architecture, implementing it, evaluating its performance and making it reliable enough to use.',
  approach: 'I start by understanding the problem rather than choosing a technology first. I break the product into components, define what success should look like, and build the simplest system that can solve the problem reliably. I use AI models where reasoning or generation is useful, but I don’t give them unrestricted authority over critical operations. The model proposes; deterministic code validates and decides; humans approve irreversible or high-impact actions. I believe a product is not complete just because its demo works. It needs measurable evaluation, sensible failure handling, security, observability and a good user experience.',
};

/* ---------------------------------------------------------------- Testimonials */

// Only real, approved quotes. Empty until supplied; the section is hidden in production while it is empty.
export interface Testimonial { name: string; role: string; org: string; quote: string; approved: true }
export const testimonials: Testimonial[] = [];

/* ---------------------------------------------------------------- Contact and links */

export const enquiryTypes = ['Job or internship', 'Freelance project', 'Collaboration', 'Other'];

// Verified profiles only (31 Oct 2026). LeetCode, Kaggle, HackerRank, X and Medium stay off until confirmed.
export const socials: { label: string; href: string }[] = [
  { label: 'GitHub', href: profile.github },
  { label: 'LinkedIn', href: profile.linkedin },
  { label: 'Email', href: `mailto:${profile.email}` },
  { label: 'Portfolio', href: 'https://mokshitsharma27.vercel.app/' },
];
