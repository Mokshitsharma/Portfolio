import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import type { ArchEdge, ArchNode, Architecture, NodeKind } from '../data/architecture';
import { onDiagram, openAssistant, setContext, takeQueued, type DiagramCommand } from '../agent/bus';

// An architecture sheet: nodes are real buttons laid over an SVG of orthogonal connectors. A walkthrough lights
// one connector and one component at a time and says what happens there. The assistant can start a walkthrough
// or select a component through the bus.

type Layout = 'd' | 'm';
export const BOX: Record<Layout, [number, number]> = { d: [170, 70], m: [140, 64] };
const STEP_MS = 2300;

export const kindName: Record<NodeKind, string> = {
  io: 'Input or output',
  model: 'Language model',
  rule: 'Code',
  human: 'Person decides',
  store: 'Storage',
  external: 'External service',
};

type Pt = [number, number];

// The point on a node's edge facing `p`, sliding along that side towards p so parallel lines stay apart.
function anchor(n: ArchNode, p: Pt, l: Layout): Pt {
  const [cx, cy] = n[l];
  const [w, h] = BOX[l];
  const dx = p[0] - cx;
  const dy = p[1] - cy;
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  if (Math.abs(dx) / (w / 2) > Math.abs(dy) / (h / 2)) return [cx + Math.sign(dx) * (w / 2), clamp(p[1], cy - h / 2 + 10, cy + h / 2 - 10)];
  return [clamp(p[0], cx - w / 2 + 12, cx + w / 2 - 12), cy + Math.sign(dy) * (h / 2)];
}

export function route(e: ArchEdge, byId: Map<string, ArchNode>, l: Layout): Pt[] {
  const a = byId.get(e.from)!;
  const b = byId.get(e.to)!;
  let via = e.via?.[l] ?? [];
  if (!via.length && a[l][0] !== b[l][0] && a[l][1] !== b[l][1]) via = [[b[l][0], a[l][1]]]; // one elbow
  const start = anchor(a, via[0] ?? b[l], l);
  const end = anchor(b, via[via.length - 1] ?? a[l], l);
  return [start, ...via, end];
}

const toPath = (pts: Pt[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');

function useLayout(): Layout {
  const [l, setL] = useState<Layout>('d');
  useEffect(() => {
    const q = window.matchMedia('(max-width: 719px)');
    const on = () => setL(q.matches ? 'm' : 'd');
    on();
    q.addEventListener('change', on);
    return () => q.removeEventListener('change', on);
  }, []);
  return l;
}

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// `driven` hands control to the page (a case study's scroll chapters set the step or the component); `compact`
// leaves only the sheet and its key, for a pinned diagram beside text that already explains each step.
export interface Driven { walkthrough?: string; step?: number; node?: string | null }

export default function ArchitectureExplorer({ arch, driven, compact = false, onNodeClick }: { arch: Architecture; driven?: Driven; compact?: boolean; onNodeClick?: (id: string) => void }) {
  const l = useLayout();
  const byId = useMemo(() => new Map(arch.nodes.map((n) => [n.id, n])), [arch]);
  const paths = useMemo(() => new Map(arch.edges.map((e) => [e.id, route(e, byId, l)])), [arch, byId, l]);
  const [ownWt, setWt] = useState(arch.walkthroughs[0].id);
  const [ownStep, setStep] = useState(-1); // -1: whole architecture, nothing lit
  const [playing, setPlaying] = useState(false);
  const [ownSelected, setSelected] = useState<string | null>(null);
  const root = useRef<HTMLElement>(null);
  const wt = driven?.walkthrough ?? ownWt;
  const step = driven ? driven.step ?? -1 : ownStep;
  const selected = driven ? driven.node ?? null : ownSelected;

  const walk = arch.walkthroughs.find((w) => w.id === wt)!;
  const current = step >= 0 ? walk.steps[step] : null;
  const travelled = new Set(step >= 0 ? walk.steps.slice(0, step + 1).map((s) => s.edge).filter(Boolean) as string[] : []);
  const visited = new Set(step >= 0 ? walk.steps.slice(0, step + 1).map((s) => s.node) : []);
  const focus = selected ?? current?.node ?? null;
  const detail = focus ? byId.get(focus)! : null;

  useEffect(() => {
    if (!playing) return;
    if (step >= walk.steps.length - 1) { setPlaying(false); return; }
    const t = window.setTimeout(() => setStep((s) => s + 1), step < 0 ? 200 : STEP_MS);
    return () => window.clearTimeout(t);
  }, [playing, step, walk.steps.length]);

  useEffect(() => {
    setContext({ slug: arch.slug, node: focus ?? undefined, walkthrough: step >= 0 ? wt : undefined });
  }, [arch.slug, focus, step, wt]);
  useEffect(() => () => setContext({}), []);

  const play = useCallback((id?: string) => {
    if (id) setWt(id);
    setSelected(null);
    setStep(-1);
    setPlaying(true);
  }, []);

  const run = useCallback((cmd: DiagramCommand) => {
    if (cmd.slug !== arch.slug) return;
    root.current?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    if (cmd.walkthrough && arch.walkthroughs.some((w) => w.id === cmd.walkthrough)) play(cmd.walkthrough);
    else if (cmd.node && byId.has(cmd.node)) { setPlaying(false); setSelected(cmd.node); }
  }, [arch, byId, play]);

  useEffect(() => {
    if (compact) return; // the full explorer on the page answers the assistant
    const queued = takeQueued(arch.slug);
    if (queued) window.setTimeout(() => run(queued), 300);
    return onDiagram(run);
  }, [arch.slug, run, compact]);

  const [W, H] = arch.size[l];
  const [bw, bh] = BOX[l];
  const pct = (v: number, of: number) => `${(v / of) * 100}%`;
  const titleId = `${arch.slug}-arch-title${compact ? '-pinned' : ''}`;

  return (
    <figure ref={root} className="arch scroll-mt-24" aria-labelledby={titleId}>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        {compact ? <h3 id={titleId} className="sr-only">{arch.title}</h3> : <h3 id={titleId} className="headline text-2xl md:text-3xl">{arch.title}</h3>}
        <ul className="arch-key" aria-label="Key">
          {(['model', 'rule', 'human', 'store', 'io', 'external'] as NodeKind[]).filter((k) => arch.nodes.some((n) => n.kind === k)).map((k) => (
            <li key={k}><span className={`arch-swatch k-${k}`} aria-hidden />{kindName[k]}</li>
          ))}
        </ul>
      </div>

      {!compact && <div className="arch-controls mt-6" role="group" aria-label="Walkthrough">
        <label className="sr-only" htmlFor={`${arch.slug}-wt`}>Request to follow</label>
        <select id={`${arch.slug}-wt`} value={wt} onChange={(e) => { setWt(e.target.value); setStep(-1); setPlaying(false); }} className="arch-select">
          {arch.walkthroughs.map((w) => <option key={w.id} value={w.id}>Follow {w.title}</option>)}
        </select>
        <div className="flex gap-1.5">
          <button type="button" className="arch-btn" onClick={() => (playing ? setPlaying(false) : step >= walk.steps.length - 1 ? play() : (setSelected(null), setPlaying(true)))}>
            {playing ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />}{playing ? 'Pause' : step >= 0 && step < walk.steps.length - 1 ? 'Resume' : 'Play flow'}
          </button>
          <button type="button" className="arch-btn" onClick={() => { setPlaying(false); setSelected(null); setStep((s) => Math.max(0, s - 1)); }} disabled={step <= 0}>
            <SkipBack size={16} aria-hidden /><span className="sr-only">Previous step</span>
          </button>
          <button type="button" className="arch-btn" onClick={() => { setPlaying(false); setSelected(null); setStep((s) => Math.min(walk.steps.length - 1, s + 1)); }} disabled={step >= walk.steps.length - 1}>
            <SkipForward size={16} aria-hidden /><span className="sr-only">Next step</span>
          </button>
          <button type="button" className="arch-btn" onClick={() => { setPlaying(false); setStep(-1); setSelected(null); }} disabled={step < 0 && !selected}>
            <RotateCcw size={16} aria-hidden />Whole system
          </button>
        </div>
      </div>

      }
      <div className="arch-sheet mt-4" style={{ aspectRatio: `${W} / ${H}`, maxWidth: l === 'd' ? `${W * 1.05}px` : undefined }} data-lit={step >= 0 || undefined} data-layout={l}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <marker id={`${arch.slug}-head`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 1 L9 5 L0 9 z" className="arch-head" />
            </marker>
          </defs>
          {arch.edges.map((e) => {
            const pts = paths.get(e.id)!;
            const on = travelled.has(e.id);
            const now = current?.edge === e.id;
            return (
              <g key={`${e.id}-${l}`}>
                <path d={toPath(pts)} className={`arch-edge ${on ? 'is-on' : ''}`} markerEnd={`url(#${arch.slug}-head)`} />
                {now && <path d={toPath(pts)} pathLength={1} className="arch-pulse" key={`${step}-${wt}`} />}
                {e.label && l === 'd' && (() => {
                  // Label the longest segment, at its middle.
                  let best = 0;
                  pts.slice(1).forEach((p, i) => { if (Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]) > Math.hypot(pts[best + 1][0] - pts[best][0], pts[best + 1][1] - pts[best][1])) best = i; });
                  const [a, b] = [pts[best], pts[best + 1]];
                  const vertical = a[0] === b[0];
                  return <text x={(a[0] + b[0]) / 2 + (vertical ? 8 : 0)} y={(a[1] + b[1]) / 2 + (vertical ? 4 : -7)} textAnchor={vertical ? 'start' : 'middle'} className="arch-edge-label">{e.label}</text>;
                })()}
              </g>
            );
          })}
        </svg>
        {arch.nodes.map((n) => {
          const [x, y] = n[l];
          const state = current?.node === n.id ? 'now' : visited.has(n.id) ? 'seen' : '';
          return (
            <button
              key={n.id}
              type="button"
              className={`arch-node k-${n.kind}`}
              data-state={state || undefined}
              aria-pressed={focus === n.id}
              onClick={() => { if (onNodeClick) return onNodeClick(n.id); setPlaying(false); setSelected(n.id === selected ? null : n.id); }}
              style={{ left: pct(x - bw / 2, W), top: pct(y - bh / 2, H), width: pct(bw, W), height: pct(bh, H) }}
            >
              <span className="arch-node-label">{n.label}</span>
              {n.sub && <span className="arch-node-sub">{n.sub}</span>}
            </button>
          );
        })}
      </div>

      {!compact && <div className="arch-readout mt-4 grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <p className="ui" aria-live="polite">
          {current ? (
            <><span className="font-semibold">Step {step + 1} of {walk.steps.length}.</span> {current.say}</>
          ) : (
            <span className="text-slate">Press Play flow to follow {walk.title} through the system, or select any component.</span>
          )}
        </p>
        {detail ? (
          <div className="arch-detail" aria-live="polite">
            <p className="fine text-slate">{kindName[detail.kind]}</p>
            <h4 className="headline mt-1 text-xl">{detail.label}</h4>
            <p className="ui mt-2">{detail.what}</p>
            {detail.io && (
              <dl className="fine mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                <dt className="text-slate">In</dt><dd>{detail.io.in}</dd>
                <dt className="text-slate">Out</dt><dd>{detail.io.out}</dd>
              </dl>
            )}
            {detail.why && <p className="ui mt-3 border-l-2 border-brass pl-3">{detail.why}</p>}
            {detail.source && <p className="fine mt-3 text-slate">In the code: {detail.source}</p>}
            <button type="button" className="arch-btn mt-4" onClick={() => openAssistant(`What does the ${detail.label} component do in this system, and why is it built that way?`)}>
              Ask my AI about this
            </button>
          </div>
        ) : (
          <p className="fine text-slate">{arch.caption}</p>
        )}
      </div>}
    </figure>
  );
}
