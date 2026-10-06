import { skills } from '../data/portfolio';

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="wrap">
        <h2 className="section-title">Tools I use</h2>
        <p className="lede">Grouped by what they’re for. Everything here is used in at least one project on this page.</p>

        <dl className="mt-12 divide-y divide-line border-y border-line">
          {skills.map((s) => (
            <div key={s.group} className="grid gap-2 py-5 md:grid-cols-[14rem_1fr] md:gap-8">
              <dt className="font-semibold">{s.group}</dt>
              <dd className="text-paper/85">{s.items.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
