import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { petFigure, portrait, profile } from '../../data/profile';
import { aboutRoles } from '../../data/home';
import { mix, seg, useReducedMotion, useScrollScene } from '../../hooks/useScrollScene';
import { openAssistant } from '../../agent/bus';

// The opening, in one pinned scene driven by scroll:
//   0.00-0.18  Name, a card that flips through my four roles, my portrait with three annotations.
//   0.18-0.50  The name lifts away; the portrait slides left and dims; my dog walks in from the right.
//   0.50-1.00  The dog takes the centre and points the way to the doors below.
// Styles are written straight to the elements each frame. With reduced motion the scene is laid out still.

const ROLES = aboutRoles.map((r) => r.title);

// Annotations: where each note sits and the point on the portrait (fractions of the portrait box) it joins.
const NOTES = [
  { title: 'Agentic AI', text: 'Tools over MCP and LangGraph, a person approving the risky step', at: [0.42, 0.07], side: 'l' as const, y: 0.1 },
  { title: 'Machine learning', text: 'Evaluated on data the model has not seen', at: [0.25, 0.46], side: 'l' as const, y: 0.44 },
  { title: 'Systems', text: 'Movigo’s backend, built from zero', at: [0.3, 0.93], side: 'l' as const, y: 0.78 },
];

function FlipRoles({ still }: { still: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (still) return;
    const t = window.setInterval(() => setI((x) => (x + 1) % ROLES.length), 2400);
    return () => window.clearInterval(t);
  }, [still]);
  const article = /^[AEIOU]/i.test(ROLES[i]) ? 'an' : 'a';
  return (
    <>
      {article}{' '}
      <span className="flip" aria-live="polite">
        <span className="flip-rings" aria-hidden />
        <span key={i} className="flip-card">{ROLES[i]}</span>
      </span>
    </>
  );
}

export default function CinemaStory() {
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const me = useRef<HTMLDivElement>(null);
  const notes = useRef<HTMLDivElement>(null);
  const dog = useRef<HTMLDivElement>(null);
  const cap1 = useRef<HTMLDivElement>(null);
  const cap2 = useRef<HTMLDivElement>(null);

  useScrollScene(section, (p) => {
    const wide = innerWidth >= 900;
    const set = (el: HTMLElement | null, css: Partial<CSSStyleDeclaration>) => { if (el) Object.assign(el.style, css); };
    const lift = seg(p, 0.14, 0.32);
    set(intro.current, { opacity: String(1 - lift), transform: `translateY(${-lift * 60}px)` });
    set(notes.current, { opacity: String(1 - seg(p, 0.1, 0.22)) });
    const move = seg(p, 0.18, 0.48);
    set(me.current, {
      // Phones: the portrait starts low, below the buttons, and rises as the introduction lifts away.
      transform: wide ? `translateX(${mix(0, -38, move)}vw) scale(${mix(1, 0.86, move)})` : `translateY(${mix(30, -4, seg(p, 0.08, 0.3))}vh) scale(${mix(1, 0.8, move)})`,
      opacity: String(mix(1, 0.18, seg(p, 0.3, 0.55))),
      filter: `grayscale(${seg(p, 0.3, 0.5)})`,
    });
    const walk = seg(p, 0.3, 0.55);
    set(dog.current, {
      transform: wide ? `translateX(${mix(60, 0, walk)}vw)` : `translateX(${mix(110, 0, walk)}vw)`,
      opacity: String(walk),
    });
    const c1 = seg(p, 0.45, 0.55) * (1 - seg(p, 0.72, 0.8));
    set(cap1.current, { opacity: String(c1), transform: `translateY(${(1 - c1) * 16}px)` });
    const c2 = seg(p, 0.8, 0.9);
    set(cap2.current, { opacity: String(c2), transform: `translateY(${(1 - c2) * 16}px)` });
  }, !reduced);

  const introBlock = (
    <>
      <p className="label text-brass">{profile.location}</p>
      <h1 id="hero-title" className="cine-name">Hi, I’m Mokshit.</h1>
      <p className="cine-iam">I am <FlipRoles still={reduced} /></p>
      <p className="mt-6 max-w-[32rem] text-[1.125rem] leading-[1.6] text-charcoal/80">{profile.intro}</p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a href="#doors" className="pill pill-solid">Explore my work</a>
        <button type="button" className="pill" onClick={() => openAssistant()}>Ask my AI</button>
      </div>
    </>
  );

  if (reduced) {
    return (
      <section id="intro" data-section="about" aria-labelledby="hero-title" className="cine relative pb-20 pt-28">
        <div className="shell grid gap-10 md:grid-cols-2 md:items-center">
          <div>{introBlock}</div>
          <img src={portrait.src} alt={portrait.alt} width={portrait.width} height={portrait.height} className="mx-auto h-[28rem] w-auto" />
        </div>
        <div className="shell mt-16 flex items-end gap-8">
          <img src={petFigure.src} alt={petFigure.alt} width={petFigure.width} height={petFigure.height} className="h-56 w-auto" loading="lazy" />
          <p className="pb-4 text-[1.25rem] text-charcoal">This is my dog. Everything I have built is behind the doors below.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="intro" ref={section} data-section="about" aria-labelledby="hero-title" className="cine relative h-[320vh]">
      <div className="cine-stage sticky top-0 h-[100svh] overflow-hidden">
        <div className="cine-glow" aria-hidden />
        <div ref={intro} className="cine-intro shell">{introBlock}</div>

        <div ref={me} className="cine-me">
          <div className="cine-me-box">
            <img src={portrait.src} alt={portrait.alt} width={portrait.width} height={portrait.height} fetchPriority="high" />
            <div ref={notes} className="cine-notes" aria-hidden>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                {NOTES.map((n) => {
                  const x0 = n.side === 'l' ? -18 : 118;
                  return <path key={n.title} d={`M${x0} ${n.y * 100 + 3} H${n.side === 'l' ? -8 : 108} L${n.at[0] * 100} ${n.at[1] * 100}`} />;
                })}
              </svg>
              {NOTES.map((n) => (
                <span key={n.title} className="cine-pin" style={{ left: `${n.at[0] * 100}%`, top: `${n.at[1] * 100}%` }} />
              ))}
              {NOTES.map((n) => (
                <p key={n.title} className={`cine-note cine-note-${n.side}`} style={{ top: `${n.y * 100}%` }}>
                  <span className="block font-sans text-[0.9375rem] font-semibold text-charcoal">{n.title}</span>
                  <span className="block font-sans text-[0.8125rem] text-slate">{n.text}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        <div ref={dog} className="cine-dog">
          <img src={petFigure.src} alt={petFigure.alt} width={petFigure.width} height={petFigure.height} loading="lazy" decoding="async" />
        </div>

        <div ref={cap1} className="cine-cap shell">
          <p className="cine-cap-big">And this is my dog.</p>
          <p className="mt-3 max-w-[24rem] text-[1.0625rem] text-charcoal/75">He knows his way around. Follow him to the work.</p>
        </div>
        <div ref={cap2} className="cine-cap shell">
          <p className="cine-cap-big">Everything I have built is behind a door.</p>
          <p className="mt-3 max-w-[26rem] text-[1.0625rem] text-charcoal/75">Projects, experience, education, skills, certifications and achievements, one room each. <Link to="/projects" className="link text-brass">Or go straight to the projects.</Link></p>
        </div>
      </div>
    </section>
  );
}
