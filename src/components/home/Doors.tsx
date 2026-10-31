import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projects } from '../../data/projects';
import { caseStudies } from '../../data/caseStudies';
import { credentials, education, inProgress } from '../../data/profile';
import { currentRole, internships } from '../../data/experience';
import { skillColumns } from '../../data/home';
import { useReducedMotion, useScrollScene } from '../../hooks/useScrollScene';

// The doors: one painted, panelled door per part of the portfolio, set in a dark wall with a brass nameplate and
// a lever handle. On wide screens scrolling stands each door ajar in turn, light spilling out, and lists what is
// inside beside it. Opening a door swings it wide and walks the view through it into the room.

interface Room {
  id: string;
  name: string;
  to: string;
  paint: string;
  inside: string[];
}

const ROOMS: Room[] = [
  { id: 'projects', name: 'Projects', to: '/projects', paint: '#2f4f86',
    inside: [`${projects.length} projects in six areas`, `${caseStudies.length} case studies with their architecture`, 'An interactive map from area to project', 'Architecture you can play, step by step'] },
  { id: 'experience', name: 'Experience', to: '/experience', paint: '#5d5582',
    inside: [`${currentRole.title}, ${currentRole.org.replace(' Pvt. Ltd.', '')}`, `${internships.length} internships, with their documents`, 'The work by area: ML, voice and RAG, platform'] },
  { id: 'education', name: 'Education', to: '/about', paint: '#7a9a83',
    inside: [education.degree, education.school.replace(', Indore', ''), `${education.years}, ${education.grade}`] },
  { id: 'skills', name: 'Skills', to: '/skills', paint: '#b4562f',
    inside: skillColumns.map((c) => c.title) },
  { id: 'certifications', name: 'Certifications', to: '/achievements', paint: '#b8893a',
    inside: credentials.map((c) => `${c.title}, ${c.issuer}`) },
  { id: 'achievements', name: 'Achievements', to: '/achievements', paint: '#7b3346',
    inside: [...inProgress.map((i) => `${i.title}: ${i.detail}`), 'Movigo’s apps live on Google Play and the App Store'] },
  { id: 'contact', name: 'Contact', to: '/contact', paint: '#3f6f6a',
    inside: ['Open to AI, ML and data roles', 'Remote, hybrid or on-site in India', 'A short form, or email directly'] },
];

function Door({ r, ajar, opening, onOpen }: { r: Room; ajar: boolean; opening: boolean; onOpen: (el: HTMLElement) => void }) {
  return (
    <button
      type="button"
      className="door"
      data-ajar={ajar || undefined}
      data-opening={opening || undefined}
      style={{ ['--paint' as string]: r.paint }}
      onClick={(e) => onOpen(e.currentTarget)}
      aria-label={`Open the ${r.name} room`}
    >
      <span className="door-case" aria-hidden>
        <span className="door-light" />
        <span className="door-leaf">
          <span className="door-plate">{r.name}</span>
          <span className="door-panel door-panel-top" />
          <span className="door-panel door-panel-bottom" />
          <span className="door-lever" />
        </span>
      </span>
      <span className="door-spill" aria-hidden />
    </button>
  );
}

export default function Doors() {
  const reduced = useReducedMotion();
  const navigate = useNavigate();
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [opening, setOpening] = useState<string | null>(null);
  const activeRef = useRef(0);

  useScrollScene(section, (p) => {
    const now = Math.min(ROOMS.length - 1, Math.floor(p * ROOMS.length));
    if (now !== activeRef.current) { activeRef.current = now; setActive(now); }
  }, !reduced);

  const open = (r: Room, el?: HTMLElement) => {
    if (reduced || !stage.current) return navigate(r.to);
    // Walk towards the door: zoom the stage about the door's centre while it swings open.
    const box = stage.current.getBoundingClientRect();
    const door = (el ?? stage.current.querySelector<HTMLElement>(`[aria-label="Open the ${r.name} room"]`))?.getBoundingClientRect();
    if (door) stage.current.style.transformOrigin = `${door.left + door.width / 2 - box.left}px ${door.top + door.height / 2 - box.top}px`;
    setOpening(r.id);
    window.setTimeout(() => navigate(r.to), 900);
  };
  const room = ROOMS[active];
  const col = Math.min(active, ROOMS.length - 3);

  return (
    <section id="doors" ref={section} data-section="doors" aria-labelledby="doors-title" className="doors-section relative lg:h-[420vh]">
      <div ref={stage} className="doors-stage lg:sticky lg:top-0 lg:h-[100svh]" data-entering={opening || undefined}>
        <div className="doors-wall" aria-hidden />
        <div className="shell relative flex h-full flex-col justify-center pb-10 pt-24">
          <h2 id="doors-title" className="cine-h2 !text-[clamp(2rem,4.2vw,3.6rem)]">Pick a door.</h2>
          <p className="mt-3 max-w-[34rem] text-[1.0625rem] leading-[1.6] text-charcoal/70">Seven rooms, one for each part of the work. Scroll to look around, or open one.</p>
          <div className="doors-row mt-10">
            {ROOMS.map((r, i) => <Door key={r.id} r={r} ajar={active === i} opening={opening === r.id} onOpen={(el) => open(r, el)} />)}
          </div>
          <div className="doors-row doors-info-row">
          <div className="doors-info" style={{ gridColumn: `${col + 1} / span 3` }} aria-live="polite">
            <h3 className="font-sans text-[1.35rem] font-semibold text-charcoal">{room.name}</h3>
            <ul className="mt-2 space-y-1">
              {room.inside.map((x) => <li key={x} className="ui flex gap-2 text-charcoal/80"><span className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-brass" aria-hidden />{x}</li>)}
            </ul>
            <button type="button" className="pill pill-solid mt-4 !min-h-10" onClick={() => open(room)}>Open the door</button>
          </div>
          </div>
        </div>
        <div className="doors-fade" aria-hidden />
      </div>
    </section>
  );
}
