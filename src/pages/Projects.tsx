import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { categories, firstSentence, maturityLabel, projects } from '../data/projects';
import type { Category, Maturity, Project } from '../data/types';
import { areaHex } from '../data/visuals';
import { shelves } from '../data/home';
import { Links, PageHeader, StatusMark } from '../components/ui';
import ProjectCardImage from '../components/ProjectCardImage';

// The project catalogue: every published project as a card (four to a row on wide screens, two on tablets, one
// on phones), filtered by shelf, area, status, case studies or a search, all kept in the URL.

const maturities = Object.keys(maturityLabel) as Maturity[];

function matches(p: Project, q: string) {
  if (!q) return true;
  const hay = [p.name, p.summary, p.stack.join(' '), p.relation ?? ''].join(' ').toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every((word) => hay.includes(word));
}

// How the archive splits by status. Real counts from the data.
function StatusBar() {
  const counts = maturities.map((m) => ({ m, n: projects.filter((p) => p.maturity === m).length })).filter((c) => c.n > 0);
  // From lit to unlit: the further a project got, the warmer its light.
  const shade: Record<Maturity, string> = {
    production: '#ede6d6', deployed: '#c9a45c', working: '#a9b0a6', 'in-progress': '#8fb59a', prototype: '#59645d', notebook: '#2b3430', coursework: '#1b221e',
  };
  return (
    <figure className="w-full max-w-md">
      <div className="flex h-4 w-full overflow-hidden border border-seam" aria-hidden>
        {counts.map((c) => <span key={c.m} style={{ flex: c.n, background: shade[c.m] }} />)}
      </div>
      <figcaption>
        <ul className="fine mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-mist">
          {counts.map((c) => (
            <li key={c.m} className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 border border-seam" style={{ background: shade[c.m] }} aria-hidden />
              <span className="text-charcoal">{c.n}</span> {maturityLabel[c.m].toLowerCase()}
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}

function ProjectCard({ p }: { p: Project }) {
  const area = categories.find((c) => c.id === p.category)!;
  const repo = p.links.find((l) => l.kind === 'repo' || l.kind === 'demo' || l.kind === 'store');
  return (
    <li className="card" style={{ ['--tint' as string]: areaHex[p.category] }}>
      <ProjectCardImage p={p} />
      <div className="flex flex-1 flex-col p-5">
        <p className="label" style={{ color: areaHex[p.category] }}>{area.title}</p>
        <h3 className="headline mt-1 text-[1.35rem] text-charcoal">{p.name}</h3>
        <p className="ui mt-2 text-charcoal/85">{firstSentence(p.summary)}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <StatusMark maturity={p.maturity} tone="dark" className="text-charcoal" />
          <span className="fine text-slate">{p.period}</span>
        </div>
        <div className="mt-auto pt-5">
          {p.caseStudy ? (
            <Link to={`/projects/${p.slug}`} className="btn btn-brass !min-h-10 w-full justify-center">Read the full project</Link>
          ) : repo ? (
            <Links links={[repo]} />
          ) : (
            <details>
              <summary className="ui cursor-pointer font-semibold text-charcoal">More about it</summary>
              <p className="fine mt-2 text-slate">{p.summary}</p>
              <p className="fine mt-1 text-slate">{p.stack.join(', ')}</p>
              {p.linkNote && <p className="fine mt-1 text-slate">{p.linkNote}</p>}
            </details>
          )}
        </div>
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
  const onlyCases = params.get('cases') === '1';

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true, preventScrollReset: true });
  };
  const clear = () => setParams(new URLSearchParams(), { replace: true, preventScrollReset: true });

  const results = useMemo(
    () => projects
      .filter((p) => (!shelf || shelf.slugs.includes(p.slug)) && (!cat || p.category === cat || !!p.also?.includes(cat)) && (!status || p.maturity === status) && (!onlyCases || p.caseStudy) && matches(p, q))
      .sort((a, b) => Number(!!b.caseStudy) - Number(!!a.caseStudy)),
    [q, cat, shelf, status, onlyCases],
  );
  const filtering = Boolean(q || cat || shelf || status || onlyCases);
  const caseCount = projects.filter((p) => p.caseStudy).length;

  return (
    <>
      <PageHeader title="All projects" sign="The catalogue" line="signal" aside={<StatusBar />}>
        <p>
          All {projects.length} published projects, each labelled by how far it got. {caseCount} have a full case study with
          their architecture; case studies come first.
        </p>
      </PageHeader>

      <div className="shell">
        <form
          role="search"
          aria-label="Filter projects"
          method="get"
          onSubmit={(e) => e.preventDefault()}
          className="sticky top-16 z-30 -mx-5 border-b border-seam bg-ivory/95 px-5 py-5 backdrop-blur-sm sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12"
        >
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,14rem)_auto] lg:items-end">
            <div>
              <label htmlFor="q" className="label block text-slate">Search</label>
              <input id="q" name="q" type="search" value={q} onChange={(e) => update('q', e.target.value)} placeholder="Name, technology or idea" className="field-input mt-1.5 h-12" />
            </div>
            <div>
              <label htmlFor="status" className="label block text-slate">Status</label>
              <select id="status" name="status" value={status} onChange={(e) => update('status', e.target.value)} className="field-input mt-1.5 h-12">
                <option value="">Any status</option>
                {maturities.map((m) => <option key={m} value={m}>{maturityLabel[m]}</option>)}
              </select>
            </div>
            <label className="ui flex h-12 cursor-pointer items-center gap-3 font-semibold">
              <input type="checkbox" name="cases" value="1" checked={onlyCases} onChange={(e) => update('cases', e.target.checked ? '1' : '')} className="h-5 w-5 accent-[#2343b5]" />
              Case studies only
            </label>
          </div>
          <fieldset className="mt-4">
            <legend className="label text-slate">Shelf</legend>
            <div className="mt-1.5 flex flex-wrap gap-px bg-seam p-px">
              {[{ id: '', title: 'All projects' }, ...shelves].map((c) => {
                const active = (shelf?.id ?? '') === c.id;
                return (
                  <button
                    key={c.id || 'all'}
                    type="button"
                    aria-pressed={active}
                    onClick={() => update('shelf', c.id)}
                    className={`ui min-h-10 flex-auto px-3 py-2 text-left transition-colors ${active ? 'bg-brass-fill font-semibold text-charcoal shadow-[inset_0_-2px_0_var(--color-brass)]' : 'bg-white/60 text-charcoal hover:bg-sand'}`}
                  >
                    {c.title}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <noscript><button type="submit" className="btn-ink btn mt-4">Apply</button></noscript>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="ui text-slate" aria-live="polite">
            {filtering ? `${results.length} of ${projects.length} projects match.` : `Showing all ${projects.length} projects.`}
          </p>
          {filtering && <button type="button" onClick={clear} className="ui link font-semibold">Clear filters</button>}
        </div>

        {results.length === 0 && (
          <p className="mt-10 text-lg">
            Nothing matches. Try a broader word, or <button type="button" className="link" onClick={clear}>clear the filters</button>.
          </p>
        )}

        <ul className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {results.map((p) => <ProjectCard key={p.slug} p={p} />)}
        </ul>
        <div className="h-24" />
      </div>
    </>
  );
}
