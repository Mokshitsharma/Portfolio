import type { Category } from './types';

// The five engineering domains on the home page. Each lists the five projects approved for that role
// (see private/REDESIGN_REVIEW.md) and one measured result taken from those projects' records.
// Ordered from raw data at the bottom of the engine to shipped software at the top.

export interface Domain {
  id: string;
  title: string;
  line: string; // what the work in this domain is, in one sentence
  evidence: string; // one verified result
  projects: string[]; // slugs
}

export const domains: Domain[] = [
  {
    id: 'data-engineering',
    title: 'Data engineering',
    line: 'Ingestion and storage that models and dashboards can rely on.',
    evidence: 'CricXAI keeps 1.36 million deliveries in Parquet: about 15 times smaller than the CSV and 10 times faster to load.',
    projects: ['cricxai', 'paytm-dashboard', 'naman', 'dociq', 'movigo'],
  },
  {
    id: 'data-analytics',
    title: 'Data science and analytics',
    line: 'Questions answered with SQL, pandas and Power BI, from market data to retail.',
    evidence: 'A four-stage ETL lines up Paytm’s share price with competitors and market events for two Power BI dashboards.',
    projects: ['paytm-dashboard', 'nifty50-dashboard', 'lamborghini-sales', 'ai-business-analytics', 'customer-churn-xai'],
  },
  {
    id: 'ml',
    title: 'Machine learning',
    line: 'Models evaluated on held-out data, with explanations a non-specialist can read.',
    evidence: 'CricXAI predicts dismissals with ROC-AUC 0.749, validated by match so no game leaks into its own test.',
    projects: ['cricxai', 'sensei-ai', 'customer-churn-xai', 'ai-business-analytics', 'credit-card-default'],
  },
  {
    id: 'agents',
    title: 'Generative and agentic AI',
    line: 'Agents that call real tools, with code checking every plan and a person approving the risky step.',
    evidence: 'SettleAI released no payment it should have held in its evaluation, and caught every tampered proof.',
    projects: ['settleai', 'toolforge', 'naman', 'voicedesk', 'dociq'],
  },
  {
    id: 'software',
    title: 'Software and full-stack engineering',
    line: 'Products with money, races and restarts handled in code, shipped to real users.',
    evidence: 'Movigo’s driver and retailer apps are live on Google Play and the App Store, on a backend I built alone.',
    projects: ['movigo', 'routecore', 'hyperlocal-marketplace', 'refera', 'settleai'],
  },
];

// Map clusters for the engineering map. Every published project sits in exactly one, by its category.
export const clusters: { id: Category; title: string; x: number; y: number }[] = [
  { id: 'agents', title: 'Agentic AI', x: 290, y: 200 },
  { id: 'production', title: 'Production', x: 560, y: 125 },
  { id: 'fullstack', title: 'Full-stack', x: 800, y: 230 },
  { id: 'ml', title: 'Machine learning', x: 260, y: 440 },
  { id: 'data', title: 'Data and BI', x: 560, y: 460 },
  { id: 'tools', title: 'Algorithms and tools', x: 830, y: 470 },
  { id: 'learning', title: 'Early work', x: 1010, y: 350 },
];
