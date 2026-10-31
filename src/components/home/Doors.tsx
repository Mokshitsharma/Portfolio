import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projects } from '../../data/projects';
import { caseStudies } from '../../data/caseStudies';
import { credentials, education, inProgress } from '../../data/profile';
import { currentRole, internships } from '../../data/experience';
import { skillColumns } from '../../data/home';
import { useReducedMotion, useScrollScene } from '../../hooks/useScrollScene';

// The doors: one room per part of the portfolio. Each door has a brass room plate, a status light, and a frosted
// panel with a faint sketch of what is inside. On wide screens scrolling brings each door forward in turn with a
// list of its contents; anywhere, opening a door swings it on its hinge and goes into the room.

interface Room {
  id: string;
  no: string;
  name: string;
  to: string;
  tone: string;
  inside: string[];
  sketch: 'graph' | 'timeline' | 'cap' | 'grid' | 'seal' | 'star' | 'mail';
}

const ROOMS: Room[] = [
  { id: 'projects', no: 'R01', name: 'Projects', to: '/projects', tone: '#2f4a3e', sketch: 'graph',
    inside: [`${projects.length} projects in six areas`, `${caseStudies.length} case studies with their architecture`, 'An interactive map from area to project', 'Architecture you can play, step by step'] },
  { id: 'experience', no: 'R02', name: 'Experience', to: '/experience', tone: '#34465e', sketch: 'timeline',
    inside: [`${currentRole.title}, ${currentRole.org.replace(' Pvt. Ltd.', '')}`, `${internships.length} internships, with their documents`, 'The work by area: ML, voice and RAG, platform'] },
  { id: 'education', no: 'R03', name: 'Education', to: '/about', tone: '#4c3b52', sketch: 'cap',
    inside: [education.degree, education.school.replace(', Indore', ''), `${education.years}, ${education.grade}`] },
  { id: 'skills', no: 'R04', name: 'Skills', to: '/skills', tone: '#50604a', sketch: 'grid',
    inside: skillColumns.map((c) => c.title) },
  { id: 'certifications', no: 'R05', name: 'Certifications', to: '/achievements', tone: '#6b5530', sketch: 'seal',
    inside: credentials.map((c) => `${c.title}, ${c.issuer}`) },
  { id: 'achievements', no: 'R06', name: 'Achievements', to: '/achievements', tone: '#6e3f2d', sketch: 'star',
    inside: [...inProgress.map((i) => `${i.title}: ${i.detail}`), 'Movigo’s apps live on Google Play and the App Store'] },
  { id: 'contact', no: 'R07', name: 'Contact', to: '/contact', tone: '#2b3430', sketch: 'mail',
    inside: ['Open to AI, ML and data roles', 'Remote, hybrid or on-site in India', 'A short form, or email directly'] },
];

function Sketch({ kind }: { kind: Room['sketch'] }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4 } as const;
  return (
    <svg viewBox="0 0 60 40" className="door-sketch" aria-hidden>
      {kind === 'graph' && <><circle cx="10" cy="20" r="3" {...s} /><circle cx="30" cy="10" r="3" {...s} /><circle cx="30" cy="30" r="3" {...s} /><circle cx="50" cy="20" r="3" {...s} /><path d="M13 19 27 11M13 21 27 29M33 11 47 19M33 29 47 21" {...s} /></>}
      {kind === 'timeline' && <><path d="M6 20H54" {...s} />{[12, 24, 36, 48].map((x) => <circle key={x} cx={x} cy="20" r="2.5" {...s} />)}</>}
      {kind === 'cap' && <><path d="M8 16 30 7l22 9-22 9Z" {...s} /><path d="M17 20v9c6 4 20 4 26 0v-9" {...s} /></>}
      {kind === 'grid' && [0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={12 + c * 13} y={5 + r * 11} width="10" height="8" {...s} />))}
      {kind === 'seal' && <><circle cx="30" cy="17" r="9" {...s} /><path d="M24 25 21 36l9-4 9 4-3-11" {...s} /></>}
      {kind === 'star' && <path d="M30 5l6 11 12 2-9 8 2 12-11-6-11 6 2-12-9-8 12-2Z" {...s} />}
      {kind === 'mail' && <><rect x="10" y="9" width="40" height="24" {...s} /><path d="M10 9l20 14 20-14" {...s} /></>}
    </svg>
  );
}

function Door({ r, active, onOpen, opening }: { r: Room; active: boolean; onOpen: () => void; opening: boolean }) {
  return (
    <button type="button" className="door" data-active={active || undefined} data-opening={opening || undefined} style={{ ['--door' as string]: r.tone }} onClick={onOpen} aria-label={`Open the ${r.name} room`}>
      <span className="door-frame" aria-hidden>
        <span className="door-room" />
        <span className="door-leaf">
          <span className="door-window"><Sketch kind={r.sketch} /></span>
          <span className="door-plate"><span className="door-led" />{r.no} · {r.name}</span>
          <span className="door-handle" />
        </span>
      </span>
      <span className="door-label">{r.name}</span>
    </button>
  );
}

export default function Doors() {
  const reduced = useReducedMotion();
  const navigate = useNavigate();
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [opening, setOpening] = useState<string | null>(null);
  const activeRef = useRef(0);

  useScrollScene(section, (p) => {
    const now = Math.min(ROOMS.length - 1, Math.floor(p * ROOMS.length));
    if (now !== activeRef.current) { activeRef.current = now; setActive(now); }
  }, !reduced);

  const open = (r: Room) => {
    if (reduced) return navigate(r.to);
    setOpening(r.id);
    window.setTimeout(() => navigate(r.to), 650);
  };
  const room = ROOMS[active];

  return (
    <section id="doors" ref={section} data-section="doors" aria-labelledby="doors-title" className="doors-section relative lg:h-[420vh]">
      <div className="doors-stage lg:sticky lg:top-0 lg:h-[100svh]">
        <div className="shell flex h-full flex-col justify-center pb-10 pt-24">
          <h2 id="doors-title" className="cine-h2 !text-[clamp(2rem,4.2vw,3.6rem)]">Every room holds part of the work.</h2>
          <div className="doors-row mt-10">
            {ROOMS.map((r, i) => <Door key={r.id} r={r} active={active === i} opening={opening === r.id} onOpen={() => open(r)} />)}
          </div>
          <div className="doors-info" aria-live="polite">
            <p className="label text-brass">{room.no} · Behind this door</p>
            <h3 className="headline mt-1 text-[1.6rem] text-charcoal">{room.name}</h3>
            <ul className="mt-3 space-y-1.5">
              {room.inside.map((x) => <li key={x} className="ui flex gap-2 text-charcoal/85"><span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brass" aria-hidden />{x}</li>)}
            </ul>
            <button type="button" className="pill pill-solid mt-5" onClick={() => open(room)}>Open the door</button>
          </div>
        </div>
      </div>
    </section>
  );
}
