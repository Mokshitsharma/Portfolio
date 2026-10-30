import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Download } from 'lucide-react';
import { currentRole, formatMonth, formatRange, internships, roles } from '../data/experience';
import { credentials, education, inProgress, profile } from '../data/profile';
import { projects } from '../data/projects';
import { skillGroups } from '../data/skills';
import { Timeline } from '../components/home/Evidence';
import { CredentialWall, EducationFrame } from '../components/records';
import ProjectMap from '../components/home/ProjectMap';
import Story from '../components/home/Story';
import SelectedWork from '../components/home/SelectedWork';
import { NamanFetch } from '../components/home/Figures';
import { openAssistant } from '../agent/bus';

// The home page tells one story (docs/redesign/DESIGN.md): who I am (the opening scenes), what I work on (the
// notes drawn onto the figure), what I have built (Naman's map of every project), how those systems work (six
// selected systems followed step by step), then where I did it (experience) and what backs it (education,
// skills, credentials).

function Section({ id, title, intro, children, className = '' }: { id: string; title: string; intro?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`py-24 md:py-28 ${className}`}>
      <div className="shell">
        <h2 id={`${id}-title`} className="display text-[clamp(2.2rem,4.6vw,3.9rem)] text-charcoal">{title}</h2>
        {intro && <p className="mt-4 max-w-[38rem] text-[1.125rem] leading-[1.6] text-slate">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

function MapSection() {
  return (
    <section id="map" aria-labelledby="map-title" className="scroll-mt-16 border-t border-seam pb-24 pt-20">
      <div className="shell">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-8">
          <div>
            <h2 id="map-title" className="display text-[clamp(2.2rem,4.6vw,3.9rem)] text-charcoal">The map</h2>
            <p className="mt-4 max-w-[36rem] text-[1.125rem] leading-[1.6] text-slate">
              All {projects.length} projects by area. Open an area, then a project; those marked Deep dive have their architecture drawn out.
            </p>
          </div>
          <NamanFetch />
        </div>
        <div className="reveal"><ProjectMap /></div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <Section id="experience" title="Where I did it" intro="One job and a run of internships, from data analysis to AI.">
      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <p className="label text-brass">Since {formatMonth(currentRole.start)}</p>
          <h3 className="headline mt-2 text-[clamp(1.7rem,2.8vw,2.3rem)] text-charcoal">{currentRole.title}</h3>
          <p className="ui mt-1 font-semibold text-charcoal">{currentRole.org}, {currentRole.place}</p>
          <ol className="ui mt-5 space-y-1 border-l-2 border-brass pl-4">
            {currentRole.titles!.map((t) => (
              <li key={t.title} className="text-slate"><span className="text-charcoal">{t.title}</span>, from {formatMonth(t.from)}</li>
            ))}
          </ol>
          <p className="mt-6 text-[1.0625rem] leading-[1.6] text-charcoal/85">{currentRole.summary}</p>
          <Link to="/projects/movigo" className="btn btn-line mt-7">The Movigo case study</Link>
        </div>
        <dl className="exp-areas">
          {currentRole.work!.map((w, i) => (
            <div key={w} className="exp-area">
              <dt className="label text-brass">{currentRole.workAreas?.[i]}</dt>
              <dd className="mt-1 text-[1.0625rem] leading-[1.55] text-charcoal">{w}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-20 grid gap-12 border-t border-seam pt-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <h3 className="headline text-[1.6rem] text-charcoal">Internships</h3>
          <div className="mt-6"><Timeline roles={roles} /></div>
          <Link to="/experience" className="btn btn-line mt-8">Every role, with its documents</Link>
        </div>
        <ul className="divide-y divide-seam border-y border-seam">
          {internships.filter((r) => r.summary).map((r) => (
            <li key={r.id} className="grid gap-1 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
              <p className="fine text-slate">{formatRange(r.start, r.end)}</p>
              <div>
                <p className="font-sans font-semibold text-charcoal">{r.title}, {r.org}</p>
                <p className="ui mt-1 text-charcoal/80">{r.summary}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function Foundations() {
  return (
    <Section id="foundations" title="What backs it" intro="The degree, the skills each tied to projects, and the certificates." className="bg-limestone">
      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
        <div>
          <EducationFrame />
          {inProgress.map((i) => (
            <p key={i.title} className="ui mt-6 border-l-2 border-sky pl-4 text-charcoal">
              <span className="font-semibold">{i.title}.</span> <span className="text-slate">{i.detail}</span>
            </p>
          ))}
        </div>
        <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
          {skillGroups.map((g) => (
            <div key={g.id}>
              <dt className="font-sans text-[1.0625rem] font-semibold text-charcoal">{g.title}</dt>
              <dd className="ui mt-1 text-slate">{g.skills.map((s) => s.name).join('; ')}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="mt-16 border-t border-seam pt-10">
        <h3 className="headline text-[1.6rem] text-charcoal">Certificates</h3>
        <p className="ui mt-1 text-slate">Select one to see its record.</p>
        <CredentialWall items={credentials} className="mt-6 xl:!grid-cols-3" />
      </div>
    </Section>
  );
}

function Invitation() {
  const external = [['GitHub', profile.github], ['LinkedIn', profile.linkedin]];
  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-charcoal py-24 text-ivory md:py-32">
      <div className="shell">
        <h2 id="contact-title" className="display max-w-[16ch] text-[clamp(2.4rem,6vw,4.75rem)]">Open to AI, ML and data roles</h2>
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
      <Story />
      <MapSection />
      <SelectedWork />
      <Experience />
      <Foundations />
      <Invitation />
    </div>
  );
}
