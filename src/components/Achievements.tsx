import React, { useEffect, useState, useRef } from 'react';
import { Code2, Server, Smartphone, GraduationCap } from 'lucide-react';
import gsap from 'gsap';

const achievements = [
  {
    title: "Lines of Code",
    value: 136000,
    suffix: "+",
    label: "Production Code (Movigo)",
    icon: <Code2 className="text-white" />
  },
  {
    title: "API Endpoints",
    value: 372,
    suffix: "",
    label: "In Production",
    icon: <Server className="text-emerald-400" />
  },
  {
    title: "App Releases",
    value: 47,
    suffix: "+ / 41+",
    label: "Driver / Retailer (Play Store)",
    icon: <Smartphone className="text-blue-400" />
  },
  {
    title: "CGPA",
    value: 8.2,
    suffix: "",
    label: "B.Tech + M.Tech Dual Degree",
    icon: <GraduationCap className="text-accent" />
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
      {value % 1 === 0 ? Math.floor(count).toLocaleString() : count.toFixed(1)}{suffix}
    </span>
  );
};

const Achievements: React.FC = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
