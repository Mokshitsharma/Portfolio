import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { architectureFor, type Architecture } from '../../data/architecture';
import { categories, projectBySlug } from '../../data/projects';
import type { Category } from '../../data/types';
import { areaHex } from '../../data/visuals';
import { kindName } from '../ArchitectureExplorer';

// Six systems, one per area, each explained step by step. The text scrolls; beside it a pinned flow of the
// system's components lights the one the current step is about. Steps and components come from the project's
// architecture sheet (src/data/architecture.ts, sheets.ts), the same data as its case study.

const SELECTED: { slug: string; area: Category; result: string }[] = [
  { slug: 'settleai', area: 'agents', result: '28 of 28 evaluation scenarios passed; 49 of 49 tampered receipts caught.' },
  { slug: 'dociq', area: 'llm', result: 'hit@5 98.3% and citation accuracy 92.2% on held-out questions.' },
  { slug: 'cricxai', area: 'ml', result: 'Trained on 1,362,629 deliveries from 2,569 ODIs; dismissal ROC-AUC 0.749.' },
  { slug: 'voicedesk', area: 'voice', result: '55.6% of 160 labelled turns answered on fast paths, with no model call.' },
  { slug: 'job-market-tracker', area: 'data', result: 'First snapshot: 10,876 postings from 52 companies, 522 of them data roles.' },
  { slug: 'movigo', area: 'systems', result: 'Cancellations 40% to 12% while daily bookings grew from about 140 to 400 (reported).' },
];

// Components in the order a walkthrough first reaches them.
function flowOf(a: Architecture) {
  const steps = a.walkthroughs[0].steps;
  const order: string[] = [];
  for (const s of steps) if (!order.includes(s.node)) order.push(s.node);
  return { steps, nodes: order.map((id) => a.nodes.find((n) => n.id === id)!) };
}

function MiniFlow({ arch, active, visited, tint }: { arch: Architecture; active: string; visited: Set<string>; tint: string }) {
  const { nodes } = flowOf(arch);
  return (
    <ol className="mini-flow" style={{ ['--tint' as string]: tint }} aria-label={`${arch.title}: components`}>
      {nodes.map((n) => (
        <li key={n.id} className={`mini-node k-${n.kind}`} data-state={n.id === active ? 'now' : visited.has(n.id) ? 'seen' : undefined}>
          <span className="mini-mark" aria-hidden />
          <span className="min-w-0">
            <span className="block font-sans text-[0.9375rem] font-semibold leading-tight">{n.label}</span>
            <span className="block font-sans text-[0.75rem] text-ivory/60">{n.sub ?? kindName[n.kind]}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

function Project({ slug, area, result }: { slug: string; area: Category; result: string }) {
  const p = projectBySlug(slug)!;
  const arch = architectureFor(slug)!;
  const { steps } = flowOf(arch);
  const [step, setStep] = useState(0);
  const blocks = useRef<(HTMLLIElement | null)[]>([]);
  const tint = areaHex[area];

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setStep(Number((e.target as HTMLElement).dataset.i));
    }, { rootMargin: '-45% 0px -45% 0px' });
    blocks.current.forEach((b) => b && io.observe(b));
    return () => io.disconnect();
  }, []);

  const visited = new Set(steps.slice(0, step + 1).map((s) => s.node));
  const active = steps[step].node;

  return (
    <article aria-labelledby={`sel-${slug}`} className="sel-project" style={{ ['--tint' as string]: tint }}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
        <div>
          <header className="sel-head">
            <p className="label sel-tint">{categories.find((c) => c.id === area)!.title}</p>
            <h3 id={`sel-${slug}`} className="display mt-3 text-[clamp(2.4rem,5vw,4.2rem)] text-ivory">{p.name}</h3>
            <p className="mt-4 max-w-[34rem] text-[1.125rem] leading-[1.6] text-ivory/80">{p.summary}</p>
            <p className="sel-result mt-6">{result}</p>
            <Link to={`/projects/${slug}`} className="btn mt-7 bg-ivory text-charcoal hover:bg-brass-fill">Open the case study</Link>
          </header>
          <ol className="mt-10" aria-label={arch.walkthroughs[0].title}>
            <li className="label mb-2 text-ivory/60">Follow {arch.walkthroughs[0].title}</li>
            {steps.map((s, i) => {
              const node = arch.nodes.find((n) => n.id === s.node)!;
              return (
                <li key={i} ref={(el) => { blocks.current[i] = el; }} data-i={i} className="sel-step" data-on={i === step || undefined}>
                  <span className="sel-step-node sel-tint">{node.label}</span>
                  <p className="mt-1 text-[1.0625rem] leading-[1.55] text-ivory/90">{s.say}</p>
                </li>
              );
            })}
          </ol>
        </div>
        <div className="max-lg:hidden">
          <div className="sticky top-24">
            <MiniFlow arch={arch} active={active} visited={visited} tint={tint} />
            <p className="fine mt-4 text-ivory/55">Step {step + 1} of {steps.length}. Components from the project’s architecture sheet.</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function SelectedWork() {
  return (
    <section id="work" aria-labelledby="work-title" className="bg-charcoal py-24 text-ivory md:py-32">
      <div className="shell">
        <p className="label text-ivory/60">Selected work</p>
        <h2 id="work-title" className="display mt-3 max-w-[18ch] text-[clamp(2.4rem,5.4vw,4.6rem)]">Six systems, explained as they run</h2>
        <p className="mt-5 max-w-[38rem] text-[1.125rem] leading-[1.6] text-ivory/75">
          One from each area. Scroll through a real request and watch which part of the system handles each step.
        </p>
        <div className="mt-20 space-y-36">
          {SELECTED.map((s) => <Project key={s.slug} {...s} />)}
        </div>
      </div>
    </section>
  );
}
