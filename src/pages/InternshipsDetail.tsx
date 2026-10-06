import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, FileCheck } from 'lucide-react';
import { experience } from '../data/portfolio';

// Verification documents for each internship, keyed by company.
const documents: Record<string, { label: string; href: string }[]> = {
  'Bluestock Fintech': [
    { label: 'Offer letter', href: 'https://drive.google.com/file/d/1fRrLmzs8o4JA1FHBOWHm6W_OEsr9Cp1L/view?usp=sharing' },
  ],
  'Evoastra Ventures': [
    { label: 'Offer letter', href: 'https://drive.google.com/drive/u/2/folders/19c5J-Afnp8F-ajr1yu1n_eiimrgJ4wk2' },
    { label: 'Letter of recommendation', href: 'https://drive.google.com/file/d/1H1uC9xINU2DqBcbaZYobOjQ9PdANs2Ak/view?usp=sharing' },
  ],
  'Cognifyz Technologies': [
    { label: 'Offer letter', href: 'https://drive.google.com/file/d/1qFCF_sY7sBTIVZ4C5Sid1u83UTrHNwz5/view?usp=sharing' },
  ],
};

export default function InternshipsDetail() {
  return (
    <div className="pt-28 pb-16">
      <div className="wrap">
        <Link to="/" className="inline-flex items-center gap-2 text-muted hover:text-paper">
          <ArrowLeft size={18} aria-hidden /> Back to home
        </Link>

        <h1 className="mt-8 text-5xl md:text-7xl font-extrabold">Internships</h1>
        <p className="lede">What I did at each one, with the documents to check it.</p>

        <ul className="mt-14 divide-y divide-line border-y border-line">
          {experience.map((e) => (
            <li key={e.company} className="grid gap-4 py-8 md:grid-cols-[14rem_1fr] md:gap-10">
              <div>
                <p className="text-sm text-muted">{e.period}</p>
                <h2 className="mt-1 text-2xl font-semibold">{e.company}</h2>
              </div>
              <div>
                <p className="font-semibold">{e.role}</p>
                <p className="mt-2 max-w-2xl text-paper/85">{e.body}</p>
                <ul className="mt-5 flex flex-wrap gap-3">
                  {(documents[e.company] ?? []).map((d) => (
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

        <p className="mt-10 max-w-2xl text-muted">
          Also: Code Alpha (ML pipelines and EDA), Kangaroo Software (data pipelines and analytics) and several short data-science internships in 2024 and 2025.
        </p>
      </div>
    </div>
  );
}
