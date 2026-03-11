import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Github, ExternalLink, Code2, Database, TrendingUp, UserCheck, Info, Smile, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const projects = [
  {
    id: 'sensei',
    title: "Sensei AI Trading System",
    description: "Developed an AI-driven trading intelligence platform that integrates deep learning models (LSTM, TCN) and reinforcement learning (PPO) to generate buy/sell/hold decisions for NIFTY 50 stocks. Designed a modular signal pipeline combining technical indicators, fundamentals, and news sentiment analysis.",
    problem: "Traditional trading analysis lacks real-time tactical depth and reinforcement learning-based decision support.",
    stack: ["Python", "Streamlit", "LSTM", "PPO", "NLP"],
    metrics: "82% Prediction Accuracy",
    github: "https://github.com/Mokshitsharma/Sensei",
    demo: "#",
    icon: <TrendingUp size={32} />
  },
  {
    id: 'moodmate',
    title: "MoodMate Emotion Detection",
    description: "Real-time facial emotion detection system built with Streamlit and deep learning. It captures live video feed and classifies emotions into categories like Happy, Sad, Angry, etc., with high precision and low latency.",
    problem: "Detecting human emotions in real-time for interactive AI applications and mental health monitoring.",
    stack: ["Python", "Streamlit", "OpenCV", "Deep Learning"],
    metrics: "Real-time Processing",
    github: "https://github.com/Mokshitsharma/MoodMate",
    demo: "#",
    icon: <Smile size={32} />
  },
  {
    id: 'finsight',
    title: "Finsight Stock Analyzer",
    description: "A dark, minimal fintech-style dashboard that connects market events with stock behavior. It evaluates the impact of real-world events on stock performance using event-driven analysis and sentiment-labeled market events.",
    problem: "Retail investors need accessible, real-time data visualization and event impact analysis to understand market volatility.",
    stack: ["Python", "Streamlit", "Plotly", "Yahoo Finance API"],
    metrics: "Event-Driven Insights",
    github: "https://github.com/Mokshitsharma/Finsight_Smart_Stock_Event_Impact_Analyzer",
    demo: "#",
    icon: <Database size={32} />
  },
  {
    id: 'churn',
    title: "Customer Churn Prediction",
    description: "Predicting customer retention with AI-driven insights. Built a machine learning pipeline to analyze customer behavior and predict the likelihood of churn, enabling businesses to take proactive retention measures.",
    problem: "Businesses lose significant revenue due to customer churn and lack predictive tools to identify at-risk customers.",
    stack: ["Python", "Pandas", "Scikit-learn", "Jupyter"],
    metrics: "91% Precision Rate",
    github: "https://github.com/Mokshitsharma/Customer-Churn-Prediction",
    demo: "#",
    icon: <TrendingUp size={32} />
  },
  {
    id: 'sentiment',
    title: "Reddit Sentiment Analysis",
    description: "Built NLP pipelines using TF-IDF, Logistic Regression, and Naive Bayes to classify 50k+ Reddit posts. Achieved high accuracy in multi-class sentiment prediction for social media insights.",
    problem: "Analyzing large-scale social media data for sentiment trends and public opinion monitoring.",
    stack: ["Python", "NLP", "TF-IDF", "Scikit-learn"],
    metrics: "87% Accuracy",
    github: "https://github.com/Mokshitsharma/Sentiment_analysis",
    demo: "#",
    icon: <Code2 size={32} />
  },
  {
    id: 'zudio',
    title: "Zudio EDA & Analysis",
    description: "Comprehensive Exploratory Data Analysis (EDA) on Zudio's retail data. Performed trend analysis, customer segmentation, and sales forecasting to identify growth opportunities.",
    problem: "Understanding retail sales patterns and customer behavior to optimize inventory and marketing strategies.",
    stack: ["Python", "Pandas", "Matplotlib", "Seaborn"],
    metrics: "Data-Driven Insights",
    github: "https://github.com/Mokshitsharma/Zudio-Data-Analysis-EDA",
    demo: "#",
    icon: <Database size={32} />
  },
  {
    id: 'fraud',
    title: "Credit Card Fraud Detection",
    description: "Machine learning model to detect fraudulent credit card transactions. Implemented anomaly detection and classification algorithms to identify suspicious patterns in real-time.",
    problem: "Financial institutions lose billions to fraud; real-time detection is critical for security.",
    stack: ["Python", "Scikit-learn", "Random Forest", "XGBoost"],
    metrics: "99.8% Detection Rate",
    github: "https://github.com/Mokshitsharma/Credit-Card-fraud-detection",
    demo: "#",
    icon: <ShieldCheck size={32} />
  },
  {
    id: 'zomato',
    title: "Zomato SQL Analysis",
    description: "Deep dive into Zomato's restaurant data using SQL and visualization tools. Analyzed restaurant ratings, cuisines, and pricing trends across different locations.",
    problem: "Extracting meaningful business insights from large-scale restaurant databases.",
    stack: ["SQL", "Power BI", "Data Visualization"],
    metrics: "Business Intelligence",
    github: "https://github.com/Mokshitsharma/Zomato-SQL-EDA-Visualization",
    demo: "#",
    icon: <Database size={32} />
  },
  {
    id: 'house',
    title: "House Price Regression",
    description: "Generic tabular regressor for predicting house prices. Implemented advanced feature engineering and ensemble methods to achieve high predictive accuracy.",
    problem: "Accurately predicting real estate prices based on diverse tabular features.",
    stack: ["Python", "Regression", "Ensemble Methods"],
    metrics: "Low RMSE Score",
    github: "https://github.com/Mokshitsharma/House-Price-Regression-Generic-Tabular-Regressor-",
    demo: "#",
    icon: <TrendingUp size={32} />
  }
];

const ProjectsDetail: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <Link to="/" className="inline-flex items-center gap-2 text-accent hover:underline mb-12 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Portfolio
        </Link>

        <h1 className="text-5xl md:text-7xl font-bold mb-8 text-[var(--text-primary)]">All <span className="text-gradient">Projects</span></h1>
        <p className="text-[var(--text-secondary)] text-xl mb-16 max-w-3xl">
          A deep dive into my technical projects, exploring the problems solved and the impact created through AI and data science.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-20">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className={`glass-card p-8 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:scale-105 ${selectedProject?.id === project.id ? 'border-accent bg-accent/10' : 'hover:border-accent/30'}`}
            >
              <div className={`p-4 rounded-2xl ${selectedProject?.id === project.id ? 'bg-accent text-slate-950' : 'bg-accent/10 text-accent'}`}>
                {project.icon}
              </div>
              <span className="text-sm font-bold text-center text-[var(--text-primary)]">{project.title}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selectedProject ? (
            <motion.div
              key={selectedProject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-8 md:p-12"
            >
              <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--text-primary)]">{selectedProject.title}</h2>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedProject.stack.map((tech, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-accent/5 border border-accent/20 text-xs font-mono text-accent uppercase tracking-widest">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4 h-fit">
                  <a href={selectedProject.github} target="_blank" rel="noopener noreferrer" className="glow-button flex items-center gap-2">
                    <Github size={18} />
                    GitHub
                  </a>
                  <a href={selectedProject.demo} className="px-6 py-3 rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/80 transition-all flex items-center gap-2 font-medium text-[var(--text-primary)]">
                    <ExternalLink size={18} />
                    Live Demo
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[var(--text-primary)]">
                      <Info size={20} className="text-accent" />
                      About the Project
                    </h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
                      {selectedProject.description}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Problem Statement</h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                      {selectedProject.problem}
                    </p>
                  </div>
                </div>
                <div className="glass-card p-6 h-fit bg-[var(--bg-secondary)]/50">
                  <h3 className="text-lg font-bold mb-4 border-b border-[var(--border-primary)] pb-2 text-[var(--text-primary)]">Key Metrics</h3>
                  <div className="text-3xl font-bold text-accent mb-2">{selectedProject.metrics}</div>
                  <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest font-mono">Performance Impact</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-20 glass-card border-dashed border-[var(--border-primary)]">
              <p className="text-[var(--text-secondary)] text-lg">Select a project icon above to view details</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProjectsDetail;
