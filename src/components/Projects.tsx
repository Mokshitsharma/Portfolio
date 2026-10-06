import { Github, ExternalLink } from 'lucide-react';
import { flagships, type Link as ProjectLink } from '../data/portfolio';

export function ProjectLinks({ links, compact = false }: { links: ProjectLink; compact?: boolean }) {
  if (!links.repo && !links.live) {
    return <span className="text-sm text-muted">Code available on request</span>;
  }
  return (
    <span className={`flex flex-wrap gap-x-5 gap-y-1 ${compact ? 'text-sm' : ''}`}>
      {links.repo && (
        <a href={links.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-link">
          <Github size={16} aria-hidden /> Source
        </a>
      )}
      {links.live && (
        <a href={links.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-link">
          <ExternalLink size={16} aria-hidden /> Live demo
        </a>
      )}
    </span>
  );
}

export default function Projects() {
  return (
    <section id="work" className="section">
      <div className="wrap">
        <h2 className="section-title">Agent systems</h2>
        <p className="lede">
          Five agents I designed and built end to end. Each one does real work, and each one has a line it can’t cross without code or a person saying yes.
        </p>

        <div className="mt-14 divide-y divide-line border-y border-line">
          {flagships.map((p) => (
            <article key={p.id} id={p.id} className="grid gap-6 py-10 md:grid-cols-[minmax(0,16rem)_1fr] md:gap-12">
              <header>
                <h3 className="text-3xl md:text-4xl font-extrabold">{p.name}</h3>
                <p className="mt-2 text-sm text-muted">{p.context}</p>
                <div className="mt-4">
                  <ProjectLinks links={p.links} compact />
                </div>
              </header>

              <div className="max-w-3xl">
                <p className="text-paper/95">{p.summary}</p>

                <div className="mt-5 border-l-2 border-pass pl-4">
                  <p className="text-sm font-semibold text-pass">Guardrail</p>
                  <p className="mt-1 text-paper/85">{p.guardrail}</p>
                </div>

                <p className="mt-5 text-paper/85">
                  <span className="font-semibold text-propose">Evidence: </span>
                  {p.proof}
                </p>

                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tech stack">
                  {p.stack.map((s) => (
                    <li key={s} className="rounded-md bg-plum-3 px-2.5 py-1 text-sm text-muted">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
