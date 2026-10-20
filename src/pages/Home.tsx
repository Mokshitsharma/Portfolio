import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Download } from 'lucide-react';
import { currentRole, formatMonth, roles } from '../data/experience';
import { credentials, education, inProgress, profile } from '../data/profile';
import { projects } from '../data/projects';
import { skillGroups } from '../data/skills';
import { domains, galleryOrder, skillsFor } from '../data/domains';
import { calibration } from '../data/visuals';
import { chapters } from '../scene/chapters';
import ResidenceBackdrop from '../components/home/ResidenceBackdrop';
import ChapterRail from '../components/home/ChapterRail';
import { Timeline } from '../components/home/Evidence';
import { AgentsRoom, DataRoom, MachineLearningRoom, ProjectLink, SoftwareRoom, roomProjects, rooms } from '../components/home/Rooms';

// The home page is a walk through a house (see docs/redesign/DESIGN.md): arrival, the door, a gallery of skills,
// a corridor of four rooms, a study and a courtyard. Each chapter is an ordinary section; the WebGL residence
// behind them follows the scroll and is never needed to read or reach anything.

const NAME = 'Mokshit Sharma';
const DISCIPLINES = 'Applied AI · Machine learning · Software engineering';
const FRAME_TITLES = galleryOrder.map((id) => domains.find((d) => d.id === id)!.title);

function Chapter({ id, title, intro, children, width = 'lg:max-w-[42rem]' }: { id: string; title: ReactNode; intro?: ReactNode; children: ReactNode; width?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative z-10 py-28 md:py-36">
      <div className="shell lg:pr-52">
        <div className={`read-panel -mx-4 px-4 py-8 sm:mx-0 sm:px-6 lg:p-0 ${width}`}>
          <h2 id={`${id}-title`} className="serif-display max-w-[42rem] text-[clamp(2.5rem,5.2vw,4.4rem)] text-bone">{title}</h2>
          {intro && <p className="mt-5 max-w-[36rem] font-sans text-[clamp(1.05rem,1.4vw,1.25rem)] leading-snug text-bone/85">{intro}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Arrival */

function Arrival() {
  return (
    <section id="arrival" aria-labelledby="hero-title" className="relative z-10 flex min-h-[100svh] items-end pb-14 pt-28 md:pb-20">
      <div className="shell lg:pr-52">
        <div className="nameplate">
          <h1 id="hero-title" className="nameplate-name hero-intro text-[clamp(1.6rem,4.2vw,3.3rem)] uppercase">{NAME}</h1>
          <p className="nameplate-line mt-4 uppercase">{DISCIPLINES}</p>
        </div>
        <p className="ui mt-6 text-stone">{profile.currentRole} at {profile.currentOrg}, {profile.location}</p>
        <p className="mt-4 max-w-[36rem] font-sans text-[clamp(1.15rem,1.7vw,1.45rem)] font-medium leading-snug text-bone">
          I build AI systems in which the model proposes and code decides, and I run a live delivery platform in Indore
          as its only engineer.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a href="#gallery" className="btn btn-brass">Open the door</a>
          <a href={profile.resume} className="btn btn-line" download><Download size={17} aria-hidden />Download résumé</a>
          <Link to="/projects" className="ui ml-2 font-semibold text-bone"><span className="link">All {projects.length} projects</span></Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Entrance: the directory */

function Entrance() {
  const where: Record<string, string> = {
    gallery: 'Five areas of skill, each framed with the projects behind it',
    corridor: 'Four doors, one per kind of project',
    'room-ml': `${roomProjects(rooms[0]).length} projects`,
    'room-agents': `${roomProjects(rooms[1]).length} projects`,
    'room-data': `${roomProjects(rooms[2]).length} projects`,
    'room-software': `${roomProjects(rooms[3]).length} projects`,
    study: 'Experience, education and certificates',
    courtyard: 'Contact, résumé and profiles',
  };
  return (
    <section id="entrance" aria-labelledby="entrance-title" className="relative z-10 flex min-h-[150vh] items-end pb-28">
      <div className="shell lg:pr-52">
        <div className="read-panel -mx-4 px-4 py-8 sm:mx-0 sm:px-6 lg:max-w-[34rem] lg:p-0">
          <h2 id="entrance-title" className="serif-display text-[clamp(2.2rem,4.4vw,3.6rem)] text-bone">Come in</h2>
          <p className="mt-4 font-sans text-[1.125rem] leading-snug text-bone/85">
            The work is laid out like a house. Walk through it, or go straight to a room.
          </p>
          <nav aria-label="Directory" className="mt-8 border-t border-joint">
            <ul>
              {chapters.filter((c) => where[c.id]).map((c) => (
                <li key={c.id} className="border-b border-joint">
                  <a href={`#${c.id}`} className="group grid grid-cols-[1fr_auto] items-baseline gap-4 py-3 no-underline">
                    <span className="ui font-semibold text-bone group-hover:text-brass">{c.name}</span>
                    <span className="fine text-right text-stone">{where[c.id]}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Gallery */

function Gallery() {
  const frames = galleryOrder.map((id) => domains.find((d) => d.id === id)!);
  return (
    <section id="gallery" aria-labelledby="gallery-title" className="relative z-10 pt-28 md:pt-36">
      <div className="shell lg:pr-52">
        <div className="read-panel -mx-4 px-4 py-8 sm:mx-0 sm:px-6 lg:max-w-[42rem] lg:p-0">
          <h2 id="gallery-title" className="serif-display text-[clamp(2.5rem,5.2vw,4.4rem)] text-bone">The gallery</h2>
          <p className="mt-5 max-w-[36rem] font-sans text-[clamp(1.05rem,1.4vw,1.25rem)] leading-snug text-bone/85">
            Five areas of work, one frame each. Every skill is named as it is on the Skills page, and every frame leads to
            the projects that show it.
          </p>
        </div>
        <ol className="mt-16">
          {frames.map((d) => (
            <li key={d.id} data-frame className="flex min-h-[92vh] items-center py-10 lg:max-w-[42rem]">
              <article aria-labelledby={`${d.id}-frame`} className="frame w-full">
                <h3 id={`${d.id}-frame`} className="serif-display text-[clamp(1.9rem,3.2vw,2.6rem)] text-bone">{d.title}</h3>
                <p className="ui mt-2 text-stone">{d.line}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Skills">
                  {skillsFor(d).map((s) => <li key={s} className="tag">{s}</li>)}
                </ul>
                <p className="ui mt-5 border-l-2 border-brass pl-4 text-bone/90">{d.evidence}</p>
                <ul className="fine mt-5 flex flex-wrap gap-x-4 gap-y-1.5" aria-label={`${d.title} projects`}>
                  {d.projects.map((s) => <li key={s}><ProjectLink slug={s} /></li>)}
                </ul>
              </article>
            </li>
          ))}
        </ol>
        <div className="read-panel -mx-4 px-4 pb-8 sm:mx-0 sm:px-6 lg:p-0">
          <Link to="/skills" className="btn btn-line">Every skill, with the projects that show it</Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Corridor */

function DoorPreview({ id, tint }: { id: string; tint: string }) {
  // Small drawings of what is behind each door, from the room's own evidence.
  if (id === 'room-ml') {
    return (
      <svg viewBox="0 0 120 60" className="h-14 w-28" aria-hidden>
        {calibration.map((c, i) => (
          <g key={c.bin}>
            <rect x={10 + i * 38} y={56 - c.predicted * 160} width="12" height={c.predicted * 160} fill="none" stroke={tint} strokeWidth="1.5" />
            <rect x={24 + i * 38} y={56 - c.observed * 160} width="12" height={c.observed * 160} fill={tint} />
          </g>
        ))}
      </svg>
    );
  }
  if (id === 'room-agents') {
    const kinds = ['human', 'model', 'rule', 'io', 'rule', 'model', 'rule', 'rule', 'io'];
    return (
      <svg viewBox="0 0 120 60" className="h-14 w-28" aria-hidden>
        <line x1="6" x2="114" y1="30" y2="30" stroke="#34302b" />
        {kinds.map((k, i) => {
          const x = 8 + i * 13;
          return k === 'rule' ? <rect key={i} x={x - 4} y="26" width="8" height="8" fill={tint} /> : <circle key={i} cx={x} cy="30" r="4" fill={k === 'human' ? '#efe9df' : 'none'} stroke={k === 'model' ? '#7cc6d2' : '#efe9df'} strokeWidth="1.5" />;
        })}
      </svg>
    );
  }
  if (id === 'room-data') {
    return (
      <svg viewBox="0 0 120 60" className="h-14 w-28" aria-hidden>
        {[0, 1, 2, 3].map((k) => <line key={k} x1="6" x2="114" y1={12 + k * 13} y2={12 + k * 13} stroke="#34302b" />)}
        {[38, 70, 52, 90].map((w, k) => <rect key={k} x="6" y={5 + k * 13} width={w} height="5" fill={tint} opacity={0.9 - k * 0.15} />)}
      </svg>
    );
  }
  return <img src="/images/movigo-retailer-vehicles.jpg" alt="" width={540} height={705} loading="lazy" decoding="async" className="h-20 w-auto border border-joint object-cover object-top" />;
}

function Corridor() {
  return (
    <Chapter id="corridor" title="Four rooms" intro="Each door opens on one kind of work. Go through in order, or pick a room." width="lg:max-w-none">
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {rooms.map((r) => (
          <li key={r.id}>
            <a href={`#${r.id}`} className="doorway" style={{ ['--tint' as string]: r.tint }}>
              <DoorPreview id={r.id} tint={r.tint} />
              <span className="sign mt-auto pt-10" style={{ color: r.tint }}>{roomProjects(r).length} projects</span>
              <span className="serif-display mt-2 text-[1.65rem] text-bone">{r.title}</span>
              <span className="ui mt-2 text-stone">{r.line}</span>
              <span className="ui mt-4 font-semibold text-bone"><span className="link">Enter the room</span></span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/projects" className="btn btn-line">Search all {projects.length} projects</Link>
        <Link to="/projects?cases=1" className="btn btn-line">Case studies only</Link>
      </div>
    </Chapter>
  );
}

/* ------------------------------------------------------------ Study */

function Study() {
  return (
    <Chapter id="study" title="The study" intro="Where the work was done, and what backs it." width="lg:max-w-none">
      <div className="mt-12 grid gap-12 xl:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] xl:gap-14">
        <div>
          <p className="fine text-brass">Since {formatMonth(currentRole.start)}</p>
          <h3 className="serif-display mt-1 text-[clamp(1.9rem,3vw,2.5rem)] text-bone">{currentRole.title}</h3>
          <p className="ui mt-1 font-semibold text-bone">{currentRole.org}</p>
          <ol className="ui mt-5 space-y-1 border-l-2 border-brass pl-4">
            {currentRole.titles!.map((t) => (
              <li key={t.title} className="text-stone"><span className="text-bone">{t.title}</span>, from {formatMonth(t.from)}</li>
            ))}
          </ol>
          <p className="ui mt-6 text-bone/85">{currentRole.summary}</p>
          <ul className="ui mt-5 space-y-2 text-bone/85">
            {currentRole.work!.slice(0, 3).map((w) => (
              <li key={w} className="flex gap-3"><span className="mt-[0.5rem] inline-block h-2 w-2 shrink-0 bg-brass" aria-hidden />{w}</li>
            ))}
          </ul>
        </div>
        <div>
          <Timeline roles={roles} />
          <Link to="/experience" className="btn btn-line mt-8">Full experience, with documents</Link>
        </div>
      </div>

      <div className="mt-20 grid gap-12 border-t border-joint pt-10 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <h3 className="fine text-stone">Education</h3>
          <p className="serif-display mt-3 text-[1.5rem] text-bone">{education.degree}</p>
          <p className="ui mt-2 text-bone/85">{education.school}</p>
          <p className="ui mt-1 text-stone">{education.years}. {education.grade}.</p>
          {inProgress.map((i) => (
            <p key={i.title} className="ui mt-6 border-l-2 border-glass pl-4 text-bone">
              <span className="font-semibold">{i.title}.</span> <span className="text-stone">{i.detail}</span>
            </p>
          ))}
        </div>
        <div>
          <h3 className="fine text-stone">Certificates</h3>
          <ul className="mt-3">
            {credentials.map((c) => (
              <li key={c.title} className="ui grid grid-cols-[1fr_auto] gap-x-4 border-b border-joint py-2">
                <span>
                  {c.href ? (
                    <a href={c.href} target="_blank" rel="noopener noreferrer" className="link font-semibold text-bone">
                      {c.title}<span className="sr-only"> (certificate, opens in a new tab)</span>
                    </a>
                  ) : (
                    <span className="font-semibold text-bone">{c.title}</span>
                  )}
                  <span className="block text-stone">{c.issuer}</span>
                </span>
                {c.date && <span className="whitespace-nowrap text-stone">{c.date}</span>}
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2 xl:col-span-1">
          <h3 className="fine text-stone">Skills, each backed by projects</h3>
          <dl className="mt-3 space-y-4">
            {skillGroups.slice(0, 5).map((g) => (
              <div key={g.id}>
                <dt className="ui font-semibold text-bone">{g.title}</dt>
                <dd className="ui mt-0.5 text-stone">{g.skills.slice(0, 4).map((s) => s.name).join('; ')}</dd>
              </div>
            ))}
          </dl>
          <a href={profile.resume} className="btn btn-brass mt-7" download><Download size={17} aria-hidden />Download résumé</a>
        </div>
      </div>
    </Chapter>
  );
}

/* ------------------------------------------------------------ Courtyard */

function Courtyard() {
  const external = [
    ['GitHub', profile.github],
    ['LinkedIn', profile.linkedin],
  ];
  return (
    <section id="courtyard" aria-labelledby="courtyard-title" className="relative z-10 flex min-h-[100svh] items-end pb-20 pt-28">
      <div className="shell lg:pr-52">
        <div className="read-panel -mx-4 px-4 py-8 sm:mx-0 sm:px-6 lg:max-w-[44rem] lg:p-0">
          <h2 id="courtyard-title" className="serif-display text-[clamp(2.6rem,6vw,5rem)] text-bone">Open to AI, data and software roles</h2>
          <p className="mt-6 max-w-[36rem] font-sans text-[clamp(1.05rem,1.4vw,1.25rem)] leading-snug text-bone/85">{profile.availability}.</p>
          <a href={`mailto:${profile.email}`} className="serif-display mt-10 inline-block break-all text-[clamp(1.5rem,3vw,2.4rem)] text-brass no-underline hover:underline">
            {profile.email}
          </a>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href={profile.resume} className="btn btn-brass" download><Download size={17} aria-hidden />Download résumé</a>
            <Link to="/contact" className="btn btn-line">Send a message</Link>
          </div>
          <ul className="ui mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {external.map(([label, href]) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-bone">
                  <span className="link">{label}</span><ArrowUpRight size={15} aria-hidden /><span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
            <li className="text-stone">{profile.location}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [active, setActive] = useState(0);
  return (
    <div className="home relative bg-soot text-bone">
      <ResidenceBackdrop onChapter={setActive} name={NAME.toUpperCase()} line={DISCIPLINES.toUpperCase()} frames={FRAME_TITLES} />
      <ChapterRail active={active} />
      <Arrival />
      <Entrance />
      <Gallery />
      <Corridor />
      <MachineLearningRoom />
      <AgentsRoom />
      <DataRoom />
      <SoftwareRoom />
      <Study />
      <Courtyard />
    </div>
  );
}
