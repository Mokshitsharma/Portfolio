import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight, Download } from 'lucide-react';
import { rolePageBySlug, type RoleProject } from '../data/rolePages';
import { cardFor } from '../data/cards';
import { currentRole, formatRange, roles } from '../data/experience';
import { maturityLabel, projectBySlug } from '../data/projects';
import { profile } from '../data/profile';
import { lineHex } from '../data/visuals';
import { Links, PageHeader } from '../components/ui';
import NotFound from './NotFound';

// A page for one role, linked from applications and cold emails. Links may carry ?ref=; the page renders the same
// and its canonical URL leaves the query out.

function ProjectBoard({ entry, tint }: { entry: RoleProject; tint: string }) {
  const p = projectBySlug(entry.slug)!;
  const others = (entry.also ?? []).map((s) => projectBySlug(s)!).filter(Boolean);
  const card = cardFor(p.slug);
  const to = p.caseStudy ? `/projects/${p.slug}` : `/projects?q=${encodeURIComponent(others.length ? 'Kaggle' : p.name)}`;
  return (
    <article className="role-board h-full" style={{ ['--tint' as string]: tint }} aria-labelledby={`rp-${p.slug}`}>
      <p className="fine text-slate">{others.length ? `${[p, ...others].length} notebooks, ${p.period}` : `${maturityLabel[p.maturity]}, ${p.period}`}</p>
      <h3 id={`rp-${p.slug}`} className="headline mt-1 text-[1.6rem] text-charcoal">{entry.name ?? p.name}</h3>
      <p className="ui mt-3 text-charcoal/90">{others.length ? entry.note : card.pitch}</p>
      {!others.length && (entry.note || card.detail) && <p className="ui mt-2 text-slate">{entry.note ?? card.detail}</p>}
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Built with">
        {[...new Set([...p.stack, ...others.flatMap((o) => o.stack)])].slice(0, 6).map((s) => <li key={s} className="chip">{s}</li>)}
      </ul>
      <div className="mt-5 flex flex-col gap-2">
        <Link to={to} className="ui inline-flex items-center gap-1.5 font-semibold text-charcoal">
          <span className="link">{p.caseStudy ? 'Case study' : 'In the archive'}</span><ArrowUpRight size={15} aria-hidden />
        </Link>
        {!others.length && <Links links={p.links} className="flex-col !gap-2 text-charcoal" />}
      </div>
    </article>
  );
}

export default function RolePage() {
  const { slug = '' } = useParams();
  const r = rolePageBySlug(slug);
  if (!r) return <NotFound />;
  const tint = lineHex[r.area];
  const experience = r.experience.map((id) => roles.find((x) => x.id === id)!).filter(Boolean);
  return (
    <>
      <PageHeader
        title={r.title}
        sign="For the role of"
        line={r.area}
        aside={
          <div className="flex flex-col gap-3">
            <a href={r.resume.file} className="btn btn-brass" download><Download size={17} aria-hidden />Download résumé<span className="sr-only"> ({r.resume.label})</span></a>
            <a href={`mailto:${profile.email}`} className="btn btn-line">Email me</a>
          </div>
        }
      >
        <p>{r.fit}</p>
      </PageHeader>

      <section aria-labelledby="work" className="shell py-16 md:py-20">
        <h2 id="work" className="headline text-[clamp(2rem,4vw,3rem)]">Five projects for this role</h2>
        <ul className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {r.projects.map((e) => <li key={e.slug}><ProjectBoard entry={e} tint={tint} /></li>)}
        </ul>
      </section>

      <section aria-labelledby="exp" className="border-y border-seam bg-limestone">
        <div className="shell grid gap-12 py-16 md:py-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div>
            <h2 id="exp" className="headline text-[clamp(2rem,4vw,3rem)]">Experience</h2>
            <ul className="mt-8 divide-y divide-seam border-y border-seam">
              <li className="py-5">
                <p className="fine text-brass">{formatRange(currentRole.start, currentRole.end)}</p>
                <h3 className="headline mt-1 text-[1.5rem]">{currentRole.title}</h3>
                <p className="ui font-semibold">{currentRole.org}</p>
                <p className="ui mt-2 max-w-xl text-slate">{currentRole.summary}</p>
              </li>
              {experience.map((x) => (
                <li key={x.id} className="grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[1fr_auto]">
                  <div>
                    <h3 className="ui font-semibold text-charcoal">{x.title}</h3>
                    <p className="ui text-slate">{x.org}, {formatRange(x.start, x.end)}</p>
                  </div>
                  {x.proof && <Links links={x.proof} className="text-charcoal" />}
                </li>
              ))}
            </ul>
            <Link to="/experience" className="btn btn-line mt-8">Full experience</Link>
          </div>
          <div>
            <h2 className="headline text-[clamp(1.6rem,3vw,2.2rem)]">Skills for this role</h2>
            <ul className="mt-6 space-y-2">
              {r.skills.map((s) => (
                <li key={s} className="ui flex gap-3 text-charcoal"><span className="mt-[0.45rem] inline-block h-2 w-2 shrink-0" style={{ background: tint }} aria-hidden />{s}</li>
              ))}
            </ul>
            <Link to="/skills" className="ui mt-6 inline-flex font-semibold text-charcoal"><span className="link">Every skill, with the projects that show it</span></Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="talk" className="shell py-16 md:py-20">
        <h2 id="talk" className="headline text-[clamp(2rem,4vw,3rem)]">Talk to me about the role</h2>
        <p className="lede mt-3 max-w-2xl text-slate">{profile.availability}.</p>
        <a href={`mailto:${profile.email}`} className="headline mt-6 inline-block break-words text-[clamp(1.35rem,2.4vw,1.9rem)] text-brass no-underline hover:underline">{profile.email}</a>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={r.resume.file} className="btn btn-brass" download><Download size={17} aria-hidden />Download résumé<span className="sr-only"> ({r.resume.label})</span></a>
          <Link to="/roles" className="btn btn-line">Other roles</Link>
        </div>
      </section>
    </>
  );
}
