// A tiny message bus between the assistant and the page: the assistant asks a diagram to play or focus, the
// diagram reports what the visitor selected so the assistant can answer about it.

export type DiagramCommand = { slug: string; walkthrough?: string; node?: string };
export type PageContext = { slug?: string; node?: string; walkthrough?: string };

const target = typeof window === 'undefined' ? null : new EventTarget();

export function showDiagram(cmd: DiagramCommand) {
  target?.dispatchEvent(new CustomEvent('diagram', { detail: cmd }));
}

export function onDiagram(fn: (cmd: DiagramCommand) => void) {
  const h = (e: Event) => fn((e as CustomEvent<DiagramCommand>).detail);
  target?.addEventListener('diagram', h);
  return () => target?.removeEventListener('diagram', h);
}

// What the visitor is looking at, read by the assistant when it sends a question.
let context: PageContext = {};
export const setContext = (c: PageContext) => { context = c; };
export const getContext = () => context;

// Commands waiting for a diagram that is not on screen yet (the assistant navigated to its page).
let pending: DiagramCommand | null = null;
export const queueDiagram = (cmd: DiagramCommand) => { pending = cmd; };
export const takeQueued = (slug: string) => {
  if (pending?.slug !== slug) return null;
  const c = pending;
  pending = null;
  return c;
};

export function openAssistant(question?: string) {
  target?.dispatchEvent(new CustomEvent('assistant', { detail: question ?? '' }));
}
export function onOpenAssistant(fn: (q: string) => void) {
  const h = (e: Event) => fn((e as CustomEvent<string>).detail);
  target?.addEventListener('assistant', h);
  return () => target?.removeEventListener('assistant', h);
}

// Fig. 2 fetches a project: the map opens its area and points at it.
export function fetchProject(slug: string) {
  target?.dispatchEvent(new CustomEvent('fetch', { detail: slug }));
}
export function onFetchProject(fn: (slug: string) => void) {
  const h = (e: Event) => fn((e as CustomEvent<string>).detail);
  target?.addEventListener('fetch', h);
  return () => target?.removeEventListener('fetch', h);
}

// The opening story's map asks the project map below to open an area.
export function openArea(area: string) {
  target?.dispatchEvent(new CustomEvent('area', { detail: area }));
}
export function onOpenArea(fn: (area: string) => void) {
  const h = (e: Event) => fn((e as CustomEvent<string>).detail);
  target?.addEventListener('area', h);
  return () => target?.removeEventListener('area', h);
}
