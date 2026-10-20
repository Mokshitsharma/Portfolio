import type { Category } from './types';

// Data behind the site's diagrams and charts. Every station, bar and bin below comes from a project's code,
// README benchmark table or evaluation artefact (see the career-research evidence registry).

export type Line = 'route' | 'signal' | 'field' | 'ink';

// Which line colour a project carries.
export const lineFor: Record<Category, Line> = {
  production: 'route',
  agents: 'signal',
  ml: 'field',
  fullstack: 'ink',
  tools: 'ink',
  data: 'field',
  learning: 'ink',
};

// The colour of each area's room in the residence.
export const lineHex: Record<Line, string> = {
  route: '#cf915d',
  signal: '#e2b877',
  field: '#8fd0db',
  ink: '#a49e95',
};

// Hero transit map. Two real pipelines that meet where deterministic code takes over.
export const transit = {
  production: {
    name: 'Production line',
    project: 'Movigo',
    slug: 'movigo',
    before: ['Retailer books a delivery', 'Dispatch loop finds drivers'],
    after: ['Razorpay signature check', 'Live tracking over Pusher', 'Driver completes with PIN'],
  },
  agents: {
    name: 'Agent line',
    project: 'SettleAI, ToolForge, Naman',
    slug: 'settleai',
    before: ['Model proposes', 'Schema and rule checks'],
    after: ['Person approves', 'Tool runs exactly once', 'Signed receipt'],
  },
  interchange: { name: 'Code decides', note: 'Conditional writes in production; guards around every agent' },
};

// CricXAI dismissal-probability calibration, active model 2026-08-30 (1,362,629 deliveries).
// Bins with fewer than 100 deliveries are left out of the chart because they are noise.
export const calibration = [
  { bin: '0-10%', predicted: 0.0268, observed: 0.026, n: 1347404 },
  { bin: '10-20%', predicted: 0.1268, observed: 0.1401, n: 15021 },
  { bin: '20-30%', predicted: 0.215, observed: 0.2944, n: 197 },
];

// RouteCore README: nearest neighbour, 2,000 queries per size, answers verified identical.
export const kdBenchmark = [
  { n: '100', brute: 17.92, kd: 7.68 },
  { n: '1,000', brute: 25.31, kd: 1.52 },
  { n: '10,000', brute: 48.15, kd: 1.62 },
  { n: '100,000', brute: 1601.66, kd: 3.92 },
];

// Short pipelines for the agent bench on the home page, taken from each project's graph or call path.
export const miniFlows: Record<string, { label: string; kind: 'model' | 'rule' | 'human' | 'io' }[]> = {
  toolforge: [
    { label: 'Read spec', kind: 'rule' },
    { label: 'Design tools', kind: 'model' },
    { label: 'Check plan', kind: 'rule' },
    { label: 'Human review', kind: 'human' },
    { label: 'Generate', kind: 'rule' },
    { label: 'Live test', kind: 'model' },
    { label: 'Audit', kind: 'rule' },
  ],
  naman: [
    { label: 'Wake word', kind: 'io' },
    { label: 'Route and plan', kind: 'model' },
    { label: 'Approval node', kind: 'human' },
    { label: 'Tools run once', kind: 'rule' },
    { label: 'Reply', kind: 'io' },
  ],
  voicedesk: [
    { label: 'Speech to text', kind: 'io' },
    { label: 'Fast paths', kind: 'rule' },
    { label: 'Dialogue model', kind: 'model' },
    { label: 'Booking', kind: 'rule' },
    { label: 'Speech, interruptible', kind: 'io' },
  ],
  dociq: [
    { label: 'Parse and embed', kind: 'rule' },
    { label: 'Retrieve', kind: 'rule' },
    { label: 'Cited answer', kind: 'model' },
    { label: 'Extractive fallback', kind: 'rule' },
  ],
};
