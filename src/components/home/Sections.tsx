import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { currentRole, formatMonth, formatRange, internships } from '../../data/experience';
import { credentials, education, inProgress, profile } from '../../data/profile';
import { personal, skillColumns, socials, testimonials } from '../../data/home';
import ContactForm from '../ContactForm';

// Sections 4 to 10 of the home page, in the specified order: experience, certifications, skills, testimonials,
// "want to know more about me", contact and social links. Everything renders from src/data.

function Head({ id, title, intro, dark = false }: { id: string; title: string; intro?: string; dark?: boolean }) {
  return (
    <>
      <h2 id={`${id}-title`} className={`display text-[clamp(2.2rem,4.6vw,3.9rem)] ${dark ? 'text-ivory' : 'text-charcoal'}`}>{title}</h2>
      {intro && <p className={`mt-4 max-w-[38rem] text-[1.0625rem] leading-[1.6] ${dark ? 'text-ivory/75' : 'text-slate'}`}>{intro}</p>}
    </>
  );
}

/* ---------------------------------------------------------------- 4. Experience */
export function Experience() {
  const shown = internships.filter((r) => r.summary || r.terms || r.proof);
  return (
    <section id="experience" data-section="experience" aria-labelledby="experience-title" className="border-t border-seam py-24 md:py-28">
      <div className="shell">
        <Head id="experience" title="Experience" intro="One job and a run of internships. Projects are in their own section above; this is the work done for organisations." />
        <ol className="tl mt-14">
          <li className="tl-item tl-major">
            <p className="tl-date">{formatRange(currentRole.start, currentRole.end)}</p>
            <div>
              <h3 className="headline text-[clamp(1.6rem,2.6vw,2.2rem)] text-charcoal">{currentRole.title}</h3>
              <p className="ui mt-1 font-semibold text-charcoal">{currentRole.org}, {currentRole.place}</p>
              <p className="ui mt-2 text-slate">{currentRole.titles!.map((t) => `${t.title} from ${formatMonth(t.from)}`).join('; ')}</p>
              <p className="mt-5 max-w-[46rem] text-[1.0625rem] leading-[1.6] text-charcoal/90">{currentRole.summary}</p>
              <dl className="tl-areas mt-6">
                {currentRole.work!.map((w, i) => (
                  <div key={w}>
                    <dt className="label text-brass">{currentRole.workAreas?.[i]}</dt>
                    <dd className="ui mt-1 text-charcoal/90">{w}</dd>
                  </div>
                ))}
              </dl>
              {currentRole.tech && <p className="fine mt-5 text-slate"><span className="font-semibold text-charcoal">Technologies: </span>{currentRole.tech.join(', ')}</p>}
              <Link to="/projects/movigo" className="ui mt-4 inline-block font-semibold text-brass"><span className="link">How the platform works</span></Link>
            </div>
          </li>
          {shown.map((r) => (
            <li key={r.id} className="tl-item">
              <p className="tl-date">{formatRange(r.start, r.end)}</p>
              <div>
                <h3 className="font-sans text-[1.1875rem] font-semibold text-charcoal">{r.title}</h3>
                <p className="ui text-charcoal/85">{r.org}{r.terms ? `, ${r.terms.toLowerCase()}` : ''}</p>
                {r.summary && <p className="ui mt-2 max-w-[44rem] text-charcoal/90">{r.summary}</p>}
                {r.tech && <p className="fine mt-2 text-slate"><span className="font-semibold text-charcoal">Technologies: </span>{r.tech.join(', ')}</p>}
                {r.proof?.[0] && (
                  <a href={r.proof[0].href} target="_blank" rel="noopener noreferrer" className="fine mt-2 inline-flex items-center gap-1 text-brass">
                    <span className="link">{r.proof[0].label}</span><ArrowUpRight size={13} aria-hidden /><span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- 5. Certifications */
export function Certifications() {
  return (
    <section id="certifications" data-section="certifications" aria-labelledby="certifications-title" className="border-t border-seam bg-limestone py-24 md:py-28">
      <div className="shell">
        <Head id="certifications" title="Certifications" intro="Only credentials with a verified title, issuer and date. Each links to the issuer’s copy." />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {credentials.map((c) => (
            <li key={c.title} className="cert-card">
              {c.image && <img src={c.image.src} alt={`${c.title} certificate from ${c.issuer}`} width={c.image.width} height={c.image.height} loading="lazy" decoding="async" className="cert-card-img" />}
              <div className="flex flex-1 flex-col p-5">
                <p className="fine text-slate">{c.issuer}</p>
                <h3 className="headline mt-1 text-[1.25rem] text-charcoal">{c.title}</h3>
                {c.date && <p className="fine mt-1 text-slate">{c.date}</p>}
                {c.href && (
                  <a href={c.href} target="_blank" rel="noopener noreferrer" className="btn btn-line mt-auto !min-h-10 self-start">
                    View credential<ArrowUpRight size={15} aria-hidden /><span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-12 grid gap-6 border-t border-seam pt-8 md:grid-cols-2">
          <div>
            <h3 className="headline text-[1.4rem] text-charcoal">Education</h3>
            <p className="ui mt-2 text-charcoal">{education.degree}</p>
            <p className="ui text-slate">{education.school}</p>
            <p className="ui text-slate">{education.years}, {education.grade}</p>
          </div>
          {inProgress.map((i) => (
            <div key={i.title}>
              <h3 className="headline text-[1.4rem] text-charcoal">{i.title}</h3>
              <p className="ui mt-2 text-slate">{i.detail}</p>
            </div>
          ))}
        </div>
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

/* ---------------------------------------------------------------- 9. Contact and 10. Social links */
export function Contact() {
  return (
    <section id="contact" data-section="contact" aria-labelledby="contact-title" className="bg-charcoal py-24 text-ivory md:py-28">
      <div className="shell grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div>
          <Head id="contact" title="Get in touch" dark intro={`${profile.availability}.`} />
          <a href={`mailto:${profile.email}`} className="headline mt-8 inline-block break-all text-[clamp(1.25rem,2.4vw,1.8rem)] text-ivory underline decoration-1 underline-offset-[0.2em] hover:decoration-2">
            {profile.email}
          </a>
          <p className="ui mt-3 text-ivory/70">{profile.location}</p>
        </div>
        <ContactForm tone="dark" />
      </div>
    </section>
  );
}

export function Social() {
  return (
    <section data-section="contact" aria-label="Profiles and links" className="border-t border-ivory/15 bg-charcoal pb-20 pt-10 text-ivory">
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
