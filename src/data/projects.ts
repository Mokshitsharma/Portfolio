import type { Category, ExternalLink, Maturity, Project } from './types';

// Every published project. Ids match the career-research registry (E:\Career\career-research).
// Records that cannot be published accurately are kept out of the client bundle; see private/ (git-ignored).

const gh = (repo: string): ExternalLink => ({ label: 'Source on GitHub', href: `https://github.com/Mokshitsharma/${repo}`, kind: 'repo' });

export const categories: { id: Category; title: string; blurb: string }[] = [
  { id: 'production', title: 'Production platforms', blurb: 'Systems built for a real business and its staff, drivers and customers.' },
  { id: 'agents', title: 'Agentic AI and LLM applications', blurb: 'Agents that call real tools, with deterministic checks and human approval around them.' },
  { id: 'ml', title: 'Applied machine learning', blurb: 'Models with evaluation and explanations, from cricket strategy to churn.' },
  { id: 'fullstack', title: 'Full-stack and mobile applications', blurb: 'Complete products with money, auth and data rules.' },
  { id: 'tools', title: 'Algorithms and developer tools', blurb: 'Engines and utilities built from first principles.' },
  { id: 'data', title: 'Data analysis and BI', blurb: 'Pipelines that feed dashboards, mostly market and retail data.' },
  { id: 'learning', title: 'Learning and early projects', blurb: 'Coursework, exercises and first projects, kept for the record.' },
];

// Status vocabulary. "Runs locally" means it works end to end but is not hosted anywhere public.
export const maturityLabel: Record<Maturity, string> = {
  production: 'In production',
  deployed: 'Deployed',
  working: 'Runs locally',
  'in-progress': 'In development',
  prototype: 'Prototype',
  notebook: 'Notebook or script',
  coursework: 'Coursework',
};

export const projects: Project[] = [
  // Production
  {
    id: 'P06', slug: 'movigo', name: 'Movigo logistics platform', category: 'production', maturity: 'production', period: 'Apr 2026 - present',
    summary: 'Live delivery marketplace connecting retailers and customers with 2-, 3- and 4-wheeler drivers: a Node.js dispatch and payments backend, Flutter driver and retailer apps on Google Play and the App Store, and the operations console.',
    stack: ['Node.js', 'Express', 'MongoDB', 'Flutter', 'Pusher', 'Razorpay', 'Firebase Cloud Messaging', 'OSRM', 'PM2', 'Nginx'],
    links: [
      { label: 'Movigo Driver on Google Play', href: 'https://play.google.com/store/apps/details?id=com.app.movigodriver', kind: 'store' },
      { label: 'Movigo Retailer on Google Play', href: 'https://play.google.com/store/apps/details?id=com.app.movigocustomer', kind: 'store' },
      { label: 'Movigo Retailer on the App Store', href: 'https://apps.apple.com/in/app/movigo-retailer-app/id6793887251', kind: 'store' },
    ],
    linkNote: 'Company code, kept private.',
    tests: '8 Flutter test files; the backend has no automated tests yet.',
    caseStudy: true, featured: true,
  },
  {
    id: 'P07', slug: 'fieldops-ai', name: 'FieldOps', category: 'production', maturity: 'prototype', period: 'May 2026',
    summary: 'Workforce platform for a field team of about 20: GPS attendance from an Android foreground service, driver and retailer onboarding, call logs, HR records and a points engine whose weights live in the database.',
    stack: ['TypeScript', 'Express', 'Sequelize', 'MariaDB', 'Socket.io', 'Next.js', 'Flutter'],
    links: [], linkNote: 'Built for Movigo. The code stays private until the company agrees to publish it.', caseStudy: true,
  },
  {
    id: 'P08', slug: 'movigo-broadcast', name: 'Movigo Broadcast', category: 'production', maturity: 'working', period: 'Sep 2026',
    summary: 'Campaign tool for sending one message with an image to a contact list: upload CSV or XLSX, map the phone and name columns, send.',
    stack: ['Node.js', 'Express', 'JavaScript'], links: [], linkNote: 'Built for Movigo. The code stays private until the company agrees to publish it.',
  },
  {
    id: 'P09', slug: 'hyperlocal-marketplace', name: 'Hyperlocal Marketplace', category: 'production', maturity: 'working', period: 'Sep 2026',
    summary: 'Customers order from local Indore shops and riders deliver in about 30 minutes. The order state machine survives races, payment webhooks and server restarts.',
    stack: ['Node.js', 'Express', 'PostgreSQL', 'Drizzle', 'Socket.io', 'React', 'Next.js', 'TypeScript'],
    links: [], linkNote: 'Built for Movigo. The code stays private until the company agrees to publish it.', tests: '52 backend tests in the repository (counted, not run for this site).', caseStudy: true,
  },

  // Agents
  {
    id: 'P01', slug: 'settleai', name: 'SettleAI', category: 'agents', maturity: 'in-progress', period: 'Oct 2026',
    summary: 'Escrow for work that AI agents hire people to do. Agents scope the job, judge photo proof and propose dispute splits; a deterministic guard approves every payout, and every step becomes a signed receipt anyone can verify offline.',
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Drizzle', 'MCP', 'PayPal APIs', 'Zod', 'Playwright'],
    links: [], linkNote: 'Entry for the PayPal AI Hackathon 2026; the repository is not public yet.',
    tests: '146 unit, integration and end-to-end tests in the repository (counted, not run for this site).',
    caseStudy: true, featured: true,
  },
  {
    id: 'P02', slug: 'toolforge', name: 'ToolForge', category: 'agents', maturity: 'working', period: 'Sep 2026',
    summary: 'Point it at an OpenAPI spec and agents design an MCP server, test it against the live API and audit it for security problems, with a person approving the tool plan.',
    stack: ['Python', 'LangGraph', 'MCP', 'Pydantic', 'Typer', 'pytest'],
    links: [], linkNote: 'Source not public yet.', tests: '24 pytest tests.', caseStudy: true, featured: true,
  },
  {
    id: 'P03', slug: 'naman', name: 'Naman', category: 'agents', maturity: 'working', period: 'Sep-Oct 2026',
    summary: 'A voice agent on my laptop and phone. It opens apps, controls media, tracks tasks and searches for jobs, and waits for a yes before anything that changes data.',
    stack: ['Python', 'LangGraph', 'Groq', 'MCP', 'faster-whisper', 'Telegram', 'SQLite'],
    links: [], linkNote: 'Runs on my own machine and holds personal data, so the source is not public.', tests: '124 pytest tests.',
    caseStudy: true, featured: true,
  },
  {
    id: 'P04', slug: 'voicedesk', name: 'VoiceDesk', category: 'agents', maturity: 'working', period: 'Sep 2026',
    summary: 'A real-time voice receptionist for local businesses. It answers questions, books appointments from spoken dates and hands off to a person; callers can interrupt it mid-sentence.',
    stack: ['Node.js', 'WebSocket', 'AudioWorklet', 'Deepgram', 'Groq', 'MongoDB'],
    links: [gh('VoiceDesk---AI-Voice-calling-agent')], caseStudy: true,
  },
  {
    id: 'P05', slug: 'dociq', name: 'docIQ', category: 'agents', maturity: 'working', period: 'Sep 2026',
    summary: 'Ask questions of contracts and invoices and get answers that cite the passage. A risk scan flags clauses; with no API key it quotes passages instead of failing.',
    stack: ['Node.js', 'Express', 'MongoDB', 'Chroma', 'BullMQ', 'Next.js', 'Gemini', 'Groq'],
    links: [], linkNote: 'Source not public yet.', tests: 'A 16-check end-to-end script and unit tests for the chunker.', caseStudy: true,
  },
  {
    id: 'P23', slug: 'disaster-response-agent', name: 'Disaster Response Agent', category: 'agents', maturity: 'prototype', period: 'Dec 2025',
    summary: 'A chat assistant for disaster safety that searches the web live through Claude tool use, gives evacuation guidance and keeps conversation memory.',
    stack: ['Python', 'Streamlit', 'Anthropic Claude API'], links: [gh('Disaster-Management-System')],
  },
  {
    id: 'P26', slug: 'founderlens-ai', name: 'FounderLens AI', category: 'agents', maturity: 'prototype', period: 'Dec 2025',
    summary: 'A founder uploads business data and gets trends, anomalies and recommendations back as structured JSON from an LLM.',
    stack: ['Python', 'Streamlit', 'Gemini', 'Plotly'], links: [], linkNote: 'Small prototype, not published.',
  },

  // Applied ML
  {
    id: 'P17', slug: 'cricxai', name: 'CricXAI', category: 'ml', maturity: 'working', period: 'Aug 2026',
    summary: 'Recommends what to bowl next in an ODI, with dismissal probability, likely dismissal type, expected runs and SHAP reasons. Trained on 1.36 million real deliveries with leakage-safe features.',
    stack: ['Python', 'LightGBM', 'SHAP', 'FastAPI', 'Parquet', 'Docker', 'GitHub Actions'],
    links: [gh('CricXAI')], tests: '71 pytest tests.', relation: 'Replaced cricket-strategy-ai, an earlier pipeline that scraped ball-by-ball commentary and extracted shot type and bowling intent with NLP rules; its interface was never built.', caseStudy: true, featured: true,
  },
  {
    id: 'P18', slug: 'sensei-ai', name: 'Sensei AI', category: 'ml', maturity: 'working', period: 'Feb-Sep 2026',
    summary: 'Buy, sell or hold signals for Nifty 50 stocks from five model families, including an LSTM, a temporal CNN and a PPO agent, with FinBERT news sentiment, SHAP explanations and a backtester.',
    stack: ['Python', 'PyTorch', 'Stable-Baselines3', 'hmmlearn', 'SHAP', 'FinBERT', 'FastAPI', 'Next.js'],
    links: [gh('Sensei')], linkNote: 'The Streamlit demo currently asks for a sign-in, so it is not linked.', caseStudy: true,
  },
  {
    id: 'P19', slug: 'ai-business-analytics', name: 'AI Business Analytics', category: 'ml', maturity: 'working', period: 'Aug 2026',
    summary: 'Upload a CSV and get cleaning, exploratory analysis, trained models, SHAP explanations and an LLM-written summary, packaged as an HTML and PDF report.',
    stack: ['Python', 'scikit-learn', 'SHAP', 'Gemini', 'FastAPI', 'Streamlit', 'ReportLab'],
    links: [gh('ai-business-analytics')], caseStudy: true,
  },
  {
    id: 'P22', slug: 'customer-churn-xai', name: 'Customer churn with explanations', category: 'ml', maturity: 'working', period: 'Mar 2026',
    summary: 'Predicts which customers will leave and explains each prediction in plain English with a retention suggestion, using XGBoost and SHAP.',
    stack: ['Python', 'XGBoost', 'SHAP', 'Streamlit'], links: [gh('Customer_Churn_using_XAI')],
    linkNote: 'The Streamlit demo currently asks for a sign-in, so it is not linked.',
    relation: 'Third version, after a SHAP prototype and an exploratory notebook.',
  },
  {
    id: 'P21', slug: 'customer-churn-shap-prototype', name: 'Customer churn SHAP prototype', category: 'ml', maturity: 'prototype', period: 'Mar 2026',
    summary: 'An explainer class comparing random forest and gradient boosting with SHAP, with a synthetic-data fallback.',
    stack: ['Python', 'scikit-learn', 'SHAP'], links: [], relation: 'Second version of the churn project.',
  },
  {
    id: 'P20', slug: 'customer-churn-eda', name: 'Customer churn analysis', category: 'ml', maturity: 'notebook', period: 'Oct 2025',
    summary: 'Exploratory analysis of the Telco customer churn dataset.', stack: ['Python', 'pandas', 'Jupyter'],
    links: [gh('Customer-Churn-Prediction')], relation: 'First version of the churn project.',
  },
  {
    id: 'P25', slug: 'finsight', name: 'FinSight', category: 'ml', maturity: 'working', period: 'Feb 2026',
    summary: 'Measures how market events moved a stock: event-window returns, volatility and news sentiment on a dark Plotly dashboard.',
    stack: ['Python', 'Streamlit', 'Plotly', 'yfinance', 'NLTK'], links: [gh('Finsight_Smart_Stock_Event_Impact_Analyzer')],
    linkNote: 'The Streamlit demo currently asks for a sign-in, so it is not linked.',
  },
  {
    id: 'P28', slug: 'credit-card-default', name: 'Credit card default', category: 'ml', maturity: 'notebook', period: 'Oct 2025',
    summary: 'Default prediction on 30,000 UCI credit-card clients, comparing logistic regression, random forest and XGBoost (about 81% accuracy, ROC-AUC 0.72 to 0.76).',
    stack: ['Python', 'scikit-learn', 'XGBoost'], links: [gh('Credit-Card-Default')],
  },
  {
    id: 'P29', slug: 'credit-card-fraud', name: 'Credit card fraud detection', category: 'ml', maturity: 'notebook', period: 'Oct 2025',
    summary: 'Fraud detection on a heavily imbalanced dataset with SMOTE and a random forest, judged on precision-recall rather than accuracy.',
    stack: ['Python', 'scikit-learn', 'imbalanced-learn'], links: [gh('Credit-Card-fraud-detection')],
  },
  {
    id: 'P34', slug: 'kaggle-student-scores', name: 'Kaggle Playground: student scores', category: 'ml', maturity: 'notebook', period: 'Jan 2026',
    summary: 'Regression with heavy feature engineering, K-fold validation and a stacked ensemble of HistGradientBoosting and XGBoost under a ridge meta-model.',
    stack: ['Python', 'scikit-learn', 'XGBoost'], links: [],
  },
  {
    id: 'P35', slug: 'kaggle-diabetes', name: 'Kaggle Playground: diabetes', category: 'ml', maturity: 'notebook', period: 'Jan 2026',
    summary: 'Binary classification over 26 health features with a blended CatBoost and LightGBM model.', stack: ['Python', 'CatBoost', 'LightGBM'], links: [],
  },
  {
    id: 'P36', slug: 'product-recommender', name: 'Product recommender', category: 'ml', maturity: 'notebook', period: 'Oct 2025',
    summary: 'Content-based recommendations for Amazon India products using TF-IDF and cosine similarity.', stack: ['Python', 'scikit-learn'], links: [],
  },
  {
    id: 'P37', slug: 'house-price-regressor', name: 'Tabular regressor', category: 'ml', maturity: 'notebook', period: 'Aug 2025',
    summary: 'A reusable scikit-learn pipeline that compares linear regression with a random forest, keeps the lower-RMSE model and saves it.',
    stack: ['Python', 'scikit-learn'], links: [gh('House-Price-Regression-Generic-Tabular-Regressor-')],
  },
  {
    id: 'P30', slug: 'spam-detector', name: 'Spam mail detector', category: 'ml', maturity: 'notebook', period: 'Aug 2025',
    summary: 'TF-IDF text classifier comparing multinomial naive Bayes with a linear SVM, with column auto-detection and demo data.',
    stack: ['Python', 'scikit-learn'], links: [gh('Spam-Mail-Detector')],
  },
  {
    id: 'P31', slug: 'sentiment-web-app', name: 'Sentiment web app', category: 'ml', maturity: 'notebook', period: 'Oct 2025',
    summary: 'Paste any text and get its polarity, subjectivity and a label. A single-file Flask app on TextBlob.',
    stack: ['Python', 'Flask', 'TextBlob'], links: [gh('Sentiment_analysis')],
  },
  {
    id: 'P33', slug: 'moodmate', name: 'MoodMate', category: 'ml', maturity: 'prototype', period: 'Jul 2025',
    summary: 'Facial emotion detection from a webcam or an uploaded image in a Streamlit app.', stack: ['Python', 'OpenCV', 'cvlib', 'Streamlit'], links: [gh('MoodMate')],
  },
  {
    id: 'P52', slug: 'face-attendance', name: 'Face attendance', category: 'ml', maturity: 'working', period: 'Aug 2025',
    summary: 'Register faces from a webcam, recognise them live, log attendance to SQLite and export reports by date range.',
    stack: ['Python', 'face_recognition', 'OpenCV', 'SQLite'], links: [], linkNote: 'Not published because the database holds face data.',
  },

  // Full-stack
  {
    id: 'P11', slug: 'refera', name: 'Refera', category: 'fullstack', maturity: 'working', period: 'Sep-Oct 2026',
    summary: 'Fintech referral platform: affiliates refer leads for loans and cards, conversions pay multi-level commissions into an append-only ledger, and KYC-verified affiliates withdraw earnings.',
    stack: ['React Native', 'Expo', 'Express 5', 'Prisma', 'PostgreSQL', 'React', 'TypeScript'],
    links: [gh('Banksaathi-clone')], tests: '50 API tests (counted, not run for this site).', caseStudy: true, featured: true,
  },
  {
    id: 'P12', slug: 'dairy-collection-manager', name: 'Dairy Collection Manager', category: 'fullstack', maturity: 'deployed', period: 'Sep 2026',
    summary: 'Daily milk register for a collection centre: fat-based rate charts, supplier ledgers, advances repaid in instalments and one-transaction settlements.',
    stack: ['React', 'Vite', 'Supabase', 'PostgreSQL', 'Vercel'],
    links: [gh('Milk_management'), { label: 'Live app (sign-in required)', href: 'https://milk-management-five.vercel.app', kind: 'demo' }], caseStudy: true,
  },
  {
    id: 'P13', slug: 'community-platform', name: 'Community platform', category: 'fullstack', maturity: 'prototype', period: 'Mar 2026',
    summary: 'Member registry, events, matrimonial profiles, donations and an admin approval workflow for a community association.',
    stack: ['React', 'TypeScript', 'Firebase', 'Razorpay', 'Tailwind'], links: [gh('Freelance')],
  },
  {
    id: 'P14', slug: 'ride-booking-app', name: 'Ride booking app', category: 'fullstack', maturity: 'prototype', period: 'Apr 2026',
    summary: 'Booking flow with a wallet, driver dashboard and admin panel on real-time Firestore listeners and transactions.',
    stack: ['React', 'TypeScript', 'Firebase', 'Express'], links: [], linkNote: 'Repository is not public.',
  },
  {
    id: 'P16', slug: 'seedsphere', name: 'SeedSphere', category: 'fullstack', maturity: 'prototype', period: 'Mar 2026',
    summary: 'Storefront for agricultural seeds with a catalogue, cart, wishlist and cart recommendations.',
    stack: ['React', 'TypeScript', 'Firebase'], links: [gh('SeedSphere')],
  },
  {
    id: 'P15', slug: 'portfolio', name: 'This website', category: 'fullstack', maturity: 'deployed', period: 'Mar-Oct 2026',
    summary: 'Prerendered React site with a project archive, case studies and a contact form backed by a serverless function.',
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Vercel'], links: [gh('Portfolio')],
  },

  // Algorithms and tools
  {
    id: 'P10', slug: 'routecore', name: 'RouteCore', category: 'tools', maturity: 'working', period: 'Sep 2026',
    summary: 'Route-optimisation and fleet-scheduling engine with a hand-built hash map, min-heap and k-d tree, Dijkstra, A* and 2-opt. No runtime dependencies.',
    stack: ['Java 17', 'Maven', 'JUnit'], links: [gh('RouteCore')], tests: '47 JUnit tests in 8 suites.', caseStudy: true, featured: true,
  },
  {
    id: 'P55', slug: 'stock-cli', name: 'Indian stock lookup (terminal)', category: 'tools', maturity: 'notebook', period: 'Jan 2026',
    summary: 'Look up any NSE stock with ticker autocomplete: live price, fundamentals and shareholding.', stack: ['Python', 'yfinance', 'prompt_toolkit'],
    links: [gh('Stock-price-details')], relation: 'A Flask version also exists.',
  },
  {
    id: 'P56', slug: 'stock-website', name: 'Indian stock lookup (web)', category: 'tools', maturity: 'prototype', period: 'Jan 2025',
    summary: 'Flask version of the stock lookup. Shareholding data is still stubbed.', stack: ['Python', 'Flask', 'yfinance'], links: [],
  },
  {
    id: 'P57', slug: 'whatsapp-greetings', name: 'WhatsApp greetings', category: 'tools', maturity: 'notebook', period: 'Aug 2025',
    summary: 'Reads contacts from Excel and sends personalised messages through WhatsApp Web.', stack: ['Python', 'pandas', 'pywhatkit'],
    links: [gh('Whatsapp_message_automation')],
  },
  {
    id: 'P58', slug: 'finance-tracker', name: 'Finance tracker', category: 'tools', maturity: 'notebook', period: 'Mar 2025',
    summary: 'Command-line income and expense log with a running summary, using only the standard library.', stack: ['Python'], links: [gh('Finance-tracker')],
  },

  // Data and BI
  {
    id: 'P40', slug: 'paytm-dashboard', name: 'Paytm stock dashboard', category: 'data', maturity: 'notebook', period: 'Sep 2025',
    summary: 'Four-stage ETL lining up Paytm’s share price with competitors and market events, feeding two Power BI dashboards.', stack: ['Python', 'yfinance', 'Power BI'], links: [],
  },
  {
    id: 'P41', slug: 'nifty50-dashboard', name: 'NIFTY 50 dashboard', category: 'data', maturity: 'notebook', period: 'Sep 2025',
    summary: 'Fundamentals and price history for all 50 constituents, modelled in Power BI.', stack: ['Python', 'pandas', 'yfinance', 'Power BI'],
    links: [gh('nifty-50-dashboard-using-python-and-power-bi')],
  },
  {
    id: 'P42', slug: 'nifty50-live', name: 'NIFTY 50 live feed', category: 'data', maturity: 'notebook', period: 'Oct 2025',
    summary: 'Polls prices and fundamentals for all 50 stocks every minute into sheets a dashboard can read.', stack: ['Python', 'yfinance'], links: [gh('nifty-50-live')],
  },
  {
    id: 'P43', slug: 'zomato-sql', name: 'Zomato SQL analysis', category: 'data', maturity: 'notebook', period: 'Oct 2025',
    summary: 'Loads 9,551 restaurants from 15 countries into SQLite and answers questions with joins, CTEs and window functions.', stack: ['SQL', 'SQLite', 'pandas', 'Seaborn'],
    links: [gh('Zomato-SQL-EDA-Visualization')],
  },
  {
    id: 'P44', slug: 'youtube-analysis', name: 'YouTube channel analysis', category: 'data', maturity: 'notebook', period: 'Aug 2025',
    summary: 'Pulls every video from a channel through the YouTube Data API and computes engagement metrics for Power BI.', stack: ['Python', 'YouTube Data API', 'Power BI'],
    links: [gh('Youtube_channel_analysis')],
  },
  {
    id: 'P45', slug: 'bmw-sales', name: 'BMW sales analysis', category: 'data', maturity: 'notebook', period: 'Oct 2025',
    summary: 'Exploratory analysis of worldwide BMW sales from 2010 to 2024 with a Power BI dashboard.', stack: ['pandas', 'Power BI'], links: [gh('BMW-sales-analysis')],
  },
  {
    id: 'P46', slug: 'lamborghini-sales', name: 'Lamborghini sales BI', category: 'data', maturity: 'notebook', period: 'Nov 2025',
    summary: 'BI on simulated dealership data: customers, vehicles, dealers and marketing campaigns.', stack: ['pandas', 'SQLite', 'Power BI'], links: [],
  },
  {
    id: 'P47', slug: 'zudio-eda', name: 'Zudio retail analysis', category: 'data', maturity: 'notebook', period: 'Feb 2026',
    summary: 'Exploratory analysis of Zudio sales data.', stack: ['pandas', 'Jupyter'], links: [gh('Zudio-Data-Analysis-EDA')], relation: 'An R version also exists.',
  },
  {
    id: 'P48', slug: 'zudio-r', name: 'Zudio sales analytics in R', category: 'data', maturity: 'prototype', period: 'Mar 2026',
    summary: 'A numbered R pipeline from loading and cleaning through feature engineering to model training and prediction.', stack: ['R', 'tidyverse', 'caret', 'xgboost'], links: [],
  },
  {
    id: 'P49', slug: 'quick-commerce-inventory', name: 'Quick-commerce inventory', category: 'data', maturity: 'notebook', period: 'Jan 2026',
    summary: 'Cleans Zepto inventory data and reports items running low.', stack: ['pandas'], links: [gh('inventory-management-system')],
  },
  {
    id: 'P50', slug: 'eda-toolkit', name: 'EDA script', category: 'data', maturity: 'notebook', period: 'Oct 2025',
    summary: 'Exploratory analysis for any CSV: summary statistics, bar and scatter charts and a correlation heatmap.', stack: ['pandas', 'matplotlib'],
    links: [gh('EDA-on-a-data-frame')],
  },

  // Learning
  {
    id: 'P53', slug: 'face-detection', name: 'Face detection', category: 'learning', maturity: 'notebook', period: 'Feb 2025',
    summary: 'Real-time webcam face detection with Haar cascades.', stack: ['Python', 'OpenCV'], links: [gh('Face_detection')],
  },
  {
    id: 'P54', slug: 'motion-detection', name: 'Motion detection', category: 'learning', maturity: 'notebook', period: 'May 2025',
    summary: 'Highlights moving objects with MOG2 background subtraction and contours.', stack: ['Python', 'OpenCV'], links: [gh('Motion-datection')],
  },
  {
    id: 'P38', slug: 'digit-classifier', name: 'Handwritten digit classifier', category: 'learning', maturity: 'notebook', period: 'Feb 2025',
    summary: 'An SVM on scikit-learn’s digits dataset with visualised predictions.', stack: ['Python', 'scikit-learn'], links: [],
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);

// First sentence of a summary, ending in exactly one full stop.
export const firstSentence = (text: string) => {
  const i = text.indexOf('. ');
  return i === -1 ? text : text.slice(0, i + 1);
};
