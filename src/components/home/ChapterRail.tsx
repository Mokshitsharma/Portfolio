import { useEffect, useRef, useState } from 'react';
import { chapters } from '../../scene/chapters';

// Where you are in the house, and a way to go anywhere in it. Wide screens: a list on the right edge.
// Phones: a "Rooms" button that opens the same list. Every entry is a link, so the walk can be skipped from
// the keyboard; the current chapter is marked for screen readers as well as visually.
export default function ChapterRail({ active }: { active: number }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    sheet.current?.querySelector<HTMLElement>('a[aria-current]')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const list = (onPick?: () => void) => (
    <ol className="space-y-0.5">
      {chapters.map((c, i) => {
        const on = i === active;
        return (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              onClick={onPick}
              aria-current={on ? 'location' : undefined}
              className={`fine group flex items-center gap-3 py-1.5 no-underline transition-colors lg:justify-end lg:py-1 ${on ? 'text-charcoal' : 'text-slate hover:text-charcoal'}`}
            >
              <span className={`inline-block h-[2px] shrink-0 transition-all duration-300 lg:order-2 ${on ? 'w-8 bg-brass' : 'w-3 bg-slate/50 group-hover:w-5'}`} aria-hidden />
              {c.name}
            </a>
          </li>
        );
      })}
    </ol>
  );

  return (
    <>
      <nav aria-label="Rooms of the house" className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 px-3 py-2 text-right read-panel lg:block xl:right-8">
        {list()}
      </nav>
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end lg:hidden">
        <div ref={sheet} id="rooms-sheet" hidden={!open} className="mb-2 w-60 border border-seam bg-limestone/95 px-4 py-3 backdrop-blur-sm">
          <nav aria-label="Rooms of the house">{list(() => setOpen(false))}</nav>
        </div>
        <button
          ref={button}
          type="button"
          aria-expanded={open}
          aria-controls="rooms-sheet"
          onClick={() => setOpen((o) => !o)}
          className="btn btn-plate !min-h-11"
        >
          {open ? 'Close' : 'Rooms'}
          <span className="sr-only">: {chapters[active].name}</span>
        </button>
      </div>
    </>
  );
}
