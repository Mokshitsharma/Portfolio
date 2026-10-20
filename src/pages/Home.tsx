import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { caseStudyBySlug } from '../data/caseStudies';
import { currentRole, formatMonth, roles } from '../data/experience';
import { credentials, education, inProgress, profile } from '../data/profile';
import { categories, maturityLabel, projectBySlug, projects } from '../data/projects';
import { skillGroups } from '../data/skills';
import { miniFlows } from '../data/visuals';
import { cardFor } from '../data/cards';
import type { Maturity } from '../data/types';
import { categoryHex, maturityHeight } from '../scene/layout';
import ContactForm from '../components/ContactForm';
import CityBackdrop from '../components/home/CityBackdrop';
import ChapterRail from '../components/home/ChapterRail';
import { Links, StatusMark } from '../components/ui';
import { BenchmarkChart, CalibrationChart, KindLegend, LedgerDiagram, MiniFlow, RoleTimeline } from '../components/viz';

// The home page is one walk through a city at night (see docs/redesign/DESIGN.md). Each chapter is an ordinary
// section; the WebGL city behind them follows the scroll and is never needed to read anything.

const movigo = caseStudyBySlug('movigo')!;
const settle = caseStudyBySlug('settleai')!;
const p = (slug: string) => projectBySlug(slug)!;

function Chapter({ id, title, children, wide = false }: { id: string; title: string; children: ReactNode; wide?: boolean }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative z-10 flex min-h-[125vh] items-center py-24 md:py-32">
      <div className="shell">
        <div className={`chapter-panel -mx-4 px-4 py-8 sm:mx-0 sm:px-6 lg:p-0 ${wide ? 'lg:max-w-[46rem] xl:max-w-[52rem]' : 'lg:max-w-[38rem]'}`}>
          <h2 id={`${id}-title`} className="headline text-[clamp(2.5rem,5.5vw,4.5rem)] text-paper">{title}</h2>
          {children}
        </div>
      </div>
    </section>
  );
}

function AreaMark({ color, children }: { color: string; children: ReactNode }) {
  return (
    <p className="label mb-5 mt-4 flex items-center gap-3 text-haze">
      <span className="inline-block h-2.5 w-2.5" style={{ background: color }} aria-hidden />
      {children}
    </p>
  );
}

/* ------------------------------------------------------------ Opening */

function Opening() {
  const caseCount = projects.filter((x) => x.caseStudy).length;
  return (
    <section id="opening" aria-labelledby="hero-title" className="relative z-10 flex min-h-[100svh] items-end pb-14 pt-28 md:pb-20">
      <div className="shell">
        <h1 id="hero-title" className="hero-name hero-intro text-[clamp(4.5rem,15vw,13.5rem)] text-paper">
          Mokshit<br />Sharma
        </h1>
        <p className="mt-8 max-w-[36rem] font-sans text-[clamp(1.15rem,1.7vw,1.45rem)] font-medium leading-snug text-paper">
          {profile.currentRole} at {profile.currentOrgShort}, and the only engineer behind its live delivery platform in
          Indore. I also build AI agents that stop for code or a person before the risky step.
        </p>
        <p className="ui mt-4 max-w-[36rem] text-haze">{profile.availability}.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a href="#movigo" className="btn-sodium btn"><ArrowDown size={18} aria-hidden />See the work</a>
          <Link to="/projects" className="btn-ghost-night btn">Browse all {projects.length} projects</Link>
        </div>
        <p className="fine mt-10 text-haze">
          Scroll to follow one delivery through the work. {caseCount} projects have full case studies.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Movigo */

function Movigo() {
  const facts = [
    ['400+', 'API routes'],
    ['40', 'MongoDB models'],
    ['3', 'store listings'],
    ['1K+', 'installs per app on Google Play'],
  ];
  return (
    <Chapter id="movigo" title="Movigo">
      <AreaMark color={categoryHex.production}>Production system, current employer</AreaMark>
      <p className="font-sans text-[1.25rem] leading-snug text-paper">{movigo.lede}</p>
      <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-kerb pt-7">
        {facts.map(([v, l]) => (
          <div key={l} className="flex flex-col">
            <dt className="ui order-2 text-haze">{l}</dt>
            <dd className="headline order-1 text-5xl text-sodium">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="fine mt-4 text-haze">Counted from the backend source and the public store listings, October 2026.</p>
      <ul className="mt-9 space-y-3 border-l-2 border-sodium pl-5">
        <li className="ui text-paper">A conditional database write makes exactly one of several accepting drivers win a booking.</li>
        <li className="ui text-paper">Pricing settings are cached: more than 100 database reads a second fall to none within 60 seconds.</li>
        <li className="ui text-paper">One OSRM distance-matrix call per booking instead of one per driver.</li>
      </ul>
      <Links links={p('movigo').links} className="mt-9 flex-col !gap-2.5 text-paper" />
      <Link to="/projects/movigo" className="btn-sodium btn mt-9">Read the Movigo case study</Link>
    </Chapter>
  );
}

/* ------------------------------------------------------------ Agents */

const agentNotes: Record<string, string> = {
  toolforge: 'Fits a 102-endpoint spec into a 16,000-character prompt budget for free-tier models. 8 of 8 live PokéAPI calls passed.',
  naman: 'Outreach emails with an unsupported claim: 48 of 49 before a code verifier, 0 of 21 after.',
  voicedesk: 'Common requests take fast paths with no model call; each turn is measured against a 1.5-second round trip.',
  dociq: 'Hybrid BM25 and vector retrieval. Offline evaluation: 11 of 11 retrieval hits and 1 of 1 correct refusal.',
};

function Agents() {
  const shot = settle.figures![0];
  return (
    <Chapter id="agents" title="The model proposes, code decides" wide>
      <p className="mt-5 max-w-[38rem] font-sans text-[1.2rem] leading-snug text-paper">
        In each of these systems a language model is one stage. Exact checks run first, code makes the irreversible
        call, and a person approves the risky step.
      </p>
      <div className="mt-6"><KindLegend /></div>

      <article aria-labelledby="settle-title" className="mt-12 border-t border-kerb pt-8">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <h3 id="settle-title" className="headline text-4xl text-paper">SettleAI</h3>
          <StatusMark maturity="in-progress" tone="dark" className="text-sodium" />
          <span className="fine text-haze">PayPal AI Hackathon 2026</span>
        </div>
        <p className="ui mt-3 max-w-[38rem] text-[1.0625rem] text-haze">{settle.lede}</p>
        <p className="headline mt-6 border-l-2 border-signal-light pl-4 text-2xl text-paper">No agent holds a tool that can move money.</p>
        <ul className="ui mt-6 grid gap-x-8 gap-y-2 text-paper sm:grid-cols-2">
          <li>Receipts verify offline in 81 ms; one changed byte breaks them.</li>
          <li>A 50-way concurrency test never overspends escrow.</li>
          <li>146 unit, integration and end-to-end tests.</li>
          <li>In its evaluation: 0% false releases, every injected or tampered proof detected.</li>
        </ul>
        <figure className="mt-8 max-w-[38rem] border border-kerb bg-dusk">
          <img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} loading="lazy" decoding="async" className="block h-auto w-full" />
          <figcaption className="fine px-3 py-2 text-haze">{shot.caption}</figcaption>
        </figure>
        <Link to="/projects/settleai" className="btn-sodium btn mt-8">Read the SettleAI case study</Link>
      </article>

      <ul className="mt-14 divide-y divide-kerb border-y border-kerb">
        {(['toolforge', 'naman', 'voicedesk', 'dociq'] as const).map((slug) => (
          <li key={slug} className="group relative py-7">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="headline text-3xl text-paper">
                <Link to={`/projects/${slug}`} className="no-underline after:absolute after:inset-0 group-hover:text-signal-light">{p(slug).name}</Link>
              </h3>
              <StatusMark maturity={p(slug).maturity} tone="dark" className="text-haze" />
            </div>
            <p className="ui mt-2 max-w-[38rem] text-haze">{cardFor(slug).pitch}</p>
            <div className="mt-5"><MiniFlow stages={miniFlows[slug]} /></div>
            <p className="ui mt-5 text-paper">{agentNotes[slug]}</p>
          </li>
        ))}
      </ul>
    </Chapter>
  );
}

/* ------------------------------------------------------------ Models and engines */

function Models() {
  return (
    <Chapter id="models" title="Measured, with the margin stated" wide>
      <p className="mt-5 max-w-[38rem] font-sans text-[1.2rem] leading-snug text-paper">
        A cricket model evaluated on 1.36 million real deliveries, a routing engine benchmarked against brute force, and
        a ledger that cannot rewrite history.
      </p>

      <article aria-labelledby="cric-title" className="mt-12 border-t border-kerb pt-8">
        <AreaMark color={categoryHex.ml}>Applied machine learning</AreaMark>
        <h3 id="cric-title" className="headline text-4xl text-paper">CricXAI</h3>
        <p className="ui mt-3 max-w-[38rem] text-[1.0625rem] text-haze">{p('cricxai').summary}</p>
        <dl className="mt-6 flex flex-wrap gap-x-12 gap-y-4">
          {[['0.749', 'Dismissal ROC-AUC'], ['0.867', 'Runs, mean absolute error']].map(([v, l]) => (
            <div key={l} className="flex flex-col">
              <dt className="ui order-2 text-haze">{l}</dt>
              <dd className="headline order-1 text-5xl text-field-light">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="ui mt-4 max-w-[38rem] text-paper">
          Trained with leakage-safe features and validated by match. Its Parquet store is about 15 times smaller than the
          CSV and loads about 10 times faster.
        </p>
        <div className="mt-8 max-w-[34rem]"><CalibrationChart tone="dark" /></div>
        <Link to="/projects/cricxai" className="ui mt-6 inline-flex font-semibold text-paper"><span className="link">CricXAI case study</span></Link>
      </article>

      <div className="mt-14 grid gap-12 border-t border-kerb pt-8 xl:grid-cols-2">
        <article aria-labelledby="route-title">
          <h3 id="route-title" className="headline text-3xl text-paper">RouteCore</h3>
          <p className="ui mt-3 text-haze">{p('routecore').summary}</p>
          <div className="mt-6"><BenchmarkChart tone="dark" /></div>
          <Link to="/projects/routecore" className="ui mt-5 inline-flex font-semibold text-paper"><span className="link">RouteCore case study</span></Link>
        </article>
        <article aria-labelledby="refera-title">
          <h3 id="refera-title" className="headline text-3xl text-paper">Refera</h3>
          <p className="ui mt-3 text-haze">{p('refera').summary}</p>
          <div className="mt-6"><LedgerDiagram tone="dark" /></div>
          <Link to="/projects/refera" className="ui mt-5 inline-flex font-semibold text-paper"><span className="link">Refera case study</span></Link>
        </article>
      </div>
    </Chapter>
  );
}

/* ------------------------------------------------------------ Archive */

function Archive() {
  const statuses = (Object.keys(maturityLabel) as Maturity[])
    .map((m) => ({ m, n: projects.filter((x) => x.maturity === m).length }))
    .filter((s) => s.n > 0);
  const tallest = maturityHeight.production;
  return (
    <Chapter id="archive" title="Every light is a project">
      <p className="mt-5 font-sans text-[1.2rem] leading-snug text-paper">
        All {projects.length} published projects, from a production platform to first notebooks. A tower’s colour is its
        area of work; its height is how far the project got.
      </p>
      <div className="mt-10 grid gap-10 sm:grid-cols-2">
        <div>
          <h3 className="label text-haze">By area</h3>
          <ul className="ui mt-3 space-y-2">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center gap-3 text-paper">
                <span className="inline-block h-3 w-3 shrink-0" style={{ background: categoryHex[c.id] }} aria-hidden />
                <span className="flex-1">{c.title}</span>
                <span className="text-haze">{projects.filter((x) => x.category === c.id).length}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="label text-haze">By how far it got</h3>
          <ul className="ui mt-3 space-y-2">
            {statuses.map(({ m, n }) => (
              <li key={m} className="flex items-end gap-3 text-paper">
                <span className="flex h-5 w-3 shrink-0 items-end" aria-hidden>
                  <span className="block w-full bg-haze" style={{ height: `${(maturityHeight[m] / tallest) * 100}%` }} />
                </span>
                <span className="flex-1">{maturityLabel[m]}</span>
                <span className="text-haze">{n}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/projects" className="btn-sodium btn">Search the archive</Link>
        <Link to="/projects?cases=1" className="btn-ghost-night btn">Case studies only</Link>
      </div>
    </Chapter>
  );
}

/* ------------------------------------------------------------ Career */

function Career() {
  return (
    <Chapter id="career" title="Two years of internships, then a production job" wide>
      <div className="mt-8 grid gap-8 border-t border-kerb pt-8 md:grid-cols-2">
        <div>
          <p className="label text-sodium">Since {formatMonth(currentRole.start)}</p>
          <h3 className="headline mt-2 text-3xl text-paper">{currentRole.title}</h3>
          <p className="ui mt-1 font-semibold text-paper">{currentRole.org}</p>
        </div>
        <ol className="self-end border-l-2 border-sodium pl-4">
          {currentRole.titles!.map((t) => (
            <li key={t.title} className="ui py-1 text-haze"><span className="text-paper">{t.title}</span>, from {formatMonth(t.from)}</li>
          ))}
        </ol>
      </div>
      <div className="mt-12"><RoleTimeline roles={roles} tone="dark" /></div>
      <Link to="/experience" className="btn-ghost-night btn mt-10">Full experience, with documents</Link>
    </Chapter>
  );
}

/* ------------------------------------------------------------ Credentials */

function Credentials() {
  return (
    <Chapter id="credentials" title="What I work with" wide>
      <p className="ui mt-4 text-haze">Each one is backed by projects I have built; the Skills page links every skill to its projects.</p>
      <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {skillGroups.slice(0, 6).map((g) => (
          <div key={g.id} className="border-t border-kerb pt-4">
            <h3 className="headline text-xl text-paper">{g.title}</h3>
            <ul className="ui mt-3 space-y-1.5 text-paper">
              {g.skills.slice(0, 4).map((s) => (
                <li key={s.name} className="flex items-start gap-2.5">
                  <span className="mt-[0.45rem] inline-block h-2 w-2 shrink-0 bg-sodium" aria-hidden />
                  <span>{s.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Link to="/skills" className="ui mt-8 inline-flex font-semibold text-paper"><span className="link">Every skill, with the projects that show it</span></Link>

      <div className="mt-14 grid gap-10 border-t border-kerb pt-8 md:grid-cols-2">
        <div>
          <h3 className="label text-haze">Education</h3>
          <p className="headline mt-3 text-2xl text-paper">{education.degree}</p>
          <p className="ui mt-2 text-paper">{education.school}</p>
          <p className="ui mt-1 text-haze">{education.years}</p>
          {inProgress.map((i) => (
            <p key={i.title} className="ui mt-6 border-l-2 border-sodium pl-4 text-paper">
              <span className="font-semibold">{i.title}.</span> <span className="text-haze">{i.detail}</span>
            </p>
          ))}
        </div>
        <div>
          <h3 className="label text-haze">Certificates</h3>
          <ul className="mt-3">
            {credentials.map((c) => (
              <li key={c.title} className="ui grid grid-cols-[1fr_auto] gap-x-4 border-b border-kerb py-2.5">
                <span>
                  <a href={c.href} target="_blank" rel="noopener noreferrer" className="link font-semibold text-paper">
                    {c.title}<span className="sr-only"> (certificate, opens in a new tab)</span>
                  </a>
                  <span className="block text-haze">{c.issuer}</span>
                </span>
                <span className="whitespace-nowrap text-haze">{c.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Chapter>
  );
}

/* ------------------------------------------------------------ Contact */

function Contact() {
  const external = [
    ['LinkedIn', profile.linkedin],
    ['GitHub', profile.github],
    ['Résumé', profile.resume],
  ];
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative z-10 py-24 md:py-32">
      <div className="shell grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:pr-40">
        <div className="chapter-panel -mx-4 px-4 py-8 sm:mx-0 sm:px-6 lg:p-0">
          <h2 id="contact-title" className="headline text-[clamp(2.5rem,5.5vw,4.5rem)] text-paper">Write to me</h2>
          <p className="ui mt-4 text-[1.0625rem] text-haze">{profile.availability}. Email is fastest; the form sends the same email.</p>
          <a href={`mailto:${profile.email}`} className="headline mt-8 inline-block break-all text-[clamp(1.4rem,2.6vw,2.1rem)] text-sodium no-underline hover:underline">
            {profile.email}
          </a>
          <ul className="ui mt-8 space-y-2">
            {external.map(([label, href]) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-paper">
                  <span className="link">{label}</span><ArrowUpRight size={15} aria-hidden /><span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-kerb bg-dusk/95 p-6 md:p-8">
          <ContactForm tone="dark" />
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [active, setActive] = useState(0);
  return (
    <div className="relative bg-night text-paper">
      <CityBackdrop onChapter={setActive} />
      <ChapterRail active={active} />
      <Opening />
      <Movigo />
      <Agents />
      <Models />
      <Archive />
      <Career />
      <Credentials />
      <Contact />
    </div>
  );
}
