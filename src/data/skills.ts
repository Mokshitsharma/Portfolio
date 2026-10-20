import type { SkillGroup } from './types';

// Every skill links to the projects that use it.
export const skillGroups: SkillGroup[] = [
  {
    id: 'agents',
    title: 'Agentic systems and LLM applications',
    intro: 'Agents with real tools, typed outputs, approval steps and offline test doubles.',
    skills: [
      { name: 'LangGraph state machines, interrupts and checkpoints', projects: ['toolforge', 'naman'] },
      { name: 'Model Context Protocol servers and clients', projects: ['settleai', 'toolforge', 'naman'] },
      { name: 'Tool calling and multi-step planning', projects: ['naman', 'settleai', 'disaster-response-agent'] },
      { name: 'Human approval inside the agent loop', projects: ['naman', 'toolforge', 'settleai'] },
      { name: 'Structured output with Zod and Pydantic', projects: ['settleai', 'toolforge'] },
      { name: 'Retrieval with citations and refusal evaluation', projects: ['dociq'] },
      { name: 'Real-time voice: streaming speech-to-text and text-to-speech', projects: ['voicedesk', 'naman'] },
      { name: 'Groq, Gemini, Claude and xAI Grok APIs', projects: ['settleai', 'toolforge', 'naman', 'dociq', 'ai-business-analytics'] },
      { name: 'Mock adapters and offline model stubs', projects: ['settleai', 'toolforge', 'dociq'] },
    ],
  },
  {
    id: 'ml',
    title: 'Applied machine learning',
    intro: 'Models with honest evaluation and explanations a non-specialist can read.',
    skills: [
      { name: 'Gradient boosting: LightGBM, XGBoost, CatBoost', projects: ['cricxai', 'customer-churn-xai', 'credit-card-default', 'kaggle-diabetes'] },
      { name: 'SHAP explanations', projects: ['cricxai', 'sensei-ai', 'ai-business-analytics', 'customer-churn-xai'] },
      { name: 'Leakage-safe features, grouped cross-validation, calibration', projects: ['cricxai'] },
      { name: 'scikit-learn pipelines', projects: ['ai-business-analytics', 'house-price-regressor', 'spam-detector'] },
      { name: 'PyTorch sequence models (LSTM, temporal CNN)', projects: ['sensei-ai'] },
      { name: 'Reinforcement learning with Stable-Baselines3', projects: ['sensei-ai'] },
      { name: 'Hidden Markov models', projects: ['sensei-ai'] },
      { name: 'NLP: FinBERT, TF-IDF, VADER', projects: ['sensei-ai', 'finsight', 'spam-detector'] },
      { name: 'Computer vision with OpenCV', projects: ['face-attendance', 'moodmate', 'motion-detection'] },
    ],
  },
  {
    id: 'backend',
    title: 'Backend and real-time systems',
    intro: 'APIs that handle money, races and restarts.',
    skills: [
      { name: 'Node.js and Express', projects: ['movigo', 'hyperlocal-marketplace', 'refera', 'voicedesk', 'dociq'] },
      { name: 'Python and FastAPI', projects: ['cricxai', 'sensei-ai', 'ai-business-analytics'] },
      { name: 'TypeScript', projects: ['settleai', 'refera', 'hyperlocal-marketplace', 'fieldops-ai'] },
      { name: 'Concurrency-safe writes and state machines', projects: ['movigo', 'hyperlocal-marketplace', 'refera'] },
      { name: 'Pusher, WebSockets and Socket.io', projects: ['movigo', 'voicedesk', 'hyperlocal-marketplace'] },
      { name: 'Payments and webhooks: Razorpay, PayPal', projects: ['movigo', 'settleai'] },
      { name: 'Ledgers, idempotency and signed receipts', projects: ['settleai', 'refera'] },
      { name: 'Scheduled jobs and background queues', projects: ['movigo', 'dociq'] },
    ],
  },
  {
    id: 'data-stores',
    title: 'Databases',
    intro: '',
    skills: [
      { name: 'MongoDB with geospatial queries', projects: ['movigo', 'voicedesk', 'dociq'] },
      { name: 'PostgreSQL with Prisma and Drizzle', projects: ['settleai', 'refera', 'hyperlocal-marketplace'] },
      { name: 'Supabase with row-level security', projects: ['dairy-collection-manager'] },
      { name: 'MariaDB with Sequelize', projects: ['fieldops-ai'] },
      { name: 'SQLite', projects: ['naman', 'face-attendance'] },
      { name: 'Chroma and Redis', projects: ['dociq'] },
    ],
  },
  {
    id: 'clients',
    title: 'Frontend and mobile',
    intro: '',
    skills: [
      { name: 'Flutter, including Android background services', projects: ['movigo', 'fieldops-ai'] },
      { name: 'Play Store and App Store releases', projects: ['movigo'] },
      { name: 'React and Next.js', projects: ['settleai', 'hyperlocal-marketplace', 'refera', 'dociq', 'portfolio'] },
      { name: 'React Native with Expo', projects: ['refera'] },
      { name: 'Tailwind CSS', projects: ['portfolio', 'settleai', 'community-platform'] },
    ],
  },
  {
    id: 'delivery',
    title: 'Infrastructure, testing and security',
    intro: '',
    skills: [
      { name: 'Mobile CI with Codemagic', projects: ['movigo'] },
      { name: 'Docker and GitHub Actions', projects: ['toolforge', 'cricxai', 'dociq'] },
      { name: 'Vercel and serverless functions', projects: ['portfolio', 'dairy-collection-manager'] },
      { name: 'pytest, Vitest, JUnit, Playwright', projects: ['naman', 'settleai', 'routecore', 'refera'] },
    ],
  },
  {
    id: 'foundations',
    title: 'Algorithms and data',
    intro: '',
    skills: [
      { name: 'Hand-built hash map, heap and k-d tree', projects: ['routecore'] },
      { name: 'Graph search: Dijkstra, A*, 2-opt', projects: ['routecore'] },
      { name: 'Java', projects: ['routecore'] },
      // Zomato is archive-only (fix first); it stays here as the record behind the SQL skill, linked to its archive entry.
      { name: 'SQL: joins, CTEs, window functions', projects: ['zomato-sql'] },
      { name: 'pandas and NumPy', projects: ['eda-toolkit', 'nifty50-dashboard'] },
      { name: 'Power BI', projects: ['paytm-dashboard', 'nifty50-dashboard', 'bmw-sales'] },
      { name: 'R with tidyverse', projects: ['zudio-r'] },
    ],
  },
];
