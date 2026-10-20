import { corePoint, kindFor, kindHex, rng } from '../../scene/shapes';

// Still image of the engine's opening shape, drawn by the same generator as the WebGL scene. It is in the
// prerendered HTML, so the first paint never waits on WebGL, and it stays when WebGL is unavailable or too slow.

const COUNT = 1100;

function points() {
  const r = rng(27);
  const out: { x: number; y: number; z: number; k: number; s: number }[] = [];
  const turn = 0.6;
  for (let i = 0; i < COUNT; i++) {
    const { p, hub } = corePoint(r);
    const [x, y, z] = p;
    out.push({
      x: x * Math.cos(turn) + z * Math.sin(turn),
      y: -y,
      z: -x * Math.sin(turn) + z * Math.cos(turn),
      k: kindFor(r),
      s: hub ? 0.045 : 0.022,
    });
  }
  return out.sort((a, b) => a.z - b.z);
}

const cached = points();

export default function EnginePoster({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="-4.6 -3.6 9.2 7.2" preserveAspectRatio="xMidYMid meet" className={className} aria-hidden focusable="false">
      {cached.map((p, i) => (
        <circle key={i} cx={p.x.toFixed(3)} cy={p.y.toFixed(3)} r={p.s} fill={kindHex[p.k]} fillOpacity={(0.35 + 0.5 * ((p.z + 3) / 6)).toFixed(2)} />
      ))}
    </svg>
  );
}
