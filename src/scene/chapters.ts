// Chapters of the home page and the shape the engine takes during each. Shared by the scroll handler,
// the chapter rail and the scene, so the three never disagree.

export type ChapterId = 'opening' | 'domains' | 'map' | 'systems' | 'approach' | 'experience' | 'closing';

// Engine shapes, in the order they blend: 0 core, 1 layers, 2 map plane, 3 reading field, 4 closing ring.
export const SHAPES = 5;

export const chapters: { id: ChapterId; name: string; shape: number; dim: number }[] = [
  { id: 'opening', name: 'Introduction', shape: 0, dim: 0 },
  { id: 'domains', name: 'Domains', shape: 1, dim: 0.1 },
  { id: 'map', name: 'Project map', shape: 2, dim: 0.35 },
  { id: 'systems', name: 'Featured work', shape: 3, dim: 0.55 },
  { id: 'approach', name: 'How I build', shape: 3, dim: 0.55 },
  { id: 'experience', name: 'Experience', shape: 3, dim: 0.6 },
  { id: 'closing', name: 'Contact', shape: 4, dim: 0.1 },
];

export const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

// Each chapter holds its shape while it is read and travels to the next one in its last 30%.
export function shapeAt(index: number, progress: number, reduced: boolean) {
  const from = chapters[index];
  const to = chapters[Math.min(index + 1, chapters.length - 1)];
  const t = reduced ? 0 : smooth(0.7, 1, progress);
  return {
    shape: from.shape + (to.shape - from.shape) * t,
    dim: from.dim + (to.dim - from.dim) * t,
  };
}
