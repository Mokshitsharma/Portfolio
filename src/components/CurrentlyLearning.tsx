import React from 'react';
import { BookOpen, Rocket, ShieldCheck, Database, LayoutGrid } from 'lucide-react';

const CurrentlyLearning: React.FC = () => {
  const topics = [
    {
      title: "Advanced Recommendation Systems",
      description: "Collaborative filtering, deep learning for recommendations, and cold-start problem optimization.",
      icon: <LayoutGrid className="text-accent" />
    },
    {
      title: "Model Explainability (SHAP, LIME)",
      description: "Techniques for interpreting complex black-box models to build trust and ensure ethical AI.",
      icon: <ShieldCheck className="text-accent" />
    },
    {
      title: "MLOps & Deployment Pipelines",
      description: "Automating the ML lifecycle with CI/CD, model monitoring, and versioning for scalable systems.",
      icon: <Rocket className="text-accent" />
    },
    {
      title: "Scalable ML System Design",
      description: "Architecting high-performance systems for real-time inference and large-scale data processing.",
      icon: <Database className="text-accent" />
    }
  ];

  return (
    <section id="currently-learning" className="py-24 bg-slate-900/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-accent font-mono text-sm tracking-[0.3em] uppercase mb-4 block">Growth Mindset</span>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">Currently <span className="text-gradient">Learning</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">
            Staying at the forefront of AI innovation through continuous learning and experimentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {topics.map((topic, index) => (
            <div key={index} className="glass-card p-8 group hover:bg-white/10 transition-all duration-500">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform shrink-0 mb-6 inline-block">
                {topic.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors">{topic.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {topic.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CurrentlyLearning;
