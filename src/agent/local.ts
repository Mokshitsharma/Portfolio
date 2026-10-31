import { buildKnowledge, type Doc } from './knowledge';
import { architectures } from '../data/architecture';

// The assistant for the static build (the S3 copy): no server and no model, so it searches the same records the
// pages render, in the browser, and answers with what they say and where to read more. It never writes claims of
// its own; every sentence it returns is copied from a record.

const STOP = new Set('a an and are as at be by can do does for from has have he his how i in is it its me mokshit my of on or show tell that the their them this to was what when where which who why with you your about'.split(' '));
const words = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9+#. ]+/g, ' ').split(/\s+/).filter((w) => w.length > 1 && !STOP.has(w));

let index: { docs: Doc[]; tf: Map<string, number>[]; df: Map<string, number> } | null = null;
function build() {
  if (index) return index;
  const { docs } = buildKnowledge();
  const tf = docs.map((d) => {
    const m = new Map<string, number>();
    for (const w of words(`${d.title} ${d.title} ${d.text}`)) m.set(w, (m.get(w) ?? 0) + 1);
    return m;
  });
  const df = new Map<string, number>();
  for (const m of tf) for (const w of m.keys()) df.set(w, (df.get(w) ?? 0) + 1);
  index = { docs, tf, df };
  return index;
}

function retrieve(question: string, slug?: string, k = 3) {
  const { docs, tf, df } = build();
  const q = words(question);
  const N = docs.length;
  return docs
    .map((d, i) => {
      let s = 0;
      for (const w of q) {
        const f = tf[i].get(w);
        if (!f) continue;
        const n = df.get(w) ?? 0;
        s += Math.log(1 + (N - n + 0.5) / (n + 0.5)) * ((f * 2.2) / (f + 1.2));
      }
      if (q.some((w) => d.id.includes(w) || d.title.toLowerCase().includes(w))) s += 4;
      if (slug && d.id === slug) s += 6;
      return { d, s };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, k)
    .map((x) => x.d);
}

// The record's opening sentence, and its first measured result if it has one.
function summarise(d: Doc) {
  const lines = d.text.split('\n');
  // A project's first line opens with "Name (area; status; period)."; the profile's is only that, so its intro
  // (the next line) stands in.
  const first = lines[0].replace(/^[^(]{1,80}\([^)]*\)\.\s*/, '') || lines[1] || '';
  const lead = first.indexOf('. ') === -1 ? first : first.slice(0, first.indexOf('. ') + 1);
  const result = lines.find((l) => l.startsWith('Result: '))?.replace(/^Result: /, '').replace(/ \(source:.*\)$/, '');
  return result ? `${lead} ${result}.` : lead;
}

export function localAnswer(question: string, slug?: string): string {
  let hits = retrieve(question, slug).filter((d) => d.id !== 'skills' || /skill/i.test(question));
  // Questions about Mokshit himself lead with his profile.
  if (/\b(who|what kind|engineer is|about him|background|education|interests?|open to|collaborate)\b/i.test(question)) {
    const profile = build().docs.find((d) => d.id === 'profile')!;
    hits = [profile, ...hits.filter((d) => d !== profile)].slice(0, 3);
  }
  if (!hits.length) return 'I could not find that in the portfolio. The [projects page](/projects) lists everything, and you can write to Mokshit from the [contact section](/#contact).';
  const body = hits.map((d) => `- [${d.title.replace(/: profile$/, '')}](${d.url}): ${summarise(d)}`).join('\n');
  // "How does X work?" about a project with an architecture sheet: play its first walkthrough.
  const arch = architectures.find((a) => a.slug === hits[0].id);
  const how = arch && /\b(how|work|works|architecture|flow|process|handle)\b/i.test(question);
  return `This version of the site answers from its own records, without an AI model. Here is what they say:\n\n${body}${how ? `\n[[diagram:${arch!.slug}:${arch!.walkthroughs[0].id}]]` : ''}`;
}
