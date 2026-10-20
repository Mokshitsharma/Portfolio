// Chapters of the home page and the camera stations each one walks through. Shared by the scroll handler, the
// chapter navigation and the scene, so the three never disagree.
//
// The scene is driven by one number, the station `s`. Integer values are the stations listed in Residence.ts;
// everything in between (camera travel, the door opening, frames lighting, the courtyard unfolding) is a pure
// function of `s`, so scrolling back reverses every transition.

export type ChapterId =
  | 'arrival'
  | 'entrance'
  | 'gallery'
  | 'corridor'
  | 'room-ml'
  | 'room-agents'
  | 'room-data'
  | 'room-software'
  | 'study'
  | 'courtyard';

// `from` and `to` are the stations a chapter walks between while it is read. The gallery walks past five frames.
export const chapters: { id: ChapterId; name: string; from: number; to: number; dim: number }[] = [
  { id: 'arrival', name: 'Arrival', from: 0, to: 0, dim: 0 },
  { id: 'entrance', name: 'Entrance', from: 0, to: 1, dim: 0 },
  { id: 'gallery', name: 'Skills gallery', from: 2, to: 6, dim: 0.15 },
  { id: 'corridor', name: 'Corridor', from: 7, to: 7, dim: 0.1 },
  { id: 'room-ml', name: 'Machine learning', from: 8, to: 8, dim: 0.4 },
  { id: 'room-agents', name: 'Agentic AI', from: 9, to: 9, dim: 0.4 },
  { id: 'room-data', name: 'Data and analytics', from: 10, to: 10, dim: 0.4 },
  { id: 'room-software', name: 'Software', from: 11, to: 11, dim: 0.4 },
  { id: 'study', name: 'Study', from: 12, to: 12, dim: 0.45 },
  { id: 'courtyard', name: 'Courtyard', from: 13, to: 13, dim: 0 },
];

export const STATIONS = 14;

export const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

const TRAVEL = 0.72; // a chapter is read until 72% of the way through, then the camera travels on

/** Station and reading dim for a chapter index and the reader's progress through it (0-1). */
export function stationAt(index: number, progress: number, reduced: boolean) {
  const c = chapters[index];
  const next = chapters[Math.min(index + 1, chapters.length - 1)];
  if (reduced) {
    // No travel: cut to the nearest station inside the chapter.
    return { s: Math.round(c.from + (c.to - c.from) * Math.min(1, progress / TRAVEL)), dim: c.dim };
  }
  if (progress < TRAVEL) {
    return { s: c.from + (c.to - c.from) * (progress / TRAVEL), dim: c.dim };
  }
  const t = smooth(TRAVEL, 1, progress);
  return { s: c.to + (next.from - c.to) * t, dim: c.dim + (next.dim - c.dim) * t };
}

/**
 * The gallery's station from where its framed panels sit on screen, so the camera stands at the frame the reader
 * is looking at. `centres` are the panels' vertical centres and `end` the bottom of the gallery, all relative to
 * the viewport's middle line (negative = above it).
 */
export function galleryStation(centres: number[], end: number, reduced: boolean) {
  const g = chapters[2];
  let s = g.from;
  for (let k = 0; k < centres.length; k++) {
    if (centres[k] > 0) break;
    const next = k + 1 < centres.length ? centres[k + 1] : end;
    const t = Math.min(1, -centres[k] / Math.max(1, next - centres[k]));
    // Hold at each frame while it is read, then walk on to the next.
    const step = reduced ? 0 : smooth(0.35, 0.85, t);
    s = g.from + k + step * (k + 1 < centres.length ? 1 : chapters[3].from - g.to);
  }
  return s;
}
