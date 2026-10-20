import { GRID, PITCH, buildings, categoryHex, categoryOrder, crossing } from '../../scene/layout';

// Still image of the city, drawn from the same layout as the WebGL scene. It is in the prerendered HTML, so the
// first paint never waits on WebGL, and it stays as the backdrop when WebGL is unavailable or too slow.
// Isometric projection; only the project towers and the street grid are drawn.

const C = Math.cos(Math.PI / 6);
const S = Math.sin(Math.PI / 6);
const iso = (x: number, z: number, y = 0) => [(x - z) * C, (x + z) * S - y] as const;
const pts = (list: (readonly [number, number])[]) => list.map(([a, b]) => `${a.toFixed(2)},${b.toFixed(2)}`).join(' ');

export default function CityPoster({ className = '' }: { className?: string }) {
  const half = (GRID / 2) * PITCH;
  const streets = Array.from({ length: GRID + 1 }, (_, k) => crossing(k, 0)[0]);
  const towers = buildings
    .filter((b) => b.category >= 0)
    .sort((a, b) => a.x + a.z - (b.x + b.z));
  return (
    <svg viewBox="-17 -9 34 25" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden focusable="false">
      <g stroke="#1f3249" strokeWidth="0.05">
        {streets.map((v) => (
          <g key={v}>
            <line x1={iso(v, -half)[0]} y1={iso(v, -half)[1]} x2={iso(v, half)[0]} y2={iso(v, half)[1]} />
            <line x1={iso(-half, v)[0]} y1={iso(-half, v)[1]} x2={iso(half, v)[0]} y2={iso(half, v)[1]} />
          </g>
        ))}
      </g>
      {towers.map((b) => {
        const color = categoryHex[categoryOrder[b.category]];
        const w = b.width / 2;
        const [x0, x1, z0, z1, h] = [b.x - w, b.x + w, b.z - w, b.z + w, b.height];
        return (
          <g key={b.slug}>
            <polygon points={pts([iso(x0, z1), iso(x1, z1), iso(x1, z1, h), iso(x0, z1, h)])} fill={color} fillOpacity="0.32" />
            <polygon points={pts([iso(x1, z0), iso(x1, z1), iso(x1, z1, h), iso(x1, z0, h)])} fill={color} fillOpacity="0.18" />
            <polygon points={pts([iso(x0, z0, h), iso(x1, z0, h), iso(x1, z1, h), iso(x0, z1, h)])} fill={color} fillOpacity="0.55" />
          </g>
        );
      })}
    </svg>
  );
}
