import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { companion, portrait, profile } from '../../data/profile';
import NamanOrb, { type OrbMode } from '../NamanOrb';
import { categories, projects } from '../../data/projects';
import type { Category } from '../../data/types';
import { areaHex } from '../../data/visuals';
import { mix, seg, useReducedMotion, useScrollScene, useSize } from '../../hooks/useScrollScene';
import { openArea, openAssistant } from '../../agent/bus';

// The opening of the home page: one sticky stage driven by scroll progress.
//   0.00-0.14  I am introduced: name, role, figure on the right.
//   0.14-0.44  The figure moves to the centre and six notes, one per area of work, are drawn onto it.
//   0.44-0.64  The notes retract, I walk out, Naman (my voice agent, drawn as its orb) arrives.
//   0.64-1.00  Naman steps aside; lines grow from him into the map of the six areas, which can be clicked,
//              while his plan dots fill one per area, as the real orb shows a plan.
// Every frame writes styles straight to the elements. With reduced motion the same content is laid out still.

const AREAS: Category[] = ['agents', 'voice', 'llm', 'ml', 'data', 'systems'];

// What each note says, and where on the figure (fractions of the figure's box) its line ends.
const NOTES: Record<Category, { title: string; text: string; to: string; pin: [number, number]; side: 'l' | 'r'; y: number }> = {
  agents: { title: 'Agentic AI', text: 'SettleAI, ToolForge, Naman: MCP, LangGraph and a person approving the risky step', to: '/projects/settleai', pin: [0.43, 0.065], side: 'l', y: 0.13 },
  voice: { title: 'Voice AI', text: 'VoiceDesk: streaming speech, fast paths before the model', to: '/projects/voicedesk', pin: [0.6, 0.12], side: 'r', y: 0.11 },
  llm: { title: 'LLMs and RAG', text: 'docIQ: cited answers, hit@5 98.3% on held-out questions', to: '/projects/dociq', pin: [0.88, 0.2], side: 'r', y: 0.33 },
  ml: { title: 'Machine learning', text: 'CricXAI on 1.36 million deliveries, Sensei AI, churn with SHAP', to: '/projects/cricxai', pin: [0.25, 0.46], side: 'l', y: 0.42 },
  data: { title: 'Data engineering', text: 'job-market-tracker: daily pipeline into DuckDB and dbt', to: '/projects/job-market-tracker', pin: [0.85, 0.47], side: 'r', y: 0.55 },
  systems: { title: 'Systems', text: 'Movigo in production, Refera’s ledger, RouteCore', to: '/projects/movigo', pin: [0.3, 0.95], side: 'l', y: 0.72 },
  learning: { title: '', text: '', to: '', pin: [0, 0], side: 'l', y: 0 },
};

const FIG_ASPECT = portrait.width / portrait.height;
// Projects in an area: its own before those also listed there (so Movigo never leads another area), case studies first.
const rank = (c: Category) => (p: (typeof projects)[number]) => (p.category === c ? 0 : 2) + (p.caseStudy ? 0 : 1);
const inArea = (c: Category) => projects.filter((p) => p.category === c || p.also?.includes(c)).sort((a, b) => rank(c)(a) - rank(c)(b));
const areaTitle = (c: Category) => categories.find((x) => x.id === c)!;

function Intro({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <p className="label text-brass">{profile.headline}</p>
      <h1 id="hero-title" className="display mt-3 text-[clamp(3rem,7.4vw,7rem)] text-charcoal">Mokshit<br />Sharma</h1>
      <p className="mt-5 max-w-[30rem] text-[1.0625rem] leading-[1.6] text-charcoal/85 md:text-[1.125rem]">{profile.intro}</p>
      <div className="mt-7 flex flex-wrap items-center gap-3">
        <a href="#map" className="btn btn-brass">Explore my projects</a>
        <button type="button" className="btn btn-line" onClick={() => openAssistant()}>Ask my AI</button>
        <Link to="/experience" className="ui ml-1 font-semibold text-charcoal"><span className="link">Experience</span></Link>
      </div>
    </div>
  );
}

// Still version: the same story without motion.
function StillStory() {
  return (
    <section aria-labelledby="hero-title" className="pb-16 pt-24">
      <div className="shell grid gap-10 md:grid-cols-[minmax(0,6fr)_minmax(0,4fr)] md:items-center">
        <Intro />
        <img src={portrait.src} alt={portrait.alt} width={portrait.width} height={portrait.height} className="mx-auto h-[26rem] w-auto" />
      </div>
      <div className="shell mt-14">
        <h2 className="headline text-[1.75rem]">What I work on</h2>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map((c) => (
            <li key={c} className="border-l-2 pl-4" style={{ borderColor: areaHex[c] }}>
              <Link to={NOTES[c].to} className="note"><span className="note-title">{NOTES[c].title}</span><span className="note-text">{NOTES[c].text}</span></Link>
            </li>
          ))}
        </ul>
        <div className="mt-14 flex items-end gap-6">
          <NamanOrb mode="happy" className="h-44 w-auto" />
          <p className="ui max-w-[26rem] pb-2 text-slate">This is {companion.name}, my own voice agent. He runs my laptop and phone, asks before he acts, and knows where everything is.</p>
        </div>
      </div>
    </section>
  );
}

export default function Story() {
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const { w, h } = useSize(stage);
  const mobile = w > 0 && w < 768;

  const intro = useRef<HTMLDivElement>(null);
  const fig = useRef<HTMLDivElement>(null);
  const naman = useRef<HTMLDivElement>(null);
  const notes = useRef<(HTMLElement | null)[]>([]);
  const leaders = useRef<(SVGPathElement | null)[]>([]);
  const pins = useRef<(HTMLSpanElement | null)[]>([]);
  const trunk = useRef<SVGPathElement>(null);
  const drops = useRef<(SVGPathElement | null)[]>([]);
  const nodes = useRef<(HTMLButtonElement | null)[]>([]);
  const captions = useRef<(HTMLDivElement | null)[]>([]);
  const progress = useRef<HTMLDivElement>(null);
  const [orb, setOrb] = useState<{ mode: OrbMode; done: number }>({ mode: 'listening', done: 0 });
  const orbRef = useRef(orb);

  // Static geometry for the current stage size, in pixels.
  const g = useMemo(() => {
    if (!w) return null;
    const figH = mobile ? 0.4 * h : 0.78 * h;
    const figTop = mobile ? 0.1 * h : 0.12 * h;
    const figW = figH * FIG_ASPECT;
    const figLeft = w / 2 - figW / 2;
    const pin = (c: Category): [number, number] => [figLeft + NOTES[c].pin[0] * figW, figTop + NOTES[c].pin[1] * figH];
    const noteW = Math.min(0.2 * w, 250);
    const gap = 0.05 * w;
    const note = (c: Category) => {
      const n = NOTES[c];
      const x = n.side === 'l' ? figLeft - gap - noteW : figLeft + figW + gap;
      return { x, y: n.y * h + figTop * 0.4, w: noteW };
    };
    // The map: Naman at the root, a trunk up to a bus, a drop to each area.
    const root: [number, number] = mobile ? [0.17 * w, 0.27 * h] : [0.14 * w, 0.67 * h];
    const nodeW = mobile ? 0.62 * w : Math.min(0.105 * w, 170);
    const nodeH = mobile ? 0.075 * h : 150;
    const nodePos = AREAS.map((_, i) => (mobile ? [0.33 * w, 0.33 * h + i * 0.1 * h] : [0.32 * w + (i * 0.6 * w) / 5, 0.47 * h]) as [number, number]);
    const busY = 0.3 * h;
    const trunkD = mobile
      ? `M${root[0]} ${root[1]} V${nodePos[5][1]}`
      : `M${root[0]} ${root[1]} V${busY} H${nodePos[5][0]}`;
    const dropD = nodePos.map(([x, y]) => (mobile ? `M${root[0]} ${y} H${x}` : `M${x} ${busY} V${y - nodeH / 2}`));
    return { figH, figTop, figW, pin, note, nodeW, nodeH, nodePos, trunkD, dropD };
  }, [w, h, mobile]);

  useScrollScene(section, (p) => {
    if (!g) return;
    const set = (el: HTMLElement | SVGElement | null | undefined, css: Partial<CSSStyleDeclaration>) => { if (el) Object.assign(el.style, css); };
    if (progress.current) progress.current.style.transform = `scaleX(${p})`;

    // 1. Introduction leaves as the notes begin.
    const out = seg(p, 0.12, 0.2);
    set(intro.current, { opacity: String(1 - out), transform: `translateY(${-out * 40}px)` });

    // Figure: right of the name (desktop) or below it (phone), then centre, then out to the left.
    const toCentre = seg(p, 0.13, 0.22);
    const leave = seg(p, 0.47, 0.6);
    const startX = mobile ? 0 : 0.18 * w;
    const startY = mobile ? 0.42 * h : 0;
    const dx = mix(startX, 0, toCentre) - leave * (mobile ? 0.9 * w : 0.42 * w);
    const dy = mix(startY, 0, toCentre);
    const scale = mobile ? mix(0.82, 1, toCentre) : 1;
    set(fig.current, { transform: `translate(calc(-50% + ${dx}px), ${dy}px) scale(${scale})`, opacity: String(1 - leave) });

    // Notes, one after another, then all of them retract together.
    const retract = seg(p, 0.43, 0.48);
    AREAS.forEach((_, i) => {
      const a = 0.2 + i * 0.035;
      const draw = seg(p, a, a + 0.05) * (1 - retract);
      set(leaders.current[i], { strokeDashoffset: String(1 - draw) });
      set(pins.current[i], { opacity: String(draw), transform: `scale(${draw})` });
      const show = seg(p, a + 0.03, a + 0.06) * (1 - retract);
      set(notes.current[i], { opacity: String(show), transform: `translateY(${(1 - show) * 10}px)`, pointerEvents: show > 0.5 ? 'auto' : 'none' });
    });

    // Naman arrives, then steps aside to the root of the map.
    const enter = seg(p, 0.5, 0.62);
    const aside = seg(p, 0.64, 0.72);
    const mx = mix(mobile ? 1.1 * w : 0.7 * w, 0, enter);
    const tx = mobile ? 0.17 * w - 0.5 * w : 0.14 * w - 0.5 * w;
    // Feet land on the root of the map: y 0.27 of the stage on phones (from 0.9), 0.95 on wide screens (from 0.94).
    const ty = mobile ? -0.63 * h : 0.01 * h;
    set(naman.current, {
      transform: `translate(calc(-50% + ${mx + aside * tx}px), ${aside * ty}px) scale(${mix(1, mobile ? 0.36 : 0.55, aside)})`,
      opacity: String(enter),
    });

    // Naman's mood follows the story: listening as he arrives, happy to meet you, working while he draws the map,
    // with one plan dot per area filled as each appears.
    const done = AREAS.filter((_, i) => p >= 0.8 + i * 0.025).length;
    const mode: OrbMode = p < 0.56 ? 'listening' : p < 0.68 ? 'happy' : done < AREAS.length ? 'working' : 'happy';
    if (mode !== orbRef.current.mode || done !== orbRef.current.done) {
      orbRef.current = { mode, done };
      setOrb(orbRef.current);
    }

    // The map grows out of Naman.
    set(trunk.current, { strokeDashoffset: String(1 - seg(p, 0.7, 0.8)) });
    AREAS.forEach((_, i) => {
      const a = 0.78 + i * 0.025;
      set(drops.current[i], { strokeDashoffset: String(1 - seg(p, a, a + 0.03)) });
      const n = seg(p, a + 0.02, a + 0.05);
      set(nodes.current[i], { opacity: String(n), transform: `translate(-50%, 0) translateY(${(1 - n) * 14}px)`, pointerEvents: n > 0.5 ? 'auto' : 'none' });
    });

    // Captions for each chapter.
    const windows: [number, number, number, number][] = [[0.21, 0.25, 0.4, 0.44], [0.53, 0.57, 0.62, 0.66], [0.8, 0.85, 1.1, 1.2]];
    windows.forEach(([a, b, c, d], i) => {
      const o = seg(p, a, b) * (1 - seg(p, c, d));
      set(captions.current[i], { opacity: String(o), transform: `translateY(${(1 - o) * 16}px)` });
    });
  }, !reduced);

  if (reduced) return <StillStory />;

  return (
    <section ref={section} aria-labelledby="hero-title" className="story relative h-[520vh] max-md:h-[480vh]">
      <div ref={stage} className="story-stage sticky top-0 h-[100svh] overflow-hidden">
        <div ref={progress} className="story-progress" aria-hidden />

        {/* Chapter 1: the introduction */}
        <div ref={intro} className="story-intro">
          <Intro />
        </div>

        {/* The figure, placed at its centred position; motion is a transform from there. */}
        <div ref={fig} className="story-fig" style={mobile ? { top: '10%', height: '40%' } : undefined}>
          <img src={portrait.src} alt={portrait.alt} width={portrait.width} height={portrait.height} fetchPriority="high" className="h-full w-auto" />
        </div>

        {/* Lines: notes onto the figure, and the map out of Naman. Drawn in pixels so the stroke draws evenly. */}
        {g && (
          <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
            {!mobile && AREAS.map((c, i) => {
              const n = g.note(c);
              const [px, py] = g.pin(c);
              const sx = NOTES[c].side === 'l' ? n.x + n.w + 6 : n.x - 6;
              const kx = NOTES[c].side === 'l' ? sx + 18 : sx - 18;
              return <path key={c} ref={(el) => { leaders.current[i] = el; }} pathLength={1} className="story-line" style={{ stroke: areaHex[c] }} d={`M${sx} ${n.y + 11} H${kx} L${px} ${py}`} />;
            })}
            <path ref={trunk} pathLength={1} className="story-line story-trunk" d={g.trunkD} />
            {AREAS.map((c, i) => <path key={c} ref={(el) => { drops.current[i] = el; }} pathLength={1} className="story-line" style={{ stroke: areaHex[c] }} d={g.dropD[i]} />)}
          </svg>
        )}

        {/* Pins and notes */}
        {g && !mobile && AREAS.map((c, i) => {
          const [px, py] = g.pin(c);
          return <span key={c} ref={(el) => { pins.current[i] = el; }} className="story-pin" style={{ left: px, top: py, background: areaHex[c] }} aria-hidden />;
        })}
        <ul className={mobile ? 'story-notes-m' : ''} aria-label="What I work on">
          {AREAS.map((c, i) => {
            const n = g && !mobile ? g.note(c) : null;
            return (
              <li key={c} ref={(el) => { notes.current[i] = el; }} className="story-note" style={n ? { left: n.x, top: n.y, width: n.w, textAlign: NOTES[c].side === 'l' ? 'right' : 'left' } : undefined}>
                <Link to={NOTES[c].to} className="note">
                  <span className="note-title" style={{ color: areaHex[c] }}>{NOTES[c].title}</span>
                  <span className="note-text">{NOTES[c].text}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Naman */}
        <div ref={naman} className="story-naman" style={mobile ? { bottom: '10%', height: '40%' } : { height: '52%' }}>
          <NamanOrb mode={orb.mode} plan={AREAS.length} done={orb.done} className="h-full w-auto" title={`${companion.name}, my voice agent, drawn as its on-screen orb`} />
        </div>

        {/* The map of areas, clickable once drawn */}
        {g && AREAS.map((c, i) => {
          const [x, y] = g.nodePos[i];
          const count = inArea(c).length;
          return (
            <button
              key={c}
              type="button"
              ref={(el) => { nodes.current[i] = el; }}
              className="story-node"
              style={{ left: mobile ? x + g.nodeW / 2 : x, top: y - g.nodeH / 2, width: g.nodeW, minHeight: g.nodeH, ['--tint' as string]: areaHex[c] }}
              onClick={() => openArea(c)}
            >
              <span className="font-sans text-[0.9375rem] font-semibold leading-tight text-charcoal">{areaTitle(c).short}</span>
              <span className="fine mt-0.5 text-slate">{count} projects</span>
              <span className="story-node-list">{inArea(c).slice(0, 3).map((p) => p.name.replace(/ logistics platform$/, '')).join(', ')}</span>
            </button>
          );
        })}

        {/* Captions */}
        <div ref={(el) => { captions.current[0] = el; }} className="story-caption story-caption-1">
          <h2 className="headline text-[clamp(1.5rem,2.4vw,2.1rem)]">What I work on</h2>
          <p className="ui mt-2 text-slate">Six areas, one habit: the model proposes, code checks it, and every result is measured on data it has not seen.</p>
        </div>
        <div ref={(el) => { captions.current[1] = el; }} className="story-caption story-caption-2">
          <p className="label text-brass">Fig. 2</p>
          <h2 className="headline mt-1 text-[clamp(1.75rem,3vw,2.6rem)]">This is {companion.name}.</h2>
          <p className="ui mt-2 text-slate">My own voice agent: he runs my laptop and phone, plans each request and asks before anything risky. He knows where everything is. <Link to={`/projects/${companion.slug}`} className="link text-charcoal">See how he works</Link>, or follow him to the work.</p>
        </div>
        <div ref={(el) => { captions.current[2] = el; }} className="story-caption story-caption-3">
          <h2 className="headline text-[clamp(1.75rem,3vw,2.6rem)]">Everything I have built, by area</h2>
          <p className="ui mt-2 text-slate">Choose an area to open its projects, or keep scrolling for six systems explained step by step.</p>
        </div>
      </div>
    </section>
  );
}
