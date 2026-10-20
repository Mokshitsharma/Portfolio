import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { clusters, domains } from '../../data/domains';
import { cardFor } from '../../data/cards';
import { categories, maturityLabel, projects } from '../../data/projects';
import { caseStudyBySlug } from '../../data/caseStudies';
import type { Category, Maturity, Project } from '../../data/types';

// Every published project as a node, grouped by area. Nodes are real buttons laid over an SVG of the links, so
// the map works from the keyboard and with a screen reader; the archive page is the plain list of the same data.

// Node radius in pixels, by how far the project got.
const size: Record<Maturity, number> = {
  production: 10,
  deployed: 7.5,
  working: 7,
  'in-progress': 7,
  prototype: 5.5,
  notebook: 4.5,
  coursework: 4,
};

const SPACING = 34; // spiral step, in map units

// Links that exist in the records: versions of one project, and products built for the same company.
const relations: [string, string][] = [
  ['customer-churn-eda', 'customer-churn-shap-prototype'],
  ['customer-churn-shap-prototype', 'customer-churn-xai'],
  ['stock-cli', 'stock-website'],
  ['zudio-eda', 'zudio-r'],
  ['nifty50-dashboard', 'nifty50-live'],
  ['movigo', 'fieldops-ai'],
  ['movigo', 'movigo-broadcast'],
  ['movigo', 'hyperlocal-marketplace'],
];

// Narrow screens stack the clusters in two columns.
const narrow: Record<Category, [number, number]> = {
  production: [170, 110],
  agents: [440, 120],
  ml: [170, 390],
  fullstack: [440, 360],
  data: [170, 690],
  tools: [440, 610],
  learning: [440, 830],
};

const reachOf = (n: number) => SPACING * Math.sqrt(Math.max(0, n - 0.4)) * 0.9 + 22;

type Placed = { p: Project; x: number; y: number; r: number };

function place(wide: boolean) {
  const out: Placed[] = [];
  for (const c of clusters) {
    const [cx, cy] = wide ? [c.x, c.y] : narrow[c.id];
    const members = projects.filter((p) => p.category === c.id).sort((a, b) => size[b.maturity] - size[a.maturity]);
    members.forEach((p, i) => {
      // Sunflower spiral: the most finished projects sit nearest the centre of their cluster.
      const radius = i === 0 ? 0 : SPACING * Math.sqrt(i + 0.6);
      const t = i * 2.39996;
      out.push({ p, x: cx + Math.cos(t) * radius, y: cy + Math.sin(t) * radius * 0.9, r: size[p.maturity] });
    });
  }
  return out;
}

export default function ProjectMap() {
  const [wide, setWide] = useState(true);
  // A click pins a project; pointing at another one previews it until the pointer leaves.
  const [pinned, setPinned] = useState('movigo');
  const [hovered, setHovered] = useState<string | null>(null);
  const selected = hovered ?? pinned;
  const panel = useRef<HTMLElement>(null);

  // On narrow screens the details sit below the map, so a tap brings them into view.
  const pick = (slug: string, e: MouseEvent) => {
    setPinned(slug);
    if (!wide && e.detail > 0) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      requestAnimationFrame(() => panel.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' }));
    }
  };
  const [domain, setDomain] = useState<string | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const W = wide ? 1100 : 600;
  const H = wide ? 640 : 960;
  const nodes = useMemo(() => place(wide), [wide]);
  const at = (slug: string) => nodes.find((n) => n.p.slug === slug)!;
  const lit = domain ? new Set(domains.find((d) => d.id === domain)!.projects) : null;
  const current = at(selected).p;
  const card = cardFor(current.slug);
  const study = current.caseStudy ? caseStudyBySlug(current.slug) : undefined;
  const area = categories.find((c) => c.id === current.category)!;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10">
      <div>
        <div role="group" aria-label="Highlight a domain" className="flex flex-wrap gap-2">
          {domains.map((d) => {
            const on = domain === d.id;
            return (
              <button
                key={d.id}
                type="button"
                aria-pressed={on}
                onClick={() => setDomain(on ? null : d.id)}
                className={`toggle ${on ? 'toggle-on' : ''}`}
              >
                {d.title}
              </button>
            );
          })}
        </div>

        <div className="relative mt-6 w-full" style={{ aspectRatio: `${W} / ${H}` }}>
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden focusable="false">
            {nodes.map((n) => {
              const c = clusters.find((k) => k.id === n.p.category)!;
              const [cx, cy] = wide ? [c.x, c.y] : narrow[c.id];
              return <line key={n.p.slug} x1={cx} y1={cy} x2={n.x} y2={n.y} stroke="#8b95a7" strokeOpacity="0.14" />;
            })}
            {relations.map(([a, b]) => (
              <line key={a + b} x1={at(a).x} y1={at(a).y} x2={at(b).x} y2={at(b).y} stroke="#57dbe6" strokeOpacity="0.45" strokeDasharray="3 4" />
            ))}
            {clusters.map((c) => {
              const [cx, cy] = wide ? [c.x, c.y] : narrow[c.id];
              const below = cy > H * 0.55 || !wide;
              const reach = reachOf(projects.filter((p) => p.category === c.id).length);
              return (
                <text key={c.id} x={cx} y={below ? cy + reach + 14 : cy - reach} textAnchor="middle" className="map-label" fill="#8b95a7">
                  {c.title}
                </text>
              );
            })}
          </svg>
          {nodes.map((n) => {
            const on = n.p.slug === selected;
            const dimmed = lit && !lit.has(n.p.slug);
            const d = n.r * 2;
            return (
              <button
                key={n.p.slug}
                type="button"
                aria-pressed={on}
                aria-label={`${n.p.name}, ${maturityLabel[n.p.maturity]}`}
                onClick={(e) => pick(n.p.slug, e)}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(n.p.slug)}
                onPointerLeave={() => setHovered(null)}
                onFocus={() => setPinned(n.p.slug)}
                className={`map-node ${on ? 'map-node-on' : ''} ${n.p.caseStudy ? 'map-node-case' : ''} ${dimmed ? 'opacity-20' : ''}`}
                style={{ left: `${(n.x / W) * 100}%`, top: `${(n.y / H) * 100}%`, ['--d' as string]: `${d}px` }}
              />
            );
          })}
        </div>
        <p className="fine mt-4 text-ash">
          {projects.length} projects. Larger nodes got further, from notebook to production; a ring marks a full case study.
          Dashed lines join versions of one project and products built for Movigo.
        </p>
      </div>

      <aside ref={panel} aria-live="polite" className="map-panel self-start lg:sticky lg:top-24">
        <p className="fine text-ash">{area.title}</p>
        <h3 className="headline mt-1 text-[1.9rem] text-snow">{current.name}</h3>
        <p className="fine mt-2 text-ion">
          {maturityLabel[current.maturity]}, {current.period}
        </p>
        {study?.figures?.[0] && (
          <img src={study.figures[0].src} alt={study.figures[0].alt} width={study.figures[0].width} height={study.figures[0].height} loading="lazy" decoding="async" className="mt-4 block h-auto max-h-44 w-full border border-seam object-cover object-top" />
        )}
        <p className="ui mt-4 text-snow/90">{card.pitch}</p>
        {card.detail && <p className="ui mt-3 text-ash">{card.detail}</p>}
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
          {current.stack.slice(0, 6).map((s) => (
            <li key={s} className="tag">{s}</li>
          ))}
        </ul>
        {current.caseStudy ? (
          <Link to={`/projects/${current.slug}`} className="btn btn-volt mt-6 w-full justify-center">Read the case study</Link>
        ) : (
          <Link to={`/projects?q=${encodeURIComponent(current.name)}`} className="btn btn-line mt-6 w-full justify-center">Open in the archive</Link>
        )}
      </aside>
    </div>
  );
}
