import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { caseStudies, caseStudyBySlug } from '../data/caseStudies';
import { categories, projectBySlug } from '../data/projects';
import type { CaseStudy, Project } from '../data/types';
import { lineFor, lineHex, type Line } from '../data/visuals';
import ProjectVisual from '../components/ProjectVisual';
import { cardFor } from '../data/cards';
import { Flow, SystemMap } from '../components/Diagrams';
import { Links, StatusMark, lineBg, lineText } from '../components/ui';
import NotFound from './NotFound';

interface Part {
  id: string;
  title: string;
  node: ReactNode;
  wide?: boolean;
}

function Hero({ c, p, line }: { c: CaseStudy; p: Project; line: Line }) {
  const cat = categories.find((x) => x.id === p.category)!;
  const shot = c.figures?.[0];
  return (
    <header className="grid-texture relative overflow-hidden pt-28 text-bone md:pt-32">
      <div className="shell pb-14 md:pb-20">
        <nav aria-label="Breadcrumb" className="label text-stone">
          <ol className="flex flex-wrap gap-2">
            <li><Link to="/projects" className="link">Projects</Link><span aria-hidden> /</span></li>
            <li aria-current="page" className="text-bone">{p.name}</li>
          </ol>
        </nav>
        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end">
          <div>
            <p className={`sign flex items-center gap-3 ${lineText[line]}`}>
              <span className={`inline-block h-[2px] w-10 ${lineBg[line]}`} aria-hidden />{cat.title}
            </p>
            <h1 className="headline mt-5 text-[clamp(2.4rem,5.6vw,4.75rem)]">{c.title}</h1>
            <p className="lede mt-6 max-w-2xl font-sans text-stone">{c.lede}</p>
          </div>
          <div>
            {shot ? (
              <figure className="border-[6px] border-[#4a3222] bg-char" style={{ boxShadow: `0 40px 80px -40px rgb(0 0 0 / 0.95), 0 0 0 1px ${lineHex[line]}55` }}>
                <img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} className="block h-auto w-full" />
                <figcaption className="fine bg-night-2 px-3 py-2 text-stone">{shot.caption}</figcaption>
              </figure>
            ) : (
              <div className="border-[6px] border-[#4a3222]"><ProjectVisual slug={p.slug} variant="hero" /></div>
            )}
            <dl className="ui mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
              <div><dt className="label text-stone">Status</dt><dd className="mt-1"><StatusMark maturity={p.maturity} tone="dark" className="text-bone" /></dd></div>
              <div><dt className="label text-stone">When</dt><dd className="mt-1 text-bone">{p.period}</dd></div>
            </dl>
          </div>
        </div>
      </div>
      <div className={`rail ${lineBg[line]}`} aria-hidden />
    </header>
  );
}

function Prose({ children }: { children: ReactNode }) {
  return <div className="measure space-y-5 text-[1.1875rem] leading-[1.7]">{children}</div>;
}

function Overview({ c, p }: { c: CaseStudy; p: Project }) {
  return (
    <div className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_16rem]">
      <Prose>
        <p>{c.context}</p>
        <h3 className="headline !mt-10 text-2xl">My role</h3>
        <p>{c.role}</p>
        <h3 className="headline !mt-10 text-2xl">Where it stands</h3>
        <p>{c.status}</p>
      </Prose>
      <aside className="space-y-8 xl:border-l xl:border-joint xl:pl-8">
        <div>
          <h3 className="label text-stone">Stack</h3>
          <ul className="ui mt-3 flex flex-wrap gap-2">{p.stack.map((s) => <li key={s} className="chip">{s}</li>)}</ul>
        </div>
        <div>
          <h3 className="label text-stone">Code and links</h3>
          {p.links.length > 0 && <Links links={p.links} className="mt-3 flex-col !gap-2" />}
          {p.linkNote && <p className="ui mt-2 text-stone">{p.linkNote}</p>}
        </div>
      </aside>
    </div>
  );
}

function Decisions({ c, line }: { c: CaseStudy; line: Line }) {
  return (
    <ul className="divide-y divide-joint border-y border-joint">
      {c.decisions.map((d) => (
        <li key={d.title} className="grid gap-4 py-8 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-10">
          <h3 className="headline flex gap-3 text-2xl">
            <span className={`mt-2 inline-block h-3 w-3 shrink-0 ${lineBg[line]}`} aria-hidden />
            {d.title}
          </h3>
          <p className="measure text-[1.125rem] leading-[1.7]">{d.body}</p>
        </li>
      ))}
    </ul>
  );
}

function Facts({ c, slug }: { c: CaseStudy; slug: string }) {
  return (
    <div className="space-y-12">
      {c.facts && c.facts.length > 0 && (
        <dl className="grid gap-px bg-joint sm:grid-cols-2">
          {c.facts.map((f) => (
            <div key={f.label} className="bg-char p-6">
              <dt className="label text-stone">{f.label}</dt>
              <dd className="headline mt-3 text-[1.75rem] leading-tight">{f.value}</dd>
              <dd className="fine mt-3 text-stone">{f.source}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

function Sections({ c, line }: { c: CaseStudy; line: Line }) {
  return (
    <div className="space-y-12">
      {c.sections.map((s) => (
        <div key={s.heading}>
          <h3 className="headline text-3xl">{s.heading}</h3>
          <div className="mt-4"><Prose>
            {s.body?.map((para) => <p key={para}>{para}</p>)}
            {s.points && (
              <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
                {s.points.map((pt) => (
                  <li key={pt} className="ui flex gap-3 border-t border-joint pt-2 text-[1rem]"><span className={`mt-2 inline-block h-2 w-2 shrink-0 ${lineBg[line]}`} aria-hidden />{pt}</li>
                ))}
              </ul>
            )}
          </Prose></div>
        </div>
      ))}
    </div>
  );
}

function Figures({ c }: { c: CaseStudy }) {
  const rest = c.figures ?? [];
  return (
    <div className="grid gap-12 lg:grid-cols-2">
      {rest.map((f, i) => (
        <figure key={f.src} className={i === 0 && rest.length % 2 === 1 ? 'lg:col-span-2' : ''}>
          <div className="border-[6px] border-[#4a3222] bg-char">
            <img src={f.src} alt={f.alt} width={f.width} height={f.height} loading="lazy" decoding="async" className="block h-auto w-full" />
          </div>
          <figcaption className="fine mt-4 text-stone">{f.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="measure space-y-4">
      {items.map((q) => (
        <li key={q} className="flex gap-4 text-[1.125rem] leading-[1.65]">
          <span className="mt-2 inline-block h-2.5 w-2.5 shrink-0 bg-brass" aria-hidden />
          <span>{q}</span>
        </li>
      ))}
    </ul>
  );
}

function Related({ c }: { c: CaseStudy }) {
  const index = caseStudies.findIndex((x) => x.slug === c.slug);
  const next = caseStudies[(index + 1) % caseStudies.length];
  const nextProject = projectBySlug(next.slug)!;
  const related = (c.related ?? []).map((s) => projectBySlug(s)).filter(Boolean) as Project[];
  return (
    <section aria-labelledby="more" className="border-t border-joint bg-char">
      <div className="shell grid gap-12 py-16 md:py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="group relative">
          <p className="label text-stone">Next case study</p>
          <h2 id="more" className="display mt-3 text-[clamp(2.75rem,6vw,5rem)]">
            <Link to={`/projects/${next.slug}`} className="no-underline after:absolute after:inset-0 group-hover:text-brass">{nextProject.name}</Link>
          </h2>
          <p className="ui mt-3 max-w-md text-stone">{cardFor(next.slug).pitch}</p>
          <ArrowUpRight size={28} className="mt-4 text-brass transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
        </div>
        <div>
          <p className="label text-stone">Related</p>
          <ul className="mt-3 divide-y divide-joint border-y border-joint">
            {related.map((r) => (
              <li key={r.slug}>
                <Link to={r.caseStudy ? `/projects/${r.slug}` : `/projects?q=${encodeURIComponent(r.name)}`} className="group flex items-center justify-between gap-4 py-4 no-underline">
                  <span>
                    <span className="headline block text-2xl text-bone group-hover:text-brass">{r.name}</span>
                    <span className="ui text-stone">{r.caseStudy ? cardFor(r.slug).pitch : r.summary}</span>
                  </span>
                  <ArrowUpRight size={20} className="shrink-0 text-bone" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/projects" className="btn-ghost-dark btn mt-8">All projects</Link>
        </div>
      </div>
    </section>
  );
}

export default function CaseStudyPage() {
  const { slug = '' } = useParams();
  const c = caseStudyBySlug(slug);
  const p = projectBySlug(slug);
  if (!c || !p) return <NotFound />;
  const line = lineFor[p.category];

  const diagram: Part | null = c.map
    ? { id: 'architecture', title: 'Architecture', node: <SystemMap {...c.map} line={line} />, wide: true }
    : c.flow
      ? { id: 'architecture', title: c.flow.title, node: <Flow {...c.flow} line={line} />, wide: true }
      : null;
  const decisions: Part = { id: 'decisions', title: 'Decisions and trade-offs', node: <Decisions c={c} line={line} /> };
  const hasEvidence = (c.facts?.length ?? 0) > 0;
  const factTitle = { production: 'Scale', agent: 'Results', model: 'Evaluation', engineering: 'Measured' }[c.layout];
  const facts: Part | null = hasEvidence ? { id: 'results', title: factTitle, node: <Facts c={c} slug={slug} /> } : null;
  const sections: Part | null = c.sections.length ? { id: 'details', title: 'Implementation', node: <Sections c={c} line={line} /> } : null;
  const figures: Part | null = (c.figures?.length ?? 0) > 1 ? { id: 'screens', title: 'Screens', node: <Figures c={{ ...c, figures: c.figures!.slice(1) }} /> } : null;
  const quality: Part | null = c.quality?.length ? { id: 'quality', title: 'Testing and results', node: <Checklist items={c.quality} /> } : null;
  const overview: Part = { id: 'overview', title: 'Overview', node: <Overview c={c} p={p} /> };

  // Different subjects lead with different evidence.
  const order: Record<CaseStudy['layout'], (Part | null)[]> = {
    production: [overview, diagram, decisions, sections, facts, quality],
    agent: [overview, diagram, decisions, sections, facts, figures, quality],
    model: [overview, facts, diagram, decisions, sections, figures, quality],
    engineering: [overview, decisions, facts, diagram, sections, figures, quality],
  };
  const parts = order[c.layout].filter(Boolean) as Part[];

  return (
    <article>
      <Hero c={c} p={p} line={line} />
      <div className="shell grid gap-10 py-16 md:py-20 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="On this page" className="hidden lg:block">
          <ol className="sticky top-28 space-y-2 border-l-2 border-joint">
            {parts.map((part) => (
              <li key={part.id}>
                <a href={`#${part.id}`} className="ui -ml-[2px] block border-l-2 border-transparent py-1 pl-4 text-stone no-underline hover:border-brass hover:text-bone">
                  {part.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="min-w-0 space-y-20">
          {parts.map((part) => (
            <section key={part.id} id={part.id} aria-labelledby={`${part.id}-h`} className="reveal">
              <h2 id={`${part.id}-h`} className="headline mb-8 flex items-center gap-4 text-[clamp(2rem,3.5vw,2.75rem)]">
                <span className={`inline-block h-[2px] w-10 ${lineBg[line]}`} aria-hidden />
                {part.title}
              </h2>
              {part.node}
            </section>
          ))}
        </div>
      </div>
      <Related c={c} />
    </article>
  );
}
