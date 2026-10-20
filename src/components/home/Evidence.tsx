import { calibration, kdBenchmark } from '../../data/visuals';
import { formatRange } from '../../data/experience';
import type { Role } from '../../data/types';

// The home page's charts and diagrams, drawn in the engine's colours. Every value comes from src/data, which
// takes it from a project's evaluation report, benchmark table or code.

export type StageKind = 'model' | 'rule' | 'human' | 'io';

const kindLabel: Record<StageKind, string> = {
  model: 'Model proposes',
  rule: 'Code decides',
  human: 'Person approves',
  io: 'Input or output',
};

function Dot({ kind }: { kind: StageKind }) {
  return <span className={`kind-dot kind-${kind}`} aria-hidden />;
}

export function KindKey({ kinds = ['model', 'rule', 'human', 'io'] }: { kinds?: StageKind[] }) {
  return (
    <ul className="fine flex flex-wrap gap-x-5 gap-y-1.5 text-stone" aria-label="Key">
      {kinds.map((k) => (
        <li key={k} className="inline-flex items-center gap-2"><Dot kind={k} />{kindLabel[k]}</li>
      ))}
    </ul>
  );
}

/** A pipeline whose stages are coloured by who acts: a model, code, a person, or the outside world. */
export function Pipeline({ stages, vertical = false }: { stages: { label: string; kind: StageKind }[]; vertical?: boolean }) {
  return (
    <ol className={vertical ? 'pipeline-v' : 'pipeline'} style={{ ['--n' as string]: stages.length }}>
      {stages.map((s) => (
        <li key={s.label}>
          <Dot kind={s.kind} />
          <span className="fine font-medium text-bone/90">{s.label}</span>
          <span className="sr-only">: {kindLabel[s.kind]}</span>
        </li>
      ))}
    </ol>
  );
}

export function Calibration() {
  const max = 0.32;
  const h = 200;
  return (
    <figure>
      <svg viewBox="0 0 480 270" className="h-auto w-full" role="img" aria-labelledby="cal-t cal-d">
        <title id="cal-t">CricXAI: predicted against observed dismissal rate</title>
        <desc id="cal-d">
          {calibration.map((c) => `${c.bin}: predicted ${(c.predicted * 100).toFixed(1)}%, observed ${(c.observed * 100).toFixed(1)}%, ${c.n.toLocaleString('en-US')} deliveries.`).join(' ')}
        </desc>
        {[0, 0.1, 0.2, 0.3].map((t) => (
          <g key={t}>
            <line x1="44" x2="470" y1={16 + h - (t / max) * h} y2={16 + h - (t / max) * h} stroke="#34302b" />
            <text x="36" y={20 + h - (t / max) * h} textAnchor="end" fontSize="12" fill="#a49e95" fontFamily="Archivo Variable, Archivo, sans-serif">{t * 100}%</text>
          </g>
        ))}
        {calibration.map((c, i) => {
          const x0 = 70 + i * 140;
          const bar = (v: number) => (v / max) * h;
          return (
            <g key={c.bin}>
              <rect x={x0} y={16 + h - bar(c.predicted)} width="46" height={bar(c.predicted)} fill="none" stroke="#7cc6d2" strokeWidth="2" />
              <rect x={x0 + 52} y={16 + h - bar(c.observed)} width="46" height={bar(c.observed)} fill="#c9a46a" />
              <text x={x0 + 49} y={16 + h + 20} textAnchor="middle" fontSize="13" fill="#efe9df" fontFamily="Archivo Variable, Archivo, sans-serif" fontWeight="600">{c.bin}</text>
              <text x={x0 + 49} y={16 + h + 37} textAnchor="middle" fontSize="11" fill="#a49e95" fontFamily="Archivo Variable, Archivo, sans-serif">{c.n.toLocaleString('en-US')} balls</text>
            </g>
          );
        })}
      </svg>
      <figcaption className="fine mt-2 flex flex-wrap gap-x-5 gap-y-1 text-stone">
        <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-3 border-2 border-glass" aria-hidden />Predicted</span>
        <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-3 bg-brass" aria-hidden />Observed</span>
        <span>Deliveries grouped by predicted dismissal probability, from the active model’s evaluation.</span>
      </figcaption>
    </figure>
  );
}

export function Benchmark() {
  const scale = (ms: number) => (Math.log10(ms) + 0.3) / (Math.log10(2000) + 0.3);
  return (
    <figure>
      <table className="w-full border-collapse">
        <caption className="fine mb-3 text-left text-stone">
          RouteCore: 2,000 nearest-neighbour queries, log scale. Answers match brute force at every size.
        </caption>
        <thead className="sr-only">
          <tr><th scope="col">Points</th><th scope="col">Brute force (ms)</th><th scope="col">k-d tree (ms)</th><th scope="col">Speed-up</th></tr>
        </thead>
        <tbody>
          {kdBenchmark.map((r) => (
            <tr key={r.n}>
              <th scope="row" className="fine w-20 py-1.5 pr-3 text-left font-semibold text-bone">{r.n}</th>
              <td className="py-1.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="block h-2 bg-stone/45" style={{ width: `${scale(r.brute) * 100}%` }} aria-hidden />
                    <span className="fine whitespace-nowrap text-stone">{r.brute.toLocaleString('en-US')} ms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="block h-2 bg-brass" style={{ width: `${scale(r.kd) * 100}%` }} aria-hidden />
                    <span className="fine whitespace-nowrap font-semibold text-bone">{r.kd} ms</span>
                  </div>
                </div>
              </td>
              <td className="fine w-16 py-1.5 pl-3 text-right font-bold text-bone">{(r.brute / r.kd).toFixed(1)}x</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="fine mt-2 flex gap-5 text-stone">
        <span className="inline-flex items-center gap-2"><span className="inline-block h-2 w-5 bg-stone/45" aria-hidden />Brute force</span>
        <span className="inline-flex items-center gap-2"><span className="inline-block h-2 w-5 bg-brass" aria-hidden />k-d tree</span>
      </p>
    </figure>
  );
}

const monthIndex = (ym: string) => {
  const [y, m] = ym.split('-').map(Number);
  return y * 12 + (m - 1);
};

/** Every documented role on one time axis, oldest at the bottom like the engine's layers. */
export function Timeline({ roles, now = '2026-10' }: { roles: Role[]; now?: string }) {
  const start = monthIndex('2024-06');
  const end = monthIndex(now) + 1;
  const span = end - start;
  return (
    <figure>
      <div className="relative">
        {/* Year lines over the bar column only (the label column is 13rem plus a 1rem gap). */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden sm:left-[14rem] sm:block" aria-hidden>
          {[2025, 2026].map((y) => (
            <div key={y} className="absolute inset-y-0 border-l border-joint" style={{ left: `${((monthIndex(`${y}-01`) - start) / span) * 100}%` }}>
              <span className="fine absolute top-0 left-1.5 text-stone">{y}</span>
            </div>
          ))}
          <span className="fine absolute top-0 left-0 text-stone">2024</span>
        </div>
        <ol className="relative space-y-0.5 pt-7">
          {roles.map((r) => {
            const s = monthIndex(r.start);
            const e = r.end === 'present' ? end : monthIndex(r.end) + 1;
            const left = ((s - start) / span) * 100;
            const width = Math.max(((e - s) / span) * 100, 1.4);
            const current = r.end === 'present';
            return (
              <li key={r.id} className="grid grid-cols-1 items-center gap-x-4 sm:grid-cols-[13rem_1fr]">
                <span className={`fine truncate ${current ? 'font-semibold text-bone' : 'text-bone/80'}`}>
                  {r.org}<span className="sr-only">, {r.title}, {formatRange(r.start, r.end)}</span>
                </span>
                <span className="relative block h-4" aria-hidden>
                  <span className={`absolute top-1 h-2 ${current ? 'bg-brass' : 'bg-stone/50'}`} style={{ left: `${left}%`, width: `${width}%` }} />
                </span>
              </li>
            );
          })}
        </ol>
      </div>
      <figcaption className="fine mt-4 text-stone">Each bar runs from the start to the end month on the offer letter or certificate.</figcaption>
    </figure>
  );
}
