import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { portrait, profile } from '../../data/profile';
import { aboutRoles } from '../../data/home';
import { projectBySlug } from '../../data/projects';
import { projectHref } from '../ui';
import { openAssistant } from '../../agent/bus';
import { useReducedMotion } from '../../hooks/useScrollScene';

// Sections 1 and 2. The opening puts my name on the left and the illustration on the right. As the opening
// scrolls away, the illustration slides across to the left and stays pinned there while About me scrolls past on
// the right; scrolling back slides it home. For the role being read, a line is drawn from its heading to the part
// of the figure tied to it, ending in a dot, in the colour of that area. Phones keep the figure pinned above the
// text and draw the same lines.

const FIG_ASPECT = portrait.width / portrait.height;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export default function HeroAbout() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(-1); // -1: the opening, no line
  const section = useRef<HTMLElement>(null);
  const hero = useRef<HTMLDivElement>(null);
  const fig = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const caption = useRef<HTMLParagraphElement>(null);
  const line = useRef<SVGPathElement>(null);
  const dot = useRef<SVGCircleElement>(null);
  const heads = useRef<(HTMLHeadingElement | null)[]>([]);
  const blocks = useRef<(HTMLElement | null)[]>([]);
  const activeRef = useRef(-1);
  const redraw = useRef<() => void>(() => {});

  // The role in the middle of the viewport is the one being read; the opening resets it.
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      // Phones: the figure is pinned over the top 40% of the screen, so a role becomes active lower down.
    }, { rootMargin: window.matchMedia('(min-width: 1024px)').matches ? '-45% 0px -45% 0px' : '-58% 0px -32% 0px' });
    blocks.current.forEach((b) => b && io.observe(b));
    return () => io.disconnect();
  }, []);
  // A new active role redraws at once; its line must not wait for the next scroll event.
  useEffect(() => { activeRef.current = active; redraw.current(); }, [active]);

  // Every frame while scrolling: slide the figure by how far the opening has scrolled away, and keep the line
  // joined to the heading being read, wherever it is on the page.
  useEffect(() => {
    let raf = 0;
    const frame = () => {
      raf = 0;
      const s = section.current, f = fig.current, b = box.current, h = hero.current;
      if (!s || !f || !b || !h) return;
      const wide = window.matchMedia('(min-width: 1024px)').matches;
      const sr = s.getBoundingClientRect();
      if (wide) {
        // 0 while the opening fills the screen, 1 once it has scrolled away.
        const hr = h.getBoundingClientRect();
        const t = reduced ? (hr.bottom < innerHeight * 0.6 ? 1 : 0) : ease(clamp01((innerHeight * 0.85 - hr.bottom) / (innerHeight * 0.55)));
        const width = f.parentElement!.getBoundingClientRect().width;
        const x = (0.75 - 0.5 * t) * width; // centre of the right half, to the centre of the left half
        f.style.left = `${x}px`; // centred on x by its CSS translate
      } else {
        f.style.left = '';
      }
      const i = activeRef.current;
      const head = i >= 0 ? heads.current[i] : null;
      if (!head || !line.current || !dot.current) {
        line.current?.setAttribute('d', '');
        dot.current?.setAttribute('r', '0');
        return;
      }
      const br = b.getBoundingClientRect();
      const r = aboutRoles[i].region;
      const px = br.left - sr.left + r.x * br.width;
      const py = br.top - sr.top + r.y * br.height;
      const hr = head.getBoundingClientRect();
      if (wide) {
        // From just left of the heading, a short level stroke, then straight to the pin.
        const tx = hr.left - sr.left - 14;
        const ty = hr.top - sr.top + hr.height / 2;
        line.current.setAttribute('d', `M${tx} ${ty} H${tx - 28} L${px} ${py}`);
      } else {
        // Phones: down from the pin, then across to the heading.
        const ty = hr.top - sr.top - 10;
        const tx = hr.left - sr.left + 10;
        line.current.setAttribute('d', `M${tx} ${ty} V${ty - 14} H${px} V${py}`);
      }
      dot.current.setAttribute('cx', String(px));
      dot.current.setAttribute('cy', String(py));
      dot.current.setAttribute('r', '6');
      if (caption.current) caption.current.textContent = aboutRoles[i].title;
    };
    const request = () => { if (!raf) raf = requestAnimationFrame(frame); };
    redraw.current = request;
    request();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  // Each newly active role draws its line from the heading to the figure.
  useEffect(() => {
    const p = line.current;
    if (!p || active < 0) {
      if (caption.current) caption.current.textContent = `${profile.name}, ${profile.location}`;
      return;
    }
    p.style.stroke = aboutRoles[active].tint;
    dot.current?.style.setProperty('fill', aboutRoles[active].tint);
    if (reduced) { p.style.strokeDashoffset = '0'; return; }
    p.style.transition = 'none';
    p.style.strokeDashoffset = '1';
    void p.getBoundingClientRect();
    p.style.transition = 'stroke-dashoffset 700ms cubic-bezier(.45,.05,.25,1)';
    p.style.strokeDashoffset = '0';
  }, [active, reduced]);

  return (
    <section id="about" ref={section} data-section="about" aria-labelledby="hero-title" className="ha relative">
      {/* The illustration: pinned, and slid across by the scroll on wide screens. */}
      <div className="ha-track">
      <div className="shell ha-stage">
        <div ref={fig} className="ha-figure">
          <div ref={box} className="ha-figure-box" style={{ aspectRatio: String(FIG_ASPECT) }}>
            <img src={portrait.src} alt={portrait.alt} width={portrait.width} height={portrait.height} fetchPriority="high" className="ha-img" />
          </div>
          <p ref={caption} className="ha-caption" aria-live="polite">{profile.name}, {profile.location}</p>
        </div>
      </div>
      </div>

      <svg className="ha-lines" aria-hidden>
        <path ref={line} pathLength={1} className="ha-line" />
        <circle ref={dot} r={0} className="ha-dot" />
      </svg>

      <div className="shell">
        <div ref={(el) => { hero.current = el; blocks.current[0] = el; }} data-i={-1} className="ha-open">
          <p className="label text-brass">{profile.headline}</p>
          <h1 id="hero-title" className="display mt-3 text-[clamp(3.2rem,7.4vw,7rem)] text-charcoal">Mokshit<br />Sharma</h1>
          <p className="mt-6 max-w-[34rem] text-[1.1875rem] leading-[1.6] text-charcoal/85">{profile.intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#projects" className="btn btn-brass">Explore my projects</a>
            <button type="button" className="btn btn-line" onClick={() => openAssistant()}>Ask my AI</button>
            <a href="#contact" className="ui ml-1 font-semibold text-charcoal"><span className="link">Get in touch</span></a>
          </div>
          <p className="ui mt-14 text-slate">Scroll down: I move aside, and each part of what I do is drawn onto the picture.</p>
        </div>

        <div className="ha-about">
          <h2 className="display text-[clamp(2.2rem,4.6vw,3.9rem)] text-charcoal">About me</h2>
          <ol className="mt-6">
            {aboutRoles.map((r, i) => (
              <li key={r.id} ref={(el) => { blocks.current[i + 1] = el; }} data-i={i} className="ha-role" data-on={active === i || undefined} style={{ ['--tint' as string]: r.tint }}>
                <h3 ref={(el) => { heads.current[i] = el; }} className="headline text-[clamp(1.6rem,2.6vw,2.2rem)]" style={{ color: active === i ? r.tint : undefined }}>{r.title}</h3>
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
