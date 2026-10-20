import { useState } from 'react';
import { calibration, kdBenchmark, transit, type Line, lineHex } from '../data/visuals';
import type { Figure, Role } from '../data/types';
import { formatRange } from '../data/experience';

// Visual components. Each draws real data or a real architecture; none are decorative fillers.

/* ---------------------------------------------------------------- Transit map (hero) */

type Focus = 'production' | 'agents' | null;

function Station({ x, y, label, above, color, terminal }: { x: number; y: number; label: string; above?: boolean; color: string; terminal?: boolean }) {
  return (
    <g className="fade-stop" style={{ animationDelay: `${0.4 + x / 1400}s` }}>
      {terminal ? (
        <rect x={x - 9} y={y - 9} width="18" height="18" fill="#e9ecef" stroke={color} strokeWidth="5" />
      ) : (
        <circle cx={x} cy={y} r="9" fill="#e9ecef" stroke={color} strokeWidth="5" />
      )}
      <text x={x} y={above ? y - 24 : y + 36} textAnchor="middle" fill="#e9ecef" fontSize="15" fontFamily="Archivo Variable, Archivo, sans-serif" style={{ fontStretch: '80%' }} fontWeight="600">
        {label}
      </text>
    </g>
  );
}

export function TransitMap() {
  const [focus, setFocus] = useState<Focus>(null);
  const prod = transit.production;
  const ag = transit.agents;
  const yP = 96;
  const yA = 254;
  const dim = (line: Focus) => (focus && focus !== line ? 0.18 : 1);

  return (
    <figure className="relative">
      <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-3" role="group" aria-label="Highlight a line">
        {(['production', 'agents'] as const).map((key) => {
          const l = transit[key];
          const color = key === 'production' ? lineHex.route : lineHex.signal;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={focus === key}
              onClick={() => setFocus(focus === key ? null : key)}
              onMouseEnter={() => setFocus(key)}
              onMouseLeave={() => setFocus(null)}
              className="label inline-flex min-h-10 items-center gap-3 text-paper/90 hover:text-paper aria-pressed:text-paper"
            >
              <span className="inline-block h-1.5 w-8" style={{ background: color }} aria-hidden />
              {l.name}: <span className="text-mist">{l.project}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop: the map. Screen readers get the list version below instead. */}
      <svg viewBox="0 0 1200 330" className="hidden h-auto w-full md:block" aria-hidden focusable="false">
        <g style={{ opacity: dim('production'), transition: 'opacity 200ms' }}>
          <path
            pathLength={1}
            className="draw-line"
            d={`M40 ${yP} H430 L512 168 H688 L770 ${yP} H1160`}
            fill="none"
            stroke={lineHex.route}
            strokeWidth="10"
            strokeLinejoin="round"
          />
          <Station x={140} y={yP} label={prod.before[0]} above color={lineHex.route} />
          <Station x={330} y={yP} label={prod.before[1]} above color={lineHex.route} />
          <Station x={840} y={yP} label={prod.after[0]} above color={lineHex.route} />
          <Station x={1030} y={yP} label={prod.after[1]} above color={lineHex.route} />
          <Station x={1150} y={yP} label="" above color={lineHex.route} terminal />
          <text x={1160} y={yP + 38} textAnchor="end" fill="#e9ecef" fontSize="15" fontFamily="Archivo Variable, Archivo, sans-serif" fontWeight="600" className="fade-stop" style={{ fontStretch: '80%', animationDelay: '1.2s' }}>
            {prod.after[2]}
          </text>
        </g>
        <g style={{ opacity: dim('agents'), transition: 'opacity 200ms' }}>
          <path
            pathLength={1}
            className="draw-line late"
            d={`M40 ${yA} H430 L512 182 H688 L770 ${yA} H1160`}
            fill="none"
            stroke={lineHex.signal}
            strokeWidth="10"
            strokeLinejoin="round"
          />
          <Station x={140} y={yA} label={ag.before[0]} color={lineHex.signal} />
          <Station x={330} y={yA} label={ag.before[1]} color={lineHex.signal} />
          <Station x={840} y={yA} label={ag.after[0]} color={lineHex.signal} />
          <Station x={1030} y={yA} label={ag.after[1]} color={lineHex.signal} />
          <Station x={1150} y={yA} label="" color={lineHex.signal} terminal />
          <text x={1160} y={yA - 24} textAnchor="end" fill="#e9ecef" fontSize="15" fontFamily="Archivo Variable, Archivo, sans-serif" fontWeight="600" className="fade-stop" style={{ fontStretch: '80%', animationDelay: '1.4s' }}>
            {ag.after[2]}
          </text>
        </g>
        {/* Interchange */}
        <g className="fade-stop" style={{ animationDelay: '0.9s' }}>
          <rect x="520" y="150" width="160" height="50" rx="25" fill="#e9ecef" stroke="#0e1c2b" strokeWidth="4" />
          <text x="600" y="182" textAnchor="middle" fill="#0e1c2b" fontSize="19" fontWeight="800" fontFamily="Archivo Variable, Archivo, sans-serif" style={{ fontStretch: '72%' }}>
            {transit.interchange.name}
          </text>
        </g>
      </svg>

      {/* Mobile and screen readers: the same two lines as lists. */}
      <div className="grid gap-8 md:sr-only sm:grid-cols-2">
        {(['production', 'agents'] as const).map((key) => {
          const l = transit[key];
          const color = key === 'production' ? lineHex.route : lineHex.signal;
          const stops = [...l.before, transit.interchange.name, ...l.after];
          return (
            <div key={key}>
              <p className="label text-paper">{l.name}: {l.project}</p>
              <ol className="mt-3 border-l-[6px] pl-4" style={{ borderColor: color }}>
                {stops.map((s) => (
                  <li key={s} className={`ui py-1.5 ${s === transit.interchange.name ? 'font-bold text-route' : 'text-paper/90'}`}>{s}</li>
                ))}
              </ol>
            </div>
          );
        })}
      </div>
      <figcaption className="fine mt-6 max-w-2xl text-mist">
        Two pipelines from my own code. Both hand control to deterministic code at the same point: a conditional database
        write when drivers race for a booking, and a guard before any agent action takes effect.
      </figcaption>
    </figure>
  );
}

/* ---------------------------------------------------------------- Mini pipeline */

// Same colours as the gates in the home page city: blue model, amber code, white person.
const kindDot: Record<string, string> = {
  model: 'border-signal-light bg-transparent rounded-full',
  rule: 'border-sodium bg-sodium',
  human: 'border-paper bg-paper rounded-full',
  io: 'border-paper/70 bg-transparent',
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
          <span className={`inline-block h-3 w-3 border-2 ${kindDot[k]} ${tone === 'light' && (k === 'io' || k === 'human') ? '!border-ink' : ''} ${tone === 'light' && k === 'human' ? '!bg-ink' : ''} ${tone === 'light' && k === 'model' ? '!border-signal' : ''}`} aria-hidden />
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
  const ink = tone === 'dark' ? '#e9ecef' : '#0e1c2b';
  const muted = tone === 'dark' ? '#9aacbf' : '#4a5968';
  const green = tone === 'dark' ? '#57c99a' : '#2f9e6e';
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

/* ---------------------------------------------------------------- Screenshots */

export function ScreenshotStack({ figures, line = 'signal' }: { figures: Figure[]; line?: Line }) {
  const [main, second] = figures;
  return (
    <div className="relative pb-[30%] sm:pb-[22%]">
      <figure className="lift relative z-10 w-[86%] border-[1.5px] border-night bg-surface shadow-[16px_16px_0_0_var(--color-night)]">
        <figcaption className="fine border-b border-night bg-night px-3 py-2 text-paper">{main.caption}</figcaption>
        <img src={main.src} alt={main.alt} width={main.width} height={main.height} loading="lazy" decoding="async" className="block h-auto w-full" />
      </figure>
      {second && (
        <figure className="absolute bottom-0 right-0 z-20 w-[56%] border-[1.5px] border-night bg-surface" style={{ boxShadow: `10px 10px 0 0 ${lineHex[line]}` }}>
          <figcaption className="fine border-b border-night bg-night px-3 py-2 text-paper">{second.caption}</figcaption>
          <img src={second.src} alt={second.alt} width={second.width} height={second.height} loading="lazy" decoding="async" className="block h-auto w-full" />
        </figure>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- Experience timeline */

const monthIndex = (ym: string) => {
  const [y, m] = ym.split('-').map(Number);
  return y * 12 + (m - 1);
};

export function RoleTimeline({ roles, now = '2026-10', tone = 'light' }: { roles: Role[]; now?: string; tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark';
  const start = monthIndex('2024-06');
  const end = monthIndex(now) + 1;
  const span = end - start;
  const years = [2024, 2025, 2026];
  return (
    <figure>
      <div className="relative">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {years.map((y) => {
            const left = Math.max(0, ((monthIndex(`${y}-01`) - start) / span) * 100);
            return (
              <div key={y} className={`absolute top-0 bottom-0 border-l border-dashed ${dark ? 'border-haze/25' : 'border-graphite/30'}`} style={{ left: `${left}%` }}>
                <span className={`label absolute -top-6 left-1 ${dark ? 'text-haze' : 'text-graphite'}`}>{y}</span>
              </div>
            );
          })}
        </div>
        <ol className="relative space-y-1 pt-8">
          {roles.map((r) => {
            const s = monthIndex(r.start);
            const e = r.end === 'present' ? end : monthIndex(r.end) + 1;
            const left = ((s - start) / span) * 100;
            const width = Math.max(((e - s) / span) * 100, 1.6);
            const current = r.end === 'present';
            const label = (
              <span className={`fine block truncate font-semibold ${dark ? 'text-paper' : 'text-ink'}`}>
                {r.org} <span className={`font-normal ${dark ? 'text-haze' : 'text-graphite'}`}>{formatRange(r.start, r.end)}</span>
              </span>
            );
            return (
              <li key={r.id}>
                {/* Phones: the label sits on its own line, so it can never run off the edge. */}
                <div className="sm:hidden">{label}</div>
                <div className="relative h-5 sm:h-10">
                  <span className="absolute top-0 hidden max-w-full sm:block" style={left > 55 ? { right: `${Math.max(0, 100 - left - width)}%`, textAlign: 'right' } : { left: `${left}%` }}>
                    {label}
                  </span>
                  <span
                    className={`absolute bottom-1 h-3 ${current ? 'bg-sodium' : dark ? 'bg-haze/70' : 'bg-night'}`}
                    style={{ left: `${left}%`, width: `${width}%` }}
                    aria-hidden
                  />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      <figcaption className={`fine mt-4 ${dark ? 'text-haze' : 'text-graphite'}`}>Each bar runs from the start to the end month on the offer letter or certificate. Amber is the current role.</figcaption>
    </figure>
  );
}
