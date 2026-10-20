import { calibration, kdBenchmark } from '../data/visuals';

// Visual components. Each draws real data or a real architecture; none are decorative fillers.

/* ---------------------------------------------------------------- Mini pipeline */

// Same marks as the home page: sky ring = model, brass square = code, white disc with an outline = person.
const kindDot: Record<string, string> = {
  model: 'border-sky bg-transparent rounded-full',
  rule: 'border-brass bg-brass',
  human: 'border-charcoal bg-white rounded-full',
  io: 'border-slate bg-transparent',
};

export function MiniFlow({ stages, tone = 'dark', vertical = false }: { stages: { label: string; kind: string }[]; tone?: 'dark' | 'light'; vertical?: boolean }) {
  const text = tone === 'dark' ? 'text-paper/90' : 'text-ink';
  const lineColor = tone === 'dark' ? 'bg-night-rule' : 'bg-rule';
  if (vertical) {
    return (
      <ol>
        {stages.map((s, i) => (
          <li key={s.label} className="relative flex items-start gap-3 pb-3 last:pb-0">
            <span className={`relative z-10 mt-0.5 inline-block h-3.5 w-3.5 shrink-0 border-2 ${kindDot[s.kind]}`} aria-hidden />
            {i < stages.length - 1 && <span className={`absolute left-[0.4rem] top-4 bottom-0 w-[2px] ${lineColor}`} aria-hidden />}
            <span className={`ui font-medium ${text}`}>{s.label}</span>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <ol className="grid gap-y-3 md:gap-y-0 md:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]" style={{ ['--n' as string]: stages.length }}>
      {stages.map((s, i) => (
        <li key={s.label} className="relative flex items-start gap-3 md:block md:pr-2">
          <span className="relative flex h-4 shrink-0 items-center md:w-full">
            <span className={`relative z-10 inline-block h-3.5 w-3.5 border-2 ${kindDot[s.kind]}`} aria-hidden />
            {i < stages.length - 1 && <span className={`absolute left-3.5 right-0 top-1/2 hidden h-[2px] -translate-y-1/2 md:block ${lineColor}`} aria-hidden />}
          </span>
          {i < stages.length - 1 && <span className={`absolute left-[0.4rem] top-4 -bottom-3 w-[2px] md:hidden ${lineColor}`} aria-hidden />}
          <span className={`fine font-medium md:mt-2 md:block ${text}`}>{s.label}</span>
        </li>
      ))}
    </ol>
  );
}

export function KindLegend({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const items = [
    ['model', 'Model proposes'],
    ['rule', 'Code decides'],
    ['human', 'Person approves'],
    ['io', 'Input or output'],
  ];
  return (
    <ul className={`fine flex flex-wrap gap-x-5 gap-y-1.5 ${tone === 'dark' ? 'text-mist' : 'text-graphite'}`} aria-label="Legend">
      {items.map(([k, label]) => (
        <li key={k} className="inline-flex items-center gap-2">
          <span className={`inline-block h-3 w-3 border-2 ${kindDot[k]}`} aria-hidden />
          {label}
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------------------------------------- CricXAI calibration */

export function CalibrationChart({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const max = 0.32;
  const h = 220;
  const ink = tone === 'dark' ? '#221e19' : '#221e19';
  const muted = tone === 'dark' ? '#5c5449' : '#5c5449';
  const green = tone === 'dark' ? '#2d6c88' : '#2d6c88';
  return (
    <figure>
      <svg viewBox="0 0 480 300" className="h-auto w-full" role="img" aria-labelledby="cal-title cal-desc">
        <title id="cal-title">Predicted against observed dismissal rate</title>
        <desc id="cal-desc">
          {calibration.map((c) => `${c.bin}: predicted ${(c.predicted * 100).toFixed(1)}%, observed ${(c.observed * 100).toFixed(1)}%, ${c.n.toLocaleString('en-US')} deliveries.`).join(' ')}
        </desc>
        {[0, 0.1, 0.2, 0.3].map((t) => (
          <g key={t}>
            <line x1="44" x2="470" y1={20 + h - (t / max) * h} y2={20 + h - (t / max) * h} stroke={muted} strokeOpacity="0.3" />
            <text x="36" y={24 + h - (t / max) * h} textAnchor="end" fontSize="12" fill={muted} fontFamily="Archivo Variable, Archivo, sans-serif">{t * 100}%</text>
          </g>
        ))}
        {calibration.map((c, i) => {
          const x0 = 70 + i * 140;
          const bar = (v: number) => (v / max) * h;
          return (
            <g key={c.bin}>
              <rect x={x0} y={20 + h - bar(c.predicted)} width="46" height={bar(c.predicted)} fill="none" stroke={green} strokeWidth="3" />
              <rect x={x0 + 52} y={20 + h - bar(c.observed)} width="46" height={bar(c.observed)} fill={green} />
              <text x={x0 + 49} y={20 + h + 20} textAnchor="middle" fontSize="13" fill={ink} fontFamily="Archivo Variable, Archivo, sans-serif" fontWeight="600">{c.bin}</text>
              <text x={x0 + 49} y={20 + h + 37} textAnchor="middle" fontSize="11" fill={muted} fontFamily="Archivo Variable, Archivo, sans-serif">{c.n.toLocaleString('en-US')} balls</text>
            </g>
          );
        })}
      </svg>
      <figcaption className={`fine mt-2 flex flex-wrap gap-x-5 ${tone === 'dark' ? 'text-mist' : 'text-graphite'}`}>
        <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-3 border-2" style={{ borderColor: green }} aria-hidden />Predicted dismissal rate</span>
        <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-3" style={{ background: green }} aria-hidden />Observed rate</span>
        <span>Grouped by predicted probability. Source: evaluation report of the active model.</span>
      </figcaption>
    </figure>
  );
}

/* ---------------------------------------------------------------- RouteCore benchmark */

export function BenchmarkChart({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const scale = (ms: number) => (Math.log10(ms) + 0.3) / (Math.log10(2000) + 0.3);
  const muted = tone === 'dark' ? 'text-mist' : 'text-graphite';
  return (
    <figure>
      <table className="w-full border-collapse">
        <caption className={`fine mb-3 text-left ${muted}`}>
          Time for 2,000 nearest-neighbour queries, log scale. Answers match brute force at every size.
        </caption>
        <thead className="sr-only">
          <tr><th scope="col">Points</th><th scope="col">Brute force (ms)</th><th scope="col">k-d tree (ms)</th><th scope="col">Speed-up</th></tr>
        </thead>
        <tbody>
          {kdBenchmark.map((r) => (
            <tr key={r.n} className="align-middle">
              <th scope="row" className={`fine w-20 py-2 pr-3 text-left font-semibold ${tone === 'dark' ? 'text-paper' : 'text-ink'}`}>N = {r.n}</th>
              <td className="py-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="block h-2.5 bg-mist/60" style={{ width: `${scale(r.brute) * 100}%` }} aria-hidden />
                    <span className={`fine whitespace-nowrap ${muted}`}>{r.brute.toLocaleString('en-US')} ms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="block h-2.5 bg-route" style={{ width: `${scale(r.kd) * 100}%` }} aria-hidden />
                    <span className={`fine whitespace-nowrap font-semibold ${tone === 'dark' ? 'text-paper' : 'text-ink'}`}>{r.kd} ms</span>
                  </div>
                </div>
              </td>
              <td className={`fine w-16 py-2 pl-3 text-right font-bold ${tone === 'dark' ? 'text-paper' : 'text-ink'}`}>{(r.brute / r.kd).toFixed(1)}x</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={`fine mt-2 flex gap-5 ${muted}`}>
        <span className="inline-flex items-center gap-2"><span className="inline-block h-2.5 w-5 bg-mist/60" aria-hidden />Brute force</span>
        <span className="inline-flex items-center gap-2"><span className="inline-block h-2.5 w-5 bg-route" aria-hidden />k-d tree</span>
      </p>
    </figure>
  );
}

/* ---------------------------------------------------------------- Refera ledger */

export function LedgerDiagram({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark';
  const rows = [
    ['Credit', 'Commission approved for a converted lead'],
    ['Debit', 'Withdrawal requested'],
    ['Credit', 'Payout failed: reversal entry'],
  ];
  return (
    <figure className="font-sans">
      <div className={dark ? 'border border-kerb bg-dusk text-paper' : 'border border-ink bg-surface'}>
        <p className={`label border-b px-4 py-2.5 ${dark ? 'border-kerb text-haze' : 'border-ink text-graphite'}`}>ledger_entries, append-only</p>
        <ol>
          {rows.map(([type, text], i) => (
            <li key={i} className={`grid grid-cols-[4.5rem_1fr] border-b px-4 py-2.5 text-[0.9375rem] ${dark ? 'border-kerb' : 'border-rule'}`}>
              <span className={`font-semibold ${type === 'Credit' ? (dark ? 'text-field-light' : 'text-clear') : dark ? 'text-paper' : 'text-ink'}`}>{type}</span>
              <span>{text}</span>
            </li>
          ))}
        </ol>
        <div className="grid grid-cols-[4.5rem_1fr] bg-held/8 px-4 py-2.5 text-[0.9375rem]">
          <span className={`font-semibold line-through ${dark ? 'text-held-light' : 'text-held'}`}>Update</span>
          <span className={dark ? 'text-held-light' : 'text-held'}>Rejected by a database trigger. History is only ever added to.</span>
        </div>
      </div>
      <figcaption className={`fine mt-2 ${dark ? 'text-haze' : 'text-graphite'}`}>Explanatory diagram of Refera’s ledger rules. Entry types, not real data.</figcaption>
    </figure>
  );
}
