import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { currentRole, formatMonth, formatRange, internships, roles } from '../data/experience';
import { projectBySlug } from '../data/projects';
import type { Role } from '../data/types';
import { Links, PageHeader } from '../components/ui';
import { Timeline } from '../components/home/Evidence';

function TitleRoute() {
  const titles = currentRole.titles!;
  return (
    <ol className="relative grid gap-6 sm:grid-cols-3 sm:gap-0">
      <span className="absolute left-[0.55rem] top-3 bottom-3 w-[2px] bg-brass/70 sm:left-0 sm:right-[30%] sm:top-[0.55rem] sm:bottom-auto sm:h-[2px] sm:w-auto" aria-hidden />
      {titles.map((t, i) => (
        <li key={t.title} className="relative pl-10 sm:pl-0 sm:pr-6">
          <span
            className={`absolute left-0 top-0 inline-block h-[1.2rem] w-[1.2rem] border-[3px] border-brass sm:static ${i === titles.length - 1 ? 'bg-brass' : 'rounded-full bg-ivory'}`}
            aria-hidden
          />
          <p className="label mt-0 text-slate sm:mt-4">From {formatMonth(t.from)}</p>
          <p className="headline mt-1 text-2xl text-charcoal">{t.title}</p>
        </li>
      ))}
    </ol>
  );
}

function InternshipRow({ r }: { r: Role }) {
  return (
    <li className="grid gap-x-8 gap-y-2 border-b border-seam py-6 md:grid-cols-[9rem_minmax(0,1fr)_minmax(0,14rem)]">
      <p className="label pt-1 text-slate">{formatRange(r.start, r.end)}</p>
      <div>
        <h3 className="headline text-[1.6rem]">{r.title}</h3>
        <p className="ui mt-1 font-semibold">{r.org}{r.place ? `, ${r.place}` : ''}</p>
        <p className="ui mt-1 text-slate">{[r.type, r.terms].filter(Boolean).join('. ')}</p>
        {r.summary && <p className="mt-3 max-w-xl">{r.summary}</p>}
      </div>
      <div>{r.proof ? <Links links={r.proof} /> : <span className="ui text-slate">No document linked</span>}</div>
    </li>
  );
}

export default function Experience() {
  const byYear = new Map<string, Role[]>();
  internships.forEach((r) => {
    const y = r.start.slice(0, 4);
    byYear.set(y, [...(byYear.get(y) ?? []), r]);
  });

  return (
    <>
      <PageHeader title="Experience" sign="The study" line="route">
        <p>
          A production engineering job since April 2026, after two years of internships in data science, analytics, AI and
          software development. Dates follow each offer letter or certificate.
        </p>
      </PageHeader>

      <section aria-labelledby="current" className="plate">
        <div className="shell grid gap-14 py-16 md:py-24 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div>
            <p className="label text-brass">{formatRange(currentRole.start, currentRole.end)}, {currentRole.place}</p>
            <h2 id="current" className="display mt-4 text-[clamp(2.75rem,6vw,5rem)]">{currentRole.title}</h2>
            <p className="headline mt-3 text-2xl text-slate">{currentRole.org}</p>
            <div className="mt-12"><TitleRoute /></div>
            <p className="mt-12 max-w-2xl font-sans text-lg leading-relaxed text-charcoal">{currentRole.summary}</p>
          </div>
          <div className="lg:pt-16">
            <h3 className="label text-slate">What I own</h3>
            <ul className="mt-4 divide-y divide-seam border-y border-seam">
              {currentRole.work!.map((w) => <li key={w} className="ui py-3 text-[1.0625rem] text-charcoal">{w}</li>)}
            </ul>
            <h3 className="label mt-10 text-slate">Read more</h3>
            <ul className="mt-3 space-y-2">
              {currentRole.projects!.map((s) => {
                const p = projectBySlug(s)!;
                const to = p.caseStudy ? `/projects/${s}` : `/projects?q=${encodeURIComponent(p.name)}`;
                return (
                  <li key={s}>
                    <Link to={to} className="ui inline-flex items-center gap-2 font-semibold text-charcoal"><span className="link">{p.name}</span><ArrowUpRight size={16} aria-hidden /></Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="timeline" className="border-y border-seam bg-limestone">
        <div className="shell py-16 md:py-20">
          <h2 id="timeline" className="headline text-[clamp(2rem,4vw,3rem)]">Every role on one timeline</h2>
          <div className="mt-10"><Timeline roles={roles} /></div>
        </div>
      </section>

      <section aria-labelledby="internships">
        <div className="shell py-16 md:py-24">
          <h2 id="internships" className="headline text-[clamp(2rem,4vw,3rem)]">Internships</h2>
          <p className="lede mt-3 max-w-2xl text-slate">Mostly short programmes, several of them virtual. Linked documents are the copies the organisations issued.</p>
          {[...byYear.entries()].map(([year, list]) => (
            <div key={year} className="mt-14 grid gap-6 lg:grid-cols-[10rem_minmax(0,1fr)]">
              <h3 className="display text-6xl text-slate/60 lg:sticky lg:top-24 lg:self-start">{year}</h3>
              <ul className="border-t border-slate/60">{list.map((r) => <InternshipRow key={r.id} r={r} />)}</ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
