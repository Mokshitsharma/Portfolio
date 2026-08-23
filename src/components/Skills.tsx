import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, BarChart3, Code2, Globe, Server, ArrowRight, Smartphone, CreditCard, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';

const skillGroups = [
  {
    title: "Languages",
    icon: <Code2 className="text-accent" />,
    skills: ["JavaScript", "TypeScript", "Dart", "Python", "SQL", "HTML/CSS"]
  },
  {
    title: "Mobile",
    icon: <Smartphone className="text-accent" />,
    skills: ["Flutter", "Provider", "GetX Navigation", "Geolocator", "Google Maps", "Background Services", "FCM"]
  },
  {
    title: "Backend & Real-Time",
    icon: <Server className="text-accent" />,
    skills: ["Node.js", "Express", "MongoDB / Mongoose", "REST APIs (372 endpoints in prod)", "JWT Auth", "Pusher Channels", "node-cron"]
  },
  {
    title: "Payments & Infra",
    icon: <CreditCard className="text-accent" />,
    skills: ["Razorpay (Webhooks, Idempotency)", "PM2", "Nginx", "cPanel & VPS Deployment", "Let's Encrypt SSL", "Git"]
  },
  {
    title: "Frontend",
    icon: <Globe className="text-accent" />,
    skills: ["React 18/19", "Next.js", "TanStack Query", "Recharts", "Tailwind CSS", "Three.js"]
  },
  {
    title: "Machine Learning & AI",
    icon: <Brain className="text-accent" />,
    skills: ["Scikit-learn", "XGBoost", "PyTorch (LSTM, TCN)", "Stable-Baselines3 (PPO)", "SHAP", "FinBERT", "LLM/Agentic Tooling (Claude, Gemini)"]
  },
  {
    title: "Data & BI",
    icon: <BarChart3 className="text-accent" />,
    skills: ["Pandas", "NumPy", "Power BI", "SQL", "Recharts Dashboarding", "Automated Reporting (node-cron)"]
  },
  {
    title: "Operations & Leadership",
    icon: <Briefcase className="text-accent" />,
    skills: ["Team Coordination", "Business & Growth Decisions", "Config-Driven Business-Rule Systems"]
  }
];

const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <span className="text-accent font-mono text-sm tracking-[0.3em] uppercase mb-4 block">Expertise</span>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">Technical <span className="text-gradient">Arsenal</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">
            From production infrastructure to explainable ML — the full stack behind Movigo and my applied AI work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {skillGroups.map((group, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 4) * 0.1, duration: 0.6, ease: 'easeOut' }}
              className="glass-card p-8 group hover:border-accent/30 transition-all duration-500 flex flex-col"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-accent/10 group-hover:bg-accent group-hover:text-slate-950 transition-all duration-500">
                  {group.icon}
                </div>
                <h3 className="text-xl font-bold">{group.title}</h3>
              </div>

              <div className="flex flex-wrap gap-2 mt-auto">
                {group.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 hover:border-accent/30 hover:text-accent transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link to="/skills" className="glow-button flex items-center gap-2 group">
            View All My Skills
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Skills;
