import React from 'react';
import { Award, ShieldCheck, Zap, Star, ExternalLink } from 'lucide-react';

const certifications = [
  {
    title: "Skillsoft GenAI Foundation",
    description: "Mastered core Generative AI concepts, transformer architectures, and prompt engineering. Applied knowledge to build practical AI-driven automation workflows.",
    icon: <Award className="text-purple-400" />,
    issuer: "Skillsoft",
    link: "https://drive.google.com/file/d/12LL5X1XFkZa-KYVsoCFUJZ7zyR9aB1wr/view?usp=sharing",
    summary: "Foundational mastery of LLMs and generative architectures."
  },
  {
    title: "GenAI Infosys Springboard",
    description: "Advanced specialization in enterprise-level Generative AI implementation. Focused on RAG (Retrieval-Augmented Generation) and model fine-tuning strategies.",
    icon: <Zap className="text-blue-400" />,
    issuer: "Infosys Springboard",
    link: "https://drive.google.com/file/d/1FGNt8vyrA4aseMvbjoMUGsXYuAgrszPy/view?usp=sharing",
    summary: "Enterprise AI deployment and optimization specialist."
  },
  {
    title: "Google Data Analyst Professional Certificate",
    description: "Rigorous 8-course program covering the full data lifecycle. Expertise in SQL, R, and Tableau for complex business intelligence reporting.",
    icon: <ShieldCheck className="text-blue-400" />,
    issuer: "Google",
    link: "#",
    summary: "Industry-standard certification in end-to-end data analytics."
  },
  {
    title: "5 Days of Intensive AI Agents",
    description: "Hands-on lab focusing on autonomous agent design. Built multi-agent systems for complex task decomposition and execution using Python.",
    icon: <Zap className="text-yellow-400" />,
    issuer: "Kaggle & Google",
    link: "https://drive.google.com/file/d/1NmhjV9PXbdtnp09OdMNtMaizlODUNfke/view?usp=sharing",
    summary: "Practical expertise in autonomous AI agent orchestration."
  },
  {
    title: "Excel Infosys Springboard",
    description: "Advanced certification in data modeling and statistical analysis using Excel. Expert in complex DAX-like formulas and automated reporting.",
    icon: <Award className="text-emerald-400" />,
    issuer: "Infosys Springboard",
    link: "https://drive.google.com/file/d/1C0E6VwPqfuZyaZkVkLYWOFI5JvfWJ48R/view?usp=sharing",
    summary: "Advanced data manipulation and modeling specialist."
  },
  {
    title: "Freedom of AI - AI Masterclass",
    description: "Deep dive into the latest AI trends and implementation strategies. Focused on bridging the gap between research and commercial AI products.",
    icon: <Star className="text-orange-400" />,
    issuer: "Freedom of AI",
    link: "https://drive.google.com/file/d/1-0og7KJTOzSJeSR6zaWQwypVVCQjOU19/view?usp=sharing",
    summary: "Strategic AI implementation and product thinking."
  }
];

const Certifications: React.FC = () => {
  return (
    <section id="certifications" className="py-24 bg-slate-900/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">Certifications & <span className="text-gradient">Achievements</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Industry-recognized credentials that validate my technical expertise and commitment to continuous learning.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {certifications.slice(0, 3).map((cert, index) => (
            <div key={index} className="glass-card p-8 group hover:bg-white/10 transition-all duration-500 flex flex-col justify-between">
              <div className="flex items-start gap-6 mb-6">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform shrink-0">
                  {cert.icon}
                </div>
                <div>
                  <div className="text-xs font-mono text-accent uppercase tracking-widest mb-2">{cert.issuer}</div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">{cert.title}</h3>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">{cert.summary}</div>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {cert.description}
                  </p>
                </div>
              </div>
              
              {cert.link !== '#' && (
                <div className="pt-6 border-t border-white/5">
                  <a 
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-mono text-accent hover:text-white transition-colors uppercase tracking-widest"
                  >
                    View Certificate <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <a 
            href="https://drive.google.com/drive/folders/1-3-3-3-3-3-3-3-3-3-3-3-3-3-3-3-3" 
            target="_blank" 
            rel="noopener noreferrer"
            className="glow-button flex items-center gap-2 group"
          >
            View All Certifications
            <ExternalLink size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
