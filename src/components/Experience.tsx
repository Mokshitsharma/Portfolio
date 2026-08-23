import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Calendar, ArrowRight, Sparkles } from 'lucide-react';

const experiences = [
  {
    role: "Founding Engineer — Tech & Operations",
    company: "Movigo Innovations (Live B2B Logistics Marketplace)",
    period: "Apr 2026 – Present",
    featured: true,
    bullets: [
      "Sole engineer for Movigo's entire live production stack — a Node.js/Express/MongoDB backend, two Play Store-published Flutter apps (driver + retailer), and an admin console — ~136,000 LOC across ~386 files, after taking over a stalled outsourced effort that had delivered only UI mockups in ~6 months.",
      "Built a real-time driver-dispatch engine (372-endpoint API, 25 MongoDB collections): age-widening search radius, cross-booking deduplication per cycle, and race-condition-safe atomic booking assignment so simultaneous driver accepts never double-book.",
      "Diagnosed a shared-hosting WebSocket limitation in production and migrated the live-tracking/chat transport (Socket.IO → Pusher) across both mobile apps with zero user-facing breakage — a mid-flight infrastructure change under real traffic.",
      "Integrated Razorpay payments with signature-verified webhooks and idempotency guards (no double-charging), plus a config-driven pricing/commission engine admins can update live without a code deploy.",
      "Shipped 47+ versioned releases of the driver app and 41+ of the retailer app (Play Store signing, R8/ProGuard, compliance fixes), and operate the backend in production on PM2/Nginx across a self-managed VPS migration from shared cPanel hosting."
    ],
    tags: ["Founding Engineer", "Full-Stack", "Real-time Systems", "Node.js", "Flutter", "DevOps"]
  },
  {
    role: "Software Developer Intern",
    company: "Bluestock Fintech",
    period: "Apr 2025 – May 2025",
    description: "Built Python backend modules to process and analyze structured financial datasets; designed automated data-ingestion and preprocessing pipelines. Optimized analytics scripts, reducing execution time by ~22%.",
    tags: ["Backend", "Fintech", "Python", "Optimization"]
  },
  {
    role: "Artificial Intelligence Intern",
    company: "Evoastra Ventures",
    period: "Oct 2024 – Nov 2024",
    description: "Built NLP sentiment-analysis pipelines on Reddit data using TF-IDF vectorization and tuned classifiers; improved model accuracy by ~21%.",
    tags: ["NLP", "Python", "Sentiment Analysis"]
  },
  {
    role: "Data Scientist Intern",
    company: "Cognifyz Technologies",
    period: "Sep 2024 – Oct 2024",
    description: "Developed regression models predicting restaurant ratings (scikit-learn); feature engineering and correlation analysis, achieving 0.84 R² on the final model.",
    tags: ["Data Science", "Regression", "scikit-learn"]
  }
];

const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-24 bg-slate-950/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">Professional <span className="text-gradient">Experience</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Building Movigo end-to-end, backed by hands-on experience across data science and AI internships.</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8 mb-16">
          {experiences.slice(0, 3).map((exp, index) => (
            <div
              key={index}
              className={`glass-card relative overflow-hidden group ${exp.featured ? 'p-8 md:p-10 border-accent/40' : 'p-8'}`}
            >
              <div className={`absolute top-0 left-0 w-1 h-full bg-accent origin-top transition-transform duration-500 ${exp.featured ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'}`} />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  {exp.featured && (
                    <div className="flex items-center gap-2 text-accent text-xs font-mono uppercase tracking-widest mb-2">
                      <Sparkles size={14} />
                      <span>Current — Flagship Role</span>
                    </div>
                  )}
                  <h3 className={`font-bold text-white ${exp.featured ? 'text-2xl md:text-3xl' : 'text-2xl'}`}>{exp.role}</h3>
                  <div className="flex items-center gap-2 text-accent font-medium">
                    <Briefcase size={16} />
                    <span>{exp.company}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-300 font-mono text-sm">
                  <Calendar size={16} />
                  <span>{exp.period}</span>
                </div>
              </div>

              {exp.bullets ? (
                <ul className="text-slate-300 mb-6 leading-relaxed space-y-3 list-disc list-outside pl-5">
                  {exp.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-300 mb-6 leading-relaxed">
                  {exp.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {exp.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-accent/5 border border-accent/20 text-[10px] font-mono text-accent uppercase tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link to="/internships" className="glow-button flex items-center gap-2 group">
            View Detailed Internships
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Experience;
