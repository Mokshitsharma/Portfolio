import React, { useEffect, useState, useRef } from 'react';
import { Trophy, Star, Award, GraduationCap, Github } from 'lucide-react';
import gsap from 'gsap';

const achievements = [
  {
    title: "GitHub Repos",
    value: 28,
    suffix: "+",
    label: "Open Source Projects",
    icon: <Github className="text-white" />
  },
  {
    title: "Certifications",
    value: 12,
    suffix: "+",
    label: "Professional Growth",
    icon: <Trophy className="text-emerald-400" />
  },
  {
    title: "Projects Built",
    value: 15,
    suffix: "+",
    label: "End-to-End Systems",
    icon: <Star className="text-yellow-400" />
  },
  {
    title: "Internships",
    value: 4,
    suffix: "",
    label: "Real-world Experience",
    icon: <Award className="text-blue-400" />
  },
  {
    title: "HackerRank",
    value: 5,
    suffix: "★",
    label: "Python & SQL",
    icon: <Star className="text-accent" />
  }
];

const Counter: React.FC<{ value: number; suffix: string }> = ({ value, suffix }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to({ val: 0 }, {
        val: value,
        duration: 2,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 90%',
        },
        onUpdate: function() {
          setCount(this.targets()[0].val);
        }
      });
    });
    return () => ctx.revert();
  }, [value]);

  return (
    <span ref={ref} className="text-3xl md:text-4xl font-bold text-white">
      {value % 1 === 0 ? Math.floor(count) : count.toFixed(1)}{suffix}
    </span>
  );
};

const Achievements: React.FC = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {achievements.map((item, index) => (
            <div key={index} className="glass-card p-6 text-center group hover:bg-white/10 transition-colors">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
              </div>
              <div className="mb-2">
                <Counter value={item.value} suffix={item.suffix} />
              </div>
              <h4 className="text-sm font-bold mb-1">{item.title}</h4>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
