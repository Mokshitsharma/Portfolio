import React from 'react';
import { ShieldCheck, Zap, GraduationCap, Star, ExternalLink } from 'lucide-react';

const certifications = [
  {
    title: "Google Data Analyst Professional Certificate",
    description: "Rigorous 8-course program covering the full data lifecycle. Expertise in SQL, Advanced Excel, EDA, Power BI, and data visualization for business intelligence reporting.",
    icon: <ShieldCheck className="text-blue-400" />,
    issuer: "Google",
    link: "#",
    summary: "Industry-standard certification in end-to-end data analytics."
  },
  {
    title: "5 Days of Intensive AI Agents",
    description: "Hands-on lab focusing on autonomous agent design. Built AI automation workflows using prompt engineering and agentic pipelines in Python.",
    icon: <Zap className="text-yellow-400" />,
    issuer: "Kaggle & Google",
    link: "https://drive.google.com/file/d/1NmhjV9PXbdtnp09OdMNtMaizlODUNfke/view?usp=sharing",
    summary: "Practical expertise in autonomous AI agent orchestration."
  },
  {
    title: "Data Analyst Program",
    description: "Data analysis, reporting, and business-intelligence fundamentals — from data cleaning through dashboarding.",
    icon: <GraduationCap className="text-emerald-400" />,
    issuer: "Infosys Springboard",
    link: "#",
    summary: "Business-intelligence fundamentals and reporting."
  },
  {
    title: "5★ HackerRank",
    description: "5-star rating across Python, SQL, and C++ — verified problem-solving proficiency.",
    icon: <Star className="text-accent" />,
    issuer: "HackerRank",
    link: "#",
    summary: "Verified proficiency in Python, SQL, and C++."
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
          {certifications.map((cert, index) => (
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
            href="https://www.linkedin.com/in/mokshit-sharma-75b5ab305/details/certifications/"
            target="_blank"
            rel="noopener noreferrer"
            className="glow-button flex items-center gap-2 group"
          >
            View All Certifications on LinkedIn
            <ExternalLink size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
