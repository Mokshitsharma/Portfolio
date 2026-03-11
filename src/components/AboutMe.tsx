import React from 'react';

const AboutMe: React.FC = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-[var(--bg-secondary)]">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-accent font-mono text-sm tracking-[0.3em] uppercase mb-4 block">The Narrative</span>
            <h2 className="text-5xl md:text-7xl font-bold mb-8">About <span className="text-gradient">Me</span></h2>
          </div>
          
          <div className="glass-card p-10 md:p-16 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="relative z-10">
              <p className="text-xl md:text-3xl text-white leading-relaxed mb-8 font-light italic text-glow">
                "I don't just build models; I build systems that think, learn, and empower."
              </p>
              <div className="space-y-6 text-slate-300 text-lg md:text-xl leading-relaxed">
                <p>
                  My name is <span className="text-white font-medium text-glow">Mokshit Sharma</span>, and I specialize in <span className="text-accent font-medium">AI & Data Science Engineering</span>. I am driven by the challenge of translating raw, chaotic data into structured, intelligent narratives that drive measurable impact.
                </p>
                <p>
                  I focus on building <span className="text-white font-medium">end-to-end ML systems</span>—from data collection and rigorous experimentation to deployment and monitoring. My approach is rooted in a strong evaluation mindset, ensuring that every model I build is as robust and interpretable as it is accurate.
                </p>
                <p>
                  I thrive at the intersection of human intuition and machine precision, turning complex business problems into scalable AI solutions that empower decision-makers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
