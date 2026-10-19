import type { MapGroup, Stage } from '../data/types';
import { lineHex, type Line } from '../data/visuals';
import { KindLegend } from './viz';

// Case-study diagrams drawn from each project's code. Built from HTML lists so they read correctly without
// the visuals and reflow on small screens.

const kindName: Record<NonNullable<Stage['kind']>, string> = {
  model: 'model proposes',
  rule: 'code decides',
  human: 'person decides',
  io: 'input or output',
};

const marker: Record<NonNullable<Stage['kind']>, string> = {
  model: 'rounded-full border-signal-light bg-night',
  rule: 'border-route bg-route',
  human: 'rounded-full border-route bg-route',
  io: 'border-paper bg-paper',
};

// A pipeline: horizontal on wide screens (stations along a line), vertical on narrow ones.
export function Flow({ title, caption, stages, line = 'signal' }: { title: string; caption: string; stages: Stage[]; line?: Line }) {
  return (
    <figure className="plate grid-texture -mx-5 px-5 py-10 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h3 className="headline text-2xl text-paper md:text-3xl">{title}</h3>
        <KindLegend />
      </div>
      <ol className="relative mt-10 grid gap-0 lg:grid-flow-col lg:auto-cols-fr">
        {stages.map((s, i) => (
          <li key={i} className="relative grid grid-cols-[2rem_1fr] gap-3 pb-6 lg:block lg:pb-0 lg:pr-4">
            {/* connector */}
            {i < stages.length - 1 && (
              <>
                <span className="absolute left-[0.9rem] top-5 bottom-0 w-[4px] lg:hidden" style={{ background: lineHex[line] }} aria-hidden />
                <span className="absolute left-5 right-0 top-[0.7rem] hidden h-[4px] lg:block" style={{ background: lineHex[line] }} aria-hidden />
              </>
            )}
            <span className={`relative z-10 mt-0.5 inline-block h-[1.4rem] w-[1.4rem] border-[3px] ${marker[s.kind ?? 'io']}`} aria-hidden />
            <div className="lg:mt-4">
              <p className="font-sans text-[1.0625rem] font-semibold leading-snug text-paper">
                {s.label}
                {s.kind && <span className="sr-only"> ({kindName[s.kind]})</span>}
              </p>
              {s.note && <p className="fine mt-1 text-mist">{s.note}</p>}
            </div>
          </li>
        ))}
      </ol>
      <figcaption className="fine mt-8 text-mist">{caption}</figcaption>
    </figure>
  );
}

export function SystemMap({ title, caption, groups, line = 'route' }: { title: string; caption: string; groups: MapGroup[]; line?: Line }) {
  return (
    <figure className="plate grid-texture -mx-5 px-5 py-10 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-10">
      <h3 className="headline text-2xl text-paper md:text-3xl">{title}</h3>
      <div className="mt-8 grid gap-6 md:grid-cols-3 md:gap-0">
        {groups.map((g, i) => (
          <section key={g.title} className="relative md:pr-10">
            <h4 className="label flex items-center gap-3 text-paper">
              <span className="inline-block h-3 w-3" style={{ background: lineHex[line] }} aria-hidden />
              {g.title}
            </h4>
            <ul className="mt-4 space-y-3 border-l-[3px] pl-4" style={{ borderColor: lineHex[line] }}>
              {g.items.map((item) => (
                <li key={item.name} className="ui">
                  <span className="font-semibold text-paper">{item.name}</span>
                  {item.note && <span className="block text-mist">{item.note}</span>}
                </li>
              ))}
            </ul>
            {i < groups.length - 1 && (
              <span className="absolute right-2 top-0 hidden text-2xl leading-none md:block" style={{ color: lineHex[line] }} aria-hidden>
                &#x2192;
              </span>
            )}
          </section>
        ))}
      </div>
      <figcaption className="fine mt-8 text-mist">{caption}</figcaption>
    </figure>
  );
}
