import type { Credential } from './types';

export const site = {
  url: 'https://mokshitsharma27.vercel.app',
  name: 'Mokshit Sharma',
};

export const profile = {
  name: 'Mokshit Sharma',
  headline: 'Applied AI / ML Engineer',
  currentRole: 'Founding Engineer & Tech Lead',
  currentOrg: 'Movigo Innovations Pvt. Ltd.',
  currentOrgShort: 'Movigo',
  location: 'Indore, India',
  availability: 'Available for internships and full-time roles, remote, hybrid or on-site in India',
  email: 'sharman48520@gmail.com',
  github: 'https://github.com/Mokshitsharma',
  linkedin: 'https://www.linkedin.com/in/mokshit-sharma-75b5ab305/',
  // The final résumé is still to come (31 Oct 2026); every download link hides itself while this is null.
  resume: null as string | null,
  intro:
    'I build intelligent systems, agentic workflows and data-driven products, and I measure them on held-out data before I trust them. I run the AI and data layer of a live delivery marketplace in Indore as its only engineer.',
};

export const education = {
  degree: 'Integrated B.Tech + M.Tech, Artificial Intelligence and Data Science',
  school: 'School of Data Science and Forecasting, Devi Ahilya Vishwavidyalaya, Indore',
  years: '2023 - 2028 (expected)',
  grade: 'CGPA 8.2',
};

// Only credentials Mokshit has verified (31 Oct 2026): Google Data Analytics, the Freedom of AI course, HackerRank
// and the Infosys Data Analyst Program stay off until their titles, dates and links are confirmed.
// Drive links are the copies the issuers sent. The last three were confirmed by Mokshit on 2026-10-20 and have no
// public link yet. `about` says only what the title and issuer establish; no grades, ranks or syllabus claims.
export const credentials: Credential[] = [
  {
    title: '5-Day AI Agents Intensive', issuer: 'Kaggle and Google', date: 'Dec 2025', href: 'https://drive.google.com/file/d/1NmhjV9PXbdtnp09OdMNtMaizlODUNfke/view?usp=sharing',
    about: 'A five-day intensive course from Kaggle and Google on building AI agents.',
    related: ['settleai', 'toolforge', 'naman'],
  },
  {
    title: 'Generative AI Foundations', issuer: 'Skillsoft', date: 'Nov 2025', href: 'https://drive.google.com/file/d/12LL5X1XFkZa-KYVSoCFUJZ7zyR9aB1wr/view?usp=sharing',
    about: 'A Skillsoft course on the foundations of generative AI.',
    related: ['dociq', 'ai-business-analytics'],
  },
  {
    title: 'Generative AI Foundations: IT Integration with Generative AI', issuer: 'Infosys Springboard', date: 'Nov 2024', href: 'https://drive.google.com/file/d/1FGNt8vyrA4aseMvbjoMUgsXYuAgrszPy/view?usp=sharing',
    about: 'An Infosys Springboard course on generative AI and integrating it into IT systems.',
    related: ['dociq'],
  },
  {
    title: 'Excel', issuer: 'Infosys Springboard', date: 'Nov 2024', href: 'https://drive.google.com/file/d/1C0E6VwPqfuZyaZkvkLYWOFl5JvfWJ48R/view?usp=sharing',
    about: 'An Infosys Springboard course in Microsoft Excel.',
  },
];

export const inProgress = [
  { title: 'PayPal AI Hackathon 2026', detail: 'SettleAI entry; submissions close 12 November 2026, judging in December.' },
];

// The engineering rules behind the agent work, each tied to where it shows up in code.
export const principles = [
  {
    title: 'The model proposes, code decides',
    body: 'Agents draft plans, judgements and dispute splits. Deterministic code checks them before anything irreversible happens, and no agent holds a tool that can move money on its own.',
    where: [{ label: 'SettleAI Mandate Guard', slug: 'settleai' }, { label: 'ToolForge plan check', slug: 'toolforge' }],
  },
  {
    title: 'Exact checks run before the model',
    body: 'Photo timestamps, GPS distance, duplicate-image hashes and schema validation of a tool plan are cheap and certain, so they run first. The model only sees what rules cannot settle, and when the two disagree, the rule wins.',
    where: [{ label: 'SettleAI proof checks', slug: 'settleai' }, { label: 'VoiceDesk fast paths', slug: 'voicedesk' }],
  },
  {
    title: 'A person approves the risky step',
    body: 'Approval is a step in the agent graph, not a line in a prompt. The run pauses, waits for a yes, and resumes without repeating tools that already ran.',
    where: [{ label: 'Naman approval node', slug: 'naman' }, { label: 'ToolForge review', slug: 'toolforge' }],
  },
  {
    title: 'It runs without keys, and it is measured',
    body: 'Every external service has a mock and every model a stub, so tests and demos run offline. Evaluation checks whether the system is right, including whether it refuses when it should.',
    where: [{ label: 'SettleAI ports and mocks', slug: 'settleai' }, { label: 'docIQ refusal evaluation', slug: 'dociq' }, { label: 'CricXAI versioned evaluations', slug: 'cricxai' }],
  },
];

// The illustration in the opening story, cut out of its background so it stands on the page.
export interface Photo { src: string; alt: string; width: number; height: number }
export const portrait: Photo = {
  src: '/images/me-figure.webp', width: 441, height: 1200,
  alt: 'Illustration of Mokshit Sharma standing, in glasses, a navy short-sleeved shirt and cream trousers, hands in pockets.',
};
// The companion in the opening story and beside the map: Naman, my own voice agent, drawn as its on-screen orb.
export const companion = { name: 'Naman', slug: 'naman' };

