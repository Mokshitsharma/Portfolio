import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { categories, maturityLabel, projects } from '../data/projects';
import type { Category, Maturity, Project } from '../data/types';
import { lineFor, lineHex } from '../data/visuals';
import { Links, PageHeader, StatusMark } from '../components/ui';

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
    production: '#85632d', deployed: '#c39a6b', working: '#3d3830', 'in-progress': '#2d6c88', prototype: '#8c8274', notebook: '#c9bda7', coursework: '#ddd3c1',
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

function ProjectRow({ p }: { p: Project }) {
  const notes = [p.tests, p.relation, p.linkNote].filter(Boolean) as string[];
  const color = lineHex[lineFor[p.category]];
  return (
    <li className="group relative grid gap-x-10 gap-y-3 border-b border-seam py-6 pl-5 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_minmax(0,14rem)]">
      <span className="absolute left-0 top-6 bottom-6 w-[3px] transition-all group-hover:w-[5px]" style={{ background: color }} aria-hidden />
      <div>
        <h3 className="headline text-[1.6rem]">
          {p.caseStudy ? (
            <Link to={`/projects/${p.slug}`} className="link">{p.name}</Link>
          ) : p.name}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          <StatusMark maturity={p.maturity} tone="dark" className="text-charcoal" />
          <span className="label text-slate">{p.period}</span>
        </div>
      </div>
      <div>
        <p className="text-[1.0625rem] leading-relaxed text-charcoal/90">{p.summary}</p>
        <details className="mt-2">
          <summary className="label cursor-pointer text-slate hover:text-charcoal">Stack{notes.length ? ' and notes' : ''}</summary>
          <p className="ui mt-2 text-slate">{p.stack.join(', ')}</p>
          {notes.length > 0 && <ul className="ui mt-1 space-y-0.5 text-slate">{notes.map((n) => <li key={n}>{n}</li>)}</ul>}
        </details>
      </div>
      <div className="flex flex-col gap-2">
        {p.caseStudy && (
          <Link to={`/projects/${p.slug}`} className="ui inline-flex items-center gap-1.5 font-semibold">
            <span className="link">Case study</span><ArrowUpRight size={16} aria-hidden />
          </Link>
        )}
        <Links links={p.links} className="flex-col !gap-2" />
        {!p.caseStudy && p.links.length === 0 && <span className="ui text-slate">No public link</span>}
      </div>
    </li>
  );
}

export default function Projects() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const cat = (params.get('category') ?? '') as Category | '';
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
    () => projects.filter((p) => (!cat || p.category === cat) && (!status || p.maturity === status) && (!onlyCases || p.caseStudy) && matches(p, q)),
    [q, cat, status, onlyCases],
  );
  const filtering = Boolean(q || cat || status || onlyCases);
  const groups = categories.map((c) => ({ ...c, items: results.filter((p) => p.category === c.id) })).filter((g) => g.items.length > 0);
  const caseCount = projects.filter((p) => p.caseStudy).length;

  return (
    <>
      <PageHeader title="Projects" sign="The archive" line="signal" aside={<StatusBar />}>
        <p>
          All {projects.length} published projects, from a production logistics platform to first notebooks, each labelled
          by how far it got. {caseCount} have full case studies.
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
              <input type="checkbox" name="cases" value="1" checked={onlyCases} onChange={(e) => update('cases', e.target.checked ? '1' : '')} className="h-5 w-5 accent-[#85632d]" />
              Case studies only
            </label>
          </div>
          <fieldset className="mt-4">
            <legend className="label text-slate">Area</legend>
            <div className="mt-1.5 flex flex-wrap gap-px bg-seam p-px">
              {[{ id: '', title: 'All areas' }, ...categories].map((c) => {
                const active = cat === c.id;
                return (
                  <button
                    key={c.id || 'all'}
                    type="button"
                    aria-pressed={active}
                    onClick={() => update('category', c.id)}
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

        {groups.map((g) => (
          <section key={g.id} id={g.id} aria-labelledby={`${g.id}-title`} className="mt-16">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate/60 pb-4">
              <div>
                <h2 id={`${g.id}-title`} className="headline flex items-center gap-4 text-[clamp(2rem,4vw,3rem)]">
                  <span className="inline-block h-3 w-3" style={{ background: lineHex[lineFor[g.id]] }} aria-hidden />
                  {g.title}
                </h2>
                <p className="ui mt-2 text-slate">{g.blurb}</p>
              </div>
              <p className="label text-slate">{g.items.length} {g.items.length === 1 ? 'project' : 'projects'}</p>
            </div>
            <ul>{g.items.map((p) => <ProjectRow key={p.slug} p={p} />)}</ul>
          </section>
        ))}
        <div className="h-24" />
      </div>
    </>
  );
}
