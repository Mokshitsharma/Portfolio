import { chapters } from '../../scene/layout';

// Chapter list on the right edge of wide screens. Every entry is a link, so the story can be skipped
// from the keyboard; the current chapter is marked for screen readers as well as visually.
export default function ChapterRail({ active }: { active: number }) {
  return (
    <nav aria-label="Chapters on this page" className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block xl:right-10">
      <ol className="space-y-1.5 text-right">
        {chapters.map((c, i) => {
          const on = i === active;
          return (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                aria-current={on ? 'location' : undefined}
                className={`fine group inline-flex items-center justify-end gap-3 py-1 no-underline transition-colors ${on ? 'text-paper' : 'text-haze hover:text-paper'}`}
              >
                {c.name}
                <span className={`inline-block h-[2px] transition-all duration-300 ${on ? 'w-8 bg-sodium' : 'w-3 bg-haze/50 group-hover:w-5'}`} aria-hidden />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
