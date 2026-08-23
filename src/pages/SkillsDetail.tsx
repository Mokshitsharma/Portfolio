import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, BarChart3, Code2, Globe, Server, Smartphone, CreditCard, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';

const skillCategories = [
  {
    id: 0,
    title: "Backend & Real-Time Systems",
    icon: <Server className="text-accent" />,
    description: "Movigo Production Stack",
    subCategories: [
      {
        name: "Core Backend",
        skills: ["Node.js", "Express", "MongoDB / Mongoose", "REST APIs (372 endpoints in production)", "JWT Auth"]
      },
      {
        name: "Real-Time & Scheduling",
        skills: ["Pusher Channels", "Race-Condition-Safe Concurrency", "node-cron"]
      }
    ]
  },
  {
    id: 1,
    title: "Mobile Engineering",
    icon: <Smartphone className="text-accent" />,
    description: "2 Apps on Play Store (47+/41+ Releases)",
    subCategories: [
      {
        name: "Flutter",
        skills: ["Provider", "GetX Navigation", "Geolocator", "Google Maps", "Background Services", "FCM"]
      }
    ]
  },
  {
    id: 2,
    title: "Payments & Infrastructure",
    icon: <CreditCard className="text-accent" />,
    subCategories: [
      {
        name: "Payments",
        skills: ["Razorpay", "Webhooks", "Idempotency Guards"]
      },
      {
        name: "Deployment & Ops",
        skills: ["PM2", "Nginx", "cPanel & VPS Deployment", "Let's Encrypt SSL", "Git"]
      }
    ]
  },
  {
    id: 3,
    title: "Frontend",
    icon: <Globe className="text-accent" />,
    subCategories: [
      {
        name: "Web",
        skills: ["React 18/19", "Next.js", "TanStack Query", "Recharts", "Tailwind CSS", "Three.js"]
      }
    ]
  },
  {
    id: 4,
    title: "Machine Learning & AI",
    icon: <Brain className="text-accent" />,
    subCategories: [
      {
        name: "Modeling",
        skills: ["Scikit-learn", "XGBoost", "PyTorch (LSTM, Temporal CNN)", "Stable-Baselines3 (PPO)", "hmmlearn"]
      },
      {
        name: "Explainability & NLP",
        skills: ["SHAP", "FinBERT", "LLM / Agentic Tooling (Claude, Gemini)"]
      }
    ]
  },
  {
    id: 5,
    title: "Data & BI",
    icon: <BarChart3 className="text-accent" />,
    subCategories: [
      {
        name: "Analysis & Reporting",
        skills: ["Pandas", "NumPy", "Power BI", "SQL", "Recharts Dashboarding", "Automated Reporting (node-cron)"]
      }
    ]
  },
  {
    id: 6,
    title: "Languages",
    icon: <Code2 className="text-accent" />,
    subCategories: [
      {
        name: "Core",
        skills: ["JavaScript", "TypeScript", "Dart", "Python", "SQL", "HTML/CSS"]
      }
    ]
  },
  {
    id: 7,
    title: "Operations & Leadership",
    icon: <Briefcase className="text-accent" />,
    description: "Not Just Engineering",
    subCategories: [
      {
        name: "Business & Team",
        skills: ["Team Coordination (Calling & Field Teams)", "Business & Growth Decision-Making", "Config-Driven Business-Rule Systems"]
      }
    ]
  }
];

const SkillsDetail: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <Link to="/" className="inline-flex items-center gap-2 text-accent hover:underline mb-12 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Portfolio
        </Link>

        <h1 className="text-5xl md:text-7xl font-bold mb-8 text-[var(--text-primary)]">Technical <span className="text-gradient">Skills</span></h1>
        <p className="text-[var(--text-secondary)] text-xl mb-16 max-w-3xl">
          A comprehensive classification of my expertise — from production infrastructure and mobile engineering to explainable ML and the operational side of running Movigo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-8 group hover:border-accent/40 transition-all duration-500"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-accent/10 group-hover:bg-accent group-hover:text-slate-950 transition-all duration-500">
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)]">{category.title}</h3>
                  {category.description && (
                    <span className="text-xs font-mono text-accent uppercase tracking-widest">{category.description}</span>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {category.subCategories.map((sub, i) => (
                  <div key={i}>
                    <h4 className="text-sm font-mono text-[var(--text-secondary)] uppercase tracking-widest mb-3">{sub.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      {sub.skills.map((skill, j) => (
                        <span
                          key={j}
                          className="px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-sm text-[var(--text-secondary)] hover:border-accent/30 hover:text-accent transition-all cursor-default"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsDetail;
