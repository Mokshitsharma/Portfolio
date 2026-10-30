import { useId } from 'react';

// Naman's orb, redrawn in SVG from the assistant's own renderer (Naman/src/naman/orb.py and overlay.py): a soft
// gradient blob in the colour of its state, lit from the top left, with eyes that blink, pink cheeks and a mouth
// that follows the state, and one dot per plan step under the face. Proportions follow orb.py (eyes at ±0.32R,
// 0.1R above centre, 0.1R by 0.145R). Motion is CSS and stops with reduced motion.

export type OrbMode = 'waiting' | 'listening' | 'thinking' | 'working' | 'speaking' | 'happy';

// State colours from overlay.py.
export const orbColour: Record<OrbMode, string> = {
  waiting: '#2dd4bf',
  listening: '#38bdf8',
  thinking: '#fbbf24',
  working: '#a78bfa',
  speaking: '#34d399',
  happy: '#2dd4bf',
};

const INK = '#0f172a';

export default function NamanOrb({ mode = 'waiting', plan, done = 0, className = '', title }: { mode?: OrbMode; plan?: number; done?: number; className?: string; title?: string }) {
  const id = useId().replace(/:/g, '');
  const c = orbColour[mode];
  const R = 100;
  const cx = 120;
  const cy = 118;
  const ex = R * 0.32;
  const ey = cy - R * 0.1;
  const big = mode === 'listening' ? 1.18 : 1;
  const w = R * 0.1 * big;
  const h = R * 0.145 * big;
  const look = mode === 'thinking' || mode === 'working' ? { x: R * 0.08, y: -R * 0.07 } : { x: 0, y: 0 };
  const happy = mode === 'happy';

  return (
    <svg viewBox="0 0 240 260" className={`naman-orb is-${mode} ${className}`} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <defs>
        <radialGradient id={`${id}-body`} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="28%" stopColor={c} stopOpacity="0.9" />
          <stop offset="100%" stopColor={c} />
        </radialGradient>
        <filter id={`${id}-soft`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14" /></filter>
        <clipPath id={`${id}-clip`}><circle cx={cx} cy={cy} r={R} /></clipPath>
      </defs>

      {/* shadow on the page */}
      <ellipse cx={cx} cy={cy + R + 22} rx={R * 0.62} ry={9} fill={INK} opacity="0.12" className="orb-shadow" />

      <g className="orb-body">
        <circle cx={cx} cy={cy} r={R} fill={`url(#${id}-body)`} />
        {/* soft lights drifting inside, in the state's colour and its neighbours */}
        <g clipPath={`url(#${id}-clip)`} filter={`url(#${id}-soft)`} opacity="0.75">
          <circle className="orb-light orb-light-a" cx={cx - 30} cy={cy + 34} r={44} fill="#ffffff" opacity="0.35" />
          <circle className="orb-light orb-light-b" cx={cx + 42} cy={cy + 10} r={38} fill={c} opacity="0.9" />
        </g>
        <circle cx={cx} cy={cy} r={R - 1} fill="none" stroke={INK} strokeOpacity="0.12" strokeWidth="2" />

        {/* face */}
        <g className="orb-face" transform={`translate(${look.x} ${look.y})`}>
          {[-1, 1].map((side) => {
            const x = cx + side * ex;
            return happy ? (
              <path key={side} d={`M${x - w * 1.1} ${ey + h * 0.3} Q${x} ${ey - h * 0.9} ${x + w * 1.1} ${ey + h * 0.3}`} fill="none" stroke={INK} strokeWidth="4.2" strokeLinecap="round" />
            ) : (
              <g key={side} className="orb-eye" style={{ transformOrigin: `${x}px ${ey}px` }}>
                <ellipse cx={x} cy={ey} rx={w} ry={h} fill={INK} />
                <circle cx={x + w * 0.35} cy={ey - h * 0.35} r={w * 0.42} fill="#ffffff" />
              </g>
            );
          })}
          {[-1, 1].map((side) => <ellipse key={`c${side}`} cx={cx + side * R * 0.5} cy={cy + R * 0.12} rx={R * 0.11} ry={R * 0.06} fill="#f472b6" opacity="0.55" />)}
          {mode === 'listening' && <ellipse cx={cx} cy={cy + R * 0.2} rx={R * 0.05} ry={R * 0.06} fill={INK} />}
          {mode === 'thinking' && <path d={`M${cx + R * 0.02} ${cy + R * 0.22} h${R * 0.14}`} stroke={INK} strokeWidth="4.2" strokeLinecap="round" />}
          {mode === 'speaking' && <ellipse className="orb-talk" cx={cx} cy={cy + R * 0.21} rx={R * 0.1} ry={R * 0.08} fill={INK} style={{ transformOrigin: `${cx}px ${cy + R * 0.21}px` }} />}
          {happy && <path d={`M${cx - R * 0.16} ${cy + R * 0.14} Q${cx} ${cy + R * 0.38} ${cx + R * 0.16} ${cy + R * 0.14} Z`} fill={INK} />}
          {(mode === 'waiting' || mode === 'working') && <path d={`M${cx - R * 0.13} ${cy + R * 0.16} Q${cx} ${cy + R * 0.28} ${cx + R * 0.13} ${cy + R * 0.16}`} fill="none" stroke={INK} strokeWidth="4.2" strokeLinecap="round" />}
        </g>
      </g>

      {/* plan: one dot per step, finished ones solid, the running one pulsing */}
      {plan ? (
        <g>
          {Array.from({ length: plan }, (_, i) => {
            const x = cx + (i - (plan - 1) / 2) * 18;
            const state = i < done ? 'done' : i === done ? 'now' : 'todo';
            return <circle key={i} cx={x} cy={cy + R + 46} r={5.5} className={`orb-dot orb-dot-${state}`} fill={state === 'todo' ? 'none' : c} stroke={c} strokeWidth="2" />;
          })}
        </g>
      ) : null}
    </svg>
  );
}
