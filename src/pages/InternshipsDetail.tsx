import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, FileCheck } from 'lucide-react';
import { experience } from '../data/portfolio';

export default function InternshipsDetail() {
  return (
    <div className="pt-28 pb-16">
      <div className="wrap">
        <Link to="/" className="inline-flex items-center gap-2 text-muted hover:text-paper">
          <ArrowLeft size={18} aria-hidden /> Back to home
        </Link>

        <h1 className="mt-8 text-5xl md:text-7xl font-extrabold">Internships</h1>
        <p className="lede">All {experience.length} roles, newest first, with the documents to check them.</p>

        <ul className="mt-14 divide-y divide-line border-y border-line">
          {experience.map((e) => (
            <li key={e.company + e.role} className="grid gap-4 py-8 md:grid-cols-[14rem_1fr] md:gap-10">
              <div>
                <p className="text-sm text-muted">{e.period}</p>
                <h2 className="mt-1 text-2xl font-semibold">{e.company}</h2>
              </div>
              <div>
                <p className="font-semibold">{e.role}</p>
                {e.body && <p className="mt-2 max-w-2xl text-paper/85">{e.body}</p>}
                <ul className="mt-5 flex flex-wrap gap-3">
                  {(e.documents ?? []).map((d) => (
                    <li key={d.label}>
                      <a href={d.href} target="_blank" rel="noopener noreferrer" className="btn-ghost !py-1.5 text-sm">
                        {d.label.startsWith('Letter') ? <FileCheck size={16} aria-hidden /> : <FileText size={16} aria-hidden />}
                        {d.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}
