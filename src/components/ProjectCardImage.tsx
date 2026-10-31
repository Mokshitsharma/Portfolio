import type { Project } from '../data/types';
import { architectureFor } from '../data/architecture';
import { areaHex } from '../data/visuals';
import { BOX, route } from './ArchitectureExplorer';

// The picture on a catalogue card, in order of preference: a real screenshot of the project; otherwise its own
// architecture sheet drawn small and labelled as a diagram (never dressed up as an app screen); otherwise a plain
// plate listing what it is built with.

const SHOTS: Record<string, { src: string; alt: string }> = {
  movigo: { src: '/images/movigo-retailer-vehicles.jpg', alt: 'Movigo retailer app: choosing a vehicle for a delivery.' },
  settleai: { src: '/images/settleai-admin.jpg', alt: 'SettleAI admin overview with escrow totals, shown with seeded demo data.' },
  'ai-business-analytics': { src: '/images/ai-business-analytics-upload.jpg', alt: 'AI Business Analytics upload screen.' },
};

function ArchThumb({ p }: { p: Project }) {
  const a = architectureFor(p.slug)!;
  const [W, H] = a.size.d;
  const [bw, bh] = BOX.d;
  const byId = new Map(a.nodes.map((n) => [n.id, n]));
  const tint = areaHex[p.category];
  return (
    <figure className="card-img card-arch" style={{ ['--tint' as string]: tint }}>
      <svg viewBox={`-10 -10 ${W + 20} ${H + 20}`} preserveAspectRatio="xMidYMid meet" className="h-full w-full" role="img" aria-label={`Architecture diagram of ${p.name}: ${a.nodes.map((n) => n.label).join(', ')}`}>
        {a.edges.map((e) => {
          const pts = route(e, byId, 'd');
          return <path key={e.id} d={pts.map((pt, i) => `${i ? 'L' : 'M'}${pt[0]} ${pt[1]}`).join(' ')} fill="none" stroke="#9aa7b0" strokeWidth="3" />;
        })}
        {a.nodes.map((n) => (
          <g key={n.id}>
            <rect x={n.d[0] - bw / 2} y={n.d[1] - bh / 2} width={bw} height={bh} rx={n.kind === 'human' ? bh / 2 : 0} fill="white" stroke={n.kind === 'model' ? tint : '#16202b'} strokeWidth="3" strokeDasharray={n.kind === 'external' ? '10 6' : undefined} />
            <text x={n.d[0]} y={n.d[1] + 9} textAnchor="middle" fontSize="26" fontWeight="600" fill="#16202b" fontFamily="Archivo Variable, Archivo, sans-serif">{n.label.length > 13 ? `${n.label.slice(0, 12)}…` : n.label}</text>
          </g>
        ))}
      </svg>
      <figcaption className="card-img-tag">Architecture diagram</figcaption>
    </figure>
  );
}

function StackPlate({ p }: { p: Project }) {
  return (
    <div className="card-img card-plate" style={{ ['--tint' as string]: areaHex[p.category] }} aria-hidden>
      <p className="card-plate-label">Built with</p>
      <ul className="card-plate-stack">{p.stack.slice(0, 6).map((s) => <li key={s}>{s}</li>)}</ul>
    </div>
  );
}

export default function ProjectCardImage({ p }: { p: Project }) {
  const shot = SHOTS[p.slug];
  if (shot) return <figure className="card-img"><img src={shot.src} alt={shot.alt} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" /></figure>;
  if (architectureFor(p.slug)) return <ArchThumb p={p} />;
  return <StackPlate p={p} />;
}
