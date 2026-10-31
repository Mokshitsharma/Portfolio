import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { portrait, profile } from '../../data/profile';
import { aboutRoles } from '../../data/home';
import { projectBySlug } from '../../data/projects';
import { projectHref } from '../ui';
import { openAssistant } from '../../agent/bus';
import { useReducedMotion, useSize } from '../../hooks/useScrollScene';

// Sections 1 and 2. The opening (name, identity, introduction) and About share one layout: the illustration stays
// pinned on the right (on top on phones) while the text scrolls on the left. As each role comes into view, the
// figure darkens everywhere except the part tied to that role, and the lit area glides from one part to the next;
// scrolling back reverses it. Roles and their evidence come from src/data/home.ts.

const DIM = 'rgb(14 20 28 / 0.62)';

export default function HeroAbout() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(-1); // -1: the opening, nothing dimmed
  const blocks = useRef<(HTMLElement | null)[]>([]);
  const shade = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const spot = useRef({ x: 0.5, y: 0.4, r: 0.6, o: 0 });
  const box = useRef<HTMLDivElement>(null);
  const size = useSize(box);

  // The role in the middle of the viewport is the active one; the opening block resets it.
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
    }, { rootMargin: '-45% 0px -45% 0px' });
    blocks.current.forEach((b) => b && io.observe(b));
    return () => io.disconnect();
  }, []);

  // Glide the lit circle to the active role's region.
  useEffect(() => {
    const target = active >= 0 ? { ...aboutRoles[active].region, o: 1 } : { ...spot.current, o: 0 };
    const from = { ...spot.current };
    // Region x and y are fractions of the figure's width and height; the radius is a fraction of its height.
    const draw = (s: typeof from) => {
      spot.current = s;
      const { w, h } = size;
      if (!w) return;
      const x = s.x * w;
      const y = s.y * h;
      const r = s.r * h;
      if (shade.current) {
        shade.current.style.opacity = String(s.o);
        shade.current.style.background = `radial-gradient(circle ${r}px at ${x}px ${y}px, transparent ${r * 0.8}px, ${DIM} ${r}px)`;
      }
      if (ring.current) Object.assign(ring.current.style, { left: `${x}px`, top: `${y}px`, width: `${r * 2}px`, height: `${r * 2}px`, opacity: String(s.o) });
    };
    if (reduced) return draw(target);
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / 650);
      const e = 1 - Math.pow(1 - t, 3);
      draw({ x: from.x + (target.x - from.x) * e, y: from.y + (target.y - from.y) * e, r: from.r + (target.r - from.r) * e, o: from.o + (target.o - from.o) * e });
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, reduced, size]);

  const role = active >= 0 ? aboutRoles[active] : null;

  return (
    <section id="about" data-section="about" aria-labelledby="hero-title" className="ha relative">
      <div className="shell ha-grid">
        {/* The illustration, pinned while the text scrolls. */}
        <div className="ha-figure-col">
          <div className="ha-figure">
            <div ref={box} className="ha-figure-box">
              <img src={portrait.src} alt={portrait.alt} width={portrait.width} height={portrait.height} fetchPriority="high" className="ha-img" />
              <div ref={shade} className="ha-shade" aria-hidden />
              <div ref={ring} className="ha-ring" aria-hidden />
            </div>
            <p className="ha-caption" aria-live="polite">{role ? role.title : `${profile.name}, ${profile.location}`}</p>
          </div>
        </div>

        <div className="ha-text">
          <div ref={(el) => { blocks.current[0] = el; }} data-i={-1} className="ha-open">
            <p className="label text-brass">{profile.headline}</p>
            <h1 id="hero-title" className="display mt-3 text-[clamp(3.2rem,7.4vw,7rem)] text-charcoal">Mokshit<br />Sharma</h1>
            <p className="mt-6 max-w-[34rem] text-[1.1875rem] leading-[1.6] text-charcoal/85">{profile.intro}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#projects" className="btn btn-brass">Explore my projects</a>
              <button type="button" className="btn btn-line" onClick={() => openAssistant()}>Ask my AI</button>
              <a href="#contact" className="ui ml-1 font-semibold text-charcoal"><span className="link">Get in touch</span></a>
            </div>
            <p className="ui mt-14 text-slate">Scroll to see what I do. Each part of the picture lights up as you read about it.</p>
          </div>

          <h2 className="display mt-6 text-[clamp(2.2rem,4.6vw,3.9rem)] text-charcoal">About me</h2>
          <ol className="mt-6">
            {aboutRoles.map((r, i) => (
              <li key={r.id} ref={(el) => { blocks.current[i + 1] = el; }} data-i={i} className="ha-role" data-on={active === i || undefined}>
                <h3 className="headline text-[clamp(1.6rem,2.6vw,2.2rem)] text-charcoal">{r.title}</h3>
                <p className="mt-3 max-w-[34rem] text-[1.125rem] leading-[1.65] text-charcoal/85">{r.body}</p>
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5" aria-label="Projects that show it">
                  {r.projects.map((s) => <li key={s}><Link to={projectHref(s)} className="ui link font-semibold text-brass">{projectBySlug(s)!.name}</Link></li>)}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
