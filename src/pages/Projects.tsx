import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { categories, firstSentence, maturityLabel, projects } from '../data/projects';
import type { Category, Maturity, Project } from '../data/types';
import { areaHex } from '../data/visuals';
import { shelves } from '../data/home';
import { cardFor } from '../data/cards';
import { StatusMark } from '../components/ui';
import ProjectCardImage from '../components/ProjectCardImage';

// The Projects room. Case studies come first as a stack of large cards that settle on top of one another as you
// scroll, each with its picture on a monitor. Below them, the rest of the archive as a searchable index. The
// area, shelf, status and search filters live in the URL and apply to both.

const maturities = Object.keys(maturityLabel) as Maturity[];

function matches(p: Project, q: string) {
  if (!q) return true;
  const hay = [p.name, p.summary, p.stack.join(' '), p.relation ?? ''].join(' ').toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every((word) => hay.includes(word));
}

const linkLabel = (kind: string) => (kind === 'repo' ? 'Source' : kind === 'store' ? 'App store' : 'Live demo');

function StackCard({ p, i }: { p: Project; i: number }) {
  const area = categories.find((c) => c.id === p.category)!;
  const link = p.links.find((l) => l.kind === 'repo' || l.kind === 'demo' || l.kind === 'store');
  return (
    <li className="stack-card" style={{ ['--i' as string]: i, ['--tint' as string]: areaHex[p.category] }}>
      <div className="stack-inner">
        <div className="flex flex-col">
          <p className="font-sans text-[0.8125rem] font-semibold" style={{ color: areaHex[p.category] }}>{area.title}</p>
          <h3 className="mt-2 font-sans text-[clamp(1.6rem,2.6vw,2.3rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-charcoal">{p.name}</h3>
          <p className="mt-4 max-w-[30rem] text-[1.0625rem] leading-[1.6] text-charcoal/80">{cardFor(p.slug).pitch || firstSentence(p.summary)}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {p.stack.slice(0, 5).map((t) => <li key={t} className="ptag">{t}</li>)}
          </ul>
          <div className="mt-auto flex flex-wrap items-center gap-3 pt-7">
            <Link to={`/projects/${p.slug}`} className="pill pill-solid !min-h-10">Read the full project</Link>
            {link && (
              <a href={link.href} target="_blank" rel="noopener noreferrer" className="pill !min-h-10">
                {linkLabel(link.kind)}<ArrowUpRight size={15} aria-hidden /><span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
            <StatusMark maturity={p.maturity} tone="dark" className="text-charcoal/80" />
          </div>
        </div>
        <div className="monitor">
          <div className="monitor-screen"><ProjectCardImage p={p} /></div>
          <span className="monitor-neck" aria-hidden />
          <span className="monitor-foot" aria-hidden />
        </div>
      </div>
    </li>
  );
}

function IndexRow({ p }: { p: Project }) {
  const area = categories.find((c) => c.id === p.category)!;
  const link = p.links.find((l) => l.kind === 'repo' || l.kind === 'demo' || l.kind === 'store');
  return (
    <li className="ix-row">
      <div className="min-w-0">
        <h3 className="font-sans text-[1.0625rem] font-semibold text-charcoal">{p.name}</h3>
        <p className="ui mt-0.5 text-charcoal/70">{firstSentence(p.summary)}</p>
      </div>
      <p className="fine" style={{ color: areaHex[p.category] }}>{area.short}</p>
      <div><StatusMark maturity={p.maturity} tone="dark" className="fine text-charcoal/75" /></div>
      <p className="fine tabular-nums text-charcoal/60">{p.period}</p>
      <div className="ix-act">
        {link ? (
          <a href={link.href} target="_blank" rel="noopener noreferrer" className="fine inline-flex items-center gap-1 font-semibold text-charcoal">
            <span className="link">{linkLabel(link.kind)}</span><ArrowUpRight size={13} aria-hidden /><span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          <details>
            <summary className="fine cursor-pointer font-semibold text-charcoal">Details</summary>
            <p className="fine mt-1 text-charcoal/70">{p.stack.join(', ')}</p>
            {p.linkNote && <p className="fine mt-1 text-charcoal/70">{p.linkNote}</p>}
          </details>
        )}
      </div>
    </li>
  );
}

export default function Projects() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const cat = (params.get('category') ?? '') as Category | '';
  const shelf = shelves.find((x) => x.id === params.get('shelf'));
  const status = (params.get('status') ?? '') as Maturity | '';

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true, preventScrollReset: true });
  };
  const pickArea = (id: string) => {
    const next = new URLSearchParams(params);
    next.delete('shelf');
    if (id) next.set('category', id);
    else next.delete('category');
    setParams(next, { replace: true, preventScrollReset: true });
  };
  const clear = () => setParams(new URLSearchParams(), { replace: true, preventScrollReset: true });

  const results = useMemo(
    () => projects.filter((p) => (!shelf || shelf.slugs.includes(p.slug)) && (!cat || p.category === cat || !!p.also?.includes(cat)) && (!status || p.maturity === status) && matches(p, q)),
    [q, cat, shelf, status],
  );
  const cases = results.filter((p) => p.caseStudy);
  const rest = results.filter((p) => !p.caseStudy);
  const filtering = Boolean(q || cat || shelf || status);
  const caseCount = projects.filter((p) => p.caseStudy).length;

  return (
    <div className="room">
      <header className="shell pb-10 pt-28 md:pt-36">
        <h1 className="cine-name !text-[clamp(3rem,8vw,6.5rem)]">Projects</h1>
        <p className="mt-5 max-w-[40rem] text-[1.125rem] leading-[1.6] text-charcoal/75">
          {projects.length} projects, each labelled by how far it got. The {caseCount} with a full case study come first, with
          their architecture drawn out; the rest of the archive is listed below them.
        </p>
        <nav aria-label="Areas" className="mt-8 flex flex-wrap gap-2">
          {[{ id: '', title: 'Every area' }, ...categories].map((c) => (
            <button key={c.id || 'all'} type="button" aria-pressed={!shelf && cat === c.id} className="room-chip" onClick={() => pickArea(c.id)}>
              {c.title}
            </button>
          ))}
        </nav>
        {shelf && <p className="ui mt-4 text-charcoal/70">Showing the shelf “{shelf.title}”. <button type="button" className="link" onClick={() => update('shelf', '')}>Show every project</button></p>}
      </header>

      {cases.length > 0 && (
        <section aria-labelledby="cases-title" className="shell">
          <h2 id="cases-title" className="sr-only">Case studies</h2>
          <ol className="stack">
            {cases.map((p, i) => <StackCard key={p.slug} p={p} i={i} />)}
          </ol>
        </section>
      )}

      <section aria-labelledby="archive-title" className="shell pb-28 pt-20">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-seam pb-6">
          <div>
            <h2 id="archive-title" className="cine-h2 !text-[clamp(1.8rem,3.4vw,2.8rem)]">The rest of the archive</h2>
            <p className="ui mt-2 text-charcoal/70" aria-live="polite">
              {filtering ? `${results.length} of ${projects.length} projects match.` : `${rest.length} more projects: notebooks, prototypes, coursework and tools.`}
              {filtering && <> <button type="button" onClick={clear} className="link font-semibold text-charcoal">Clear filters</button></>}
            </p>
          </div>
          <form role="search" aria-label="Filter projects" onSubmit={(e) => e.preventDefault()} className="flex flex-wrap gap-3">
            <label className="sr-only" htmlFor="q">Search projects</label>
            <input id="q" type="search" value={q} onChange={(e) => update('q', e.target.value)} placeholder="Search name or technology" className="field-input h-11 w-[16rem] max-w-full" />
            <label className="sr-only" htmlFor="status">Status</label>
            <select id="status" value={status} onChange={(e) => update('status', e.target.value)} className="field-input h-11 w-auto">
              <option value="">Any status</option>
              {maturities.map((m) => <option key={m} value={m}>{maturityLabel[m]}</option>)}
            </select>
          </form>
        </div>
        {results.length === 0 ? (
          <p className="mt-10 text-lg">Nothing matches. Try a broader word, or <button type="button" className="link" onClick={clear}>clear the filters</button>.</p>
        ) : rest.length === 0 ? (
          <p className="ui mt-8 text-charcoal/70">Every match is a case study, shown above.</p>
        ) : (
          <ul className="ix">{rest.map((p) => <IndexRow key={p.slug} p={p} />)}</ul>
        )}
      </section>
    </div>
  );
}
