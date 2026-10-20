import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, FileText } from 'lucide-react';
import { Detail, useDetail } from './Detail';
import { Links, StatusMark } from './ui';
import { cardFor } from '../data/cards';
import { categories, maturityLabel, projectBySlug } from '../data/projects';
import { education } from '../data/profile';
import { lineFor, lineHex } from '../data/visuals';
import { skillsFor, type Domain } from '../data/domains';
import { rolePageBySlug, rolesForDomain } from '../data/rolePages';
import type { Plaque } from '../data/achievements';
import type { Credential, Project } from '../data/types';

// The house's furniture: framed credentials, plaques, project files and wall displays. Each object is a real
// button that opens a detail view with everything the records hold about it, and a way on to the full page.

const projectHref = (p: Project) => (p.caseStudy ? `/projects/${p.slug}` : `/projects?q=${encodeURIComponent(p.name)}`);

function Actions({ children }: { children: ReactNode }) {
  return <div className="mt-8 flex flex-wrap gap-3 border-t border-seam pt-6">{children}</div>;
}

/* ------------------------------------------------------------ Framed credentials */

export function CredentialWall({ items, className = '' }: { items: Credential[]; className?: string }) {
  const d = useDetail<Credential>();
  return (
    <>
      <ul className={`grid gap-5 sm:grid-cols-2 xl:grid-cols-3 ${className}`}>
        {items.map((c) => (
          <li key={c.title}>
            <button type="button" className="cert-frame" onClick={() => d.open(c)} aria-haspopup="dialog">
              <span className="cert-mat">
                <span className="fine text-slate">{c.issuer}</span>
                <span className="headline mt-2 block text-[1.35rem] text-charcoal">{c.title}</span>
                <span className="fine mt-2 block text-slate">{c.about}</span>
                <span className="fine mt-auto flex items-center justify-between gap-3 pt-3 text-slate">
                  <span>{c.date ?? ''}</span>
                  <span className="font-semibold text-brass">View</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Detail open={!!d.item} onClose={d.close} title={d.item?.title ?? ''} sign="Framed credential">
        {d.item && (
          <>
            <p className="text-[1.0625rem] leading-relaxed">{d.item.about}</p>
            <dl className="ui mt-5 grid grid-cols-[8rem_1fr] gap-x-6 gap-y-3">
              <dt className="text-slate">Issued by</dt><dd className="text-charcoal">{d.item.issuer}</dd>
              {d.item.date && (<><dt className="text-slate">Completed</dt><dd className="text-charcoal">{d.item.date}</dd></>)}
              <dt className="text-slate">Certificate</dt>
              <dd className="text-charcoal">{d.item.href ? 'The issuer’s copy, linked below' : 'Not published online yet'}</dd>
            </dl>
            {d.item.related && (
              <>
                <h3 className="label mt-7 text-slate">Related work on this site</h3>
                <ul className="mt-2 divide-y divide-seam border-y border-seam">
                  {d.item.related.map((s) => {
                    const p = projectBySlug(s)!;
                    return (
                      <li key={s}>
                        <Link to={projectHref(p)} className="group grid gap-1 py-3 no-underline sm:grid-cols-[12rem_1fr] sm:gap-4">
                          <span className="ui font-semibold text-charcoal group-hover:text-brass">{p.name}</span>
                          <span className="ui text-slate">{cardFor(s).pitch}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
            <Actions>
              {d.item.href && (
                <a href={d.item.href} target="_blank" rel="noopener noreferrer" className="btn btn-brass">
                  <FileText size={17} aria-hidden />View the certificate<span className="sr-only"> (the issuer’s copy, opens in a new tab)</span>
                </a>
              )}
              <Link to="/achievements" className="btn btn-line">Every credential</Link>
            </Actions>
          </>
        )}
      </Detail>
    </>
  );
}

/* ------------------------------------------------------------ Education */

export function EducationFrame() {
  const d = useDetail<true>();
  return (
    <>
      <button type="button" className="cert-frame cert-frame-diploma w-full" onClick={() => d.open(true)} aria-haspopup="dialog">
        <span className="cert-mat">
          <span className="fine text-slate">Education</span>
          <span className="headline mt-2 block text-[1.5rem] text-charcoal">{education.degree}</span>
          <span className="ui mt-2 block text-slate">{education.school}</span>
          <span className="fine mt-3 flex items-center justify-between gap-3 text-slate">
            <span>{education.years}. {education.grade}.</span>
            <span className="font-semibold text-brass">View</span>
          </span>
        </span>
      </button>
      <Detail open={!!d.item} onClose={d.close} title={education.degree} sign="Academic record">
        <dl className="ui grid grid-cols-[8rem_1fr] gap-x-6 gap-y-3">
          <dt className="text-slate">School</dt><dd className="text-charcoal">{education.school}</dd>
          <dt className="text-slate">Years</dt><dd className="text-charcoal">{education.years}</dd>
          <dt className="text-slate">Grade</dt><dd className="text-charcoal">{education.grade}</dd>
        </dl>
        <p className="ui mt-5 text-slate">
          The integrated programme runs five years. The AI, data and software work done alongside it is in the project
          archive and on the experience timeline.
        </p>
        <Actions>
          <Link to="/experience" className="btn btn-brass">Experience, with documents</Link>
          <Link to="/about" className="btn btn-line">About me</Link>
        </Actions>
      </Detail>
    </>
  );
}

/* ------------------------------------------------------------ Plaques */

export function PlaqueWall({ items }: { items: Plaque[] }) {
  const d = useDetail<Plaque>();
  return (
    <>
      <ul className="grid gap-5 md:grid-cols-3">
        {items.map((x) => (
          <li key={x.id}>
            <button type="button" className="plaque" onClick={() => d.open(x)} aria-haspopup="dialog">
              <span className="fine text-slate">{x.context}</span>
              <span className="headline mt-2 block text-[1.45rem] text-charcoal">{x.title}</span>
              <span className="fine mt-4 flex items-center justify-between gap-3">
                <span className="text-slate">{x.status ? `${x.status}. ` : ''}{x.when}</span>
                <span className="font-semibold text-brass">View</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Detail open={!!d.item} onClose={d.close} title={d.item?.title ?? ''} sign={d.item?.context}>
        {d.item && (
          <>
            <p className="fine text-slate">{d.item.status ? `${d.item.status}. ` : ''}{d.item.when}</p>
            <div className="mt-4 space-y-3">{d.item.body.map((b) => <p key={b} className="text-[1.0625rem] leading-relaxed">{b}</p>)}</div>
            {d.item.external && <Links links={d.item.external} className="mt-5 flex-col !gap-2 text-charcoal" />}
            {d.item.internal && (
              <Actions>
                {d.item.internal.map((l) => <Link key={l.to} to={l.to} className="btn btn-brass">{l.label}</Link>)}
              </Actions>
            )}
          </>
        )}
      </Detail>
    </>
  );
}

/* ------------------------------------------------------------ Project files */

export function ProjectDetailBody({ p }: { p: Project }) {
  const area = categories.find((c) => c.id === p.category)!;
  const card = cardFor(p.slug);
  const notes = [p.tests, p.relation, p.linkNote].filter(Boolean) as string[];
  return (
    <>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <StatusMark maturity={p.maturity} tone="light" className="text-charcoal" />
        <span className="fine text-slate">{p.period}</span>
        <span className="fine text-slate">{area.title}</span>
      </div>
      <p className="mt-5 text-[1.0625rem] leading-relaxed">{p.summary}</p>
      {card.detail && <p className="ui mt-3 text-slate">{card.detail}</p>}
      <h3 className="label mt-6 text-slate">Built with</h3>
      <ul className="mt-2 flex flex-wrap gap-1.5">{p.stack.map((s) => <li key={s} className="chip">{s}</li>)}</ul>
      {notes.length > 0 && <ul className="ui mt-5 space-y-1 text-slate">{notes.map((n) => <li key={n}>{n}</li>)}</ul>}
      {p.links.length > 0 && <Links links={p.links} className="mt-5 flex-col !gap-2 text-charcoal" />}
      <Actions>
        <Link to={projectHref(p)} className="btn btn-brass">{p.caseStudy ? 'Read the full case study' : 'Open in the archive'}</Link>
      </Actions>
    </>
  );
}

export type ShelfVariant = 'binders' | 'cards' | 'drawers' | 'screens';

/**
 * The rest of a room's projects, kept the way that room keeps things: binders in the lab's cabinet, cards on the
 * control desk, drawers in the archive, screens in the studio. Every variant is the same button and opens the
 * same project record; only the furniture differs.
 */
export function ProjectShelf({ slugs, label, variant = 'binders' }: { slugs: string[]; label: string; variant?: ShelfVariant }) {
  const d = useDetail<Project>();
  const items = slugs.map((s) => projectBySlug(s)!).filter(Boolean);
  return (
    <>
      <ul aria-label={label} className={`shelf shelf-${variant}`}>
        {items.map((p) => (
          <li key={p.slug}>
            <button
              type="button"
              className={`project-file file-${variant}`}
              style={{ ['--tint' as string]: lineHex[lineFor[p.category]] }}
              onClick={() => d.open(p)}
              aria-haspopup="dialog"
            >
              {variant === 'screens' && <span className="file-screen-bar" aria-hidden />}
              <span className="headline block text-[1.15rem] leading-tight text-charcoal">{p.name}</span>
              {variant === 'cards' && <span className="ui mt-2 block text-slate">{cardFor(p.slug).pitch}</span>}
              <span className={`fine block text-slate ${variant === 'drawers' ? '' : 'mt-auto pt-4'}`}>{maturityLabel[p.maturity]}, {p.period}</span>
              {variant === 'drawers' && <span className="file-pull" aria-hidden />}
            </button>
          </li>
        ))}
      </ul>
      <Detail open={!!d.item} onClose={d.close} title={d.item?.name ?? ''} sign="Project file" tint={d.item ? lineHex[lineFor[d.item.category]] : undefined}>
        {d.item && <ProjectDetailBody p={d.item} />}
      </Detail>
    </>
  );
}

/* ------------------------------------------------------------ Domain displays */

export function DomainDetailBody({ d }: { d: Domain }) {
  const roles = (rolesForDomain[d.id] ?? []).map((s) => rolePageBySlug(s)!).filter(Boolean);
  return (
    <>
      <p className="text-[1.0625rem] leading-relaxed">{d.line}</p>
      <p className="ui mt-4 border-l-2 border-brass pl-4 text-charcoal">{d.evidence}</p>
      <h3 className="label mt-7 text-slate">Skills</h3>
      <ul className="mt-2 flex flex-wrap gap-1.5">{skillsFor(d).map((s) => <li key={s} className="chip">{s}</li>)}</ul>
      <h3 className="label mt-7 text-slate">Projects</h3>
      <ul className="mt-2 divide-y divide-seam border-y border-seam">
        {d.projects.map((s) => {
          const p = projectBySlug(s)!;
          return (
            <li key={s}>
              <Link to={projectHref(p)} className="group grid gap-1 py-3 no-underline sm:grid-cols-[12rem_1fr] sm:gap-4">
                <span className="ui font-semibold text-charcoal group-hover:text-brass">{p.name}</span>
                <span className="ui text-slate">{cardFor(s).pitch}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      {roles.length > 0 && (
        <>
          <h3 className="label mt-7 text-slate">Roles this work fits</h3>
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
            {roles.map((r) => <li key={r.slug}><Link to={`/roles/${r.slug}`} className="ui link font-semibold text-charcoal">{r.title}</Link></li>)}
          </ul>
        </>
      )}
      <Actions>
        <Link to="/skills" className="btn btn-line">Every skill, with its projects</Link>
      </Actions>
    </>
  );
}

export function RoleBoard({ slug }: { slug: string }) {
  const r = rolePageBySlug(slug)!;
  const tint = lineHex[r.area];
  return (
    <article className="role-board" style={{ ['--tint' as string]: tint }} aria-labelledby={`role-${slug}`}>
      <h3 id={`role-${slug}`} className="headline text-[1.6rem] text-charcoal">{r.title}</h3>
      <p className="ui mt-2 text-slate">{r.fit}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Skills">{r.skills.slice(0, 4).map((s) => <li key={s} className="chip">{s}</li>)}</ul>
      <p className="fine mt-4 text-slate">
        Projects: {r.projects.map((x) => x.name ?? projectBySlug(x.slug)!.name).join(', ')}
      </p>
      <Link to={`/roles/${slug}`} className="ui mt-5 inline-flex items-center gap-1.5 font-semibold text-charcoal">
        <span className="link">Open the {r.title} page</span><ArrowUpRight size={15} aria-hidden />
      </Link>
    </article>
  );
}
