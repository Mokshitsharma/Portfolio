// Point positions for every shape the engine takes. No three.js here, so the prerendered poster can draw the
// same core without loading the scene. All randomness is seeded: the poster and the live scene match.

export type Kind = 0 | 1 | 2 | 3; // 0 model proposes, 1 code decides, 2 person approves, 3 data

export const kindHex = ['#4f8cff', '#57dbe6', '#a78bfa', '#c9d3e3'] as const;

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type V3 = [number, number, number];

// Rings of the core: tilt about x, tilt about z, radius. They read as one armature around three shells.
const RINGS: V3[] = [
  [0.0, 0.0, 3.05],
  [1.15, 0.2, 2.95],
  [-0.9, 0.75, 3.0],
  [0.5, -1.2, 2.2],
  [1.5, 1.1, 2.15],
];

function onRing(r: () => number, [ax, az, radius]: V3): V3 {
  const t = r() * Math.PI * 2;
  const jitter = (r() - 0.5) * 0.05;
  let x = Math.cos(t) * (radius + jitter);
  let y = (r() - 0.5) * 0.04;
  let z = Math.sin(t) * (radius + jitter);
  // tilt about x, then about z
  [y, z] = [y * Math.cos(ax) - z * Math.sin(ax), y * Math.sin(ax) + z * Math.cos(ax)];
  [x, y] = [x * Math.cos(az) - y * Math.sin(az), x * Math.sin(az) + y * Math.cos(az)];
  return [x, y, z];
}

function onShell(r: () => number, radius: number): V3 {
  const u = r() * 2 - 1;
  const t = r() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  const k = radius * (1 + (r() - 0.5) * 0.06);
  return [s * Math.cos(t) * k, u * k * 0.9, s * Math.sin(t) * k];
}

/** The opening shape: three nested shells inside a ring armature. Hubs carry the links; shell -1 is a ring. */
export function corePoint(r: () => number): { p: V3; hub: boolean; shell: number } {
  const pick = r();
  if (pick < 0.36) return { p: onRing(r, RINGS[Math.floor(r() * RINGS.length)]), hub: false, shell: -1 };
  if (pick < 0.64) return { p: onShell(r, 2.35), hub: r() < 0.3, shell: 0 };
  if (pick < 0.88) return { p: onShell(r, 1.45), hub: r() < 0.36, shell: 1 };
  return { p: onShell(r, 0.6), hub: r() < 0.45, shell: 2 };
}

export const LAYER_Y = [-2.4, -1.2, 0, 1.2, 2.4];
export const LAYER_HALF: [number, number] = [3.1, 1.7];

/** Five stacked layers on a fine grid, one per engineering domain. */
export function layerPoint(r: () => number, layer: number): V3 {
  const step = 0.2;
  const [hx, hz] = LAYER_HALF;
  const x = Math.round(((r() * 2 - 1) * hx) / step) * step;
  const z = Math.round(((r() * 2 - 1) * hz) / step) * step;
  return [x + (r() - 0.5) * 0.03, LAYER_Y[layer], z + (r() - 0.5) * 0.03];
}

/** A flat disc on concentric rings, under the project map. */
export function planePoint(r: () => number): V3 {
  const ring = Math.floor(Math.sqrt(r()) * 12) + 1;
  const radius = ring * 0.36 + (r() - 0.5) * 0.04;
  const t = r() * Math.PI * 2;
  return [Math.cos(t) * radius, -1.2, Math.sin(t) * radius];
}

/** A wide, sparse field behind the reading chapters. */
export function fieldPoint(r: () => number): V3 {
  return [(r() * 2 - 1) * 10, (r() * 2 - 1) * 5, -2 - r() * 9];
}

/** The closing ring, seen from just above its plane. */
export function ringPoint(r: () => number): V3 {
  const t = r() * Math.PI * 2;
  const spread = r() < 0.85 ? 0.06 : 0.6;
  const g = (r() + r() + r() - 1.5) * spread;
  return [Math.cos(t) * (3.3 + g), (r() - 0.5) * spread * 0.5, Math.sin(t) * (3.3 + g)];
}

export function kindFor(r: () => number): Kind {
  const x = r();
  return x < 0.55 ? 0 : x < 0.86 ? 1 : x < 0.95 ? 2 : 3;
}
