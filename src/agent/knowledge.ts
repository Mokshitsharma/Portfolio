import { credentials, education, inProgress, principles, profile } from '../data/profile';
import { categories, firstSentence, maturityLabel, projects } from '../data/projects';
import { caseStudies } from '../data/caseStudies';
import { roles, formatRange } from '../data/experience';
import { skillGroups } from '../data/skills';
import { plaques } from '../data/achievements';
import { architectures } from '../data/architecture';

// The assistant's knowledge base, built from the same records the pages render, so it cannot say more than the
// site does. scripts/prerender.mjs writes it to api/_lib/knowledge.gen.ts at build time, which keeps the serverless
// function free of imports from src/.

export interface Doc {
  id: string;
  title: string;
  url: string;
  text: string;
}

const lines = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join('\n');

export function buildKnowledge(): { docs: Doc[]; index: string; diagrams: string } {
  const docs: Doc[] = [];

  docs.push({
    id: 'profile',
    title: `${profile.name}: profile`,
    url: '/about',
    text: lines(
      `${profile.name}. ${profile.currentRole} at ${profile.currentOrg} (${profile.location}).`,
      profile.intro,
      `Education: ${education.degree}, ${education.school}, ${education.years}, ${education.grade}.`,
      `Availability: ${profile.availability}.`,
      `Email: ${profile.email}. GitHub: ${profile.github}. LinkedIn: ${profile.linkedin}.${profile.resume ? ` Résumé: ${profile.resume}.` : ''}`,
      ...inProgress.map((i) => `${i.title}: ${i.detail}`),
      'Engineering principles: ' + principles.map((p) => `${p.title}. ${p.body}`).join(' '),
    ),
  });

  docs.push({
    id: 'experience',
    title: 'Experience',
    url: '/experience',
    text: roles
      .map((r) => lines(
        `${r.title}, ${r.org}${r.place ? `, ${r.place}` : ''} (${r.type}, ${formatRange(r.start, r.end)}).`,
        r.titles && 'Titles: ' + r.titles.map((t) => `${t.title} from ${t.from}`).join('; ') + '.',
        r.summary,
        ...(r.work ?? []).map((w) => `- ${w}`),
      ))
      .join('\n'),
  });

  docs.push({
    id: 'credentials',
    title: 'Certificates and achievements',
    url: '/achievements',
    text: lines(
      ...credentials.map((c) => `${c.title}, ${c.issuer}${c.date ? `, ${c.date}` : ''}. ${c.about}`),
      ...plaques.map((p) => `${p.title} (${p.context}, ${p.when}${p.status ? `, ${p.status}` : ''}). ${p.body.join(' ')}`),
    ),
  });

  docs.push({
    id: 'skills',
    title: 'Skills',
    url: '/skills',
    text: skillGroups.map((g) => `${g.title}: ` + g.skills.map((s) => `${s.name} (shown in ${s.projects.join(', ')})`).join('; ')).join('\n'),
  });

  for (const p of projects) {
    const c = caseStudies.find((x) => x.slug === p.slug);
    const cat = categories.find((x) => x.id === p.category)!;
    const a = architectures.find((x) => x.slug === p.slug);
    docs.push({
      id: p.slug,
      title: p.name,
      url: p.caseStudy ? `/projects/${p.slug}` : `/projects?q=${encodeURIComponent(p.name)}`,
      text: lines(
        `${p.name} (${cat.title}; ${maturityLabel[p.maturity]}; ${p.period}). ${p.summary}`,
        `Stack: ${p.stack.join(', ')}.`,
        p.links.length ? 'Links: ' + p.links.map((l) => `${l.label} ${l.href}`).join('; ') + '.' : p.linkNote,
        p.tests,
        p.relation,
        // Measured results first, so trimming a long record never drops them.
        ...(c?.facts ?? []).map((f) => `Result: ${f.label}: ${f.value} (source: ${f.source})`),
        ...(c?.quality ?? []).map((q) => `Testing and evaluation: ${q}`),
        a && lines(
          `Architecture (${a.title}): ` + a.nodes.map((n) => `${n.label}: ${n.what}${n.why ? ` ${n.why}` : ''}`).join(' '),
          'Walkthroughs: ' + a.walkthroughs.map((w) => `${w.title}: ` + w.steps.map((s) => s.say).join(' ')).join(' | '),
        ),
        c && lines(
          c.title, c.lede, `Context: ${c.context}`, `Role: ${c.role}`, `Status: ${c.status}`,
          c.flow && `${c.flow.title}: ` + c.flow.stages.map((s) => s.label + (s.note ? ` (${s.note})` : '')).join(' -> '),
          c.map && `${c.map.title}: ` + c.map.groups.map((g) => `${g.title}: ${g.items.map((i) => i.name + (i.note ? ` (${i.note})` : '')).join(', ')}`).join('; '),
          ...c.decisions.map((d) => `Decision: ${d.title}. ${d.body}`),
          ...c.sections.map((s) => `${s.heading}: ${[...(s.body ?? []), ...(s.points ?? [])].join(' ')}`),
        ),
      ),
    });
  }

  // A one-line entry per project, always sent, so the assistant can recommend across the whole collection.
  const index = projects
    .map((p) => `${p.name} | ${p.caseStudy ? `/projects/${p.slug}` : `/projects?q=${encodeURIComponent(p.name)}`} | ${categories.find((x) => x.id === p.category)!.title} | ${firstSentence(p.summary)}`)
    .join('\n');

  const diagrams = architectures
    .map((a) => `${a.slug}: walkthroughs ${a.walkthroughs.map((w) => `${w.id} (${w.title})`).join(', ')}; nodes ${a.nodes.map((n) => `${n.id} (${n.label})`).join(', ')}`)
    .join('\n');

  return { docs, index, diagrams };
}
