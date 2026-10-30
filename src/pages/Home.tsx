import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Download } from 'lucide-react';
import { currentRole, formatMonth, roles } from '../data/experience';
import { credentials, education, inProgress, pet, portrait, profile, type Photo } from '../data/profile';
import { projects } from '../data/projects';
import { domains, galleryOrder, skillsFor } from '../data/domains';
import { Timeline } from '../components/home/Evidence';
import { CredentialWall, EducationFrame } from '../components/records';
import { ProjectLink } from '../components/home/Rooms';
import ProjectMap from '../components/home/ProjectMap';
import { openAssistant } from '../agent/bus';

// The home page is a short sequence of drawing plates (docs/redesign/DESIGN.md): Fig. 1 introduces me with
// annotations that lead to the work behind them, Fig. 2 is my pet, whose leader line runs down into the map of every
// project. Below the map: areas of work, experience and credentials, contact. Every annotation links to evidence.

// Annotations around the portrait, in percentages of the plate: where the note sits (y on its side) and the point on
// the frame its leader line ends at.
const NOTES: { side: 'l' | 'r'; y: number; at: [number, number]; title: string; text: string; to: string }[] = [
  { side: 'l', y: 14, at: [36, 24], title: 'Agents that ask before they act', text: 'Naman, SettleAI, ToolForge: LangGraph, MCP, approval steps', to: '/projects/naman' },
  { side: 'l', y: 58, at: [36, 66], title: 'Models with readable reasons', text: 'CricXAI: ROC-AUC 0.749, SHAP for every recommendation', to: '/projects/cricxai' },
  { side: 'r', y: 8, at: [64, 18], title: 'A live delivery platform', text: 'Movigo: the only engineer, backend to both store apps', to: '/projects/movigo' },
  { side: 'r', y: 44, at: [64, 50], title: 'Data that feeds decisions', text: 'ETL into Power BI, pandas and SQL analyses', to: '/projects?category=data' },
  { side: 'r', y: 76, at: [64, 82], title: 'AI and Data Science', text: 'Integrated B.Tech + M.Tech, DAVV Indore', to: '/about' },
];

function Plate({ photo, label, className = '' }: { photo: Photo | null; label: string; className?: string }) {
  return (
    <div className={`fig-frame ${className}`}>
      {photo ? (
        <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} decoding="async" />
      ) : (
        <div className="fig-empty"><span className="fine bg-white px-2 py-1 text-slate">{label}</span></div>
      )}
    </div>
  );
}

function Section({ id, title, intro, children, className = '' }: { id: string; title: string; intro?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`py-20 md:py-24 ${className}`}>
      <div className="shell">
        <h2 id={`${id}-title`} className="headline text-[clamp(2rem,4vw,3.25rem)] text-charcoal">{title}</h2>
        {intro && <p className="ui mt-3 max-w-[36rem] text-slate">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Fig. 1 */
function Introduction() {
  return (
    <section id="intro" aria-labelledby="hero-title" className="fig-1 relative pb-16 pt-24 md:pb-20 md:pt-28">
      <div className="shell grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-8">
        <div className="[container-type:inline-size]">
          <h1 id="hero-title" className="display text-[clamp(3.25rem,24cqi,7.5rem)] text-charcoal">
            Mokshit<br />Sharma
          </h1>
          <p className="mt-6 font-sans text-[clamp(1.0625rem,1.5vw,1.25rem)] font-medium leading-snug text-charcoal">
            {profile.currentRole} at {profile.currentOrgShort}, {profile.location}.
          </p>
          <p className="mt-3 max-w-[34rem] text-[1.125rem] leading-[1.6] text-charcoal/85">{profile.intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#map" className="btn btn-brass">Explore my projects</a>
            <button type="button" className="btn btn-line" onClick={() => openAssistant()}>Ask my AI</button>
            <Link to="/experience" className="ui ml-1 font-semibold text-charcoal"><span className="link">View experience</span></Link>
          </div>
        </div>

        <figure className="fig-1-plate">
          {/* Wide screens: notes either side, leader lines into the frame. */}
          <div className="relative hidden aspect-[7/6] md:block">
            <div className="absolute inset-y-0 left-[36%] right-[36%]">
              <Plate photo={portrait} label="Portrait to be added" className="!aspect-auto h-full" />
            </div>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
              {NOTES.map((n) => {
                const x0 = n.side === 'l' ? 27 : 73;
                const y0 = n.y + 2.5;
                return <path key={n.title} pathLength={1} className="leader" d={`M${x0} ${y0} L${n.side === 'l' ? x0 + 3 : x0 - 3} ${y0} L${n.at[0]} ${n.at[1]}`} />;
              })}
            </svg>
            {NOTES.map((n) => (
              <span key={n.title} className="absolute h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-charcoal" style={{ left: `${n.at[0]}%`, top: `${n.at[1]}%` }} aria-hidden />
            ))}
            {NOTES.map((n) => (
              <Link key={n.title} to={n.to} className={`note absolute w-[26%] ${n.side === 'l' ? 'left-0 text-right' : 'right-0'}`} style={{ top: `${n.y}%` }}>
                <span className="note-title">{n.title}</span>
                <span className="note-text">{n.text}</span>
              </Link>
            ))}
          </div>
          {/* Phones: the plate, then the notes as a keyed list. */}
          <div className="md:hidden">
            <Plate photo={portrait} label="Portrait to be added" className="mx-auto max-w-[16rem]" />
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
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Fig. 2 */
function Companion() {
  return (
    <section aria-labelledby="pet-title" className="relative pt-10 md:pt-16">
      <div className="shell grid gap-8 md:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] md:items-end">
        <figure className="fig-2-plate w-full max-w-[16rem] md:max-w-[20rem]">
          <Plate photo={pet} label="Photo of my pet to be added" />
          <figcaption className="fig-caption"><span>Fig. 2</span><span>{pet ? pet.name : 'My pet'}</span></figcaption>
        </figure>
        <div className="pb-2">
          <h2 id="pet-title" className="headline text-[clamp(1.75rem,3.4vw,2.6rem)] text-charcoal">{pet ? pet.caption : 'Company while I build.'}</h2>
          <p className="ui mt-3 max-w-[30rem] text-slate">
            The rest of this page is the work: every project on one map, then the experience and credentials behind it.
          </p>
        </div>
      </div>
      {/* The leader from Fig. 2 runs on into the map's root. */}
      <div className="shell"><span className="map-wire ml-6 block h-16 w-px lg:mx-auto" aria-hidden /></div>
    </section>
  );
}

/* ------------------------------------------------------------ Map */
function MapSection() {
  return (
    <section id="map" aria-labelledby="map-title" className="relative pb-24">
      <div className="shell">
        <div className="mb-8 lg:text-center">
          <h2 id="map-title" className="headline text-[clamp(2rem,4vw,3.25rem)] text-charcoal">Every project, by area</h2>
          <p className="ui mt-3 max-w-[38rem] text-slate lg:mx-auto">
            Open an area to see its projects. Projects marked Deep dive have a page with their architecture; the rest open in the archive.
          </p>
        </div>
        <ProjectMap />
        <div className="mt-10 flex flex-wrap gap-3 lg:justify-center">
          <Link to="/projects" className="btn btn-line">Search all {projects.length} projects</Link>
          <Link to="/projects/naman#architecture" className="btn btn-line">See an architecture walkthrough</Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Areas of work */
function Areas() {
  const list = galleryOrder.map((id) => domains.find((d) => d.id === id)!);
  return (
    <Section id="areas" title="Areas of work" intro="Each skill is named as it is on the Skills page, with one measured result and the projects behind it." className="border-t border-seam bg-limestone">
      <div className="mt-10 grid gap-px border border-seam bg-seam md:grid-cols-2 xl:grid-cols-3">
        {list.map((d) => (
          <article key={d.id} aria-labelledby={`${d.id}-t`} className="flex flex-col bg-ivory p-6">
            <h3 id={`${d.id}-t`} className="headline text-[1.375rem] text-charcoal">{d.title}</h3>
            <p className="ui mt-1 text-slate">{d.line}</p>
            <p className="ui mt-4 border-l-2 border-brass pl-3 text-charcoal">{d.evidence}</p>
            <ul className="mt-4 flex flex-wrap gap-y-1" aria-label="Skills">
              {skillsFor(d).map((s) => <li key={s} className="tag">{s}</li>)}
            </ul>
            <ul className="fine mt-auto flex flex-wrap gap-x-4 gap-y-1.5 pt-5" aria-label={`${d.title} projects`}>
              {d.projects.map((s) => <li key={s}><ProjectLink slug={s} /></li>)}
            </ul>
          </article>
        ))}
        <div className="flex flex-col justify-end bg-ivory p-6">
          <p className="ui text-slate">Every skill, each with the projects that show it.</p>
          <Link to="/skills" className="btn btn-line mt-4 self-start">All skills</Link>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------ Experience and credentials */
function Record() {
  return (
    <Section id="experience" title="Experience and credentials">
      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        <div>
          <p className="fine text-brass">Since {formatMonth(currentRole.start)}</p>
          <h3 className="headline mt-1 text-[clamp(1.6rem,2.6vw,2.1rem)] text-charcoal">{currentRole.title}</h3>
          <p className="ui mt-1 font-semibold text-charcoal">{currentRole.org}</p>
          <ol className="ui mt-5 space-y-1 border-l-2 border-brass pl-4">
            {currentRole.titles!.map((t) => (
              <li key={t.title} className="text-slate"><span className="text-charcoal">{t.title}</span>, from {formatMonth(t.from)}</li>
            ))}
          </ol>
          <p className="ui mt-6 text-charcoal/85">{currentRole.summary}</p>
          <ul className="ui mt-5 space-y-2 text-charcoal/85">
            {currentRole.work!.slice(0, 3).map((w) => (
              <li key={w} className="flex gap-3"><span className="mt-[0.55rem] inline-block h-1.5 w-1.5 shrink-0 bg-charcoal" aria-hidden />{w}</li>
            ))}
          </ul>
        </div>
        <div>
          <Timeline roles={roles} />
          <Link to="/experience" className="btn btn-line mt-8">Full experience, with documents</Link>
        </div>
      </div>
      <div className="mt-16 grid gap-8 border-t border-seam pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-start">
        <div>
          <h3 className="headline text-[1.5rem] text-charcoal">Education</h3>
          <div className="mt-4"><EducationFrame /></div>
          {inProgress.map((i) => (
            <p key={i.title} className="ui mt-6 border-l-2 border-sky pl-4 text-charcoal">
              <span className="font-semibold">{i.title}.</span> <span className="text-slate">{i.detail}</span>
            </p>
          ))}
        </div>
        <div>
          <h3 className="headline text-[1.5rem] text-charcoal">Certificates</h3>
          <p className="ui mt-1 text-slate">Select one to see its record.</p>
          <CredentialWall items={credentials} className="mt-4 xl:!grid-cols-2" />
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------ Contact */
function Invitation() {
  const external = [['GitHub', profile.github], ['LinkedIn', profile.linkedin]];
  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-charcoal py-20 text-ivory md:py-28">
      <div className="shell">
        <h2 id="contact-title" className="display max-w-[16ch] text-[clamp(2.4rem,6vw,4.75rem)]">Open to AI, data and software roles</h2>
        <p className="mt-6 max-w-[36rem] font-sans text-[clamp(1.05rem,1.4vw,1.25rem)] leading-snug text-ivory/80">{profile.availability}.</p>
        <a href={`mailto:${profile.email}`} className="headline mt-8 inline-block break-all text-[clamp(1.35rem,3vw,2.2rem)] text-ivory underline decoration-1 underline-offset-[0.2em] hover:decoration-2">
          {profile.email}
        </a>
        <div className="mt-9 flex flex-wrap gap-3">
          <a href={profile.resume} className="btn bg-ivory text-charcoal hover:bg-brass-fill" download><Download size={17} aria-hidden />Download résumé</a>
          <Link to="/contact" className="btn border-ivory/40 text-ivory hover:border-ivory">Send a message</Link>
          <button type="button" className="btn border-ivory/40 text-ivory hover:border-ivory" onClick={() => openAssistant()}>Ask my AI</button>
        </div>
        <ul className="ui mt-8 flex flex-wrap gap-x-6 gap-y-2">
          {external.map(([label, href]) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-ivory">
                <span className="link">{label}</span><ArrowUpRight size={15} aria-hidden /><span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
          <li className="text-ivory/70">{profile.location}</li>
          <li className="text-ivory/70">{education.grade}</li>
        </ul>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="home relative overflow-x-clip">
      <Introduction />
      <Companion />
      <MapSection />
      <Areas />
      <Record />
      <Invitation />
    </div>
  );
}
