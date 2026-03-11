import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Github, ExternalLink, Code2, Database, TrendingUp, UserCheck, ArrowRight, Smile, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';

const projects = [
  {
    title: "Sensei AI Trading System",
    problem: "Traditional trading analysis lacks real-time tactical depth and reinforcement learning-based decision support.",
    stack: ["Python", "Streamlit", "LSTM", "PPO"],
    metrics: "82% Prediction Accuracy",
    github: "https://github.com/Mokshitsharma/Sensei",
    demo: "#",
    icon: <TrendingUp className="text-accent" />
  },
  {
    title: "MoodMate Emotion Detection",
    problem: "Detecting human emotions in real-time for interactive AI applications and mental health monitoring.",
    stack: ["Python", "Streamlit", "OpenCV", "Deep Learning"],
    metrics: "Real-time Processing",
    github: "https://github.com/Mokshitsharma/MoodMate",
    demo: "#",
    icon: <Smile className="text-accent" />
  },
  {
    title: "Finsight Stock Analyzer",
    problem: "Retail investors need accessible, real-time data visualization and event impact analysis to understand market volatility.",
    stack: ["Python", "Streamlit", "Plotly", "Yahoo Finance API"],
    metrics: "Event-Driven Insights",
    github: "https://github.com/Mokshitsharma/Finsight_Smart_Stock_Event_Impact_Analyzer",
    demo: "#",
    icon: <Database className="text-accent" />
  },
  {
    title: "Customer Churn Prediction",
    problem: "Businesses lose significant revenue due to customer churn and lack predictive tools to identify at-risk customers.",
    stack: ["Python", "Pandas", "Scikit-learn", "Jupyter"],
    metrics: "91% Precision Rate",
    github: "https://github.com/Mokshitsharma/Customer-Churn-Prediction",
    demo: "#",
    icon: <TrendingUp className="text-accent" />
  },
  {
    title: "Credit Card Fraud Detection",
    problem: "Financial institutions lose billions to fraud; real-time detection is critical for security.",
    stack: ["Python", "Scikit-learn", "Anomaly Detection"],
    metrics: "99.8% Detection Rate",
    github: "https://github.com/Mokshitsharma/Credit-Card-fraud-detection",
    demo: "#",
    icon: <ShieldCheck className="text-accent" />
  },
  {
    title: "Zomato SQL Analysis",
    problem: "Extracting meaningful business insights from large-scale restaurant databases for market analysis.",
    stack: ["SQL", "Power BI", "Data Viz"],
    metrics: "Business Intelligence",
    github: "https://github.com/Mokshitsharma/Zomato-SQL-EDA-Visualization",
    demo: "#",
    icon: <Database className="text-accent" />
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
      className="glass-card p-8 flex flex-col h-full group transition-all duration-500 hover:border-accent/40 hover:shadow-[0_0_30px_rgba(0,210,255,0.1)]"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="p-3 rounded-xl bg-accent/10">
          {project.icon}
        </div>
        <div className="flex gap-3">
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-accent transition-colors">
            <Github size={20} />
          </a>
          <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-accent transition-colors">
            <ExternalLink size={20} />
          </a>
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors text-white">{project.title}</h3>
      
      <div className="mb-6 flex-grow">
        <p className="text-sm text-slate-300 mb-4 line-clamp-3">
          <span className="text-white font-medium">Problem:</span> {project.problem}
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
        <span className="text-xs font-mono text-accent uppercase tracking-widest">Performance</span>
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
            <p className="text-slate-400 max-w-xl">A selection of my work in AI, Machine Learning, and Data Science, focused on solving complex problems with elegant code.</p>
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
