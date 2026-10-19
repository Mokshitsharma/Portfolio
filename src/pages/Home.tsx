import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight, Mail } from 'lucide-react';
import { caseStudyBySlug } from '../data/caseStudies';
import { currentRole, formatMonth, roles } from '../data/experience';
import { credentials, education, principles, profile } from '../data/profile';
import { categories, projectBySlug, projects } from '../data/projects';
import { skillGroups } from '../data/skills';
import { miniFlows } from '../data/visuals';
import ContactForm from '../components/ContactForm';
import ProjectVisual from '../components/ProjectVisual';
import { cardFor } from '../data/cards';
import { Links, SectionHead, StatusMark } from '../components/ui';
import { BenchmarkChart, CalibrationChart, KindLegend, LedgerDiagram, MiniFlow, RoleTimeline, ScreenshotStack, TransitMap } from '../components/viz';

const movigo = caseStudyBySlug('movigo')!;
const settle = caseStudyBySlug('settleai')!;
const p = (slug: string) => projectBySlug(slug)!;

/* ------------------------------------------------------------ Hero */

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="plate grid-texture relative overflow-hidden pt-28 md:pt-36">
      <div className="shell">
        <p className="label text-mist">{profile.name}, {profile.location}</p>
        <h1 id="hero-title" className="display mt-5 text-[clamp(3.6rem,10.8vw,10rem)]">
          Applied AI and full&#8209;stack engineer
        </h1>
        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start lg:gap-16">
          <div>
            <p className="flex items-start gap-4 font-sans text-[clamp(1.2rem,2vw,1.6rem)] font-medium leading-snug text-paper">
              <span className="mt-2 inline-block h-4 w-4 shrink-0 bg-route" aria-hidden />
              <span>
                {profile.currentRole} at {profile.currentOrgShort}, the only engineer behind a live delivery platform.
                I also build AI agents that call real tools and stop for code or a person at the risky step.
              </span>
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#work" className="btn-route btn"><ArrowDown size={18} aria-hidden />See the work</a>
              <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="btn-ghost-dark btn">
                Résumé<ArrowUpRight size={16} aria-hidden /><span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a href={`mailto:${profile.email}`} className="btn-ghost-dark btn"><Mail size={18} aria-hidden />Email</a>
            </div>
          </div>

          <dl className="ui grid gap-5 border-l border-night-rule pl-6 sm:grid-cols-3 lg:grid-cols-1">
            <div>
              <dt className="label text-mist">Shipping</dt>
              <dd className="mt-1 text-paper">Movigo’s driver and retailer apps, on Google Play and the App Store</dd>
            </div>
            <div>
              <dt className="label text-mist">Building</dt>
              <dd className="mt-1 text-paper">
                <Link to="/projects/settleai" className="link">SettleAI</Link>, for the PayPal AI Hackathon 2026
              </dd>
            </div>
            <div>
              <dt className="label text-mist">Looking for</dt>
              <dd className="mt-1 text-paper">{profile.availability}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-16 border-t border-night-rule pt-8 pb-16 md:mt-20">
          <TransitMap />
        </div>
      </div>
      <div className="flex" aria-hidden>
        <span className="rail flex-[3] bg-route" />
        <span className="rail flex-[2] bg-signal" />
        <span className="rail flex-1 bg-field" />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Movigo */

function MovigoFeature() {
  const proj = p('movigo');
  return (
    <article aria-labelledby="f-movigo" className="plate grid-texture">
      <div className="shell grid gap-14 py-20 md:py-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="reveal">
          <p className="label flex items-center gap-3 text-route">
            <span className="inline-block h-1.5 w-10 bg-route" aria-hidden />Production system, current employer
          </p>
          <h3 id="f-movigo" className="display mt-5 text-[clamp(3rem,7vw,6rem)]">Movigo</h3>
          <p className="mt-6 font-sans text-xl leading-snug text-paper">{movigo.lede}</p>
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-night-rule pt-8">
            {[
              ['400+', 'API routes across six route groups'],
              ['40', 'MongoDB models'],
              ['3', 'store listings: 2 on Google Play, 1 on the App Store'],
              ['1K+', 'installs per app on Google Play'],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd>
                  <span className="headline block text-5xl text-route">{v}</span>
                  <span className="ui mt-1 block text-mist">{l}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="fine mt-4 text-mist">Counted from the backend source and the public store listings, October 2026.</p>
          <Links links={proj.links} className="mt-8 flex-col !gap-3 text-paper" />
          <Link to="/projects/movigo" className="btn-route btn mt-10">Read the Movigo case study</Link>
        </div>

        <div className="reveal space-y-px self-start border border-night-rule bg-night-rule">
          {movigo.map!.groups.map((g) => (
            <div key={g.title} className="bg-night-2 p-6">
              <h4 className="label flex items-center gap-3 text-paper"><span className="inline-block h-3 w-3 bg-route" aria-hidden />{g.title}</h4>
              <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {g.items.map((i) => (
                  <li key={i.name} className="ui border-l-[3px] border-route pl-3">
                    <span className="font-semibold text-paper">{i.name}</span>
                    {i.note && <span className="block text-mist">{i.note}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="bg-night-2 p-6">
            <h4 className="label text-paper">Decisions that keep it correct</h4>
            <ul className="mt-4 space-y-3">
              {movigo.decisions.map((d) => (
                <li key={d.title} className="ui text-paper"><span className="font-semibold">{d.title}.</span> <span className="text-mist">{d.body.split('. ')[0]}.</span></li>
              ))}
            </ul>
          </div>
          <p className="fine bg-night px-6 py-3 text-mist">Explanatory map drawn from the backend’s route groups and services.</p>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------ SettleAI */

function SettleFeature() {
  return (
    <article aria-labelledby="f-settle" className="bg-paper">
      <div className="shell grid gap-14 py-20 md:py-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center">
        <div className="reveal">
          <p className="label flex items-center gap-3 text-signal">
            <span className="inline-block h-1.5 w-10 bg-signal" aria-hidden />Agent system, PayPal AI Hackathon 2026
          </p>
          <h3 id="f-settle" className="display mt-5 text-[clamp(3rem,7vw,6rem)]">SettleAI</h3>
          <p className="lede mt-6">{settle.lede}</p>
          <blockquote className="mt-8 border-l-[6px] border-signal pl-5">
            <p className="headline text-3xl">No agent holds a tool that can move money.</p>
            <p className="ui mt-2 text-graphite">A deterministic guard approves every hire, funding, payout and dispute.</p>
          </blockquote>
          <ul className="ui mt-8 space-y-2 text-graphite">
            <li><span className="font-semibold text-ink">146 tests</span> in the repository, including ledger property tests (counted, not run here)</li>
            <li><span className="font-semibold text-ink">Failure drills</span> for webhook storms, a payout outage and an LLM outage</li>
            <li><span className="font-semibold text-ink">Signed receipts</span> that verify offline; one changed byte breaks them</li>
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link to="/projects/settleai" className="btn-ink btn">Read the SettleAI case study</Link>
            <StatusMark maturity="in-progress" className="text-ink" />
          </div>
        </div>
        <div className="reveal group">
          <ScreenshotStack figures={[settle.figures![0], settle.figures![1]]} line="signal" />
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------ Agent bench */

function AgentCard({ slug, wide }: { slug: 'toolforge' | 'naman' | 'voicedesk' | 'dociq'; wide?: boolean }) {
  const proj = p(slug);
  const extra: Record<string, { stat: string; note: string }> = {
    toolforge: { stat: '8/8', note: 'live PokéAPI calls passed, security 100/100' },
    naman: { stat: '124', note: 'pytest tests, approval as its own graph step' },
    voicedesk: { stat: '6/6', note: 'planned phases built, including barge-in' },
    dociq: { stat: '16', note: 'end-to-end checks, including refusals' },
  };
  return (
    <article aria-labelledby={`a-${slug}`} className={`reveal group flex flex-col bg-night-2 p-6 md:p-8 ${wide ? 'lg:col-span-7' : 'lg:col-span-5'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 id={`a-${slug}`} className="headline text-4xl text-paper">
          <Link to={`/projects/${slug}`} className="no-underline after:absolute after:inset-0 hover:text-signal-light">{proj.name}</Link>
        </h3>
        <StatusMark maturity={proj.maturity} tone="dark" className="text-mist" />
      </div>
      <p className="ui mt-3 max-w-xl text-[1rem] text-mist">{cardFor(slug).pitch}</p>
      <div className="mt-8">
        <MiniFlow stages={miniFlows[slug]} />
      </div>
      <div className="mt-auto flex items-end justify-between gap-6 border-t border-night-rule pt-5">
        <p className="ui text-mist"><span className="headline mr-2 text-3xl text-signal-light">{extra[slug].stat}</span>{extra[slug].note}</p>
        <ArrowUpRight size={22} className="shrink-0 text-paper transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
      </div>
    </article>
  );
}

function AgentBench() {
  return (
    <section aria-labelledby="agents-title" className="plate">
      <div className="shell py-20 md:py-28">
        <SectionHead id="agents-title" kicker="Agent systems" title="Pipelines where the model is one stage, not the boss" tone="dark" aside={<KindLegend />}>
          <p>Each diagram is the project’s real control flow. Yellow stages are code or a person deciding.</p>
        </SectionHead>
        <div className="relative mt-12 grid gap-px bg-night-rule lg:grid-cols-12 [&>article]:relative">
          <AgentCard slug="toolforge" wide />
          <AgentCard slug="naman" />
          <AgentCard slug="voicedesk" />
          <AgentCard slug="dociq" wide />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Models and engineering */

function ModelsAndEngineering() {
  const cric = p('cricxai');
  const route = p('routecore');
  const refera = p('refera');
  return (
    <section aria-labelledby="eng-title" className="bg-paper">
      <div className="shell py-20 md:py-28">
        <SectionHead id="eng-title" kicker="Models and engineering" title="Measured, and honest about the margin">
          <p>A cricket model evaluated on 1.36 million real deliveries, a routing engine benchmarked against brute force, and a ledger that cannot rewrite history.</p>
        </SectionHead>

        <article aria-labelledby="f-cric" className="reveal mt-14 grid gap-10 border-t-[6px] border-field bg-surface p-6 md:p-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <p className="label text-clear">Applied machine learning</p>
            <h3 id="f-cric" className="display mt-3 text-[clamp(2.75rem,5vw,4.5rem)]">CricXAI</h3>
            <p className="mt-4">{cric.summary}</p>
            <dl className="mt-8 grid grid-cols-2 gap-6">
              <div><dt className="ui text-graphite">ROC-AUC, dismissal</dt><dd className="headline text-5xl">0.749</dd></div>
              <div><dt className="ui text-graphite">Runs, mean abs. error</dt><dd className="headline text-5xl">0.867</dd></div>
            </dl>
            <p className="ui mt-4 text-graphite">Only about 2% better than the base rate, and the README says so. 71 tests, including leakage checks.</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link to="/projects/cricxai" className="btn-ink btn">Read the case study</Link>
              <Links links={cric.links} />
            </div>
          </div>
          <CalibrationChart />
        </article>

        <div className="mt-px grid gap-px bg-rule lg:grid-cols-2">
          <article aria-labelledby="f-route" className="reveal bg-surface p-6 md:p-10">
            <p className="label text-graphite">Algorithms</p>
            <h3 id="f-route" className="display mt-3 text-[clamp(2.5rem,4vw,3.75rem)]">RouteCore</h3>
            <p className="mt-4">{route.summary}</p>
            <div className="mt-8"><BenchmarkChart /></div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link to="/projects/routecore" className="btn-ink btn">Read the case study</Link>
              <Links links={route.links} />
            </div>
          </article>
          <article aria-labelledby="f-refera" className="reveal bg-surface p-6 md:p-10">
            <p className="label text-graphite">Fintech backend</p>
            <h3 id="f-refera" className="display mt-3 text-[clamp(2.5rem,4vw,3.75rem)]">Refera</h3>
            <p className="mt-4">{refera.summary}</p>
            <div className="mt-8"><LedgerDiagram /></div>
            <p className="ui mt-4 text-graphite">AES-256-GCM for PAN and bank numbers, TOTP for admins, 50 API tests.</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link to="/projects/refera" className="btn-ink btn">Read the case study</Link>
              <Links links={refera.links} />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ More case studies */

function ShowcaseCard({ slug, layout, tone }: { slug: string; layout: 'wide' | 'tall' | 'compact'; tone: 'dark' | 'light' }) {
  const proj = p(slug);
  const card = cardFor(slug);
  const dark = tone === 'dark';
  return (
    <article
      aria-labelledby={`more-${slug}`}
      className={`reveal group relative flex h-full flex-col overflow-hidden ${dark ? 'bg-night text-paper' : 'bg-surface text-ink'} ${
        layout === 'wide' ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]' : ''
      }`}
    >
      <div className={layout === 'wide' ? 'lg:order-2' : ''}>
        <ProjectVisual slug={slug} />
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className={`label ${dark ? 'text-mist' : 'text-graphite'}`}>{categories.find((c) => c.id === proj.category)!.title}</p>
          <StatusMark maturity={proj.maturity} tone={tone} />
        </div>
        <h3 id={`more-${slug}`} className={`headline mt-4 ${layout === 'compact' ? 'text-3xl' : 'text-[clamp(2rem,3.2vw,2.75rem)]'}`}>
          <Link to={`/projects/${slug}`} className="no-underline after:absolute after:inset-0 after:z-10">{proj.name}</Link>
        </h3>
        <p className={`mt-3 font-sans text-[1.0625rem] leading-relaxed ${dark ? 'text-paper/90' : 'text-ink'}`}>{card.pitch}</p>
        {card.detail && (
          <p className={`ui mt-4 border-t pt-3 ${dark ? 'border-night-rule text-mist' : 'border-rule text-graphite'}`}>{card.detail}</p>
        )}
        <p className="ui mt-auto inline-flex items-center gap-2 pt-6 font-semibold">
          <span className="link">Read the case study</span>
          <ArrowUpRight size={18} className="transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" aria-hidden />
        </p>
      </div>
    </article>
  );
}

function MoreWork() {
  const caseCount = projects.filter((x) => x.caseStudy).length;
  const more = ['hyperlocal-marketplace', 'sensei-ai', 'ai-business-analytics', 'fieldops-ai', 'dairy-collection-manager'];
  return (
    <section aria-labelledby="more-title" className="bg-paper">
      <div className="shell pt-4 pb-20 md:pb-28">
        <div className="grid gap-8 border-t-2 border-ink pt-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-end">
          <div>
            <p className="label text-graphite">Also worth exploring</p>
            <h2 id="more-title" className="headline mt-3 text-[clamp(2rem,3.6vw,3rem)]">{more.length} more case studies</h2>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <p className="ui max-w-md text-graphite">
              {caseCount} projects have full write-ups. The archive holds all {projects.length}, labelled by how far each one got.
            </p>
            <Link to="/projects" className="btn-ink btn">All {projects.length} projects</Link>
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-7"><ShowcaseCard slug={more[0]} layout="wide" tone="dark" /></div>
          <div className="lg:col-span-5"><ShowcaseCard slug={more[1]} layout="tall" tone="light" /></div>
          <div className="lg:col-span-5"><ShowcaseCard slug={more[2]} layout="tall" tone="dark" /></div>
          <div className="grid gap-5 lg:col-span-7">
            <ShowcaseCard slug={more[3]} layout="wide" tone="dark" />
            <ShowcaseCard slug={more[4]} layout="wide" tone="light" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Principles */

function Principles() {
  return (
    <section aria-labelledby="rules-title" className="plate grid-texture">
      <div className="shell py-20 md:py-28">
        <SectionHead id="rules-title" kicker="How I build agents" title="Four rules, each traceable to code" tone="dark" />
        <ol className="mt-14 grid gap-px bg-night-rule md:grid-cols-2">
          {principles.map((r) => (
            <li key={r.title} className="reveal bg-night p-6 md:p-10">
              <span className="block h-1.5 w-12 bg-signal" aria-hidden />
              <h3 className="headline mt-6 text-3xl text-paper">{r.title}</h3>
              <p className="ui mt-3 text-[1.0625rem] text-mist">{r.body}</p>
              <p className="label mt-6 text-paper">
                In code:{' '}
                {r.where.map((w, j) => (
                  <span key={w.label}>
                    {j > 0 && ', '}
                    <Link to={`/projects/${w.slug}`} className="link">{w.label}</Link>
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Experience */

function ExperienceSummary() {
  return (
    <section aria-labelledby="exp-title" className="bg-paper">
      <div className="shell py-20 md:py-28">
        <SectionHead id="exp-title" kicker="Experience" title="Two years of internships, then a production job" aside={<Link to="/experience" className="btn-ghost btn">Full experience</Link>} />
        <div className="mt-14 grid gap-12">
          <div className="reveal grid gap-8 bg-night p-7 text-paper md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:p-10">
            <div>
            <p className="label text-route">Now</p>
            <h3 className="headline mt-3 text-4xl md:text-5xl">{currentRole.title}</h3>
            <p className="ui mt-2 font-semibold">{currentRole.org}</p>
            </div>
            <ol className="self-end border-l-[6px] border-route pl-4">
              {currentRole.titles!.map((t) => (
                <li key={t.title} className="ui py-1.5 text-mist"><span className="text-paper">{t.title}</span>, from {formatMonth(t.from)}</li>
              ))}
            </ol>
          </div>
          <div className="reveal">
            <RoleTimeline roles={roles} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Skills and education */

function SkillsAndEducation() {
  return (
    <section aria-labelledby="skills-title" className="border-t border-rule bg-surface">
      <div className="shell py-20 md:py-24">
        <SectionHead id="skills-title" kicker="Capabilities" title="What I work with" aside={<Link to="/skills" className="btn-ghost btn">Skills with evidence</Link>}>
          <p>The green square marks what runs in production at Movigo.</p>
        </SectionHead>
        <div className="mt-12 columns-1 gap-10 sm:columns-2 lg:columns-3">
          {skillGroups.map((g) => (
            <div key={g.id} className="mb-8 break-inside-avoid border-t-2 border-ink pt-4">
              <h3 className="headline text-xl">{g.title}</h3>
              <ul className="ui mt-3 space-y-1.5">
                {g.skills.slice(0, 5).map((s) => (
                  <li key={s.name} className="flex items-start gap-2">
                    <span className={`mt-[0.45rem] inline-block h-2 w-2 shrink-0 ${s.production ? 'bg-field' : 'border border-graphite/60'}`} aria-hidden />
                    <span>{s.name}{s.production && <span className="sr-only"> (production)</span>}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div id="education" className="mt-16 grid gap-10 border-t border-rule pt-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <p className="label text-graphite">Education</p>
            <h3 className="headline mt-3 text-3xl">{education.degree}</h3>
            <p className="mt-2">{education.school}</p>
            <p className="ui mt-1 text-graphite">{education.years}</p>
          </div>
          <div>
            <p className="label text-graphite">Certificates</p>
            <ul className="mt-3">
              {credentials.map((c) => (
                <li key={c.title} className="ui grid grid-cols-[1fr_auto] gap-x-4 border-b border-rule py-2.5">
                  <span>
                    <a href={c.href} target="_blank" rel="noopener noreferrer" className="link font-semibold">{c.title}<span className="sr-only"> (certificate, opens in a new tab)</span></a>
                    <span className="text-graphite">, {c.issuer}</span>
                  </span>
                  <span className="whitespace-nowrap text-graphite">{c.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Contact */

function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="plate">
      <div className="shell grid gap-12 py-20 md:py-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
          <p className="label text-mist">Contact</p>
          <h2 id="contact-title" className="display mt-4 text-[clamp(3rem,7vw,6rem)]">Hiring for applied AI or full-stack work?</h2>
          <p className="lede mt-6 font-sans text-mist">Email is fastest. The form sends the same email.</p>
        </div>
        <div className="bg-surface p-6 text-ink md:p-10">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <section id="work" aria-labelledby="work-title" className="bg-paper">
        <div className="shell pt-20 pb-14 md:pt-28">
          <SectionHead
            id="work-title"
            kicker="Selected work"
            title="Production first, then the agents, models and engines around it"
            aside={<Link to="/projects" className="btn-ghost btn">All {projects.length} projects</Link>}
          />
        </div>
        <MovigoFeature />
        <SettleFeature />
      </section>
      <AgentBench />
      <ModelsAndEngineering />
      <MoreWork />
      <Principles />
      <ExperienceSummary />
      <SkillsAndEducation />
      <ContactSection />
    </>
  );
}
