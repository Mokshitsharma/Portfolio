import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { catalog, flagships } from '../data/portfolio';
import { ProjectLinks } from '../components/Projects';

export default function ProjectsDetail() {
  const total = flagships.length + catalog.reduce((n, g) => n + g.projects.length, 0);

  return (
    <div className="pt-28 pb-16">
      <div className="wrap">
        <Link to="/" className="inline-flex items-center gap-2 text-muted hover:text-paper">
          <ArrowLeft size={18} aria-hidden /> Back to home
        </Link>

        <h1 className="mt-8 text-5xl md:text-7xl font-extrabold">All projects</h1>
        <p className="lede">
          {total} projects, newest and most complete first in each group. Projects marked “code available on request” aren’t public yet.
        </p>

        <nav className="mt-10 flex flex-wrap gap-2" aria-label="Project groups">
          <a href="#agents" className="btn-ghost !py-1.5 text-sm">Agent systems</a>
          {catalog.map((g) => (
            <a key={g.id} href={`#${g.id}`} className="btn-ghost !py-1.5 text-sm">
              {g.title}
            </a>
          ))}
        </nav>

        <section id="agents" className="mt-16">
          <h2 className="text-3xl md:text-4xl font-extrabold">Agent systems</h2>
          <p className="mt-2 text-muted">The headline work. Full write-ups are on the home page.</p>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {flagships.map((p) => (
              <li key={p.id} className="grid gap-3 py-6 md:grid-cols-[14rem_1fr_auto] md:gap-8">
                <h3 className="text-xl font-semibold">
                  <Link to={`/#${p.id}`} className="text-link">{p.name}</Link>
                </h3>
                <div>
                  <p className="text-paper/85">{p.summary}</p>
                  <p className="mt-2 text-sm text-muted">{p.stack.join(', ')}</p>
                </div>
                <ProjectLinks links={p.links} compact />
              </li>
            ))}
          </ul>
        </section>

        {catalog.map((g) => (
          <section key={g.id} id={g.id} className="mt-20">
            <h2 className="text-3xl md:text-4xl font-extrabold">{g.title}</h2>
            <p className="mt-2 text-muted">{g.blurb}</p>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {g.projects.map((p) => (
                <li key={p.name} className="grid gap-3 py-6 md:grid-cols-[14rem_1fr_auto] md:gap-8">
                  <h3 className="text-xl font-semibold">{p.name}</h3>
                  <div>
                    <p className="text-paper/85">{p.summary}</p>
                    <p className="mt-2 text-sm text-muted">{p.stack}</p>
                  </div>
                  <ProjectLinks links={p.links} compact />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
