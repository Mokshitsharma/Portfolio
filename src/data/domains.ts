import { skillGroups } from './skills';

// The five engineering domains, one framed panel each in the home page's gallery. Each lists the five projects
// approved for that role (see private/REDESIGN_REVIEW.md), one measured result from those projects' records,
// and skills named exactly as in skills.ts, so every skill shown is one the Skills page backs with projects.

export interface Domain {
  id: string;
  title: string;
  line: string; // what the work in this domain is, in one sentence
  evidence: string; // one verified result
  projects: string[]; // slugs
  skills: string[]; // names from skills.ts
}

export const domains: Domain[] = [
  {
    id: 'data-engineering',
    title: 'Data engineering',
    line: 'Ingestion and storage that models and dashboards can rely on.',
    evidence: 'CricXAI keeps 1.36 million deliveries in Parquet: about 15 times smaller than the CSV and 10 times faster to load.',
    projects: ['cricxai', 'paytm-dashboard', 'naman', 'dociq', 'movigo'],
    skills: ['Scheduled jobs and background queues', 'MongoDB with geospatial queries', 'PostgreSQL with Prisma and Drizzle', 'Chroma and Redis', 'SQLite', 'Docker and GitHub Actions'],
  },
  {
    id: 'data-analytics',
    title: 'Data science and analytics',
    line: 'Questions answered with SQL, pandas and Power BI, from market data to retail.',
    evidence: 'A four-stage ETL lines up Paytm’s share price with competitors and market events for two Power BI dashboards.',
    projects: ['paytm-dashboard', 'nifty50-dashboard', 'lamborghini-sales', 'ai-business-analytics', 'customer-churn-xai'],
    skills: ['SQL: joins, CTEs, window functions', 'pandas and NumPy', 'Power BI', 'R with tidyverse', 'scikit-learn pipelines'],
  },
  {
    id: 'ml',
    title: 'Machine learning',
    line: 'Models evaluated on held-out data, with explanations a non-specialist can read.',
    evidence: 'CricXAI predicts dismissals with ROC-AUC 0.749, validated by match so no game leaks into its own test.',
    projects: ['cricxai', 'sensei-ai', 'customer-churn-xai', 'ai-business-analytics', 'credit-card-default'],
    skills: ['Gradient boosting: LightGBM, XGBoost, CatBoost', 'SHAP explanations', 'Leakage-safe features, grouped cross-validation, calibration', 'PyTorch sequence models (LSTM, temporal CNN)', 'Reinforcement learning with Stable-Baselines3', 'NLP: FinBERT, TF-IDF, VADER'],
  },
  {
    id: 'agents',
    title: 'Generative and agentic AI',
    line: 'Agents that call real tools, with code checking every plan and a person approving the risky step.',
    evidence: 'SettleAI released no payment it should have held in its evaluation, and caught every tampered proof.',
    projects: ['settleai', 'toolforge', 'naman', 'voicedesk', 'dociq'],
    skills: ['LangGraph state machines, interrupts and checkpoints', 'Model Context Protocol servers and clients', 'Tool calling and multi-step planning', 'Human approval inside the agent loop', 'Structured output with Zod and Pydantic', 'Retrieval with citations and refusal evaluation'],
  },
  {
    id: 'software',
    title: 'Software and full-stack engineering',
    line: 'Products with money, races and restarts handled in code, shipped to real users.',
    evidence: 'Movigo’s driver and retailer apps are live on Google Play and the App Store, on a backend I built alone.',
    projects: ['movigo', 'routecore', 'hyperlocal-marketplace', 'refera', 'settleai'],
    skills: ['Node.js and Express', 'TypeScript', 'Concurrency-safe writes and state machines', 'Payments and webhooks: Razorpay, PayPal', 'Flutter, including Android background services', 'React and Next.js'],
  },
];

// Gallery order: the walk starts with agents and ends with shipped software.
export const galleryOrder = ['agents', 'ml', 'data-analytics', 'data-engineering', 'software'];

const known = new Set(skillGroups.flatMap((g) => g.skills.map((x) => x.name)));
/** A domain's skills, keeping only names the Skills page lists. */
export const skillsFor = (d: Domain) => d.skills.filter((n) => known.has(n));
