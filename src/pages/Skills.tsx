import { Link } from 'react-router-dom';
import { projectBySlug } from '../data/projects';
import { skillGroups } from '../data/skills';
import { lineHex, type Line } from '../data/visuals';
import { PageHeader } from '../components/ui';

const groupLine: Record<string, Line> = {
  agents: 'signal', ml: 'field', backend: 'route', 'data-stores': 'route', clients: 'route', delivery: 'route', foundations: 'ink',
};

export default function Skills() {
  const total = skillGroups.reduce((n, g) => n + g.skills.length, 0);
  return (
    <>
      <PageHeader
        title="Skills"
        sign="The gallery"
        line="signal"
        aside={
          <dl className="grid grid-cols-2 gap-8">
            <div><dt className="label text-mist">Skills</dt><dd className="display mt-2 text-6xl">{total}</dd></div>
            <div><dt className="label text-mist">Areas</dt><dd className="display mt-2 text-6xl">{skillGroups.length}</dd></div>
          </dl>
        }
      >
        <p>Grouped by engineering domain. Each skill links to the projects where it is used. No ratings: the projects are the evidence.</p>
      </PageHeader>

      <nav aria-label="Skill groups" className="sticky top-16 z-20 border-b border-seam bg-ivory/95 backdrop-blur-sm">
        <ul className="shell label flex gap-x-6 gap-y-2 overflow-x-auto py-4 whitespace-nowrap">
          {skillGroups.map((g) => <li key={g.id}><a href={`#${g.id}`} className="link text-charcoal">{g.title}</a></li>)}
        </ul>
      </nav>

      <div className="shell pb-24">
        {skillGroups.map((g) => {
          const color = lineHex[groupLine[g.id]];
          return (
            <section key={g.id} id={g.id} aria-labelledby={`${g.id}-title`} className="reveal grid gap-8 border-b border-seam py-14 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14">
              <div className="lg:sticky lg:top-36 lg:self-start">
                <span className="block h-1.5 w-12" style={{ background: color }} aria-hidden />
                <h2 id={`${g.id}-title`} className="headline mt-5 text-[clamp(2rem,3.5vw,2.75rem)]">{g.title}</h2>
                {g.intro && <p className="ui mt-3 text-slate">{g.intro}</p>}
              </div>
              <ul className="divide-y divide-seam border-y border-seam">
                {g.skills.map((s) => (
                  <li key={s.name} className="grid gap-3 py-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-8">
                    <p className="flex items-start gap-3 font-sans text-[1.0625rem] font-semibold">
                      <span className="mt-[0.5rem] inline-block h-2 w-2 shrink-0" style={{ background: color }} aria-hidden />
                      <span>{s.name}</span>
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {s.projects.map((slug) => {
                        const p = projectBySlug(slug);
                        if (!p) return null;
                        const to = p.caseStudy ? `/projects/${slug}` : `/projects?q=${encodeURIComponent(p.name)}`;
                        return (
                          <li key={slug}>
                            <Link to={to} className="chip no-underline transition-colors hover:border-brass hover:text-charcoal">{p.name}</Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
