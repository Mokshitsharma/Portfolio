import { projects } from '../data/projects';
import type { Category, Maturity } from '../data/types';

// The home page city, as plain data. Shared by the WebGL scene and the still poster that the prerendered HTML
// shows before (or instead of) WebGL, so both draw the same city. No three.js imports here.
//
// Every published project is one lit tower: colour is its area of work, height is how far it got.
// The other blocks are unlit filler.

export const GRID = 15; // blocks per side
export const PITCH = 1.4; // block plus street, in world units
const HALF = (GRID - 1) / 2;

export const categoryOrder: Category[] = ['production', 'agents', 'ml', 'fullstack', 'tools', 'data', 'learning'];

export const categoryHex: Record<Category, string> = {
  production: '#f2b13c',
  agents: '#8ea8ff',
  ml: '#57c99a',
  data: '#57c99a',
  fullstack: '#e8ecf1',
  tools: '#e8ecf1',
  learning: '#9aacbf',
};

export const maturityHeight: Record<Maturity, number> = {
  production: 5.2,
  deployed: 4.4,
  working: 3.6,
  'in-progress': 3.0,
  prototype: 2.3,
  notebook: 1.6,
  coursework: 1.1,
};

const maturityRank: Maturity[] = ['production', 'deployed', 'working', 'in-progress', 'prototype', 'notebook', 'coursework'];

// District centres in cell coordinates. Production sits downtown next to the dispatch route.
const districtCentre: Record<Category, [number, number]> = {
  production: [7, 6],
  agents: [10, 4],
  fullstack: [4, 8],
  tools: [4, 4],
  learning: [2, 12],
  data: [8, 11],
  ml: [11, 9],
};

export interface Building {
  x: number;
  z: number;
  height: number;
  width: number;
  depth: number;
  category: number; // index into categoryOrder, or -1 for filler
  slug?: string;
  seed: number;
}

export const cellCentre = (i: number, j: number): [number, number] => [(i - HALF) * PITCH, (j - HALF) * PITCH];
// Street intersections sit between cells; a, b run 0..GRID.
export const crossing = (a: number, b: number): [number, number] => [(a - HALF - 0.5) * PITCH, (b - HALF - 0.5) * PITCH];

// Small deterministic hash so the city is identical on every load and in the poster.
function rand(i: number, j: number, k = 0) {
  const s = Math.sin(i * 127.1 + j * 311.7 + k * 74.7) * 43758.5453;
  return s - Math.floor(s);
}

function buildCity(): Building[] {
  const taken = new Map<string, Building>();
  const key = (i: number, j: number) => `${i},${j}`;

  // Assign districts, smallest first so they stay compact; machine learning, the largest, takes what is left
  // around its centre.
  const order: Category[] = ['production', 'agents', 'fullstack', 'tools', 'learning', 'data', 'ml'];
  for (const cat of order) {
    const list = projects
      .filter((p) => p.category === cat)
      .sort((a, b) => maturityRank.indexOf(a.maturity) - maturityRank.indexOf(b.maturity));
    const [ci, cj] = districtCentre[cat];
    const cells: [number, number][] = [];
    for (let i = 0; i < GRID; i++) for (let j = 0; j < GRID; j++) if (!taken.has(key(i, j))) cells.push([i, j]);
    cells.sort((a, b) => (a[0] - ci) ** 2 + (a[1] - cj) ** 2 - ((b[0] - ci) ** 2 + (b[1] - cj) ** 2) || a[0] - b[0] || a[1] - b[1]);
    list.forEach((p, n) => {
      const [i, j] = cells[n];
      const [x, z] = cellCentre(i, j);
      taken.set(key(i, j), {
        x, z,
        height: maturityHeight[p.maturity],
        width: 0.78,
        depth: 0.78,
        category: categoryOrder.indexOf(cat),
        slug: p.slug,
        seed: rand(i, j, 3),
      });
    });
  }

  const out: Building[] = [];
  for (let i = 0; i < GRID; i++) {
    for (let j = 0; j < GRID; j++) {
      const t = taken.get(key(i, j));
      if (t) {
        out.push(t);
        continue;
      }
      const [x, z] = cellCentre(i, j);
      const d2 = (i - HALF) ** 2 + (j - HALF) ** 2;
      out.push({
        x, z,
        height: 0.25 + rand(i, j) * 1.25 + 0.9 * Math.exp(-d2 / 30),
        width: 0.62 + rand(i, j, 1) * 0.32,
        depth: 0.62 + rand(i, j, 2) * 0.32,
        category: -1,
        seed: rand(i, j, 3),
      });
    }
  }
  return out;
}

export const buildings = buildCity();

// One delivery, along the streets: the retailer books, dispatch finds a driver, the driver delivers.
export const dispatchRoute: [number, number][] = [crossing(5, 3), crossing(5, 7), crossing(9, 7), crossing(9, 10), crossing(12, 10)];
// The long avenue the career chapter lights.
export const avenue: [number, number][] = [crossing(0, 12), crossing(15, 12)];

// Where along the dispatch route (0-1) the agent chapter stands its gates, in pipeline order.
export const gates: { at: number; kind: 'model' | 'rule' | 'human' }[] = [
  { at: 0.3, kind: 'model' },
  { at: 0.5, kind: 'rule' },
  { at: 0.7, kind: 'human' },
];

export function pathLength(path: [number, number][]) {
  let len = 0;
  for (let i = 1; i < path.length; i++) len += Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]);
  return len;
}

export function pointAt(path: [number, number][], t: number): [number, number] {
  const total = pathLength(path);
  let left = t * total;
  for (let i = 1; i < path.length; i++) {
    const seg = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]);
    if (left <= seg) {
      const f = left / seg;
      return [path[i - 1][0] + (path[i][0] - path[i - 1][0]) * f, path[i - 1][1] + (path[i][1] - path[i - 1][1]) * f];
    }
    left -= seg;
  }
  return path[path.length - 1];
}

/* ------------------------------------------------------------------ Chapters */

export type ChapterId = 'opening' | 'movigo' | 'agents' | 'models' | 'archive' | 'career' | 'credentials' | 'contact';

export const chapters: { id: ChapterId; name: string }[] = [
  { id: 'opening', name: 'Opening' },
  { id: 'movigo', name: 'Movigo' },
  { id: 'agents', name: 'Agents' },
  { id: 'models', name: 'Models' },
  { id: 'archive', name: 'Archive' },
  { id: 'career', name: 'Career' },
  { id: 'credentials', name: 'Credentials' },
  { id: 'contact', name: 'Contact' },
];

type V3 = [number, number, number];

// What the scene looks like while a chapter is on screen. `lit` is per category, in categoryOrder.
export interface SceneState {
  cam: V3;
  look: V3;
  lit: number[];
  route: number; // how much of the dispatch route is drawn, 0-1
  routeAgent: number; // 0 = production colour, 1 = agent colour
  gates: number; // gate height, 0-1
  ring: number; // dispatch radius ring opacity
  avenue: number; // how much of the avenue is drawn
  dim: number; // 0 = full scene, 1 = nearly black, for reading-heavy chapters
}

const mid = pointAt(dispatchRoute, 0.45);
const human = pointAt(dispatchRoute, gates[2].at);
const [mlx, mlz] = cellCentre(...districtCentre.ml);
const [avx, avz] = avenue[0];

const L = (on: Category[]) => categoryOrder.map((c) => (on.includes(c) ? 1 : 0));
const ALL = categoryOrder.map(() => 1);

export const states: Record<ChapterId, SceneState> = {
  opening: { cam: [17, 12, 19], look: [-2.5, 0, 1.5], lit: L(['production']), route: 1, routeAgent: 0, gates: 0, ring: 1, avenue: 0, dim: 0 },
  movigo: { cam: [mid[0] + 6.5, 3.4, mid[1] + 7], look: [mid[0] - 1, 0.4, mid[1]], lit: L(['production']), route: 1, routeAgent: 0, gates: 0, ring: 0.6, avenue: 0, dim: 0.1 },
  agents: { cam: [human[0] + 6, 4.2, human[1] + 6.5], look: [human[0] - 1.5, 0.8, human[1] - 1], lit: L(['production', 'agents']), route: 1, routeAgent: 1, gates: 1, ring: 0, avenue: 0, dim: 0.15 },
  models: { cam: [mlx + 7, 7, mlz + 8], look: [mlx - 1.5, 0.5, mlz - 1], lit: L(['production', 'agents', 'ml', 'data']), route: 1, routeAgent: 1, gates: 0, ring: 0, avenue: 0, dim: 0.3 },
  archive: { cam: [4, 30, 9], look: [-3.5, 0, 0.5], lit: ALL, route: 1, routeAgent: 0, gates: 0, ring: 0, avenue: 0, dim: 0 },
  career: { cam: [avx - 3, 2.6, avz + 3.5], look: [avx + 9, 0.6, avz - 1.5], lit: ALL, route: 0.4, routeAgent: 0, gates: 0, ring: 0, avenue: 1, dim: 0.2 },
  credentials: { cam: [-16, 11, 15], look: [0, 0, 0], lit: ALL, route: 1, routeAgent: 0, gates: 0, ring: 0, avenue: 1, dim: 0.62 },
  contact: { cam: [6, 34, 30], look: [-4, 0, 0], lit: ALL, route: 1, routeAgent: 0, gates: 0, ring: 0.8, avenue: 1, dim: 0.25 },
};
