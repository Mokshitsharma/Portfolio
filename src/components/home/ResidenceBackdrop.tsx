import { useEffect, useRef, useState } from 'react';
import { chapters, galleryStation, smooth, stationAt } from '../../scene/chapters';
import type { Residence } from '../../scene/Residence';
import type { CertContent, FrameContent, Invitation, RoomContent } from '../../scene/textures';

export interface SceneContent {
  frames: FrameContent[];
  rooms: RoomContent[];
  credentials: CertContent[];
  invitation: Invitation;
}
import ResidencePoster from './ResidencePoster';

// Fixed backdrop for the home page. Prerendered as a still elevation; the WebGL residence loads as its own chunk
// after first paint and replaces it. One scroll handler turns the reader's position into a camera station, a
// reading dim and the phone progress bar, writing to the DOM directly so React does not re-render on scroll.

function webgl2() {
  try {
    return Boolean(document.createElement('canvas').getContext('webgl2'));
  } catch {
    return false;
  }
}

export default function ResidenceBackdrop({ onChapter, name, line, content }: { onChapter: (index: number) => void; name: string; line: string; content: SceneContent }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const dim = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const report = useRef(onChapter);
  report.current = onChapter;

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const narrow = window.matchMedia('(max-width: 1023px)');
    const light = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
    const sections = chapters.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    const hero = document.getElementById('arrival');
    const gallery = document.getElementById('gallery');
    const panels = gallery ? Array.from(gallery.querySelectorAll<HTMLElement>('[data-frame]')) : [];
    let scene: Residence | null = null;
    let cancelled = false;
    let current = -1;
    let queued = false;

    const update = () => {
      queued = false;
      const mid = window.innerHeight * 0.5;
      let index = 0;
      let progress = 0;
      let opened = 0;
      sections.forEach((el, k) => {
        const r = el.getBoundingClientRect();
        if (r.top <= mid) {
          index = k;
          progress = Math.min(1, Math.max(0, (mid - r.top) / r.height));
          // A chapter's opening (its title and first lines) fills about one screen; after that its content runs
          // across the scene.
          opened = smooth(0.45, 1.05, (mid - r.top) / window.innerHeight);
        }
      });
      // The courtyard is the last chapter, so at the bottom of the page it is the current one.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        index = sections.length - 1;
        progress = 0;
      }
      if (index !== current) {
        current = index;
        report.current(index);
      }
      const { s: base, dim: d } = stationAt(index, progress, reduced, opened);
      let s = base;
      if (chapters[index].id === 'gallery' && panels.length && gallery) {
        const centres = panels.map((f) => {
          const r = f.getBoundingClientRect();
          return r.top + r.height / 2 - mid;
        });
        s = galleryStation(centres, gallery.getBoundingClientRect().bottom - mid, reduced);
      }
      scene?.setStation(s);
      // Phones have no side column: text runs over the middle of the house, so the veil stays up while a chapter's
      // text is on screen. The arrival and the courtyard keep their text over the ground, under the scrim.
      // In a room the veil waits until the room's text comes in, so each room is seen clearly first.
      const id = chapters[index].id;
      const floor = id.startsWith('room-') ? 0.5 * smooth(0.05, 0.35, opened) : 0.5;
      const veil = narrow.matches && id !== 'arrival' && id !== 'courtyard' ? Math.max(d, floor) : d;
      if (dim.current) dim.current.style.opacity = String(veil);
      if (bar.current) bar.current.style.transform = `scaleX(${(index + progress) / sections.length})`;
      // The arrival is already half past the middle line at the top of the page, so its type moves from 0.55.
      if (hero && !reduced) hero.style.setProperty('--hero-p', index === 0 ? smooth(0.55, 1, progress).toFixed(3) : '1');
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    // Load the residence once the browser is idle, so it never competes with the first paint. Phones and touch
    // screens wait for the visitor to start moving (a scroll, touch or key) before building the house at all: the
    // still elevation is already on screen, and a phone that is only glanced at never pays for the 3D.
    let idle = 0;
    const intent = ['scroll', 'touchstart', 'pointerdown', 'keydown'] as const;
    let onIntent: (() => void) | null = null;
    if (canvas.current && webgl2()) {
      const load = () =>
        Promise.all([import('../../scene/Residence'), document.fonts?.ready])
          .then(([{ Residence }]) => {
            if (cancelled || !canvas.current) return;
            const r = new Residence(canvas.current, {
              reducedMotion: reduced,
              light,
              name,
              line,
              ...content,
              onFail: () => {
                setLive(false);
                r.dispose();
                scene = null;
              },
            });
            scene = r;
            return r.ready.then(() => {
              if (cancelled) return;
              update();
              // Phones draw a frame only when the scroll position changes; there is nothing else to animate there.
              if (!reduced && !light) r.play();
              setLive(true);
            });
          })
          .catch(() => setLive(false));
      const w = window as Window;
      const schedule = () => {
        idle = typeof w.requestIdleCallback === 'function' ? w.requestIdleCallback(load, { timeout: 1500 }) : w.setTimeout(load, 300);
      };
      if (light) {
        onIntent = () => {
          intent.forEach((e) => window.removeEventListener(e, onIntent!));
          onIntent = null;
          schedule();
        };
        intent.forEach((e) => window.addEventListener(e, onIntent!, { passive: true, once: true }));
      } else schedule();
    }

    return () => {
      cancelled = true;
      window.cancelIdleCallback?.(idle);
      if (onIntent) intent.forEach((e) => window.removeEventListener(e, onIntent!));
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      scene?.dispose();
    };
  }, [name, line, content]);

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-ivory">
        <ResidencePoster className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${live ? 'opacity-0' : 'opacity-100'}`} />
        <canvas ref={canvas} className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${live ? 'opacity-100' : 'opacity-0'}`} />
        <div ref={dim} className="absolute inset-0 bg-ivory" style={{ opacity: 0 }} />
        <div className="residence-scrim absolute inset-0" />
      </div>
      <div aria-hidden className="fixed inset-x-0 top-16 z-40 h-[2px] bg-seam lg:hidden">
        <div ref={bar} className="h-full origin-left bg-brass" style={{ transform: 'scaleX(0)' }} />
      </div>
    </>
  );
}
