// Single source of truth for everything the site shows.
// Home page and /projects both read from here.

export const profile = {
  name: 'Mokshit Sharma',
  role: 'Applied agentic AI engineer',
  pitch:
    'I build AI agents that plan, call real tools and check their own work. The model proposes; plain code decides anything risky, and every run can be tested offline.',
  availability: 'Open to work: full-time roles, remote or in Indore',
  location: 'Indore, Madhya Pradesh, India',
  email: 'sharman48520@gmail.com',
  github: 'https://github.com/Mokshitsharma',
  linkedin: 'https://www.linkedin.com/in/mokshit-sharma-75b5ab305/',
  resume: 'https://drive.google.com/file/d/1yqCt5a-2A4DEu9QJvIy_9b_KF6yR4xqt/view?usp=sharing',
  education: {
    degree: 'Integrated B.Tech + M.Tech, AI & Data Science',
    school: 'Devi Ahilya Vishwavidyalaya (DAVV), Indore',
    grade: '8.2 CGPA',
  },
};

export type Link = { repo?: string; live?: string };

export interface FlagshipProject {
  id: string;
  name: string;
  context: string;
  summary: string;
  guardrail: string;
  proof: string;
  stack: string[];
  links: Link;
}

// Agent systems: the headline work.
export const flagships: FlagshipProject[] = [
  {
    id: 'settleai',
    name: 'SettleAI',
    context: 'PayPal AI Hackathon 2026',
    summary:
      'Escrow for work that AI agents hire people to do. A scoping agent turns a plain-language job into paid milestones, a vision agent checks photo and GPS proof, and an arbiter agent splits disputes and names who is liable. Money sits in PayPal until the work is proven.',
    guardrail:
      'No agent has a tool that moves money. A deterministic Mandate Guard approves every hire, funding, payout and dispute, and every step is a signed receipt anyone can verify offline.',
    proof: '132 unit and integration tests, 10 end-to-end tests, failure drills for webhook storms and payout outages',
    stack: ['Next.js 16', 'TypeScript', 'MCP server', 'xAI Grok, Groq', 'PayPal Orders, Payouts, Webhooks', 'Postgres + Drizzle', 'JWS ES256', 'Playwright'],
    links: {},
  },
  {
    id: 'toolforge',
    name: 'ToolForge',
    context: 'Open-source developer tool',
    summary:
      'Point it at any OpenAPI spec and it builds a working MCP server. A designer agent picks the tools an agent actually needs, then a tester agent uses them against the live API; design bugs it finds go back to the designer automatically. Every build ends with a security audit and a scorecard.',
    guardrail:
      'Pass or fail comes from recorded API calls, never from the model’s opinion. A human approves the tool plan, write calls need an explicit flag, and spec text is escaped so a hostile spec can’t inject code.',
    proof: 'PokéAPI: 102 endpoints, 8/8 live tests, security 100/100. Petstore: the tester caught 2 design bugs and the redesign fixed both',
    stack: ['Python', 'LangGraph', 'MCP', 'Groq, Gemini, Claude', 'Pydantic', 'Typer'],
    links: {},
  },
  {
    id: 'naman',
    name: 'Naman',
    context: 'Personal voice agent for laptop and phone',
    summary:
      'A voice-first assistant that lives on my laptop and phone. Say “Jarvis” and it opens apps, controls Spotify, sets reminders, tracks tasks, searches for jobs with a fit score and can start Claude Code builds. Multi-step requests are planned, run step by step and checked after each step.',
    guardrail:
      'Approval is its own LangGraph step, so anything that changes data waits for a yes and every tool runs exactly once after resuming. The Telegram bot only answers allow-listed users.',
    proof: '105 tests, runs on Groq’s free tier with retries and a sliding history window',
    stack: ['Python', 'LangGraph + SQLite checkpoints', 'Groq', 'MCP', 'faster-whisper', 'Edge TTS', 'Telegram', 'Windows UI Automation'],
    links: {},
  },
  {
    id: 'voicedesk',
    name: 'VoiceDesk',
    context: 'Real-time voice agent',
    summary:
      'An AI receptionist that answers calls for local businesses: it handles FAQs, books appointments from natural-language dates and hands off to a human when a caller needs one. Callers can interrupt it mid-sentence, like a real conversation.',
    guardrail:
      'Speech, dialogue and booking sit behind swappable interfaces, escalation is detected rather than guessed, and each business is isolated by API key across REST and WebSocket.',
    proof: 'All six planned phases built: streaming STT, LLM, TTS with barge-in, booking, admin console, multi-tenant auth',
    stack: ['Node.js', 'Express', 'WebSocket + AudioWorklet', 'Deepgram STT and TTS', 'Groq', 'MongoDB'],
    links: { repo: 'https://github.com/Mokshitsharma/VoiceDesk---AI-Voice-calling-agent' },
  },
  {
    id: 'dociq',
    name: 'docIQ',
    context: 'Retrieval-augmented document intelligence',
    summary:
      'Turns contracts, invoices and compliance documents into a knowledge base you can question. Every answer cites the passage it came from, and a risk scan flags clauses worth a second look.',
    guardrail:
      'An evaluation harness measures retrieval quality and whether the model refuses when the documents don’t contain the answer. With no API keys it falls back to extractive answers instead of failing.',
    proof: '16/16 end-to-end checks passing, Docker Compose setup',
    stack: ['Next.js', 'Express', 'MongoDB', 'Chroma', 'BullMQ + Redis', 'Gemini, Groq'],
    links: {},
  },
];

export const principles = [
  {
    title: 'The model proposes, code decides',
    body: 'Agents draft plans and judgements. Deterministic code checks them before anything irreversible happens, and no agent holds a tool that can move money or delete data on its own.',
    source: 'SettleAI’s Mandate Guard',
  },
  {
    title: 'Ground truth runs before the LLM',
    body: 'Cheap, exact checks go first: EXIF and GPS on a photo, a duplicate-image hash, schema validation of a tool plan. The model only sees what rules can’t settle, and its output is schema-validated too.',
    source: 'SettleAI, ToolForge',
  },
  {
    title: 'Humans approve the risky step',
    body: 'Approval is a real step in the agent graph, not a prompt. The run pauses, waits for a yes and resumes without repeating tools that already ran.',
    source: 'Naman, ToolForge',
  },
  {
    title: 'Every agent runs offline and is measured',
    body: 'Each external service has a mock and each model has a stub, so tests, demos and CI never need a key. Evaluation sets track whether the agent is right, not just whether it answered.',
    source: 'SettleAI, docIQ, ToolForge',
  },
];

export interface CatalogProject {
  name: string;
  summary: string;
  stack: string;
  links: Link;
  highlight?: boolean;
}

export interface CatalogGroup {
  id: string;
  title: string;
  blurb: string;
  projects: CatalogProject[];
}

// Everything else, grouped. `highlight` items also appear on the home page.
export const catalog: CatalogGroup[] = [
  {
    id: 'platforms',
    title: 'Production platforms',
    blurb: 'Multi-app systems with mobile apps, dashboards, payments and real-time tracking.',
    projects: [
      {
        name: 'Movigo',
        summary: 'Live B2B logistics marketplace I rebuilt from zero as the sole engineer after an outsourced team delivered only mockups: a real-time dispatch engine with race-safe booking assignment, two Flutter apps on the Play Store (47+ driver and 41+ retailer releases), an admin console and Razorpay payments with signature-verified webhooks.',
        stack: 'Node.js, Express, MongoDB, Flutter, Pusher, Razorpay, PM2, Nginx, ~136,000 lines, 372 endpoints',
        links: {},
        highlight: true,
      },
      {
        name: 'FieldOps AI',
        summary: 'Workforce platform for a field team of about 20: GPS attendance from an Android foreground service with batched, retrying uploads, driver and retailer onboarding, call logging, HR workflows and a points engine with 19 scorable actions and database-configurable weights.',
        stack: 'TypeScript, Express, Sequelize + MariaDB, Socket.io, Next.js, Flutter, 27-entity schema, ~70 endpoints',
        links: { repo: 'https://github.com/Mokshitsharma/Fieldops-ai' },
        highlight: true,
      },
      {
        name: 'Hyperlocal Marketplace',
        summary: 'Customers order from local shops in Indore and riders deliver in about 30 minutes. An order state machine handles shop accept/reject with auto-cancel, rider dispatch with retry and escalation, refunds, and rides that resume after a server restart.',
        stack: 'Node.js, Express, Socket.io, PostgreSQL + Drizzle, React + Vite, Next.js, 52 tests',
        links: { repo: 'https://github.com/Mokshitsharma/Marketplace_app' },
        highlight: true,
      },
    ],
  },
  {
    id: 'ml',
    title: 'Applied ML and explainable AI',
    blurb: 'Models that explain their predictions, from cricket strategy to stock signals.',
    projects: [
      {
        name: 'CricXAI',
        summary: 'Recommends what to bowl next in an ODI: dismissal probability, likely dismissal type, expected runs and field placement, with SHAP reasons. Trained on 1.36M real deliveries from 2,569 matches with leakage-safe features.',
        stack: 'FastAPI, LightGBM, SHAP, Docker, GitHub Actions, 69 tests',
        links: { repo: 'https://github.com/Mokshitsharma/CricXAI' },
        highlight: true,
      },
      {
        name: 'Sensei AI',
        summary: 'BUY, SELL or HOLD signals for all 50 Nifty stocks from five model families (LSTM, Temporal CNN, PPO reinforcement learning, HMM regimes, Random Forest) plus FinBERT news sentiment, with SHAP attribution and a backtester.',
        stack: 'PyTorch, Stable-Baselines3, FinBERT, SHAP, Streamlit',
        links: { repo: 'https://github.com/Mokshitsharma/Sensei', live: 'https://sensei-ai.streamlit.app/' },
        highlight: true,
      },
      {
        name: 'AI Business Analytics',
        summary: 'Upload a CSV and get cleaning, EDA, auto-trained models, SHAP explanations and a Gemini-written executive summary as a PDF report. Runs from a CLI, a FastAPI service or Streamlit.',
        stack: 'Python, scikit-learn, SHAP, Gemini, FastAPI, ReportLab',
        links: { repo: 'https://github.com/Mokshitsharma/ai-business-analytics' },
        highlight: true,
      },
      {
        name: 'Customer Churn with XAI',
        summary: 'Predicts which customers will leave and explains why in plain English, with retention suggestions for each one.',
        stack: 'XGBoost, SHAP, Streamlit, ~0.85 ROC-AUC',
        links: { repo: 'https://github.com/Mokshitsharma/Customer_Churn_using_XAI', live: 'https://customer-churn-explanation.streamlit.app/' },
      },
      {
        name: 'Disaster Response Agent',
        summary: 'Tool-using assistant for disaster safety: live web search, evacuation guidance, a disaster map and conversation memory.',
        stack: 'Anthropic Claude tool use, Streamlit',
        links: { repo: 'https://github.com/Mokshitsharma/Disaster-Management-System' },
      },
      {
        name: 'Finsight',
        summary: 'Measures how real-world events moved a stock, using sentiment-labelled market events and event-window analysis.',
        stack: 'Python, Streamlit, Plotly, yfinance',
        links: { repo: 'https://github.com/Mokshitsharma/Finsight_Smart_Stock_Event_Impact_Analyzer', live: 'https://finsight-ai-invest-smart.streamlit.app/' },
      },
      {
        name: 'FounderLens AI',
        summary: 'A founder uploads business data and gets trends, anomalies and recommendations as structured LLM output.',
        stack: 'Streamlit, Gemini, Plotly',
        links: {},
      },
      {
        name: 'Credit Card Default',
        summary: 'Default prediction on 30,000 UCI clients comparing Logistic Regression, Random Forest and XGBoost.',
        stack: 'scikit-learn, XGBoost',
        links: { repo: 'https://github.com/Mokshitsharma/Credit-Card-Default' },
      },
      {
        name: 'Credit Card Fraud Detection',
        summary: 'Fraud detection on a highly imbalanced dataset with SMOTE and Random Forest, evaluated on precision-recall.',
        stack: 'scikit-learn, imbalanced-learn',
        links: { repo: 'https://github.com/Mokshitsharma/Credit-Card-fraud-detection' },
      },
      {
        name: 'Spam Mail Detector',
        summary: 'TF-IDF text classifier comparing Naive Bayes and Linear SVM.',
        stack: 'scikit-learn',
        links: { repo: 'https://github.com/Mokshitsharma/Spam-Mail-Detector' },
      },
      {
        name: 'Reddit Sentiment Analysis',
        summary: 'Sentiment classification of 50,000+ Reddit posts with TF-IDF and tuned classifiers.',
        stack: 'Python, NLP, scikit-learn',
        links: { repo: 'https://github.com/Mokshitsharma/Sentiment_analysis' },
      },
      {
        name: 'MoodMate',
        summary: 'Real-time facial emotion detection from a webcam feed.',
        stack: 'OpenCV, deep learning, Streamlit',
        links: { repo: 'https://github.com/Mokshitsharma/MoodMate' },
      },
      {
        name: 'Cricket Strategy AI',
        summary: 'In progress: pulls ESPN ball-by-ball commentary and extracts shot type, bowling intent and ball type with NLP, feeding an ML pipeline for tactical insights. The data and NLP stages work; the API and UI are not built yet.',
        stack: 'Python, NLP, scikit-learn',
        links: {},
      },
      {
        name: 'Face and Motion Detection',
        summary: 'Two computer-vision utilities: real-time webcam face detection with Haar cascades, and moving-object tracking with MOG2 background subtraction and contours.',
        stack: 'OpenCV, NumPy',
        links: {},
      },
      {
        name: 'Handwritten Digit Classifier',
        summary: 'SVM classifier for handwritten digits with visualised predictions.',
        stack: 'scikit-learn, matplotlib',
        links: {},
      },
      {
        name: 'Sentiment Web App',
        summary: 'Paste any text and get its polarity, subjectivity and a sentiment label in a single-file web app.',
        stack: 'Flask, TextBlob',
        links: {},
      },
      {
        name: 'Kaggle Playground entries',
        summary: 'Student score regression with a stacked HistGBM and XGBoost ensemble; diabetes prediction with blended CatBoost and LightGBM.',
        stack: 'XGBoost, LightGBM, CatBoost',
        links: {},
      },
      {
        name: 'Product Recommendation System',
        summary: 'Content-based recommender for Amazon India products.',
        stack: 'TF-IDF, cosine similarity',
        links: {},
      },
      {
        name: 'House Price Regression',
        summary: 'Reusable tabular regressor that picks the best model by RMSE and persists it.',
        stack: 'scikit-learn pipelines',
        links: { repo: 'https://github.com/Mokshitsharma/House-Price-Regression-Generic-Tabular-Regressor-' },
      },
      {
        name: 'Face Attendance',
        summary: 'Register faces from a webcam, recognise them live and export attendance reports.',
        stack: 'face_recognition, OpenCV, SQLite',
        links: {},
      },
    ],
  },
  {
    id: 'products',
    title: 'Full-stack products and engineering',
    blurb: 'Complete apps with real money, auth and data rules, plus a data-structures engine built from scratch.',
    projects: [
      {
        name: 'RouteCore',
        summary: 'Route-optimisation and fleet-scheduling engine with a hand-built hash map, min-heap, k-d tree, Dijkstra, A* and 2-opt TSP. Zero runtime dependencies; the k-d tree is up to 408x faster than brute force at 100,000 points.',
        stack: 'Java 17, Maven, 47 tests',
        links: { repo: 'https://github.com/Mokshitsharma/RouteCore' },
        highlight: true,
      },
      {
        name: 'Refera',
        summary: 'Fintech referral platform: affiliates refer leads for loans and cards, conversions pay multi-level commissions into an append-only ledger, and KYC-verified affiliates withdraw earnings.',
        stack: 'React Native (Expo), Express 5, Prisma, PostgreSQL, AES-256-GCM',
        links: { repo: 'https://github.com/Mokshitsharma/Banksaathi-clone' },
        highlight: true,
      },
      {
        name: 'Dairy Collection Manager',
        summary: 'Daily milk register for a collection centre: fat-based rate charts, supplier ledgers, advances with EMI recovery and one-transaction settlements.',
        stack: 'React, Supabase (Postgres, row-level security), Vercel',
        links: { repo: 'https://github.com/Mokshitsharma/Milk_management', live: 'https://milk-management-five.vercel.app' },
        highlight: true,
      },
      {
        name: 'Community platform',
        summary: 'Member registry, events, matrimonial profiles, donations and an admin approval workflow for a community association.',
        stack: 'React 19, Firebase, Razorpay, Tailwind',
        links: { repo: 'https://github.com/Mokshitsharma/Freelance', live: 'https://freelance-taupe.vercel.app' },
      },
      {
        name: 'Ride booking app',
        summary: 'Uber-style booking flow with a user wallet, driver dashboard and admin panel on real-time Firestore listeners.',
        stack: 'React 19, Firebase, Framer Motion',
        links: { repo: 'https://github.com/Mokshitsharma/logistics' },
      },
      {
        name: 'This portfolio',
        summary: 'The site you are on, with a working contact form backed by a serverless function.',
        stack: 'React 19, TypeScript, Tailwind 4, Vercel',
        links: { repo: 'https://github.com/Mokshitsharma/Portfolio' },
      },
    ],
  },
  {
    id: 'data',
    title: 'Data analysis and BI',
    blurb: 'Pipelines that feed dashboards, mostly market and retail data.',
    projects: [
      {
        name: 'Paytm stock dashboard',
        summary: 'Four-stage ETL that lines up Paytm’s share price with competitors and market events, feeding two Power BI dashboards.',
        stack: 'Python, yfinance, Power BI',
        links: {},
      },
      {
        name: 'NIFTY 50 dashboard and live feed',
        summary: 'Fundamentals and price history for all 50 constituents, plus a poller that refreshes prices every minute.',
        stack: 'Python, yfinance, Power BI',
        links: { repo: 'https://github.com/Mokshitsharma/nifty-50-dashboard-using-python-and-power-bi' },
      },
      {
        name: 'Zomato SQL analysis',
        summary: 'SQL analysis of 9,551 restaurants in 15 countries with joins, CTEs and window functions.',
        stack: 'SQLite, pandas, Seaborn',
        links: { repo: 'https://github.com/Mokshitsharma/Zomato-SQL-EDA-Visualization' },
      },
      {
        name: 'YouTube channel analysis',
        summary: 'Pulls every video from a channel through the YouTube Data API and computes engagement metrics.',
        stack: 'Python, YouTube Data API, Power BI',
        links: { repo: 'https://github.com/Mokshitsharma/Youtube_channel_analysis' },
      },
      {
        name: 'BMW and Lamborghini sales',
        summary: 'Sales EDA with companion Power BI dashboards.',
        stack: 'pandas, Power BI',
        links: { repo: 'https://github.com/Mokshitsharma/BMW-sales-analysis' },
      },
      {
        name: 'Zudio retail analysis',
        summary: 'EDA of Zudio sales data.',
        stack: 'pandas, Jupyter',
        links: { repo: 'https://github.com/Mokshitsharma/Zudio-Data-Analysis-EDA' },
      },
      {
        name: 'EDA toolkit',
        summary: 'Reusable exploratory-analysis script for any CSV: summary stats, bar and scatter charts and a correlation heatmap, with demo data when no file is given.',
        stack: 'pandas, NumPy, matplotlib',
        links: { repo: 'https://github.com/Mokshitsharma/EDA-on-a-data-frame' },
      },
      {
        name: 'Quick-commerce inventory',
        summary: 'Cleans Zepto inventory data and reports low-stock items.',
        stack: 'pandas',
        links: { repo: 'https://github.com/Mokshitsharma/inventory-management-system' },
      },
    ],
  },
  {
    id: 'tools',
    title: 'Automation and CLI tools',
    blurb: 'Small, useful utilities for markets, money and messaging.',
    projects: [
      {
        name: 'Indian stock fundamentals',
        summary: 'Look up any NSE stock with ticker autocomplete: live price, fundamentals and shareholding. Ships as a terminal app and as a Flask website.',
        stack: 'Python, yfinance, prompt_toolkit, Flask',
        links: { repo: 'https://github.com/Mokshitsharma/Stock-price-details' },
      },
      {
        name: 'Personal finance tracker',
        summary: 'Command-line income and expense log with a running summary, using only the standard library.',
        stack: 'Python',
        links: {},
      },
      {
        name: 'WhatsApp bulk messenger',
        summary: 'Reads contacts from Excel and sends personalised WhatsApp messages through WhatsApp Web.',
        stack: 'Python, pandas, pywhatkit, pyautogui',
        links: {},
      },
    ],
  },
];

export interface Experience {
  role: string;
  company: string;
  period: string;
  body?: string;
  // Featured roles get a full timeline entry on the home page; the rest are listed compactly.
  featured?: boolean;
  documents?: { label: string; href: string }[];
}

// Newest first. Source: "Internship details.xlsx".
export const experience: Experience[] = [
  {
    role: 'Product Manager',
    company: 'Movigo Innovations Pvt. Ltd.',
    period: 'Apr 2026 – Present',
    body: 'Lead product for Movigo’s live B2B logistics marketplace and its FieldOps workforce platform, both of which I also built (see Production platforms below).',
    featured: true,
  },
  {
    role: 'Data Analyst Intern',
    company: 'Bold Analytics',
    period: 'Apr 2026 – May 2026',
    featured: true,
    documents: [{ label: 'Letter of recommendation', href: 'https://drive.google.com/file/d/1H1uC9xINU2DqBcbaZYobOjQ9PdANs2Ak/view?usp=sharing' }],
  },
  {
    role: 'Data Scientist Intern',
    company: 'Kangaroo Software Pvt. Ltd.',
    period: 'Oct 2025 – Jan 2026',
    body: 'Worked on data pipelines and analytics.',
    featured: true,
    documents: [{ label: 'Certificate', href: 'https://drive.google.com/file/d/1ZPBgGkkDBb1CWGArpvjBl-zUiDwCzPo1/view?usp=sharing' }],
  },
  {
    role: 'C++ Developer Intern',
    company: 'CodSoft',
    period: 'Nov 2025 – Dec 2025',
    documents: [{ label: 'Offer letter', href: 'https://drive.google.com/file/d/17C14sTkWIYQkFV2SpCI5Cz2dcgO5Rs66/view?usp=sharing' }],
  },
  {
    role: 'Power BI Intern',
    company: 'Saiket Systems',
    period: 'Sep 2025 – Oct 2025',
    documents: [{ label: 'Offer letter', href: 'https://drive.google.com/file/d/1L1smoZpG5rqaDuqyiiRZ7F5xrCGrUrFU/view?usp=sharing' }],
  },
  {
    role: 'Python Developer Intern',
    company: 'CodexIntern',
    period: 'Aug 2025 – Sep 2025',
    documents: [{ label: 'Offer letter', href: 'https://drive.google.com/file/d/1-1TLOWtz_wvWCtJn5_rfIff97rAsynd_/view?usp=sharing' }],
  },
  {
    role: 'Artificial Intelligence Intern',
    company: 'CodexIntern',
    period: 'Aug 2025 – Sep 2025',
    documents: [{ label: 'Certificate', href: 'https://drive.google.com/file/d/13TDYLf6l5M-fISFdyKeCpK9THZ8sjfgl/view?usp=sharing' }],
  },
  {
    role: 'Software Developer Intern',
    company: 'Bluestock Fintech',
    period: 'Apr 2025 – May 2025',
    body: 'Built Python modules that ingest and analyse structured financial data, and cut analytics run time by about 22%.',
    featured: true,
    documents: [{ label: 'Offer letter', href: 'https://drive.google.com/file/d/1fRrLmzs8o4JA1FHBOWhm6W_OEsr9Cp1L/view?usp=sharing' }],
  },
  {
    role: 'Data Analyst Intern',
    company: 'Afame Technologies',
    period: 'Feb 2025 – Mar 2025',
    documents: [{ label: 'Offer letter', href: 'https://drive.google.com/file/d/1S_TLmbYtnc6IfMLME0pW3wFo5Z7WhAJx/view?usp=sharing' }],
  },
  {
    role: 'Data Scientist Intern',
    company: 'Code Alpha',
    period: 'Nov 2024 – Dec 2024',
    body: 'Built ML pipelines and exploratory analyses.',
    documents: [{ label: 'Offer letter', href: 'https://drive.google.com/file/d/15s2gujKW4r4wR0aO3GLJVrzZFl3oQ1Ul/view?usp=sharing' }],
  },
  {
    role: 'C and C++ Programming Intern',
    company: 'TechnoHacks Solutions Pvt. Ltd.',
    period: 'Nov 2024 – Dec 2024',
    documents: [{ label: 'Offer letter', href: 'https://drive.google.com/file/d/1rMo4I9OJaZHzQVMW6GyDfd_jXPuqJ3B8/view?usp=sharing' }],
  },
  {
    role: 'Artificial Intelligence Intern',
    company: 'Evoastra Ventures',
    period: 'Oct 2024 – Nov 2024',
    body: 'Built sentiment-analysis pipelines on Reddit data with TF-IDF and tuned classifiers, improving accuracy by about 21%.',
    featured: true,
    documents: [{ label: 'Offer letter', href: 'https://drive.google.com/drive/u/2/folders/19c5J-Afnp8F-ajr1yu1n_eiimrgJ4wk2' }],
  },
  {
    role: 'Data Scientist Intern',
    company: 'Cognifyz Technologies',
    period: 'Sep 2024 – Oct 2024',
    body: 'Built regression models that predict restaurant ratings, reaching 0.84 R² after feature engineering.',
    featured: true,
    documents: [{ label: 'Offer letter', href: 'https://drive.google.com/file/d/1qFCF_sY7sBTlVZ4C5Sid1u83UTrHNwz5/view?usp=sharing' }],
  },
  {
    role: 'Data Science and ML Intern',
    company: 'Edureka',
    period: 'Jun 2024 – Jul 2024',
    documents: [{ label: 'Certificate', href: 'https://drive.google.com/file/d/1I7nzd7g--EGjRusjIJ5gIRsNwh2DXT7G/view?usp=sharing' }],
  },
];

export const skills = [
  { group: 'Agents and LLMs', items: ['LangGraph', 'Model Context Protocol (servers and clients)', 'Tool calling', 'Human-in-the-loop approval', 'RAG and evaluation', 'Structured output with Zod and Pydantic', 'Claude, Gemini, Groq, Grok'] },
  { group: 'Voice and real time', items: ['Deepgram STT and TTS', 'faster-whisper', 'WebSockets', 'AudioWorklet streaming', 'Server-sent events'] },
  { group: 'Machine learning', items: ['scikit-learn', 'XGBoost, LightGBM, CatBoost', 'PyTorch', 'Stable-Baselines3', 'SHAP', 'FinBERT and Transformers'] },
  { group: 'Backend', items: ['Python, FastAPI', 'Node.js, Express', 'TypeScript', 'PostgreSQL, Prisma, Drizzle', 'MongoDB', 'Redis and BullMQ'] },
  { group: 'Frontend and mobile', items: ['React 19', 'Next.js', 'Tailwind CSS', 'React Native (Expo)', 'Flutter'] },
  { group: 'Shipping', items: ['Docker', 'GitHub Actions', 'Vitest, pytest, Playwright', 'Vercel, Render', 'PayPal and Razorpay webhooks'] },
  { group: 'Data', items: ['pandas, NumPy', 'SQL', 'Power BI', 'R'] },
];

export const certifications = [
  { title: '5-Day AI Agents Intensive', issuer: 'Kaggle and Google', link: 'https://drive.google.com/file/d/1NmhjV9PXbdtnp09OdMNtMaizlODUNfke/view?usp=sharing' },
  { title: 'Generative AI Foundations', issuer: 'Skillsoft', link: 'https://drive.google.com/file/d/12LL5X1XFkZa-KYVSoCFUJZ7zyR9aB1wr/view?usp=sharing' },
  { title: 'Generative AI', issuer: 'Infosys Springboard', link: 'https://drive.google.com/file/d/1FGNt8vyrA4aseMvbjoMUgsXYuAgrszPy/view?usp=sharing' },
  { title: 'Microsoft Excel', issuer: 'Infosys Springboard', link: 'https://drive.google.com/file/d/1C0E6VwPqfuZyaZkvkLYWOFl5JvfWJ48R/view?usp=sharing' },
  { title: 'AI Masterclass', issuer: 'Freedom of AI', link: 'https://drive.google.com/file/d/1-0og7kJTOzSJeSR6zaWQwypVVCQjOU19/view?usp=sharing' },
  { title: 'Google Data Analytics Professional Certificate', issuer: 'Google' },
  { title: '5-star in Python, SQL and C++', issuer: 'HackerRank' },
];
