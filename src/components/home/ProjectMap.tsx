import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categories, firstSentence, maturityLabel, projects } from '../../data/projects';
import type { Category, Project } from '../../data/types';
import { lineFor, lineHex } from '../../data/visuals';
import { onFetchProject } from '../../agent/bus';

// Every published project as a map: one root, a branch per area of work, and the projects on the branch the
// visitor opens. Wide screens draw it as a tree across the page; narrow screens as an indented outline, with each
// branch opening in place. The data comes straight from projects.ts; this file only draws it.

const branchOf = (c: Category) => projects.filter((p) => p.category === c);
const tint = (c: Category) => lineHex[lineFor[c]];
const href = (p: Project) => (p.caseStudy ? `/projects/${p.slug}` : `/projects?q=${encodeURIComponent(p.name)}`);

function ProjectNode({ p, fetched }: { p: Project; fetched?: boolean }) {
  return (
    <Link to={href(p)} className="map-proj" data-slug={p.slug} data-fetched={fetched || undefined} style={{ ['--tint' as string]: tint(p.category) }}>
      {fetched && <span className="map-fetched">Fetched</span>}
      <span className="font-sans text-[1rem] font-semibold leading-snug text-charcoal">{p.name}</span>
      <span className="fine mt-1 text-slate">{firstSentence(p.summary)}</span>
      <span className="fine mt-auto flex flex-wrap gap-x-3 pt-2 text-slate">
        <span>{maturityLabel[p.maturity]}</span>
        {p.caseStudy && <span className="font-semibold" style={{ color: tint(p.category) }}>Deep dive</span>}
      </span>
    </Link>
  );
}

export default function ProjectMap() {
  const [open, setOpen] = useState<Category | null>('agents');
  const list = categories.filter((c) => branchOf(c.id).length);
  const index = list.findIndex((c) => c.id === open);
  const branch = open ? branchOf(open) : [];
  const toggle = (c: Category) => setOpen((o) => (o === c ? null : c));

  // Fig. 2 fetched a project: open its area, mark it and bring it into view.
  const [fetched, setFetched] = useState<string | null>(null);
  useEffect(() => onFetchProject((slug) => {
    const p = projects.find((x) => x.slug === slug);
    if (!p) return;
    setOpen(p.category);
    setFetched(slug);
    window.setTimeout(() => {
      const node = [...document.querySelectorAll<HTMLElement>(`.map-proj[data-slug="${slug}"]`)].find((el) => el.offsetParent !== null);
      node?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    }, 60);
  }), []);

  return (
    <div>
      {/* Root */}
      <div className="flex flex-col items-start lg:items-center">
        <div className="map-root">
          <span className="font-sans text-[1.0625rem] font-semibold">{projects.length} projects</span>
          <span className="fine text-ivory/70">{list.length} areas of work</span>
        </div>
        <span className="map-wire ml-6 h-8 w-px lg:ml-0" aria-hidden />
      </div>

      {/* Wide: branches in a row, joined by a bus. */}
      <div className="hidden lg:block">
        <ul className="relative grid gap-3" style={{ gridTemplateColumns: `repeat(${list.length}, minmax(0, 1fr))` }}>
          <span className="map-wire absolute top-0 h-px" style={{ left: `${50 / list.length}%`, right: `${50 / list.length}%` }} aria-hidden />
          {list.map((c) => (
            <li key={c.id} className="relative flex flex-col pt-6">
              <span className="map-wire absolute left-1/2 top-0 h-6 w-px" aria-hidden />
              <button type="button" className="map-cat" style={{ ['--tint' as string]: tint(c.id) }} aria-expanded={open === c.id} aria-controls="map-branch" onClick={() => toggle(c.id)}>
                <span className="font-sans text-[0.9375rem] font-semibold leading-tight text-charcoal">{c.title}</span>
                <span className="fine mt-1 text-slate">{branchOf(c.id).length} projects</span>
              </button>
              {open === c.id && <span className="map-wire absolute -bottom-6 left-1/2 h-6 w-px" aria-hidden />}
            </li>
          ))}
        </ul>
        <div id="map-branch" aria-live="polite" className="mt-6">
          {open && (
            <div className="relative pt-6">
              {/* Bus from the open branch across the projects below it. */}
              <span
                className="map-wire absolute top-0 h-px"
                style={{
                  left: `min(${((index + 0.5) / list.length) * 100}%, 12.5%)`,
                  right: `min(${100 - ((index + 0.5) / list.length) * 100}%, 12.5%)`,
                }}
                aria-hidden
              />
              <p className="sr-only">{list[index].title}: {branch.length} projects</p>
              <p className="ui mb-5 max-w-[40rem] text-slate">{list[index].blurb}</p>
              <ul className="grid grid-cols-4 gap-3">
                {branch.map((p) => (
                  <li key={p.slug} className="relative">
                    <ProjectNode p={p} fetched={fetched === p.slug} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Narrow: an outline with a spine; each branch opens in place. */}
      <ul className="relative ml-6 border-l border-charcoal lg:hidden">
        {list.map((c) => (
          <li key={c.id} className="relative pl-6 pt-3 last:pb-0">
            <span className="map-wire absolute left-0 top-[2.1rem] h-px w-6" aria-hidden />
            <button type="button" className="map-cat" style={{ ['--tint' as string]: tint(c.id) }} aria-expanded={open === c.id} aria-controls={`branch-${c.id}`} onClick={() => toggle(c.id)}>
              <span className="font-sans text-[1rem] font-semibold leading-tight text-charcoal">{c.title}</span>
              <span className="fine mt-1 text-slate">{branchOf(c.id).length} projects</span>
            </button>
            <div id={`branch-${c.id}`} hidden={open !== c.id}>
              <p className="ui mt-3 text-slate">{c.blurb}</p>
              <ul className="mt-3 grid gap-2 border-l border-seam pl-4 sm:grid-cols-2">
                {branchOf(c.id).map((p) => <li key={p.slug}><ProjectNode p={p} fetched={fetched === p.slug} /></li>)}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
