// One page per role at /roles/<slug>, for applications and cold emails (links may carry ?ref=, which the page
// ignores). Project lists, résumés and experience follow the approved role mapping in private/REDESIGN_REVIEW.md.
// Every sentence is drawn from the project and experience records; no claim appears here that those records do
// not support.

export interface RoleProject {
  slug: string; // the project this entry opens
  also?: string[]; // further projects shown as one entry (the two Kaggle Playground notebooks)
  name?: string; // display name when the entry covers more than one project
  note?: string; // the role-specific detail, when it adds to the project's own copy
}

export interface RolePage {
  slug: string;
  title: string;
  fit: string; // two sentences, from evidence
  resume: { file: string; label: string };
  projects: RoleProject[];
  experience: string[]; // experience ids besides Movigo, most relevant first
  skills: string[]; // names from skills.ts
  area: 'route' | 'signal' | 'field'; // the room colour the role belongs to
}

const resume = (name: string, label: string) => ({ file: `/resume/Mokshit_Sharma_Resume_${name}.pdf`, label });

export const rolePages: RolePage[] = [
  {
    slug: 'data-analyst',
    title: 'Data Analyst',
    fit: 'I turn raw market and retail data into answers with SQL, pandas and Power BI. The work runs from a four-stage ETL feeding two Paytm dashboards to an analytics app that cleans a CSV, trains models and writes its own report.',
    resume: resume('Data_Analyst', 'Data Analyst résumé'),
    projects: [{ slug: 'paytm-dashboard' }, { slug: 'nifty50-dashboard' }, { slug: 'lamborghini-sales' }, { slug: 'ai-business-analytics' }, { slug: 'customer-churn-xai' }],
    experience: ['E06', 'E10', 'E13', 'E03', 'E05'],
    skills: ['SQL: joins, CTEs, window functions', 'pandas and NumPy', 'Power BI', 'R with tidyverse', 'scikit-learn pipelines', 'SHAP explanations'],
    area: 'field',
  },
  {
    slug: 'data-scientist',
    title: 'Data Scientist',
    fit: 'I build models that are evaluated on data they have not seen and explained in plain terms. CricXAI predicts dismissals with ROC-AUC 0.749 on 1.36 million real deliveries, validated by match, and every prediction comes with its SHAP reasons.',
    resume: resume('Data_Scientist', 'Data Scientist résumé'),
    projects: [{ slug: 'cricxai' }, { slug: 'sensei-ai' }, { slug: 'customer-churn-xai' }, { slug: 'ai-business-analytics' }, { slug: 'credit-card-default' }],
    experience: ['E03', 'E05', 'E13', 'E14', 'E07'],
    skills: ['Gradient boosting: LightGBM, XGBoost, CatBoost', 'SHAP explanations', 'Leakage-safe features, grouped cross-validation, calibration', 'PyTorch sequence models (LSTM, temporal CNN)', 'scikit-learn pipelines', 'pandas and NumPy'],
    area: 'field',
  },
  {
    slug: 'data-engineer',
    title: 'Data Engineer',
    fit: 'I build the pipelines that models and dashboards stand on. CricXAI keeps 1.36 million deliveries in Parquet, about 15 times smaller than the CSV, and Movigo’s backend runs scheduled jobs and a 15-second dispatch loop in production.',
    resume: resume('Data_Analyst', 'Data résumé'),
    projects: [
      { slug: 'cricxai' },
      { slug: 'paytm-dashboard' },
      { slug: 'naman', note: 'Its job search runs on a schedule across several sources; one run found 1,555 jobs.' },
      { slug: 'dociq' },
      { slug: 'movigo' },
    ],
    experience: ['E03', 'E09', 'E13'],
    skills: ['Scheduled jobs and background queues', 'MongoDB with geospatial queries', 'PostgreSQL with Prisma and Drizzle', 'Chroma and Redis', 'SQLite', 'Docker and GitHub Actions'],
    area: 'field',
  },
  {
    slug: 'ai-ml-engineer',
    title: 'AI/ML Engineer',
    fit: 'I take models from evaluation to working software: a FastAPI service around a cricket model, retrieval that cites the passage it came from, and agents whose risky steps wait for a person. Each one runs end to end and is tested.',
    resume: resume('AIML_Engineer', 'AI/ML Engineer résumé'),
    projects: [{ slug: 'cricxai' }, { slug: 'sensei-ai' }, { slug: 'dociq' }, { slug: 'naman' }, { slug: 'ai-business-analytics' }],
    experience: ['E07', 'E12', 'E14', 'E03'],
    skills: ['Gradient boosting: LightGBM, XGBoost, CatBoost', 'SHAP explanations', 'PyTorch sequence models (LSTM, temporal CNN)', 'Retrieval with citations and refusal evaluation', 'LangGraph state machines, interrupts and checkpoints', 'Python and FastAPI'],
    area: 'field',
  },
  {
    slug: 'machine-learning-engineer',
    title: 'Machine Learning Engineer',
    fit: 'I train, evaluate and serve models, and I measure them on data they have not seen. The work includes gradient boosting validated by match, five model families voting on stock signals, and Kaggle Playground entries.',
    resume: resume('AIML_Engineer', 'Machine Learning résumé'),
    projects: [
      { slug: 'cricxai' },
      { slug: 'sensei-ai' },
      { slug: 'customer-churn-xai' },
      { slug: 'ai-business-analytics' },
      { slug: 'kaggle-diabetes', also: ['kaggle-student-scores'], name: 'Kaggle Playground entries', note: 'Diabetes classification with a blended CatBoost and LightGBM model (AUC 0.728), and student-score regression with a stacked ensemble.' },
    ],
    experience: ['E07', 'E14', 'E03', 'E12'],
    skills: ['Gradient boosting: LightGBM, XGBoost, CatBoost', 'SHAP explanations', 'Leakage-safe features, grouped cross-validation, calibration', 'PyTorch sequence models (LSTM, temporal CNN)', 'Reinforcement learning with Stable-Baselines3', 'scikit-learn pipelines'],
    area: 'field',
  },
  {
    slug: 'agentic-ai-engineer',
    title: 'Agentic AI Engineer',
    fit: 'I build agents that call real tools while code checks their plans and a person approves the risky step. In SettleAI no agent holds a tool that can move money; in Naman approval is its own graph node, so tools run exactly once after a pause.',
    resume: resume('Agentic_AI_Engineer', 'Agentic AI Engineer résumé'),
    projects: [{ slug: 'settleai' }, { slug: 'toolforge' }, { slug: 'naman' }, { slug: 'voicedesk' }, { slug: 'dociq' }],
    experience: ['E07', 'E12', 'E08'],
    skills: ['LangGraph state machines, interrupts and checkpoints', 'Model Context Protocol servers and clients', 'Tool calling and multi-step planning', 'Human approval inside the agent loop', 'Structured output with Zod and Pydantic', 'Real-time voice: streaming speech-to-text and text-to-speech'],
    area: 'signal',
  },
  {
    slug: 'generative-ai-engineer',
    title: 'Generative AI Engineer',
    fit: 'I build LLM applications that stay grounded: answers that cite the passage they came from, generated tool servers tested against the live API, and reports that still ship when the model is unavailable.',
    resume: resume('Agentic_AI_Engineer', 'Generative AI résumé'),
    projects: [{ slug: 'dociq' }, { slug: 'naman' }, { slug: 'settleai' }, { slug: 'toolforge' }, { slug: 'ai-business-analytics' }],
    experience: ['E07', 'E12', 'E08'],
    skills: ['Retrieval with citations and refusal evaluation', 'Structured output with Zod and Pydantic', 'Groq, Gemini, Claude and xAI Grok APIs', 'Model Context Protocol servers and clients', 'Mock adapters and offline model stubs', 'Tool calling and multi-step planning'],
    area: 'signal',
  },
  {
    slug: 'python-developer',
    title: 'Python Developer',
    fit: 'Most of my agent and machine learning work is Python: LangGraph agents, FastAPI services, data pipelines and their test suites. Naman has 164 pytest tests and CricXAI 71.',
    resume: resume('AIML_Engineer', 'Python résumé'),
    projects: [{ slug: 'naman' }, { slug: 'toolforge' }, { slug: 'cricxai' }, { slug: 'sensei-ai' }, { slug: 'ai-business-analytics' }],
    experience: ['E08', 'E07', 'E03'],
    skills: ['Python and FastAPI', 'LangGraph state machines, interrupts and checkpoints', 'pandas and NumPy', 'scikit-learn pipelines', 'pytest, Vitest, JUnit, Playwright', 'Structured output with Zod and Pydantic'],
    area: 'signal',
  },
  {
    slug: 'full-stack-developer',
    title: 'Full-Stack Developer',
    fit: 'I build complete products: the backend, the apps and the console that runs them. At Movigo I am the only engineer behind a live marketplace whose driver and retailer apps are on Google Play and the App Store.',
    resume: resume('FullStack_Developer', 'Full-Stack Developer résumé'),
    projects: [{ slug: 'movigo' }, { slug: 'refera' }, { slug: 'hyperlocal-marketplace' }, { slug: 'dairy-collection-manager' }, { slug: 'settleai' }],
    experience: ['E09'],
    skills: ['Node.js and Express', 'TypeScript', 'React and Next.js', 'Flutter, including Android background services', 'PostgreSQL with Prisma and Drizzle', 'Payments and webhooks: Razorpay, PayPal'],
    area: 'route',
  },
  {
    slug: 'software-engineer',
    title: 'Software Engineer',
    fit: 'I write software that handles races, money and restarts correctly, and I build the data structures underneath when it matters. Movigo settles driver races with one conditional write; RouteCore’s hand-built k-d tree is 408 times faster than brute force at 100,000 points.',
    resume: resume('Software_Engineer', 'Software Engineer résumé'),
    projects: [{ slug: 'movigo' }, { slug: 'routecore' }, { slug: 'hyperlocal-marketplace' }, { slug: 'refera' }, { slug: 'settleai' }],
    experience: ['E09', 'E11', 'E04'],
    skills: ['Concurrency-safe writes and state machines', 'Hand-built hash map, heap and k-d tree', 'Graph search: Dijkstra, A*, 2-opt', 'Java', 'TypeScript', 'pytest, Vitest, JUnit, Playwright'],
    area: 'route',
  },
];

export const rolePageBySlug = (slug: string) => rolePages.find((r) => r.slug === slug);

// Which roles each home page domain leads to.
export const rolesForDomain: Record<string, string[]> = {
  'data-engineering': ['data-engineer'],
  'data-analytics': ['data-analyst', 'data-scientist'],
  ml: ['machine-learning-engineer', 'ai-ml-engineer', 'data-scientist'],
  agents: ['agentic-ai-engineer', 'generative-ai-engineer', 'python-developer'],
  software: ['software-engineer', 'full-stack-developer'],
};
