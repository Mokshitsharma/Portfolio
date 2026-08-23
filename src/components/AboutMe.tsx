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
                "One team of one — the entire stack, the operations, and the decisions, end to end."
              </p>
              <div className="space-y-6 text-slate-300 text-lg md:text-xl leading-relaxed">
                <p>
                  My name is <span className="text-white font-medium text-glow">Mokshit Sharma</span>. I'm the <span className="text-accent font-medium">Founding Engineer — Tech & Operations</span> at <span className="text-white font-medium">Movigo</span>, a live B2B logistics marketplace. When I joined, an outsourced dev team had spent roughly six months and delivered only UI mockups — no working software. I rebuilt the entire product from zero as the sole engineer: a Node.js/Express/MongoDB backend, two Play Store-published Flutter apps for drivers and retailers, an admin console, and a real-time dispatch engine — around 136,000 lines of code running in production today.
                </p>
                <p>
                  The work isn't just engineering. I also own the operational and business side — data-driven pricing and zone decisions, coordinating calling and field teams, and the judgment calls that come with running a live product, not just shipping code for one. That combination is deliberate: I approach dispatch logic, pricing rules, and anomaly patterns in real bookings with the same evaluation rigor I bring to applied machine learning, including explainable-AI work like Sensei AI.
                </p>
                <p>
                  In parallel, I'm finishing an integrated B.Tech + M.Tech in <span className="text-accent font-medium">AI & Data Science</span> at DAVV, Indore, with an 8.2 CGPA — building all of this alongside full-time founding-engineer work, not after it.
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
