import { useEffect, useRef, useState } from 'react';
import { chapters, states } from '../../scene/layout';
import type { CityScene } from '../../scene/CityScene';
import CityPoster from './CityPoster';

// Fixed backdrop for the home page. Prerendered as a still poster; the WebGL city loads as its own chunk after
// first paint and replaces it. One scroll handler drives the scene, the reading dim, the hero name and the
// phone progress bar, writing to the DOM directly so React does not re-render while scrolling.

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

function webgl2() {
  try {
    return Boolean(document.createElement('canvas').getContext('webgl2'));
  } catch {
    return false;
  }
}

export default function CityBackdrop({ onChapter }: { onChapter: (index: number) => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const dim = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const report = useRef(onChapter);
  report.current = onChapter;

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sections = chapters.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    const hero = document.getElementById('opening');
    let scene: CityScene | null = null;
    let cancelled = false;
    let current = -1;
    let queued = false;

    const update = () => {
      queued = false;
      const mid = window.innerHeight * 0.5;
      let index = 0;
      let progress = 0;
      sections.forEach((s, k) => {
        const r = s.getBoundingClientRect();
        if (r.top <= mid) {
          index = k;
          progress = Math.min(1, Math.max(0, (mid - r.top) / r.height));
        }
      });
      // The last chapter is shorter than the viewport, so at the bottom of the page it is the current one.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        index = sections.length - 1;
        progress = 0;
      }
      if (index !== current) {
        current = index;
        report.current(index);
      }
      scene?.setProgress(index, progress);

      const from = states[chapters[index].id];
      const to = states[chapters[Math.min(index + 1, chapters.length - 1)].id];
      const t = reduced ? 0 : smooth(0.7, 1, progress);
      if (dim.current) dim.current.style.opacity = String((from.dim + (to.dim - from.dim) * t) * 0.85);
      if (bar.current) bar.current.style.transform = `scaleX(${(index + progress) / sections.length})`;
      if (hero && !reduced) hero.style.setProperty('--hero-p', index === 0 ? smooth(0.5, 1, progress).toFixed(3) : '1');
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

    // Load the scene once the browser is idle, so it never competes with the first paint.
    let idle = 0;
    if (canvas.current && webgl2()) {
      const load = () =>
        import('../../scene/CityScene')
          .then(({ CityScene }) => {
            if (cancelled || !canvas.current) return;
            const s = new CityScene(canvas.current, {
              reducedMotion: reduced,
              onFail: () => {
                setLive(false);
                s.dispose();
                scene = null;
              },
            });
            scene = s;
            update();
            if (!reduced) s.play();
            setLive(true);
          })
          .catch(() => setLive(false));
      // Safari has no requestIdleCallback.
      const w = window as Window;
      idle = typeof w.requestIdleCallback === 'function' ? w.requestIdleCallback(load, { timeout: 2000 }) : w.setTimeout(load, 300);
    }

    return () => {
      cancelled = true;
      window.cancelIdleCallback?.(idle);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      scene?.dispose();
    };
  }, []);

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-night">
        <CityPoster
          className={`absolute inset-x-0 top-0 h-[68%] w-full transition-opacity duration-700 lg:inset-y-0 lg:left-auto lg:right-0 lg:h-full lg:w-[78%] ${live ? 'opacity-0' : 'opacity-100'}`}
        />
        <canvas ref={canvas} className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${live ? 'opacity-100' : 'opacity-0'}`} />
        <div ref={dim} className="absolute inset-0 bg-night" style={{ opacity: 0 }} />
        <div className="scrim-read absolute inset-0" />
      </div>
      <div aria-hidden className="fixed inset-x-0 top-16 z-40 h-[2px] bg-kerb/60 lg:hidden">
        <div ref={bar} className="h-full origin-left bg-sodium" style={{ transform: 'scaleX(0)' }} />
      </div>
    </>
  );
}
