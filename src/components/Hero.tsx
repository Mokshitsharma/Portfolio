import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Mail } from 'lucide-react';
import { profile } from '../data/portfolio';

type Kind = 'propose' | 'pass' | 'deny' | 'info';

interface Step {
  kind: Kind;
  label: string;
  text: string;
}

interface Run {
  id: string;
  project: string;
  command: string;
  steps: Step[];
}

// Replays of real behaviour from the projects below, shortened to fit.
const runs: Run[] = [
  {
    id: 'settleai',
    project: 'SettleAI',
    command: 'procurebot hire "deliver 3 boxes to the Vijay Nagar warehouse"',
    steps: [
      { kind: 'propose', label: 'scope', text: '2 milestones drafted, $120 total' },
      { kind: 'pass', label: 'guard G1', text: 'inside the payer’s mandate cap' },
      { kind: 'pass', label: 'escrow', text: 'PayPal capture confirmed by webhook' },
      { kind: 'pass', label: 'proof', text: 'photo GPS matches the drop-off point' },
      { kind: 'deny', label: 'proof', text: 'photo was already used on another job' },
      { kind: 'deny', label: 'payout', text: 'held for review, no money moved' },
    ],
  },
  {
    id: 'toolforge',
    project: 'ToolForge',
    command: 'toolforge build pokeapi.yaml',
    steps: [
      { kind: 'info', label: 'read_spec', text: '102 endpoints parsed' },
      { kind: 'propose', label: 'design', text: '8 tools proposed' },
      { kind: 'pass', label: 'check_plan', text: 'every param maps to the spec' },
      { kind: 'pass', label: 'review', text: 'plan approved by a human' },
      { kind: 'pass', label: 'test', text: '8 of 8 live API calls passed' },
      { kind: 'pass', label: 'audit', text: 'security score 100/100' },
    ],
  },
  {
    id: 'naman',
    project: 'Naman',
    command: '“Jarvis, close Chrome, mute and lock the laptop”',
    steps: [
      { kind: 'propose', label: 'plan', text: '3 steps' },
      { kind: 'pass', label: 'close_app', text: 'Chrome closed' },
      { kind: 'pass', label: 'volume', text: 'muted' },
      { kind: 'propose', label: 'approve', text: 'Lock the laptop? yes or no' },
      { kind: 'pass', label: 'user', text: 'yes' },
      { kind: 'pass', label: 'lock', text: 'laptop locked' },
    ],
  },
];

const kindStyle: Record<Kind, string> = {
  propose: 'text-propose',
  pass: 'text-pass',
  deny: 'text-deny',
  info: 'text-muted',
};

const kindMark: Record<Kind, string> = {
  propose: '?',
  pass: '✓',
  deny: '✕',
  info: '·',
};

const STEP_MS = 650;
const HOLD_MS = 3200;

function AgentTrace() {
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [runIndex, setRunIndex] = useState(0);
  const [shown, setShown] = useState(reduced ? runs[0].steps.length : 0);
  const [pinned, setPinned] = useState(reduced);
  const run = runs[runIndex];

  useEffect(() => {
    if (shown < run.steps.length) {
      const t = setTimeout(() => setShown((n) => n + 1), STEP_MS);
      return () => clearTimeout(t);
    }
    if (pinned) return;
    const t = setTimeout(() => {
      setRunIndex((i) => (i + 1) % runs.length);
      setShown(0);
    }, HOLD_MS);
    return () => clearTimeout(t);
  }, [shown, run.steps.length, pinned]);

  const choose = (i: number) => {
    setPinned(true);
    setRunIndex(i);
    setShown(reduced ? runs[i].steps.length : 0);
  };

  return (
    <figure className="rounded-2xl border border-line bg-plum-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
      <div className="flex items-center gap-1 border-b border-line px-3 pt-3" role="tablist" aria-label="Agent runs">
        {runs.map((r, i) => (
          <button
            key={r.id}
            role="tab"
            aria-selected={i === runIndex}
            onClick={() => choose(i)}
            className={`rounded-t-lg px-3 py-2 text-sm transition-colors ${
              i === runIndex ? 'bg-plum-3 text-paper' : 'text-muted hover:text-paper'
            }`}
          >
            {r.project}
          </button>
        ))}
      </div>

      <div className="font-mono text-[13px] leading-relaxed p-4 sm:p-5 min-h-[23rem] sm:min-h-[17.5rem]" aria-live="polite">
        <p className="text-paper break-words">
          <span className="text-muted select-none">$ </span>
          {run.command}
        </p>
        <ol className="mt-3 space-y-1.5">
          {run.steps.slice(0, shown).map((s, i) => (
            <li key={`${run.id}-${i}`} className="trace-line grid grid-cols-[1.25rem_6.5rem_1fr] gap-x-2">
              <span className={kindStyle[s.kind]} aria-hidden>
                {kindMark[s.kind]}
              </span>
              <span className={kindStyle[s.kind]}>{s.label}</span>
              <span className="text-paper/90">{s.text}</span>
            </li>
          ))}
        </ol>
        {shown < run.steps.length && <span className="trace-caret mt-1.5 inline-block h-4 w-2 bg-paper/70" aria-hidden />}
      </div>

      <figcaption className="flex flex-wrap gap-x-5 gap-y-1 border-t border-line px-4 sm:px-5 py-3 text-xs text-muted">
        <span><span className="text-propose">?</span> agent proposes</span>
        <span><span className="text-pass">✓</span> check passed</span>
        <span><span className="text-deny">✕</span> blocked by code</span>
      </figcaption>
    </figure>
  );
}

export default function Hero() {
  return (
    <section id="home" className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="inline-flex items-center gap-2.5 rounded-full border border-pass/40 bg-pass/10 px-3.5 py-1.5 text-sm text-pass">
            <span className="status-dot h-2 w-2 rounded-full bg-pass" aria-hidden />
            {profile.availability}
          </p>

          <h1 className="mt-7 text-[clamp(3rem,9vw,6.5rem)] font-extrabold">
            Mokshit
            <br />
            Sharma
          </h1>

          <p className="mt-5 font-display text-2xl md:text-3xl font-semibold text-propose">{profile.role}</p>

          <p className="mt-5 max-w-xl text-lg text-muted">{profile.pitch}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`mailto:${profile.email}`} className="btn-primary">
              <Mail size={18} aria-hidden /> Email me
            </a>
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <Download size={18} aria-hidden /> Résumé
            </a>
            <Link to="/#work" className="btn-ghost">
              See the work
            </Link>
          </div>
        </div>

        <AgentTrace />
      </div>
    </section>
  );
}
