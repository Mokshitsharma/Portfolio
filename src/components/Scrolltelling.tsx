import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Scrolltelling: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const journey = [
    {
      chapter: "01",
      title: "The Spark of Logic",
      description: "My journey didn't start with complex algorithms, but with a simple fascination for how logic could manifest into reality. Growing up in Indore, I was the kid who wanted to know how things worked under the hood. This curiosity evolved into a deep-seated passion for programming, where I realized that code wasn't just instructions—it was a language for problem-solving.",
      period: "The Foundation",
      icon: "💻",
      quote: "Curiosity is the engine of achievement."
    },
    {
      chapter: "02",
      title: "The Data Revelation",
      description: "During my Dual Degree (B.Tech + M.Tech) at DAVV, I encountered the world of Data Science. It was a revelation: the idea that hidden patterns in raw data could predict the future. I didn't just want to use tools; I wanted to understand the mathematics behind them. This drive pushed me to master statistics and linear algebra, turning abstract numbers into actionable intelligence.",
      period: "Academic Rigor",
      icon: "📊",
      quote: "In God we trust, all others must bring data."
    },
    {
      chapter: "03",
      title: "The Crucible of Internships",
      description: "Theory met reality during my internships. At Evoastra Ventures and Cognifyz, I wasn't just building models; I was solving business pain points. I learned that an 87% accuracy rate means nothing if the system isn't scalable or interpretable. These experiences taught me the 'Engineering' in AI Engineering—the art of building robust, production-ready pipelines.",
      period: "Real-world Impact",
      icon: "🚀",
      quote: "Experience is the name everyone gives to their mistakes."
    },
    {
      chapter: "04",
      title: "Vision: The AI Architect",
      description: "My ultimate goal is to transition from a builder of models to an Architect of Intelligence. I am motivated by projects that bridge the gap between human intuition and machine precision—like my AI Cricket Tactical Engine or Stock Impact Analyzer. I don't just build for the sake of tech; I build to empower decision-makers with systems that are as ethical as they are efficient.",
      period: "Future Horizon",
      icon: "🏗️",
      quote: "The best way to predict the future is to design it."
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.journey-item').forEach((item: any) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          y: 50,
          duration: 1,
          ease: 'power3.out'
        });
      });

      // Progress line animation
      gsap.to('.journey-progress-bar', {
        scrollTrigger: {
          trigger: '.journey-container',
          start: 'top center',
          end: 'bottom center',
          scrub: true
        },
        scaleY: 1,
        ease: 'none'
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="scrolltelling" ref={sectionRef} className="py-24 relative overflow-hidden bg-[var(--bg-secondary)]">
      <div className="container mx-auto px-6">
        <div className="relative journey-container max-w-5xl mx-auto">
          {/* Vertical Line Background */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-white/10 hidden md:block" />
          
          {/* Animated Progress Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-accent origin-top scale-y-0 journey-progress-bar hidden md:block shadow-[0_0_20px_rgba(254,250,205,0.6)]" />

          <div className="space-y-32">
            {journey.map((item, index) => (
              <div key={index} className={`journey-item flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-24`}>
                {/* Content Side */}
                <div className={`flex-1 w-full ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="glass-card p-8 md:p-10 hover:bg-white/[0.08] transition-all duration-500 border-white/10 hover:border-accent/30">
                    <div className="flex items-center gap-4 mb-6 md:hidden">
                       <span className="text-4xl font-display font-black text-accent/30">{item.chapter}</span>
                       <span className="text-accent font-mono text-xs tracking-widest uppercase">{item.period}</span>
                    </div>
                    
                    <h3 className="text-3xl font-bold mb-4 text-white">{item.title}</h3>
                    <p className="text-slate-300 leading-relaxed mb-6 text-lg">
                      {item.description}
                    </p>
                    
                    <div className={`flex items-center gap-3 italic text-slate-400 text-sm ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                      <span className="w-8 h-[1px] bg-slate-700" />
                      "{item.quote}"
                    </div>
                  </div>
                </div>

                {/* Center Node */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--bg-secondary)] border border-accent/30 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(254,250,205,0.1)] group-hover:border-accent transition-colors">
                    {item.icon}
                  </div>
                  <div className="hidden md:block absolute -top-12 text-5xl font-display font-black text-white/5 select-none">
                    {item.chapter}
                  </div>
                </div>

                {/* Empty Side for Desktop Layout */}
                <div className="flex-1 hidden md:block">
                  <div className={`${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                    <span className="text-accent font-mono text-sm tracking-[0.2em] uppercase mb-2 block">{item.period}</span>
                    <div className="text-6xl font-display font-black text-white/5 leading-none">
                      CHAPTER {item.chapter}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Scrolltelling;
