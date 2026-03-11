import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Calendar, ArrowRight } from 'lucide-react';

const experiences = [
  {
    role: "Software Developer Intern (SDE)",
    company: "Bluestock Fintech",
    period: "Apr 2025 – May 2025",
    description: "Architected data-driven backend modules for financial analytics. Optimized SQL queries and Python scripts, reducing data processing latency by 22% on datasets exceeding 100k records.",
    tags: ["Backend", "Fintech", "Optimization", "Python"]
  },
  {
    role: "AI Intern",
    company: "Evoastra Ventures",
    period: "Oct 2024 – Nov 2024",
    description: "Developed NLP sentiment classification models on 20,000+ Reddit records. Achieved an 84% accuracy rate, improving baseline performance by 21% through advanced hyperparameter tuning and TF-IDF optimization.",
    tags: ["NLP", "Python", "Scikit-learn", "Sentiment Analysis"]
  },
  {
    role: "Artificial Intelligence Intern",
    company: "Codexintern",
    period: "Aug 2025 – Sep 2025",
    description: "Built autonomous AI agents for task automation using Python. Implemented decision-making logic that improved workflow efficiency by 30% for analytical use cases.",
    tags: ["AI Agents", "Automation", "Python", "ML"]
  },
  {
    role: "Data Scientist Intern",
    company: "Kangaroo Software Pvt. Ltd.",
    period: "Oct 2025 – Jan 2026",
    description: "Designed predictive models for business strategy optimization. Conducted deep-dive analysis on customer behavior datasets, identifying key churn drivers with 90% confidence interval.",
    tags: ["Data Science", "Predictive Modeling", "Analytics"]
  }
];

const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-24 bg-slate-950/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">Professional <span className="text-gradient">Experience</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto">My professional journey through internships and real-world projects.</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8 mb-16">
          {experiences.slice(0, 3).map((exp, index) => (
            <div key={index} className="glass-card p-8 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-accent scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">{exp.role}</h3>
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

              <p className="text-slate-300 mb-6 leading-relaxed">
                {exp.description}
              </p>

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
