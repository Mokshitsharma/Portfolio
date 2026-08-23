import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Github, ExternalLink, ArrowRight, Rocket, Users, TrendingUp, UserCheck, LifeBuoy } from 'lucide-react';
import gsap from 'gsap';

const projects = [
  {
    title: "Movigo",
    problem: "An outsourced dev team spent ~6 months and delivered only UI mockups — no working software.",
    stack: ["Node.js", "Express", "MongoDB", "Flutter", "Pusher", "Razorpay", "PM2", "Nginx"],
    metrics: "136,000+ LOC · 372 Endpoints",
    github: "",
    demo: "",
    featured: true,
    icon: <Rocket className="text-accent" />
  },
  {
    title: "Movigo FieldOps v2",
    problem: "A real ~20-employee field operation needed a config-driven, auditable workforce platform — not a generic HR tool.",
    stack: ["Node.js/TS", "Express", "Sequelize/MariaDB", "Socket.io", "Next.js", "Flutter"],
    metrics: "27-Entity Schema · ~70 Endpoints",
    github: "",
    demo: "",
    icon: <Users className="text-accent" />
  },
  {
    title: "Sensei AI",
    problem: "Traditional trading analysis lacks explainability and multi-model tactical depth.",
    stack: ["Python", "PyTorch", "Stable-Baselines3", "SHAP", "FinBERT"],
    metrics: "~5,300 LOC · All 50 Nifty Stocks",
    github: "https://github.com/Mokshitsharma/Sensei",
    demo: "",
    icon: <TrendingUp className="text-accent" />
  },
  {
    title: "Customer Churn — Explainable AI",
    problem: "Churn predictions are of little use to business teams without plain-English reasons behind them.",
    stack: ["XGBoost", "SHAP", "Streamlit"],
    metrics: "~0.85 ROC-AUC",
    github: "https://github.com/Mokshitsharma/Customer-Churn-Prediction",
    demo: "",
    icon: <UserCheck className="text-accent" />
  },
  {
    title: "Disaster-Response AI Agent",
    problem: "Disaster response needs fast, tool-augmented guidance, not a static chatbot.",
    stack: ["Python", "Anthropic Claude", "Streamlit"],
    metrics: "~1,700 LOC",
    github: "",
    demo: "",
    icon: <LifeBuoy className="text-accent" />
  }
];

const ProjectCard: React.FC<{ project: typeof projects[0] }> = ({ project }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.5,
        ease: 'power2.out',
        transformPerspective: 1000
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`glass-card p-8 flex flex-col h-full group transition-all duration-500 hover:border-accent/40 hover:shadow-[0_0_30px_rgba(254,250,205,0.1)] ${project.featured ? 'border-accent/40 ring-1 ring-accent/20' : ''}`}
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="p-3 rounded-xl bg-accent/10">
          {project.icon}
        </div>
        <div className="flex gap-3">
          {project.github && project.github !== '#' && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-accent transition-colors">
              <Github size={20} />
            </a>
          )}
          {project.demo && project.demo !== '#' && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-accent transition-colors">
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>

      {project.featured && (
        <span className="text-[10px] font-mono text-accent uppercase tracking-widest mb-2">Flagship Project</span>
      )}
      <h3 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors text-white">{project.title}</h3>

      <div className="mb-6 flex-grow">
        <p className="text-sm text-slate-300 mb-4 line-clamp-3">
          {project.problem}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.stack.map((tech, i) => (
            <span key={i} className="px-2 py-1 rounded-md bg-white/10 border border-white/10 text-[10px] font-mono text-slate-200 uppercase tracking-wider">
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-white/10 flex items-center justify-between">
        <span className="text-xs font-mono text-accent uppercase tracking-widest">Scale</span>
        <span className="text-sm font-bold text-white">{project.metrics}</span>
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-24 bg-slate-950/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4">Featured <span className="text-gradient">Projects</span></h2>
            <p className="text-slate-400 max-w-xl">From a live production marketplace to explainable AI research — a selection of what I've built.</p>
          </div>
          <a href="https://github.com/Mokshitsharma" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center gap-2 font-medium">
            View all on GitHub <ExternalLink size={16} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {projects.slice(0, 3).map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>

        <div className="flex justify-center">
          <Link to="/projects" className="glow-button flex items-center gap-2 group">
            Explore All Projects
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Projects;
