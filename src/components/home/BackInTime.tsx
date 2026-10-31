import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { currentRole, formatRange, internships } from '../../data/experience';
import { education } from '../../data/profile';

// "Let's go back in time": the job, the internships and the degree, newest first. A large year on the left counts
// back as each entry on the right reaches the middle of the screen, with the entry's dates and a progress line.

interface Stop { key: string; year: string; when: string; title: string; org: string; points: string[]; href?: string }

const stops: Stop[] = [
  {
    key: currentRole.id, year: currentRole.start.slice(0, 4), when: formatRange(currentRole.start, currentRole.end),
    title: currentRole.title, org: `${currentRole.org}, ${currentRole.place}`, points: currentRole.work ?? [], href: '/projects/movigo',
  },
  ...internships
    .filter((r) => r.summary || r.terms || r.proof)
    .map((r) => ({ key: r.id, year: r.start.slice(0, 4), when: formatRange(r.start, r.end), title: r.title, org: r.org, points: r.summary ? [r.summary] : [] })),
  {
    key: 'education', year: education.years.slice(0, 4), when: education.years, title: education.degree,
    org: education.school, points: [`${education.grade}.`],
  },
];

export default function BackInTime() {
  const [at, setAt] = useState(0);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setAt(Number((e.target as HTMLElement).dataset.i));
    }, { rootMargin: '-45% 0px -50% 0px' });
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const s = stops[at];
  return (
    <section id="experience" data-section="experience" aria-labelledby="experience-title" className="time-section">
      <div className="shell grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        <div className="time-left">
          <div className="lg:sticky lg:top-[22vh]">
            <p className="ui text-charcoal/60">My story</p>
            <h2 id="experience-title" className="cine-h2 mt-2 !text-[clamp(2rem,3.6vw,3.2rem)]">Let’s go back in time.</h2>
            <p key={s.year} className="time-year" aria-hidden>{s.year}</p>
            <p className="ui mt-1 text-charcoal/70" aria-hidden>{s.when}</p>
            <div className="mt-4 flex items-center gap-3" aria-hidden>
              <span className="font-sans text-[0.8125rem] font-semibold tabular-nums text-charcoal/70">{String(at + 1).padStart(2, '0')} / {String(stops.length).padStart(2, '0')}</span>
              <span className="time-bar"><span style={{ width: `${((at + 1) / stops.length) * 100}%` }} /></span>
            </div>
            <Link to="/experience" className="pill mt-8 hidden lg:inline-flex">The full experience room</Link>
          </div>
        </div>
        <ol className="time-list">
          {stops.map((x, i) => (
            <li key={x.key} ref={(el) => { items.current[i] = el; }} data-i={i} data-on={i === at || undefined} className="time-item">
              <p className="font-sans text-[0.8125rem] font-semibold text-charcoal/60">{x.when}</p>
              <h3 className="mt-1 font-sans text-[1.3rem] font-semibold leading-tight text-charcoal">{x.title}</h3>
              <p className="ui text-brass">{x.org}</p>
              {x.points.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {x.points.map((t) => <li key={t} className="ui flex gap-2 text-charcoal/80"><span className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-charcoal/50" aria-hidden />{t}</li>)}
                </ul>
              )}
              {x.href && <Link to={x.href} className="ui mt-3 inline-block font-semibold text-charcoal"><span className="link">How the platform works</span></Link>}
            </li>
          ))}
        </ol>
        <Link to="/experience" className="pill justify-self-start lg:hidden">The full experience room</Link>
      </div>
    </section>
  );
}
