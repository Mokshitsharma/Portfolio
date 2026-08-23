import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, Calendar, FileText, Award, ExternalLink, FileCheck } from 'lucide-react';

const internships = [
  {
    role: "Software Developer Intern",
    company: "Bluestock Fintech",
    period: "Apr 2025 – May 2025",
    description: "Built Python backend modules to process and analyze structured financial datasets; designed automated data-ingestion and preprocessing pipelines. Optimized analytics scripts, reducing execution time by ~22%.",
    tags: ["Backend", "Fintech", "Python", "Optimization"],
    logo: "BF",
    offerLetter: "https://drive.google.com/file/d/1fRrLmzs8o4JA1FHBOWHm6W_OEsr9Cp1L/view?usp=sharing",
    certificate: "#"
  },
  {
    role: "Artificial Intelligence Intern",
    company: "Evoastra Ventures",
    period: "Oct 2024 – Nov 2024",
    description: "Built NLP sentiment-analysis pipelines on Reddit data using TF-IDF vectorization and tuned classifiers; improved model accuracy by ~21%.",
    tags: ["NLP", "Python", "Sentiment Analysis"],
    logo: "EV",
    offerLetter: "https://drive.google.com/drive/u/2/folders/19c5J-Afnp8F-ajr1yu1n_eiimrgJ4wk2",
    certificate: "#",
    lor: "https://drive.google.com/file/d/1H1uC9xINU2DqBcbaZYobOjQ9PdANs2Ak/view?usp=sharing"
  },
  {
    role: "Data Scientist Intern",
    company: "Cognifyz Technologies",
    period: "Sep 2024 – Oct 2024",
    description: "Developed regression models predicting restaurant ratings (scikit-learn); feature engineering and correlation analysis, achieving 0.84 R² on the final model.",
    tags: ["Data Science", "Regression", "scikit-learn"],
    logo: "CT",
    offerLetter: "https://drive.google.com/file/d/1qFCF_sY7sBTIVZ4C5Sid1u83UTrHNwz5/view?usp=sharing",
    certificate: "#"
  }
];

const InternshipsDetail: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-slate-100 py-20 px-6">
      <div className="container mx-auto max-w-5xl">
        <Link to="/" className="inline-flex items-center gap-2 text-accent hover:underline mb-12 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Portfolio
        </Link>

        <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white">Professional <span className="text-gradient">Internships</span></h1>
        <p className="text-slate-300 text-xl mb-16 max-w-3xl">
          A collection of my professional experiences, documenting my growth and contributions across various industry domains.
        </p>

        <div className="space-y-12">
          {internships.map((exp, index) => (
            <div key={index} className="glass-card p-8 md:p-12 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-accent scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />

              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-24 h-24 rounded-2xl bg-accent/10 flex items-center justify-center text-3xl font-bold text-accent shrink-0 border border-accent/20">
                  {exp.logo}
                </div>

                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-1">{exp.role}</h3>
                      <div className="flex items-center gap-2 text-accent font-medium text-lg">
                        <Briefcase size={20} />
                        <span>{exp.company}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300 font-mono text-sm bg-white/5 px-4 py-2 rounded-full border border-white/10">
                      <Calendar size={16} />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  <p className="text-slate-300 mb-8 leading-relaxed text-lg">
                    {exp.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-10">
                    {exp.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-accent/5 border border-accent/20 text-[10px] font-mono text-accent uppercase tracking-widest">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-8 border-t border-white/5">
                    <h4 className="text-xs font-mono text-slate-500 uppercase tracking-[0.2em] mb-4">Verification Documents</h4>
                    <div className="flex flex-wrap gap-4">
                      <a
                        href={exp.offerLetter}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => exp.offerLetter === '#' && e.preventDefault()}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all text-sm font-medium ${exp.offerLetter === '#' ? 'bg-white/5 border-white/10 text-slate-500 cursor-not-allowed' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-accent/30 text-slate-200'}`}
                      >
                        <FileText size={18} className={exp.offerLetter === '#' ? 'text-slate-600' : 'text-accent'} />
                        Offer Letter
                        {exp.offerLetter === '#' && <span className="text-[10px] opacity-50 ml-1">(Request)</span>}
                      </a>
                      <a
                        href={exp.certificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => exp.certificate === '#' && e.preventDefault()}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all text-sm font-medium ${exp.certificate === '#' ? 'bg-white/5 border-white/10 text-slate-500 cursor-not-allowed' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-accent/30 text-slate-200'}`}
                      >
                        <Award size={18} className={exp.certificate === '#' ? 'text-slate-600' : 'text-accent'} />
                        Certificate
                        {exp.certificate === '#' && <span className="text-[10px] opacity-50 ml-1">(Request)</span>}
                      </a>
                      {exp.lor && (
                        <a
                          href={exp.lor}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 hover:border-accent/30 text-slate-200 transition-all text-sm font-medium"
                        >
                          <FileCheck size={18} className="text-accent" />
                          LOR
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-slate-400 text-sm mt-12 max-w-3xl mx-auto text-center">
          Additional internships (2024–2025): Code Alpha (ML pipelines, EDA), Kangaroo Software (data pipelines & analytics), and several short data-science/analytics engagements across fintech and AI.
        </p>
      </div>
    </div>
  );
};

export default InternshipsDetail;
