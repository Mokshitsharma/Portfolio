import { Link } from 'react-router-dom';
import { catalog, flagships } from '../data/portfolio';
import { ProjectLinks } from './Projects';

const highlights = catalog.flatMap((g) => g.projects.filter((p) => p.highlight));
const total = flagships.length + catalog.reduce((n, g) => n + g.projects.length, 0);

export default function AlsoBuilt() {
  return (
    <section id="also-built" className="section">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="section-title">Also built</h2>
            <p className="lede">Production platforms with mobile apps and live payments, machine learning that explains itself, and systems engineering.</p>
          </div>
          <Link to="/projects" className="btn-ghost">
            All {total} projects
          </Link>
        </div>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {highlights.map((p) => (
            <li key={p.name} className="flex flex-col bg-plum p-6">
              <h3 className="text-2xl font-semibold">{p.name}</h3>
              <p className="mt-3 flex-1 text-paper/85">{p.summary}</p>
              <p className="mt-4 text-sm text-muted">{p.stack}</p>
              <div className="mt-4">
                <ProjectLinks links={p.links} compact />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-12 space-y-6">
          {catalog.map((g) => {
            const rest = g.projects.filter((p) => !p.highlight);
            if (rest.length === 0) return null;
            return (
              <div key={g.id}>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">{g.title}</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {rest.map((p) => (
                    <li key={p.name}>
                      <Link to={`/projects#${g.id}`} className="inline-block rounded-md bg-plum-3 px-2.5 py-1 text-sm text-paper/85 hover:text-paper">
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
