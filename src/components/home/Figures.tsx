import { useRef, useState, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { pet, portrait, profile } from '../../data/profile';
import { projects } from '../../data/projects';
import { fetchProject } from '../../agent/bus';

// Fig. 1 and Fig. 2 on the home page. Fig. 1: the figure stands on the sheet with notes pinned to it; a note and its
// pin light together on hover or focus, and the figure drifts a little with the pointer. Fig. 2: the dog fetches a
// project from the map below.

// The figure fills the plate's height and sits centred, so it spans 34.25%-65.75% of the plate's width.
const FIG_LEFT = 34.25;
const FIG_W = 31.5;
const pin = (fx: number, fy: number): [number, number] => [FIG_LEFT + fx * FIG_W, fy * 100];

export const NOTES: { side: 'l' | 'r'; y: number; at: [number, number]; title: string; text: string; to: string }[] = [
  { side: 'l', y: 2, at: pin(0.43, 0.065), title: 'Agents that ask before they act', text: 'Naman, SettleAI, ToolForge: LangGraph, MCP, approval steps', to: '/projects/naman' },
  { side: 'l', y: 38, at: pin(0.25, 0.46), title: 'Models with readable reasons', text: 'CricXAI: ROC-AUC 0.749, SHAP for every recommendation', to: '/projects/cricxai' },
  { side: 'r', y: 12, at: pin(0.88, 0.2), title: 'A live delivery platform', text: 'Movigo: the only engineer, backend to both store apps', to: '/projects/movigo' },
  { side: 'r', y: 42, at: pin(0.85, 0.47), title: 'Data that feeds decisions', text: 'ETL into Power BI, pandas and SQL analyses', to: '/projects?category=data' },
  { side: 'r', y: 80, at: pin(0.62, 0.95), title: 'Grounded in AI and Data Science', text: 'Integrated B.Tech + M.Tech, DAVV Indore', to: '/about' },
];

const still = () => window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches;

export function FigureOne() {
  const [active, setActive] = useState<number | null>(null);
  const plate = useRef<HTMLDivElement>(null);

  const drift = (e: PointerEvent<HTMLDivElement>) => {
    if (still() || !plate.current) return;
    const r = plate.current.getBoundingClientRect();
    plate.current.style.setProperty('--px', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    plate.current.style.setProperty('--py', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  };
  const rest = () => { plate.current?.style.setProperty('--px', '0'); plate.current?.style.setProperty('--py', '0'); };

  return (
    <figure className="fig-1-plate">
      <div ref={plate} onPointerMove={drift} onPointerLeave={rest} className="fig-plate relative hidden aspect-[7/6] md:block" data-active={active ?? undefined}>
        <div className="fig-drift absolute inset-0">
          <img src={portrait.src} alt={portrait.alt} width={portrait.width} height={portrait.height} fetchPriority="high" className="absolute left-1/2 top-0 h-full w-auto -translate-x-1/2" />
          {NOTES.map((n, i) => (
            <span key={n.title} className="fig-pin" data-on={active === i || undefined} style={{ left: `${n.at[0]}%`, top: `${n.at[1]}%` }} onPointerEnter={() => setActive(i)} onPointerLeave={() => setActive(null)} aria-hidden />
          ))}
        </div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          {NOTES.map((n, i) => {
            const x0 = n.side === 'l' ? 27 : 73;
            const y0 = n.y + 2.5;
            return <path key={n.title} pathLength={1} className="leader" data-on={active === i || undefined} d={`M${x0} ${y0} L${n.side === 'l' ? x0 + 3 : x0 - 3} ${y0} L${n.at[0]} ${n.at[1]}`} />;
          })}
        </svg>
        {NOTES.map((n, i) => (
          <Link
            key={n.title}
            to={n.to}
            className={`note absolute w-[26%] ${n.side === 'l' ? 'left-0 text-right' : 'right-0'}`}
            data-on={active === i || undefined}
            style={{ top: `${n.y}%` }}
            onPointerEnter={() => setActive(i)}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
          >
            <span className="note-title">{n.title}</span>
            <span className="note-text">{n.text}</span>
          </Link>
        ))}
      </div>

      {/* Phones: the figure, then the notes as a keyed list. */}
      <div className="md:hidden">
        <img src={portrait.src} alt={portrait.alt} width={portrait.width} height={portrait.height} className="mx-auto h-[26rem] w-auto" />
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {NOTES.map((n) => (
            <li key={n.title} className="flex gap-3">
              <span className="mt-[0.6rem] h-px w-5 shrink-0 bg-charcoal" aria-hidden />
              <Link to={n.to} className="note"><span className="note-title">{n.title}</span><span className="note-text">{n.text}</span></Link>
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="fig-caption"><span>Fig. 1</span><span>{profile.name}, {profile.location}</span></figcaption>
    </figure>
  );
}

// Deep dives the dog can bring back, in a shuffled order so it rarely brings the same one twice running.
const fetchable = projects.filter((p) => p.caseStudy && !p.archiveOnly);

export function FigureTwo() {
  const [hop, setHop] = useState(0);
  const [brought, setBrought] = useState<string | null>(null);
  const order = useRef<string[]>([]);

  const bring = () => {
    if (!order.current.length) order.current = [...fetchable].map((p) => p.slug).sort(() => Math.random() - 0.5);
    const slug = order.current.pop()!;
    setHop((h) => h + 1);
    window.setTimeout(() => { setBrought(slug); fetchProject(slug); }, still() ? 0 : 650);
  };
  const p = brought ? projects.find((x) => x.slug === brought) : null;

  return (
    <div className="grid gap-8 md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:gap-16 lg:pl-[8%]">
      <figure className="fig-2-plate w-fit">
        <button type="button" onClick={bring} className="fig-pet group block" aria-label="Ask my dog to fetch a project">
          <img key={hop} src={pet.src} alt={pet.alt} width={pet.width} height={pet.height} loading="lazy" decoding="async" className={`h-[17rem] w-auto md:h-[24rem] ${hop ? 'is-hopping' : ''}`} />
        </button>
        <figcaption className="fig-caption"><span>Fig. 2</span><span>{pet.name}</span></figcaption>
      </figure>
      <div className="pb-2">
        <h2 id="pet-title" className="headline text-[clamp(1.75rem,3.4vw,2.6rem)] text-charcoal">Company while I build.</h2>
        <p className="ui mt-3 max-w-[30rem] text-slate">
          Below is every project on one map. Not sure where to start? My dog will fetch one for you.
        </p>
        <button type="button" onClick={bring} className="btn btn-line mt-5">{brought ? 'Fetch another' : 'Fetch me a project'}</button>
        <p className="ui mt-3 min-h-[1.5rem] text-charcoal" aria-live="polite">
          {p && <>Fetched <Link to={`/projects/${p.slug}`} className="link font-semibold text-brass">{p.name}</Link>; it is marked on the map below.</>}
        </p>
      </div>
    </div>
  );
}
