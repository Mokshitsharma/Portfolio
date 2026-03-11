import React from 'react';
import { Brain, BarChart3, Code2, Zap, CheckCircle2 } from 'lucide-react';

const WhyWorkWithMe: React.FC = () => {
  const points = [
    {
      title: "Strong ML Fundamentals & Model Evaluation Expertise",
      description: "Deep understanding of statistical learning, model bias/variance, and rigorous evaluation metrics beyond simple accuracy.",
      icon: <Brain className="text-accent" />
    },
    {
      title: "Business-Focused Analytics Thinking",
      description: "Translating complex data patterns into actionable business intelligence and measurable ROI for stakeholders.",
      icon: <BarChart3 className="text-accent" />
    },
    {
      title: "End-to-End ML System Development",
      description: "Experience in the full lifecycle: from data collection and EDA to model deployment and monitoring.",
      icon: <Zap className="text-accent" />
    },
    {
      title: "Clean, Scalable, Production-Ready Code Practices",
      description: "Writing modular, well-documented code with a focus on algorithmic efficiency and system maintainability.",
      icon: <Code2 className="text-accent" />
    }
  ];

  return (
    <section id="why-work-with-me" className="py-24 bg-slate-950/50 border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-accent font-mono text-sm tracking-[0.3em] uppercase mb-4 block">Value Proposition</span>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">Why Work <span className="text-gradient">With Me</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">
            I bridge the gap between academic research and production-ready implementation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {points.map((point, index) => (
            <div key={index} className="glass-card p-8 group hover:bg-white/10 transition-all duration-500">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform shrink-0">
                  {point.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors">{point.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {point.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyWorkWithMe;
