import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Download } from 'lucide-react';
import { caseStudyBySlug } from '../data/caseStudies';
import { currentRole, formatMonth, roles } from '../data/experience';
import { credentials, education, inProgress, profile } from '../data/profile';
import { projectBySlug, projects } from '../data/projects';
import { skillGroups } from '../data/skills';
import { domains } from '../data/domains';
import { miniFlows } from '../data/visuals';
import EngineBackdrop from '../components/home/EngineBackdrop';
import ChapterRail from '../components/home/ChapterRail';
import ProjectMap from '../components/home/ProjectMap';
import { Benchmark, Calibration, KindKey, Pipeline, Timeline, type StageKind } from '../components/home/Evidence';

// The home page is one walk through an engine (see docs/redesign/DESIGN.md). Each chapter is an ordinary
// section; the WebGL engine behind them changes shape with the scroll and is never needed to read anything.

const p = (slug: string) => projectBySlug(slug)!;
const settle = caseStudyBySlug('settleai')!;

// Where a project name leads: its case study if it has one, otherwise the archive filtered to it.
const projectHref = (slug: string) => (p(slug).caseStudy ? `/projects/${slug}` : `/projects?q=${encodeURIComponent(p(slug).name)}`);

function Chapter({ id, title, intro, children, width = 'lg:max-w-[40rem]' }: { id: string; title: ReactNode; intro?: ReactNode; children: ReactNode; width?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative z-10 py-28 md:py-36">
      <div className="shell lg:pr-48">
        <div className={`read-panel -mx-4 px-4 py-8 sm:mx-0 sm:px-6 lg:p-0 ${width}`}>
          <h2 id={`${id}-title`} className="headline max-w-[44rem] text-[clamp(2.6rem,5.6vw,4.75rem)] text-snow">{title}</h2>
          {intro && <p className="mt-5 max-w-[38rem] font-sans text-[clamp(1.1rem,1.5vw,1.3rem)] leading-snug text-snow/85">{intro}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}

function ProjectLink({ slug }: { slug: string }) {
  return <Link to={projectHref(slug)} className="link text-snow">{p(slug).name}</Link>;
}

/* ------------------------------------------------------------ Introduction */

function Opening() {
  return (
    <section id="opening" aria-labelledby="hero-title" className="relative z-10 flex min-h-[100svh] items-end pb-14 pt-28 md:pb-20">
      <div className="shell lg:pr-48">
        <p className="ui text-ash">{profile.currentRole}, {profile.currentOrgShort}</p>
        <h1 id="hero-title" className="hero-name hero-intro mt-3 text-[clamp(4.25rem,14vw,12.5rem)] text-snow">
          Mokshit<br />Sharma
        </h1>
        <p className="mt-8 max-w-[37rem] font-sans text-[clamp(1.15rem,1.75vw,1.5rem)] font-medium leading-snug text-snow">
          I build AI systems in which the model proposes and code decides, and I run a live delivery platform in Indore
          as its only engineer.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a href="#map" className="btn btn-volt">Explore the project map</a>
          <a href={profile.resume} className="btn btn-line" download>
            <Download size={17} aria-hidden />Download résumé
          </a>
        </div>
        <div className="mt-12 flex max-w-[52rem] flex-col gap-3 border-t border-seam pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="fine max-w-[24rem] text-ash">The engine behind this page uses the colours of the diagrams below.</p>
          <KindKey kinds={['model', 'rule', 'human']} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Domains */

function Domains() {
  // Shipped software at the top, raw data at the bottom: the order of the engine's layers.
  const stack = [...domains].reverse();
  return (
    <Chapter
      id="domains"
      title="Data in at the bottom, products out at the top"
      intro="Five areas of work, stacked the way data moves through them. Each is backed by five projects you can open."
      width="lg:max-w-[40rem]"
    >
      <ol className="relative mt-12 border-l border-seam pl-6 sm:pl-8">
        <span className="absolute -left-[5px] -top-1 h-2.5 w-2.5 rotate-45 border-l border-t border-ion" aria-hidden />
        {stack.map((d) => (
          <li key={d.id} className="border-t border-seam py-6 first:border-t-0 first:pt-0">
            <h3 className="headline text-[1.75rem] text-snow">{d.title}</h3>
            <p className="ui mt-1.5 text-ash">{d.line}</p>
            <p className="ui mt-3 text-snow/90">{d.evidence}</p>
            <ul className="fine mt-3 flex flex-wrap gap-x-4 gap-y-1.5" aria-label={`${d.title} projects`}>
              {d.projects.map((s) => (
                <li key={s}><ProjectLink slug={s} /></li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Chapter>
  );
}

/* ------------------------------------------------------------ Project map */

function MapChapter() {
  return (
    <Chapter
      id="map"
      title="Every project, on one map"
      intro={`All ${projects.length} published projects, from a production platform to first notebooks. Point at a node, or pick a domain to see the projects behind it.`}
      width="lg:max-w-none"
    >
      <div className="mt-10"><ProjectMap /></div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/projects" className="btn btn-line">Search all {projects.length} projects</Link>
        <Link to="/projects?cases=1" className="btn btn-line">Case studies only</Link>
      </div>
    </Chapter>
  );
}

/* ------------------------------------------------------------ Featured systems */

function System({ id, area, title, slug, children, visual }: { id: string; area: string; title: string; slug: string; children: ReactNode; visual: ReactNode }) {
  return (
    <article aria-labelledby={`${id}-t`} className="grid gap-10 border-t border-seam pt-10 xl:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] xl:gap-14">
      <div>
        <p className="fine text-ash">{area}</p>
        <h3 id={`${id}-t`} className="headline mt-1 text-[clamp(2rem,3.4vw,2.9rem)] text-snow">{title}</h3>
        {children}
        <Link to={`/projects/${slug}`} className="btn btn-line mt-7">Read the {title} case study</Link>
      </div>
      <div className="self-center">{visual}</div>
    </article>
  );
}

function Systems() {
  const settleStages = settle.flow!.stages.map((s) => ({ label: s.label, kind: (s.kind ?? 'io') as StageKind }));
  const shot = settle.figures![0];
  return (
    <Chapter
      id="systems"
      title="Featured systems"
      intro="Five projects with the most behind them: a production platform, two agent systems, a model and an engine, each shown with its own evidence."
      width="lg:max-w-none"
    >
      <div className="mt-14 space-y-20">
        <System
          id="movigo"
          area="Production platform, current employer"
          title="Movigo"
          slug="movigo"
          visual={
            <div className="grid max-w-[34rem] grid-cols-2 items-end gap-4 sm:gap-6">
              <img src="/images/movigo-retailer-vehicles.jpg" alt="Movigo retailer app home screen with a search bar, the coins wallet banner and six vehicle types to book." width={540} height={705} loading="lazy" decoding="async" className="block h-auto w-full border border-seam" />
              <img src="/images/movigo-retailer-coins.jpg" alt="Movigo retailer app coins wallet screen showing available coins, a weekly milestone and how coins are redeemed." width={540} height={1005} loading="lazy" decoding="async" className="block h-auto w-full border border-seam" />
            </div>
          }
        >
          <p className="ui mt-4 text-[1.0625rem] text-snow/85">
            A delivery marketplace connecting retailers with two-, three- and four-wheeler drivers. I rebuilt it after an
            outsourced team delivered designs but no software, and I run the backend, both apps and the operations console.
          </p>
          <dl className="mt-7 grid grid-cols-2 gap-x-8 gap-y-5">
            {[['400+', 'API routes'], ['40', 'data models'], ['3', 'store listings'], ['1K+', 'installs per app on Google Play']].map(([v, l]) => (
              <div key={l} className="stat"><dt>{l}</dt><dd>{v}</dd></div>
            ))}
          </dl>
          <ul className="ui mt-7 space-y-2.5 border-l-2 border-ion pl-4 text-snow/90">
            <li>One conditional database write makes exactly one of several accepting drivers win a booking.</li>
            <li>Pricing, zones, surge and dispatch radius change from the console, with no app release.</li>
            <li>One road-distance matrix call per booking instead of one per driver.</li>
          </ul>
          <ul className="fine mt-5 flex flex-wrap gap-x-5 gap-y-1.5">
            {p('movigo').links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-snow">
                  <span className="link">{l.label}</span><ArrowUpRight size={14} aria-hidden /><span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </System>

        <System
          id="settle"
          area="Agentic AI, PayPal AI Hackathon 2026 entry"
          title="SettleAI"
          slug="settleai"
          visual={
            <figure className="border border-seam bg-carbon">
              <img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} loading="lazy" decoding="async" className="block h-auto w-full" />
              <figcaption className="fine px-3 py-2 text-ash">{shot.caption}</figcaption>
            </figure>
          }
        >
          <p className="ui mt-4 text-[1.0625rem] text-snow/85">{settle.lede}</p>
          <p className="headline mt-6 text-2xl text-snow">No agent holds a tool that can move money.</p>
          <div className="mt-6"><Pipeline stages={settleStages} /></div>
          <div className="mt-5"><KindKey /></div>
          <ul className="ui mt-6 grid gap-x-8 gap-y-2 text-snow/90 sm:grid-cols-2">
            <li>146 unit, integration and end-to-end tests.</li>
            <li>A 50-way concurrency test never overspends escrow.</li>
            <li>Receipts verify offline in 81 ms; one changed byte breaks them.</li>
            <li>In its evaluation: 0% false releases, every tampered proof caught.</li>
          </ul>
        </System>

        <System id="cricxai" area="Machine learning" title="CricXAI" slug="cricxai" visual={<div className="border border-seam bg-carbon/80 p-5"><Calibration /></div>}>
          <p className="ui mt-4 text-[1.0625rem] text-snow/85">{p('cricxai').summary}</p>
          <dl className="mt-7 flex flex-wrap gap-x-12 gap-y-5">
            {[['0.749', 'dismissal ROC-AUC'], ['0.867', 'runs, mean absolute error'], ['1.36M', 'deliveries']].map(([v, l]) => (
              <div key={l} className="stat"><dt>{l}</dt><dd>{v}</dd></div>
            ))}
          </dl>
          <p className="ui mt-6 text-snow/90">
            Features are leakage-safe and validation is grouped by match. The Parquet store is about 15 times smaller than
            the CSV and loads about 10 times faster. 71 pytest tests.
          </p>
        </System>

        <System
          id="naman"
          area="Agentic AI"
          title="Naman"
          slug="naman"
          visual={
            <div className="border border-seam bg-carbon/80 p-6">
              <p className="fine text-ash">One request through the agent graph</p>
              <div className="mt-5"><Pipeline stages={miniFlows.naman as { label: string; kind: StageKind }[]} /></div>
              <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-seam pt-6">
                <div className="stat"><dt>outreach emails with an unsupported claim, before a code verifier</dt><dd>48 of 49</dd></div>
                <div className="stat"><dt>after the verifier</dt><dd className="!text-ion">0 of 21</dd></div>
              </dl>
            </div>
          }
        >
          <p className="ui mt-4 text-[1.0625rem] text-snow/85">{p('naman').summary}</p>
          <p className="ui mt-4 text-snow/90">
            Approval is its own LangGraph node, so after a pause every tool runs exactly once. 164 pytest tests.
          </p>
        </System>

        <System id="routecore" area="Algorithms" title="RouteCore" slug="routecore" visual={<div className="border border-seam bg-carbon/80 p-5"><Benchmark /></div>}>
          <p className="ui mt-4 text-[1.0625rem] text-snow/85">{p('routecore').summary}</p>
          <p className="ui mt-4 text-snow/90">At 100,000 points the hand-built k-d tree is 408 times faster than brute force. 47 JUnit tests in 8 suites.</p>
        </System>
      </div>
    </Chapter>
  );
}

/* ------------------------------------------------------------ How I build */

const steps: { title: string; body: ReactNode }[] = [
  {
    title: 'Split the problem into stages',
    body: <>In <ProjectLink slug="toolforge" />, turning an API spec into a tool server takes seven stages, from reading the spec to a security audit, and each stage has one owner.</>,
  },
  {
    title: 'Decide who acts at each stage',
    body: <>A model proposes, code decides, a person approves. In <ProjectLink slug="settleai" /> agents scope jobs and judge proof, but only a guard in code can release a payout.</>,
  },
  {
    title: 'Make the critical write exact',
    body: <>In <ProjectLink slug="movigo" />, one conditional write settles a race between drivers: exactly one wins, and the others are told the job is gone.</>,
  },
  {
    title: 'Measure it, refusals included',
    body: <><ProjectLink slug="dociq" /> is evaluated on whether it refuses when the documents hold no answer: 11 of 11 retrieval hits and 1 of 1 correct refusal offline.</>,
  },
  {
    title: 'Build for the people who run it',
    body: <>Movigo’s operations team changes prices, zones and surge from the console. No setting waits on an app release.</>,
  },
  {
    title: 'Ship versions and keep improving',
    body: <>Customer churn went from a notebook to a SHAP prototype to <ProjectLink slug="customer-churn-xai" />, which explains each prediction in plain English.</>,
  },
];

function Approach() {
  return (
    <Chapter id="approach" title="How I build" intro="Six steps that run through the work, each shown in a real project." width="lg:max-w-[60rem]">
      <ol className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} className="border-t border-seam pt-5">
            <span className="label text-ion" aria-hidden>Step {i + 1}</span>
            <h3 className="headline mt-2 text-[1.5rem] text-snow">{s.title}</h3>
            <p className="ui mt-2.5 text-snow/80">{s.body}</p>
          </li>
        ))}
      </ol>
    </Chapter>
  );
}

/* ------------------------------------------------------------ Experience */

function Experience() {
  return (
    <Chapter id="experience" title="Experience" width="lg:max-w-none">
      <div className="mt-12 grid gap-12 xl:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] xl:gap-14">
        <div>
          <p className="fine text-ion">Since {formatMonth(currentRole.start)}</p>
          <h3 className="headline mt-1 text-[clamp(1.9rem,3vw,2.5rem)] text-snow">{currentRole.title}</h3>
          <p className="ui mt-1 font-semibold text-snow">{currentRole.org}</p>
          <ol className="ui mt-5 space-y-1 border-l-2 border-ion pl-4">
            {currentRole.titles!.map((t) => (
              <li key={t.title} className="text-ash"><span className="text-snow">{t.title}</span>, from {formatMonth(t.from)}</li>
            ))}
          </ol>
          <p className="ui mt-6 text-snow/85">{currentRole.summary}</p>
          <ul className="ui mt-5 space-y-2 text-snow/85">
            {currentRole.work!.slice(0, 3).map((w) => (
              <li key={w} className="flex gap-3"><span className="mt-[0.5rem] inline-block h-2 w-2 shrink-0 bg-ion" aria-hidden />{w}</li>
            ))}
          </ul>
        </div>
        <div>
          <Timeline roles={roles} />
          <Link to="/experience" className="btn btn-line mt-8">Full experience, with documents</Link>
        </div>
      </div>

      <div className="mt-20 grid gap-12 border-t border-seam pt-10 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <h3 className="fine text-ash">Education</h3>
          <p className="headline mt-3 text-[1.5rem] text-snow">{education.degree}</p>
          <p className="ui mt-2 text-snow/85">{education.school}</p>
          <p className="ui mt-1 text-ash">{education.years}. {education.grade}.</p>
          {inProgress.map((i) => (
            <p key={i.title} className="ui mt-6 border-l-2 border-iris pl-4 text-snow">
              <span className="font-semibold">{i.title}.</span> <span className="text-ash">{i.detail}</span>
            </p>
          ))}
        </div>
        <div>
          <h3 className="fine text-ash">Certificates</h3>
          <ul className="mt-3">
            {credentials.map((c) => (
              <li key={c.title} className="ui grid grid-cols-[1fr_auto] gap-x-4 border-b border-seam py-2">
                <span>
                  {c.href ? (
                    <a href={c.href} target="_blank" rel="noopener noreferrer" className="link font-semibold text-snow">
                      {c.title}<span className="sr-only"> (certificate, opens in a new tab)</span>
                    </a>
                  ) : (
                    <span className="font-semibold text-snow">{c.title}</span>
                  )}
                  <span className="block text-ash">{c.issuer}</span>
                </span>
                {c.date && <span className="whitespace-nowrap text-ash">{c.date}</span>}
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2 xl:col-span-1">
          <h3 className="fine text-ash">Skills, each backed by projects</h3>
          <dl className="mt-3 space-y-4">
            {skillGroups.slice(0, 5).map((g) => (
              <div key={g.id}>
                <dt className="ui font-semibold text-snow">{g.title}</dt>
                <dd className="ui mt-0.5 text-ash">{g.skills.slice(0, 4).map((s) => s.name).join('; ')}</dd>
              </div>
            ))}
          </dl>
          <Link to="/skills" className="ui mt-5 inline-flex font-semibold text-snow"><span className="link">Every skill, with the projects that show it</span></Link>
        </div>
      </div>
    </Chapter>
  );
}

/* ------------------------------------------------------------ Closing */

function Closing() {
  const external = [
    ['GitHub', profile.github],
    ['LinkedIn', profile.linkedin],
  ];
  return (
    <section id="closing" aria-labelledby="closing-title" className="relative z-10 flex min-h-[100svh] items-end pb-20 pt-28">
      <div className="shell lg:pr-48">
        <div className="read-panel -mx-4 px-4 py-8 sm:mx-0 sm:px-6 lg:max-w-[46rem] lg:p-0">
          <h2 id="closing-title" className="headline text-[clamp(2.6rem,6vw,5.25rem)] text-snow">Open to AI, data and software roles</h2>
          <p className="mt-6 max-w-[36rem] font-sans text-[clamp(1.1rem,1.5vw,1.3rem)] leading-snug text-snow/85">{profile.availability}.</p>
          <a href={`mailto:${profile.email}`} className="headline mt-10 inline-block break-all text-[clamp(1.5rem,3vw,2.4rem)] text-ion no-underline hover:underline">
            {profile.email}
          </a>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href={profile.resume} className="btn btn-volt" download><Download size={17} aria-hidden />Download résumé</a>
            <Link to="/contact" className="btn btn-line">Send a message</Link>
          </div>
          <ul className="ui mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {external.map(([label, href]) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-snow">
                  <span className="link">{label}</span><ArrowUpRight size={15} aria-hidden /><span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
            <li className="text-ash">{profile.location}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [active, setActive] = useState(0);
  return (
    <div className="home relative bg-void text-snow">
      <EngineBackdrop onChapter={setActive} />
      <ChapterRail active={active} />
      <Opening />
      <Domains />
      <MapChapter />
      <Systems />
      <Approach />
      <Experience />
      <Closing />
    </div>
  );
}
