// Short copy for project cards: a one- or two-sentence pitch and one verified technical detail.
// Written for scanning; the full record lives in projects.ts and the case studies.
import { firstSentence, projectBySlug } from './projects';

export const cardCopy: Record<string, { pitch: string; detail: string }> = {
  movigo: {
    pitch: 'A delivery marketplace in Indore with driver and retailer apps on Google Play and the App Store. I am its only engineer.',
    detail: 'One conditional database write decides which driver wins a booking.',
  },
  settleai: {
    pitch: 'Escrow for real-world jobs that AI agents hire people to do. Deterministic code approves every payout.',
    detail: 'Every step becomes a signed receipt that verifies offline.',
  },
  toolforge: {
    pitch: 'Turns an OpenAPI spec into an MCP server, then tests it against the live API and audits it.',
    detail: 'Pass or fail comes from recorded API calls, not the model’s opinion.',
  },
  naman: {
    pitch: 'A voice agent for my laptop and phone that waits for a yes before changing anything.',
    detail: 'Approval is its own LangGraph node, so tools run exactly once after a pause.',
  },
  voicedesk: {
    pitch: 'A phone receptionist for small businesses that answers questions, books appointments and hands off to a person.',
    detail: 'Speech stops as soon as the caller starts talking.',
  },
  dociq: {
    pitch: 'Ask questions of contracts and invoices and get answers that cite the passage they came from.',
    detail: 'Its evaluation checks that it refuses when the documents do not hold the answer.',
  },
  refera: {
    pitch: 'Referral commissions for loans and cards, paid into a ledger that cannot be edited.',
    detail: 'A database trigger rejects every update or delete on ledger entries.',
  },
  routecore: {
    pitch: 'A routing and scheduling engine in plain Java, with every data structure written by hand.',
    detail: 'Its k-d tree answers nearest-neighbour queries over 100,000 points 408 times faster than brute force.',
  },
  cricxai: {
    pitch: 'Recommends what to bowl next in a one-day international, with the reasons behind each number.',
    detail: 'Trained on 1.36 million real deliveries; dismissal ROC-AUC 0.749.',
  },
  'fieldops-ai': {
    pitch: 'Attendance, onboarding and performance tracking for a field team of about twenty.',
    detail: 'GPS points go up in one batch a minute instead of one request per point.',
  },
  'hyperlocal-marketplace': {
    pitch: 'Orders from local shops, delivered by riders, on a state machine built to survive races and restarts.',
    detail: 'Every status change is a compare-and-set update; in-flight orders are reconciled on boot.',
  },
  'sensei-ai': {
    pitch: 'Buy, sell or hold signals for Nifty 50 stocks from five model families, with the reasoning shown.',
    detail: 'Each model adds or subtracts a point, and the explanation lists every vote.',
  },
  'ai-business-analytics': {
    pitch: 'Upload a CSV and get cleaned data, trained models, SHAP explanations and a written PDF report.',
    detail: 'If the language model is unavailable, the report still ships with a structured summary.',
  },
  'dairy-collection-manager': {
    pitch: 'A milk-collection register that prices milk by fat content and settles supplier accounts.',
    detail: 'Settlement runs in one database transaction, repaying the oldest advance first.',
  },
};

export function cardFor(slug: string) {
  const p = projectBySlug(slug)!;
  return cardCopy[slug] ?? { pitch: firstSentence(p.summary), detail: '' };
}
