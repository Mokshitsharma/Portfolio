import { ExternalLink } from 'lucide-react';
import { certifications, profile } from '../data/portfolio';

export default function Certifications() {
  return (
    <section id="certifications" className="section bg-plum-2">
      <div className="wrap">
        <h2 className="section-title">Certifications</h2>
        <ul className="mt-12 grid gap-x-12 gap-y-6 md:grid-cols-2">
          {certifications.map((c) => (
            <li key={c.title}>
              <p className="text-xl font-semibold">
                {c.link ? (
                  <a href={c.link} target="_blank" rel="noopener noreferrer" className="text-link inline-flex items-center gap-2">
                    {c.title} <ExternalLink size={16} aria-hidden />
                  </a>
                ) : (
                  c.title
                )}
              </p>
              <p className="mt-1 text-muted">{c.issuer}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10">
          <a href={`${profile.linkedin}details/certifications/`} target="_blank" rel="noopener noreferrer" className="text-link">
            Every certificate on LinkedIn
          </a>
        </p>
      </div>
    </section>
  );
}
