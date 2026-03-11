import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, BarChart3, Code2, Globe, Cpu, Cloud, Palette, Trophy, Zap } from 'lucide-react';
import { motion } from 'motion/react';

const skillCategories = [
  {
    id: 1,
    title: "AI / Machine Learning Engineer",
    icon: <Brain className="text-accent" />,
    subCategories: [
      {
        name: "Core ML Skills",
        skills: ["Supervised & Unsupervised Learning", "Regression & Classification Modeling", "Model Evaluation (Accuracy, Precision, Recall, F1)", "Feature Engineering", "Data Preprocessing & Cleaning"]
      },
      {
        name: "Libraries & Frameworks",
        skills: ["Python", "NumPy", "Pandas", "Scikit-learn", "TensorFlow", "PyTorch"]
      },
      {
        name: "Special Areas",
        skills: ["NLP (Sentiment Analysis, Text Classification)", "Model Training & Optimization", "Real-world dataset handling", "Performance tuning"]
      }
    ]
  },
  {
    id: 2,
    title: "Data Scientist",
    icon: <BarChart3 className="text-accent" />,
    subCategories: [
      {
        name: "Data Analysis",
        skills: ["Exploratory Data Analysis (EDA)", "Statistical Analysis", "Correlation & Pattern Identification", "Hypothesis Testing"]
      },
      {
        name: "Data Handling",
        skills: ["SQL", "Advanced Excel", "Data Cleaning & Transformation", "Large dataset processing"]
      },
      {
        name: "Visualization",
        skills: ["Matplotlib", "Seaborn", "Power BI", "Tableau"]
      }
    ]
  },
  {
    id: 3,
    title: "Python Developer (Data-Oriented)",
    icon: <Code2 className="text-accent" />,
    subCategories: [
      {
        name: "Development",
        skills: ["Object-Oriented Programming (OOPS)", "API Integration (Reddit, Yahoo Finance)", "Script Automation", "Backend logic development", "File handling & JSON processing"]
      }
    ]
  },
  {
    id: 4,
    title: "Web & ML Application Developer",
    icon: <Globe className="text-accent" />,
    subCategories: [
      {
        name: "Web Technologies",
        skills: ["Flask (Backend)", "HTML5", "CSS3", "JavaScript", "REST API Integration", "Deployment fundamentals", "Basic frontend structuring"]
      }
    ]
  },
  {
    id: 5,
    title: "AI Systems Builder",
    icon: <Zap className="text-accent" />,
    description: "Your Strongest Positioning",
    subCategories: [
      {
        name: "Architecture & Design",
        skills: ["End-to-end ML pipeline design", "Data ETL workflow design", "Real-time & offline model architecture", "System design thinking", "Performance optimization mindset", "Deployment planning"]
      }
    ]
  },
  {
    id: 6,
    title: "Computer Science Foundations",
    icon: <Cpu className="text-accent" />,
    subCategories: [
      {
        name: "Core CS",
        skills: ["Data Structures & Algorithms", "DBMS", "Operating Systems", "OOPS", "Prompt Engineering"]
      }
    ]
  },
  {
    id: 7,
    title: "Cloud & Platforms",
    icon: <Cloud className="text-accent" />,
    subCategories: [
      {
        name: "Cloud Skills",
        skills: ["Google Cloud Arcade (Advanced Milestone)", "Cloud Skills Boost", "Basic cloud deployment exposure"]
      }
    ]
  },
  {
    id: 8,
    title: "Design & Presentation",
    icon: <Palette className="text-accent" />,
    subCategories: [
      {
        name: "Creative Tools",
        skills: ["Canva", "Figma", "Photoshop", "Technical presentation design", "Visual storytelling"]
      }
    ]
  },
  {
    id: 9,
    title: "Competitive Programming & Practice",
    icon: <Trophy className="text-accent" />,
    subCategories: [
      {
        name: "Achievements",
        skills: ["HackerRank 5⭐ (C++, SQL, Python)", "LeetCode problem solving"]
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
          A comprehensive classification of my expertise across various domains, from AI engineering to core computer science foundations.
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
