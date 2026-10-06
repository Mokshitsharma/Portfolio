import { Link } from 'react-router-dom';
import { experience, profile } from '../data/portfolio';

export default function Experience() {
  return (
    <section id="experience" className="section bg-plum-2">
      <div className="wrap grid gap-14 lg:grid-cols-[1fr_20rem]">
        <div>
          <h2 className="section-title">Experience</h2>
          <ol className="mt-12 space-y-10 border-l border-line pl-6">
            {experience.filter((e) => e.featured).map((e) => (
              <li key={e.company + e.role} className="relative">
                <span className="absolute -left-[1.85rem] top-2 h-2.5 w-2.5 rounded-full bg-propose" aria-hidden />
                <p className="text-sm text-muted">{e.period}</p>
                <h3 className="mt-1 text-2xl font-semibold">
                  {e.role}, {e.company}
                </h3>
                {e.body && <p className="mt-2 max-w-2xl text-paper/85">{e.body}</p>}
              </li>
            ))}
          </ol>
          <h3 className="mt-14 text-xl font-semibold">More internships</h3>
          <ul className="mt-6 grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {experience.filter((e) => !e.featured).map((e) => (
              <li key={e.company + e.role}>
                <p className="font-semibold">{e.role}</p>
                <p className="text-paper/85">{e.company}</p>
                <p className="text-sm text-muted">{e.period}</p>
              </li>
            ))}
          </ul>
          <p className="mt-10">
            <Link to="/internships" className="text-link text-paper">
              All {experience.length} roles with offer letters, certificates and recommendations
            </Link>
          </p>
        </div>

        <aside className="self-start rounded-2xl border border-line p-6">
          <h3 className="text-xl font-semibold">Education</h3>
          <p className="mt-3 text-paper/90">{profile.education.degree}</p>
          <p className="mt-1 text-muted">{profile.education.school}</p>
          <p className="mt-3 font-display text-3xl font-extrabold text-propose">{profile.education.grade}</p>
        </aside>
      </div>
    </section>
  );
}
