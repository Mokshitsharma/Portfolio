import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { credentials, education, inProgress } from '../../data/profile';
import { personal, skillColumns, socials, testimonials } from '../../data/home';
import { Seal } from '../records';

// Sections of the home page: certifications, skills, testimonials, "want to know more about me" and social links. Everything renders from src/data.

function Head({ id, title, intro, dark = false }: { id: string; title: string; intro?: string; dark?: boolean }) {
  return (
    <>
      <h2 id={`${id}-title`} className={`display text-[clamp(2.2rem,4.6vw,3.9rem)] ${dark ? 'text-charcoal' : 'text-charcoal'}`}>{title}</h2>
      {intro && <p className={`mt-4 max-w-[38rem] text-[1.0625rem] leading-[1.6] ${dark ? 'text-charcoal/75' : 'text-slate'}`}>{intro}</p>}
    </>
  );
}

/* ---------------------------------------------------------------- 5. Certifications */
// A gallery wall: each certificate hangs as a framed paper under its own picture light.
export function Certifications() {
  return (
    <section id="certifications" data-section="certifications" aria-labelledby="certifications-title" className="gallery-wall border-t border-seam py-24 md:py-28">
      <div className="shell">
        <Head id="certifications" title="Certifications" intro="Only credentials with a verified title, issuer and date. Each links to the issuer’s copy." />
        <ul className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-4">
          {credentials.map((c) => (
            <li key={c.title} className="hang">
              <span className="hang-lamp" aria-hidden />
              <div className="frame-wood">
                <div className="paper">
                  <Seal />
                  <p className="fine text-slate">{c.issuer}</p>
                  <h3 className="paper-title mt-2">{c.title}</h3>
                  <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                    {c.date && <p className="fine text-slate">{c.date}</p>}
                    {c.href && (
                      <a href={c.href} target="_blank" rel="noopener noreferrer" className="fine inline-flex items-center gap-1 font-semibold text-brass">
                        <span className="link">View credential</span><ArrowUpRight size={13} aria-hidden /><span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-16 grid gap-5 md:grid-cols-2">
          <div className="brass-plate">
            <p className="fine text-slate">Education</p>
            <h3 className="font-sans text-[1.25rem] font-semibold text-charcoal">{education.degree}</h3>
            <p className="ui mt-1 text-slate">{education.school}. {education.years}, {education.grade}.</p>
          </div>
          {inProgress.map((i) => (
            <div key={i.title} className="brass-plate">
              <p className="fine text-slate">Under way</p>
              <h3 className="font-sans text-[1.25rem] font-semibold text-charcoal">{i.title}</h3>
              <p className="ui mt-1 text-slate">{i.detail}</p>
            </div>
          ))}
        </div>
        <Link to="/achievements" className="pill mt-10">Every credential and achievement</Link>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- 6. Skills */
export function Skills() {
  return (
    <section id="skills" data-section="skills" aria-labelledby="skills-title" className="py-24 md:py-28">
      <div className="shell">
        <Head id="skills" title="Skills" intro="Each one used in a project or a role. The Skills page lists the projects behind every item." />
        <div className="skill-cols mt-12">
          {skillColumns.map((g) => (
            <div key={g.title} className="skill-col">
              <h3 className="font-sans text-[1.0625rem] font-semibold text-charcoal">{g.title}</h3>
              <ul className="mt-3 space-y-2">
                {g.items.map((x) => <li key={x} className="ui text-charcoal/85">{x}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <Link to="/skills" className="btn btn-line mt-10">Every skill, with its projects</Link>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- 7. Testimonials */
// Hidden until genuine, approved quotes exist. In development only, a marked placeholder shows where they go.
export function Testimonials() {
  if (!testimonials.length) {
    if (!import.meta.env.DEV) return null;
    return (
      <section data-section="testimonials" className="border-t border-dashed border-held py-12">
        <div className="shell"><p className="ui text-held">Development only: the testimonials section appears here once real, approved quotes are added to src/data/home.ts. It is not rendered in production.</p></div>
      </section>
    );
  }
  return (
    <section id="testimonials" data-section="testimonials" aria-labelledby="testimonials-title" className="border-t border-seam py-24">
      <div className="shell">
        <Head id="testimonials" title="What people say" />
        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <li key={t.name} className="border border-seam bg-white p-7">
              <blockquote className="text-[1.125rem] leading-[1.6]">“{t.quote}”</blockquote>
              <p className="ui mt-4 font-semibold">{t.name}</p>
              <p className="fine text-slate">{t.role}, {t.org}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- 8. Want to know more about me? */
export function KnowMore() {
  return (
    <section id="more" data-section="more" aria-labelledby="more-title" className="border-t border-seam bg-limestone py-24 md:py-28">
      <div className="shell">
        <Head id="more" title="Want to know more about me?" />
        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div>
            <h3 className="headline text-[1.5rem] text-charcoal">How I approach building a product</h3>
            <blockquote className="mt-4 border-l-2 border-brass pl-5 text-[1.1875rem] leading-[1.7] text-charcoal">{personal.approach}</blockquote>
          </div>
          <dl className="space-y-8">
            <div><dt className="headline text-[1.25rem] text-charcoal">How I learn</dt><dd className="mt-2 text-[1.0625rem] leading-[1.65] text-charcoal/85">{personal.learning}</dd></div>
            <div><dt className="headline text-[1.25rem] text-charcoal">What I enjoy building</dt><dd className="mt-2 text-[1.0625rem] leading-[1.65] text-charcoal/85">{personal.building}</dd></div>
            <div><dt className="headline text-[1.25rem] text-charcoal">Outside engineering</dt><dd className="mt-2 text-[1.0625rem] leading-[1.65] text-charcoal/85">{personal.interests}</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- 10. Social links */
export function Social() {
  return (
    <section data-section="contact" aria-label="Profiles and links" className="border-t border-charcoal/15 bg-limestone pb-20 pt-10 text-charcoal">
      <ul className="shell flex flex-wrap gap-3">
        {socials.map((s) => {
          const external = s.href.startsWith('http');
          return (
            <li key={s.label}>
              <a href={s.href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="social-link">
                {s.label}{external && <><ArrowUpRight size={15} aria-hidden /><span className="sr-only"> (opens in a new tab)</span></>}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
