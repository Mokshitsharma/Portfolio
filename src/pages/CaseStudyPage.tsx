import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { caseStudies, caseStudyBySlug } from '../data/caseStudies';
import { categories, projectBySlug } from '../data/projects';
import type { CaseStudy, Project } from '../data/types';
import { areaHex } from '../data/visuals';
import { architectureFor, type Architecture, type NodeKind } from '../data/architecture';
import ArchitectureExplorer, { kindName, type Driven } from '../components/ArchitectureExplorer';
import { cardFor } from '../data/cards';
import { Links, StatusMark } from '../components/ui';
import NotFound from './NotFound';

// A case study told in chapters: the problem, what I built, how it works (a real request followed step by step
// beside a pinned diagram that lights each part as it is read), each component, the decisions, the results.
// Everything comes from caseStudies.ts and the project's architecture sheet.

function useWide() {
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const q = window.matchMedia('(min-width: 1024px)');
    const on = () => setWide(q.matches);
    on();
    q.addEventListener('change', on);
    return () => q.removeEventListener('change', on);
  }, []);
  return wide;
}
const smooth = (): ScrollBehavior => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

function Chapter({ id, n, title, children, tint }: { id: string; n: number; title: string; children: ReactNode; tint: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="cs-chapter scroll-mt-20">
      <p className="label" style={{ color: tint }}>Chapter {n}</p>
      <h2 id={`${id}-h`} className="display mt-2 text-[clamp(2rem,4.2vw,3.4rem)]">{title}</h2>
      <div className="mt-10">{children}</div>
    </section>
  );
}

function Hero({ c, p, tint, chapters }: { c: CaseStudy; p: Project; tint: string; chapters: { id: string; title: string }[] }) {
  const area = categories.find((x) => x.id === p.category)!;
  const [name, ...rest] = c.title.split(': ');
  const subtitle = rest.join(': ');
  return (
    <header className="cs-hero relative overflow-hidden pt-28 md:pt-32" style={{ ['--tint' as string]: tint }}>
      <div className="shell pb-14 md:pb-20">
        <nav aria-label="Breadcrumb" className="label text-slate">
          <ol className="flex flex-wrap gap-2">
            <li><Link to="/projects" className="link">Projects</Link><span aria-hidden> /</span></li>
            <li><Link to={`/projects?category=${p.category}`} className="link">{area.title}</Link><span aria-hidden> /</span></li>
            <li aria-current="page" className="text-charcoal">{p.name}</li>
          </ol>
        </nav>
        <div className={c.figures?.length ? 'grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end' : ''}>
          <div>
            <p className="label mt-10" style={{ color: tint }}>{area.title}</p>
            <h1 className="display mt-3 text-[clamp(3rem,8vw,6.5rem)]">{name}</h1>
            {subtitle && <p className="headline mt-4 max-w-[30ch] text-[clamp(1.5rem,2.8vw,2.3rem)] text-charcoal/85">{subtitle}</p>}
            <p className="mt-7 max-w-[44rem] text-[1.1875rem] leading-[1.65] text-charcoal/85">{c.lede}</p>
          </div>
          {c.figures?.[0] && (
            <figure className="border border-charcoal/60 bg-white shadow-[0_30px_60px_-40px_rgb(22_32_43/0.5)]">
              <img src={c.figures[0].src} alt={c.figures[0].alt} width={c.figures[0].width} height={c.figures[0].height} className="block h-auto w-full" />
              <figcaption className="fine border-t border-seam px-3 py-2 text-slate">{c.figures[0].caption}</figcaption>
            </figure>
          )}
        </div>

        <dl className="cs-meta mt-10">
          <div><dt>Status</dt><dd><StatusMark maturity={p.maturity} tone="dark" className="text-charcoal" /></dd></div>
          <div><dt>When</dt><dd>{p.period}</dd></div>
          <div className="sm:col-span-2"><dt>Built with</dt><dd>{p.stack.join(', ')}</dd></div>
        </dl>
        {(p.links.length > 0 || p.linkNote) && (
          <div className="mt-6">
            {p.links.length > 0 && <Links links={p.links} />}
            {p.linkNote && <p className="ui mt-2 text-slate">{p.linkNote}</p>}
          </div>
        )}

        {c.facts && c.facts.length > 0 && (
          <dl className="cs-facts mt-12">
            {c.facts.slice(0, 3).map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <nav aria-label="Chapters" className="mt-12">
          <ol className="cs-toc">
            {chapters.map((ch, i) => (
              <li key={ch.id}><a href={`#${ch.id}`}><span aria-hidden>{i + 1}</span>{ch.title}</a></li>
            ))}
          </ol>
        </nav>
      </div>
    </header>
  );
}

function Prose({ children }: { children: ReactNode }) {
  return <div className="measure space-y-5 text-[1.1875rem] leading-[1.7]">{children}</div>;
}

// Chapter 2: what was built, as the system's parts grouped by who acts.
function Built({ c, arch, tint }: { c: CaseStudy; arch?: Architecture; tint: string }) {
  const groups: { kind: NodeKind; title: string }[] = [
    { kind: 'io', title: 'Inputs and outputs' },
    { kind: 'model', title: 'Models and agents' },
    { kind: 'rule', title: 'Code that decides' },
    { kind: 'human', title: 'People' },
    { kind: 'store', title: 'Storage' },
    { kind: 'external', title: 'External services' },
  ];
  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-16">
      <Prose>
        <p>{c.role}</p>
        <p>{c.status}</p>
      </Prose>
      {arch && (
        <div className="cs-parts" style={{ ['--tint' as string]: tint }}>
          {groups.map((g) => {
            const items = arch.nodes.filter((n) => n.kind === g.kind);
            if (!items.length) return null;
            return (
              <div key={g.kind}>
                <p className="label flex items-center gap-2 text-slate"><span className={`arch-swatch k-${g.kind}`} aria-hidden />{g.title}</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {items.map((n) => <li key={n.id} className="cs-part">{n.label}</li>)}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Chapters 3 and 4: steps of a real request, then each component, beside one pinned diagram.
function HowItWorks({ arch, tint, slug, wide, n }: { arch: Architecture; tint: string; slug: string; wide: boolean; n: (id: string) => number }) {
  const walk = arch.walkthroughs[0];
  const [driven, setDriven] = useState<Driven>({ walkthrough: walk.id, step: 0 });
  const blocks = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (!wide) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const d = (e.target as HTMLElement).dataset;
        setDriven(d.kind === 'step' ? { walkthrough: walk.id, step: Number(d.i) } : { walkthrough: walk.id, step: -1, node: d.node });
      }
    }, { rootMargin: '-42% 0px -48% 0px' });
    blocks.current.forEach((b) => b && io.observe(b));
    return () => io.disconnect();
  }, [wide, walk.id]);

  const toComponent = (id: string) => document.getElementById(`${slug}-part-${id}`)?.scrollIntoView({ behavior: smooth(), block: 'center' });
  const nodeOf = (id: string) => arch.nodes.find((x) => x.id === id)!;
  let k = 0;

  const steps = (
    <ol aria-label={`Follow ${walk.title}`}>
      {walk.steps.map((s, i) => (
        <li key={i} ref={(el) => { blocks.current[k++] = el; }} data-kind="step" data-i={i} className="cs-step" data-on={wide && driven.step === i ? true : undefined} style={{ ['--tint' as string]: tint }}>
          <p className="fine text-slate">Step {i + 1} of {walk.steps.length}</p>
          <p className="cs-step-node" style={{ color: tint }}>{nodeOf(s.node).label}</p>
          <p className="mt-1 text-[1.125rem] leading-[1.6]">{s.say}</p>
        </li>
      ))}
    </ol>
  );

  const parts = (
    <div className="space-y-4">
      {arch.nodes.map((x) => (
        <article key={x.id} id={`${slug}-part-${x.id}`} ref={(el) => { blocks.current[k++] = el; }} data-kind="node" data-node={x.id} className="cs-card scroll-mt-28" data-on={wide && driven.node === x.id ? true : undefined} style={{ ['--tint' as string]: tint }}>
          <p className="label flex items-center gap-2 text-slate"><span className={`arch-swatch k-${x.kind}`} aria-hidden />{kindName[x.kind]}</p>
          <h4 className="headline mt-2 text-[1.5rem]">{x.label}</h4>
          <p className="mt-2 text-[1.0625rem] leading-[1.6]">{x.what}</p>
          {x.io && (
            <dl className="ui mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
              <dt className="text-slate">In</dt><dd>{x.io.in}</dd>
              <dt className="text-slate">Out</dt><dd>{x.io.out}</dd>
            </dl>
          )}
          {x.why && <p className="ui mt-3 border-l-2 pl-3" style={{ borderColor: tint }}>{x.why}</p>}
          {x.source && <p className="fine mt-3 text-slate">In the code: {x.source}</p>}
        </article>
      ))}
    </div>
  );

  if (!wide) {
    return (
      <>
        <Chapter id="how" n={n('how')} title="How it works" tint={tint}>
          <ArchitectureExplorer arch={arch} />
          <h3 className="headline mt-14 text-[1.5rem]">Follow {walk.title}</h3>
          <div className="mt-6">{steps}</div>
        </Chapter>
        <Chapter id="parts" n={n('parts')} title="Each component" tint={tint}>{parts}</Chapter>
      </>
    );
  }

  return (
    <div className="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-14">
      <div className="space-y-28">
        <Chapter id="how" n={n('how')} title="How it works" tint={tint}>
          <p className="ui mb-6 text-slate">Follow {walk.title}. The diagram lights each part as you read.</p>
          {steps}
        </Chapter>
        <Chapter id="parts" n={n('parts')} title="Each component" tint={tint}>
          <p className="ui mb-6 text-slate">Select a part on the diagram to jump to it.</p>
          {parts}
        </Chapter>
      </div>
      <div>
        <div className="cs-pinned sticky top-20">
          <ArchitectureExplorer arch={arch} driven={driven} compact onNodeClick={toComponent} />
          <p className="ui mt-4 min-h-[3rem] text-charcoal" aria-live="polite">
            {driven.step != null && driven.step >= 0
              ? <><span className="font-semibold">Step {driven.step + 1}.</span> {walk.steps[driven.step].say}</>
              : driven.node ? <><span className="font-semibold">{nodeOf(driven.node).label}.</span> {nodeOf(driven.node).what}</> : arch.caption}
          </p>
        </div>
      </div>
    </div>
  );
}

function Decisions({ c, tint }: { c: CaseStudy; tint: string }) {
  return (
    <div className="space-y-14">
      <div className="grid gap-px border border-seam bg-seam md:grid-cols-2">
        {c.decisions.map((d) => (
          <article key={d.title} className="bg-ivory p-7">
            <h3 className="headline flex gap-3 text-[1.4rem]"><span className="mt-2.5 inline-block h-2.5 w-2.5 shrink-0" style={{ background: tint }} aria-hidden />{d.title}</h3>
            <p className="mt-3 text-[1.0625rem] leading-[1.65]">{d.body}</p>
          </article>
        ))}
      </div>
      {c.sections.map((s) => (
        <div key={s.heading}>
          <h3 className="headline text-[1.75rem]">{s.heading}</h3>
          <div className="mt-4"><Prose>
            {s.body?.map((para) => <p key={para}>{para}</p>)}
            {s.points && (
              <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
                {s.points.map((pt) => (
                  <li key={pt} className="ui flex gap-3 border-t border-seam pt-2 text-[1rem]"><span className="mt-2 inline-block h-2 w-2 shrink-0" style={{ background: tint }} aria-hidden />{pt}</li>
                ))}
              </ul>
            )}
          </Prose></div>
        </div>
      ))}
    </div>
  );
}

function Results({ c, p, tint }: { c: CaseStudy; p: Project; tint: string }) {
  return (
    <div className="space-y-14">
      {c.facts && c.facts.length > 0 && (
        <dl className="grid gap-px border border-seam bg-seam sm:grid-cols-2 lg:grid-cols-3">
          {c.facts.map((f) => (
            <div key={f.label} className="bg-white p-6">
              <dt className="label text-slate">{f.label}</dt>
              <dd className="headline mt-3 text-[1.6rem] leading-tight">{f.value}</dd>
              <dd className="fine mt-3 text-slate">{f.source}</dd>
            </div>
          ))}
        </dl>
      )}
      {c.quality && c.quality.length > 0 && (
        <div>
          <h3 className="headline text-[1.5rem]">Testing and evaluation</h3>
          <ul className="measure mt-5 space-y-4">
            {c.quality.map((q) => (
              <li key={q} className="flex gap-4 text-[1.0625rem] leading-[1.65]"><span className="mt-2 inline-block h-2.5 w-2.5 shrink-0" style={{ background: tint }} aria-hidden /><span>{q}</span></li>
            ))}
          </ul>
        </div>
      )}
      {/* The first screen is in the opening. */}
      {c.figures && c.figures.length > 1 && (
        <div className="grid gap-10 lg:grid-cols-2">
          {c.figures.slice(1).map((f, i, rest) => (
            <figure key={f.src} className={i === 0 && rest.length % 2 === 1 ? 'lg:col-span-2' : ''}>
              <div className="border border-charcoal/60 bg-limestone">
                <img src={f.src} alt={f.alt} width={f.width} height={f.height} loading="lazy" decoding="async" className="block h-auto w-full" />
              </div>
              <figcaption className="fine mt-3 text-slate">{f.caption}</figcaption>
            </figure>
          ))}
        </div>
      )}
      {(p.links.length > 0 || p.linkNote) && (
        <div>
          <h3 className="headline text-[1.5rem]">Code and links</h3>
          {p.links.length > 0 && <Links links={p.links} className="mt-4" />}
          {p.linkNote && <p className="ui mt-2 text-slate">{p.linkNote}</p>}
        </div>
      )}
    </div>
  );
}

function Related({ c }: { c: CaseStudy }) {
  const index = caseStudies.findIndex((x) => x.slug === c.slug);
  const next = caseStudies[(index + 1) % caseStudies.length];
  const nextProject = projectBySlug(next.slug)!;
  const related = (c.related ?? []).map((s) => projectBySlug(s)).filter(Boolean) as Project[];
  return (
    <section aria-labelledby="more" className="border-t border-seam bg-limestone">
      <div className="shell grid gap-12 py-16 md:py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="group relative">
          <p className="label text-slate">Next case study</p>
          <h2 id="more" className="display mt-3 text-[clamp(2.75rem,6vw,5rem)]">
            <Link to={`/projects/${next.slug}`} className="no-underline after:absolute after:inset-0 group-hover:text-brass">{nextProject.name}</Link>
          </h2>
          <p className="ui mt-3 max-w-md text-slate">{cardFor(next.slug).pitch}</p>
          <ArrowUpRight size={28} className="mt-4 text-brass" aria-hidden />
        </div>
        <div>
          <p className="label text-slate">Related</p>
          <ul className="mt-3 divide-y divide-seam border-y border-seam">
            {related.map((r) => (
              <li key={r.slug}>
                <Link to={r.caseStudy ? `/projects/${r.slug}` : `/projects?q=${encodeURIComponent(r.name)}`} className="group flex items-center justify-between gap-4 py-4 no-underline">
                  <span>
                    <span className="headline block text-2xl text-charcoal group-hover:text-brass">{r.name}</span>
                    <span className="ui text-slate">{r.caseStudy ? cardFor(r.slug).pitch : r.summary}</span>
                  </span>
                  <ArrowUpRight size={20} className="shrink-0 text-charcoal" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/projects" className="btn btn-line mt-8">All projects</Link>
        </div>
      </div>
    </section>
  );
}

export default function CaseStudyPage() {
  const { slug = '' } = useParams();
  const wide = useWide();
  const c = caseStudyBySlug(slug);
  const p = projectBySlug(slug);
  if (!c || !p) return <NotFound />;
  const arch = architectureFor(slug);
  const tint = areaHex[p.category];

  const chapters = [
    { id: 'problem', title: 'The problem' },
    { id: 'built', title: 'What I built' },
    ...(arch ? [{ id: 'how', title: 'How it works' }, { id: 'parts', title: 'Each component' }] : []),
    { id: 'decisions', title: 'Decisions' },
    { id: 'results', title: 'Results' },
    ...(arch && wide ? [{ id: 'explore', title: 'Explore it yourself' }] : []),
  ];
  const n = (id: string) => chapters.findIndex((x) => x.id === id) + 1;

  return (
    <article style={{ ['--tint' as string]: tint }}>
      <Hero c={c} p={p} tint={tint} chapters={chapters} />
      <div className="shell space-y-28 py-20 md:space-y-36 md:py-28">
        <Chapter id="problem" n={n('problem')} title="The problem" tint={tint}><Prose><p>{c.context}</p></Prose></Chapter>
        <Chapter id="built" n={n('built')} title="What I built" tint={tint}><Built c={c} arch={arch} tint={tint} /></Chapter>
        {arch && <HowItWorks arch={arch} tint={tint} slug={slug} wide={wide} n={n} />}
        <Chapter id="decisions" n={n('decisions')} title="Decisions" tint={tint}><Decisions c={c} tint={tint} /></Chapter>
        <Chapter id="results" n={n('results')} title="Results" tint={tint}><Results c={c} p={p} tint={tint} /></Chapter>
        {arch && wide && (
          <Chapter id="explore" n={n('explore')} title="Explore it yourself" tint={tint}>
            <p className="ui mb-8 max-w-[38rem] text-slate">Play any request through the system, step through it, or select a part. You can also ask my AI to walk you through it.</p>
            <ArchitectureExplorer arch={arch} />
          </Chapter>
        )}
      </div>
      <Related c={c} />
    </article>
  );
}
