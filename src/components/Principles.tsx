import { principles } from '../data/portfolio';

export default function Principles() {
  return (
    <section id="principles" className="section bg-plum-2">
      <div className="wrap">
        <h2 className="section-title">How I build agents</h2>
        <p className="lede">The same four rules show up in every agent above. They’re why the demos still work when the model gets something wrong.</p>

        <dl className="mt-14 grid gap-x-12 gap-y-12 md:grid-cols-2">
          {principles.map((p) => (
            <div key={p.title}>
              <dt className="font-display text-2xl font-semibold">{p.title}</dt>
              <dd className="mt-3 text-paper/85">{p.body}</dd>
              <dd className="mt-3 text-sm text-muted">Seen in {p.source}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
