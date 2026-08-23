import React from 'react';
import { Brain, BarChart3, Code2, Zap, CheckCircle2 } from 'lucide-react';

const WhyWorkWithMe: React.FC = () => {
  const points = [
    {
      title: "I've Shipped and Operate a Live Product",
      description: "As sole technical builder of Movigo, I own real infrastructure decisions end-to-end — not coursework, a real system with real users and real failure modes.",
      icon: <Zap className="text-accent" />
    },
    {
      title: "Full-Stack, Not Just Model Training",
      description: "Backend (Node.js), mobile (Flutter), real-time systems, payments, and deployment ops — I build the systems that carry ML into production, not just the models.",
      icon: <Code2 className="text-accent" />
    },
    {
      title: "Explainable, Not Just Predictive",
      description: "SHAP-based feature attribution, model evaluation beyond a single accuracy number, and applied AI that shows its reasoning — from trading signals to churn predictions.",
      icon: <Brain className="text-accent" />
    },
    {
      title: "Business-Focused, Metrics-Driven Thinking",
      description: "Whether it's a dispatch engine's latency or a model's precision, I optimize for measurable outcomes stakeholders actually care about.",
      icon: <BarChart3 className="text-accent" />
    }
  ];

  return (
    <section id="why-work-with-me" className="py-24 bg-slate-950/50 border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-accent font-mono text-sm tracking-[0.3em] uppercase mb-4 block">Value Proposition</span>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">Why Work <span className="text-gradient">With Me</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">
            I bridge the gap between building real production systems and AI/ML research.
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
