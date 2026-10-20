import { useEffect, useRef, useState } from 'react';
import { chapters, shapeAt, smooth } from '../../scene/chapters';
import type { Engine } from '../../scene/Engine';
import EnginePoster from './EnginePoster';

// Fixed backdrop for the home page. Prerendered as a still poster; the WebGL engine loads as its own chunk after
// first paint and replaces it. One scroll handler drives the engine's shape, the reading dim, the hero type and
// the phone progress bar, writing to the DOM directly so React does not re-render while scrolling.

function webgl2() {
  try {
    return Boolean(document.createElement('canvas').getContext('webgl2'));
  } catch {
    return false;
  }
}

export default function EngineBackdrop({ onChapter }: { onChapter: (index: number) => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const dim = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const report = useRef(onChapter);
  report.current = onChapter;

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const light = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
    const sections = chapters.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    const hero = document.getElementById('opening');
    let engine: Engine | null = null;
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
      // The closing chapter is short, so at the bottom of the page it is the current one.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        index = sections.length - 1;
        progress = 0;
      }
      if (index !== current) {
        current = index;
        report.current(index);
      }
      const { shape, dim: d } = shapeAt(index, progress, reduced);
      engine?.setShape(shape);
      if (dim.current) dim.current.style.opacity = String(d);
      if (bar.current) bar.current.style.transform = `scaleX(${(index + progress) / sections.length})`;
      // The opening is already half past the middle line at the top of the page, so its type starts moving at 0.55.
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

    // Load the engine once the browser is idle, so it never competes with the first paint.
    let idle = 0;
    if (canvas.current && webgl2()) {
      const load = () =>
        import('../../scene/Engine')
          .then(({ Engine }) => {
            if (cancelled || !canvas.current) return;
            const e = new Engine(canvas.current, {
              reducedMotion: reduced,
              light,
              onFail: () => {
                setLive(false);
                e.dispose();
                engine = null;
              },
            });
            engine = e;
            update();
            if (!reduced) e.play();
            setLive(true);
          })
          .catch(() => setLive(false));
      const w = window as Window;
      idle = typeof w.requestIdleCallback === 'function' ? w.requestIdleCallback(load, { timeout: 1500 }) : w.setTimeout(load, 300);
    }

    return () => {
      cancelled = true;
      window.cancelIdleCallback?.(idle);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      engine?.dispose();
    };
  }, []);

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-void">
        <EnginePoster
          className={`absolute inset-x-0 top-[4%] h-[58%] w-full transition-opacity duration-700 lg:inset-y-0 lg:left-auto lg:right-[-4%] lg:top-0 lg:h-full lg:w-[72%] ${live ? 'opacity-0' : 'opacity-100'}`}
        />
        <canvas ref={canvas} className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${live ? 'opacity-100' : 'opacity-0'}`} />
        <div ref={dim} className="absolute inset-0 bg-void" style={{ opacity: 0 }} />
        <div className="engine-scrim absolute inset-0" />
      </div>
      <div aria-hidden className="fixed inset-x-0 top-16 z-40 h-[2px] bg-seam lg:hidden">
        <div ref={bar} className="h-full origin-left bg-ion" style={{ transform: 'scaleX(0)' }} />
      </div>
    </>
  );
}
