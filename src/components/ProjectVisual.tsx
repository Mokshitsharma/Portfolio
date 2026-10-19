import type { ReactNode } from 'react';
import { miniFlows } from '../data/visuals';
import { BenchmarkChart, CalibrationChart, LedgerDiagram, MiniFlow } from './viz';

// One visual per case-study project, chosen in this order: a real screenshot, real evaluation or benchmark
// data, a diagram drawn from the code, or a typographic treatment. Each says which of these it is.

type Kind = 'Screenshot' | 'Evaluation data' | 'Benchmark data' | 'Diagram from the code' | 'Formula from the code';

function Frame({ kind, children, tone = 'dark', className = '' }: { kind: Kind; children: ReactNode; tone?: 'dark' | 'light'; className?: string }) {
  return (
    <figure className={`relative flex h-full flex-col ${tone === 'dark' ? 'bg-night-2 text-paper' : 'bg-surface text-ink'} ${className}`}>
      <div className="flex-1 p-5 md:p-6">{children}</div>
      <figcaption className={`label px-5 pb-4 md:px-6 ${tone === 'dark' ? 'text-mist' : 'text-graphite'}`}>{kind}</figcaption>
    </figure>
  );
}

function Shot({ src, alt, width, height, phone }: { src: string; alt: string; width: number; height: number; phone?: boolean }) {
  return (
    <figure className="relative flex h-full flex-col bg-night-2">
      <div className={`flex flex-1 items-end justify-center overflow-hidden ${phone ? 'px-8 pt-6' : 'p-4 pb-0 md:p-6 md:pb-0'}`}>
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className={`lift block h-auto ${phone ? 'max-h-80 w-auto rounded-t-[1.25rem] border-[6px] border-b-0 border-night' : 'w-full border border-night'}`}
        />
      </div>
      <figcaption className="label px-5 py-4 text-mist md:px-6">Screenshot</figcaption>
    </figure>
  );
}

// Hyperlocal Marketplace: the order state machine and its failure exits.
function OrderStates() {
  const states = ['Placed', 'Store confirmed', 'Rider dispatched', 'Picked up', 'On the way', 'Delivered'];
  const exits: Record<string, string> = { Placed: 'auto-cancel after 2 min', 'Rider dispatched': 'retry after 180 s, escalate after 3' };
  return (
    <ol className="space-y-0">
      {states.map((s, i) => (
        <li key={s} className="relative grid grid-cols-[1.25rem_1fr] gap-3 pb-3 last:pb-0">
          {i < states.length - 1 && <span className="absolute left-[0.5rem] top-4 bottom-0 w-[3px] bg-route" aria-hidden />}
          <span className={`relative z-10 mt-1 inline-block h-4 w-4 border-[3px] border-route ${i === states.length - 1 ? 'bg-route' : 'rounded-full bg-night-2'}`} aria-hidden />
          <span className="ui text-paper">
            {s}
            {exits[s] && <span className="fine ml-2 border-l border-held-light/60 pl-2 text-held-light">{exits[s]}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}

// Sensei AI: the scoring rule in the decision engine.
function VoteRule() {
  const voters = ['Random forest', 'LSTM', 'Temporal CNN', 'PPO agent', 'Market regime (HMM)', 'News sentiment'];
  return (
    <div className="font-sans">
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {voters.map((v) => (
          <li key={v} className="fine flex items-center justify-between gap-2 border-b border-rule pb-1 text-ink">
            {v}<span className="font-semibold text-graphite">+1 / -1</span>
          </li>
        ))}
      </ul>
      <div className="mt-5" aria-hidden>
        <div className="grid grid-cols-[1fr_1.4fr_1fr] text-center">
          <span className="fine bg-held/15 py-1 font-semibold text-held">Sell, -2 or less</span>
          <span className="fine bg-rule/60 py-1 text-graphite">Hold</span>
          <span className="fine bg-field/15 py-1 font-semibold text-clear">Buy, +2 or more</span>
        </div>
      </div>
      <p className="fine mt-2 text-graphite">Confidence is the size of the score out of 5.</p>
    </div>
  );
}

// FieldOps: the attendance path from phone to points.
function FieldPath() {
  return (
    <MiniFlow
      vertical
      stages={[
        { label: 'GPS fix on the phone', kind: 'io' },
        { label: 'Batched locally', kind: 'rule' },
        { label: 'Retried until uploaded', kind: 'rule' },
        { label: 'Attendance record', kind: 'io' },
        { label: 'Points from weights in the database', kind: 'rule' },
      ]}
    />
  );
}

// Dairy Collection Manager: the arithmetic the database performs.
function DairyFormula() {
  return (
    <div className="font-sans text-ink">
      <p className="headline text-[clamp(1.2rem,1.9vw,1.5rem)] leading-tight">
        amount = (litres + ml / 1000) <span className="text-graphite">×</span> rate(fat %)
      </p>
      <p className="ui mt-3 text-graphite">Rate interpolated between chart rows, rounded to paise.</p>
      <ol className="ui mt-5 space-y-1.5 border-l-[3px] border-ink pl-4">
        <li>Deduct instalments, oldest advance first</li>
        <li>Record the net payout</li>
        <li>Lock the settled entries</li>
      </ol>
      <p className="fine mt-3 text-graphite">All in one transaction.</p>
    </div>
  );
}

export default function ProjectVisual({ slug, variant = 'card' }: { slug: string; variant?: 'card' | 'hero' }) {
  switch (slug) {
    case 'movigo':
      return variant === 'hero' ? (
        <Shot src="/images/movigo-retailer-coins.jpg" alt="Movigo retailer app coins wallet screen showing available coins, a weekly milestone and how coins are redeemed." width={540} height={1005} phone />
      ) : (
        <Shot src="/images/movigo-retailer-vehicles.jpg" alt="Movigo retailer app home screen with a search bar, the coins wallet banner and six vehicle types to book." width={540} height={705} phone />
      );
    case 'settleai':
      return <Shot src="/images/settleai-held-duplicate.jpg" alt="SettleAI job page with a milestone held because the proof photo was reused." width={1280} height={1080} />;
    case 'ai-business-analytics':
      return <Shot src="/images/ai-business-analytics-upload.jpg" alt="AI Business Analytics upload screen listing what the report includes." width={1920} height={640} />;
    case 'cricxai':
      return <Frame kind="Evaluation data" tone="light"><CalibrationChart /></Frame>;
    case 'routecore':
      return <Frame kind="Benchmark data" tone="light"><BenchmarkChart /></Frame>;
    case 'refera':
      return <Frame kind="Diagram from the code" tone="light"><LedgerDiagram /></Frame>;
    case 'hyperlocal-marketplace':
      return <Frame kind="Diagram from the code"><OrderStates /></Frame>;
    case 'sensei-ai':
      return <Frame kind="Formula from the code" tone="light"><VoteRule /></Frame>;
    case 'fieldops-ai':
      return <Frame kind="Diagram from the code"><FieldPath /></Frame>;
    case 'dairy-collection-manager':
      return <Frame kind="Formula from the code" tone="light"><DairyFormula /></Frame>;
    case 'toolforge':
    case 'naman':
    case 'voicedesk':
    case 'dociq':
      return <Frame kind="Diagram from the code"><MiniFlow stages={miniFlows[slug]} /></Frame>;
    default:
      return null;
  }
}
