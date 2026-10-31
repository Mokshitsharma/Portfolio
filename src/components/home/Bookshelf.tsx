import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { shelves } from '../../data/home';
import { firstSentence, maturityLabel, projectBySlug, projects } from '../../data/projects';
import { projectHref } from '../ui';
import { useReducedMotion, useScrollScene } from '../../hooks/useScrollScene';

// Section 3: five shelves of work. On wide screens the section is a pinned stage: each fifth of the scroll belongs
// to one shelf, which opens fully in a single short motion while the others close to their spines, in either
// direction. On phones the shelves stack; the one in the middle of
// the screen opens. Clicks open projects; scrolling never does.

const BOOKS = 8;

function ShelfBody({ i }: { i: number }) {
  const s = shelves[i];
  const list = s.slugs.map((slug) => projectBySlug(slug)!).filter(Boolean);
  return (
    <div className="shelf-body">
      <p className="label" style={{ color: s.tint }}>{list.length} projects</p>
      <h3 className="headline mt-1 text-[clamp(1.6rem,2.4vw,2.2rem)] text-charcoal">{s.title}</h3>
      <p className="ui mt-2 max-w-[34rem] text-slate">{s.line}</p>
      <ul className="shelf-books mt-5">
        {list.slice(0, BOOKS).map((p) => (
          <li key={p.slug}>
            <Link to={projectHref(p.slug)} className="book" style={{ ['--tint' as string]: s.tint }}>
              <span className="font-sans text-[1rem] font-semibold leading-tight text-charcoal">{p.name}</span>
              <span className="fine mt-1 text-slate">{firstSentence(p.summary)}</span>
              <span className="fine mt-auto pt-2 text-slate">{maturityLabel[p.maturity]}{p.caseStudy ? ' · Case study' : ''}</span>
            </Link>
          </li>
        ))}
      </ul>
      {list.length > BOOKS && <p className="ui mt-4"><Link to={`/projects?shelf=${s.id}`} className="link font-semibold text-charcoal">All {list.length} on this shelf</Link></p>}
    </div>
  );
}

function Spine({ i }: { i: number }) {
  const s = shelves[i];
  return (
    <div className="shelf-spine" aria-hidden>
      <span className="shelf-spine-title">{s.title}</span>
      <span className="shelf-spine-count">{s.slugs.length}</span>
    </div>
  );
}

export default function Bookshelf() {
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const cols = useRef<(HTMLDivElement | null)[]>([]);
  const [wide, setWide] = useState(true);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    const q = window.matchMedia('(min-width: 1024px)');
    const on = () => setWide(q.matches);
    on();
    q.addEventListener('change', on);
    return () => q.removeEventListener('change', on);
  }, []);

  // Wide screens: widths follow scroll progress; the open shelf is the one closest to it.
  // Scroll only chooses the open shelf; it then opens fully in one short motion (CSS), never part-way.
  useScrollScene(section, (p) => {
    const now = Math.min(shelves.length - 1, Math.floor(p * shelves.length));
    if (now !== activeRef.current) { activeRef.current = now; setActive(now); }
  }, wide && !reduced);

  // Phones (and reduced motion): the shelf in the middle of the screen is open.
  useEffect(() => {
    if (wide && !reduced) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
    }, { rootMargin: '-40% 0px -40% 0px' });
    cols.current.forEach((c) => c && io.observe(c));
    return () => io.disconnect();
  }, [wide, reduced]);

  const header = (
    <div className="shell flex flex-wrap items-end justify-between gap-6">
      <div>
        <h2 id="projects-title" className="display text-[clamp(2.2rem,4.6vw,3.9rem)] text-charcoal">Projects</h2>
        <p className="mt-3 max-w-[38rem] text-[1.0625rem] leading-[1.6] text-slate">
          {projects.length} projects on five shelves. These are ways to browse the work, not five job titles.
        </p>
      </div>
      <Link to="/projects" className="btn btn-brass">View all projects</Link>
    </div>
  );

  if (!wide || reduced) {
    return (
      <section id="projects" data-section="projects" aria-labelledby="projects-title" className="scroll-mt-16 border-t border-seam py-20">
        {header}
        <div className="shell mt-10 space-y-3">
          {shelves.map((s, i) => (
            <div key={s.id} ref={(el) => { cols.current[i] = el; }} data-i={i} className="shelf-m" data-open={active === i || undefined} style={{ ['--tint' as string]: s.tint }}>
              <button type="button" className="shelf-m-head" aria-expanded={active === i} onClick={() => setActive(i)}>
                <span className="font-sans text-[1.0625rem] font-semibold text-charcoal">{s.title}</span>
                <span className="fine text-slate">{s.slugs.length} projects</span>
              </button>
              {active === i && <ShelfBody i={i} />}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="projects" ref={section} data-section="projects" aria-labelledby="projects-title" className="relative h-[460vh] scroll-mt-16 border-t border-seam">
      <div className="sticky top-0 flex h-[100svh] flex-col pb-8 pt-24">
        {header}
        <div className="shell mt-8 flex min-h-0 flex-1 gap-2">
          {shelves.map((s, i) => (
            <div key={s.id} ref={(el) => { cols.current[i] = el; }} className="shelf-col" data-open={active === i || undefined} style={{ ['--tint' as string]: s.tint, flexGrow: active === i ? 12 : 1 }}>
              <Spine i={i} />
              {active === i && <ShelfBody i={i} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
