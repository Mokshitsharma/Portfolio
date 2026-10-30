import { useEffect, useRef, useState, type RefObject } from 'react';

// Scroll progress through a tall section, 0 at its top reaching the viewport top, 1 when its end leaves the bottom
// of a sticky stage. `onFrame` runs at most once per animation frame and should write styles directly to elements,
// so a scene of dozens of moving parts never re-renders React while scrolling.

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** Progress of `p` through the window [a, b], eased. */
export const seg = (p: number, a: number, b: number) => ease(clamp01((p - a) / (b - a)));
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export function useScrollScene(section: RefObject<HTMLElement | null>, onFrame: (p: number) => void, enabled = true) {
  const frame = useRef(onFrame);
  frame.current = onFrame;
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const el = section.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      frame.current(span > 0 ? clamp01(-r.top / span) : 0);
    };
    const request = () => { if (!raf) raf = requestAnimationFrame(tick); };
    request();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [section, enabled]);
}

/** True when the visitor asked for less motion; false during the prerender. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(q.matches);
    on();
    q.addEventListener('change', on);
    return () => q.removeEventListener('change', on);
  }, []);
  return reduced;
}

/** The size of an element, kept current. */
export function useSize(el: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    if (!el.current) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el.current);
    return () => ro.disconnect();
  }, [el]);
  return size;
}
