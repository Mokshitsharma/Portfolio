import type { Credential } from './types';

export const site = {
  url: 'https://mokshitsharma27.vercel.app',
  name: 'Mokshit Sharma',
};

export const profile = {
  name: 'Mokshit Sharma',
  headline: 'Applied AI and full-stack engineer',
  currentRole: 'Founding Engineer & Tech Lead',
  currentOrg: 'Movigo Innovations Pvt. Ltd.',
  currentOrgShort: 'Movigo',
  location: 'Indore, India',
  availability: 'Open to full-time roles, remote or in Indore',
  email: 'sharman48520@gmail.com',
  github: 'https://github.com/Mokshitsharma',
  linkedin: 'https://www.linkedin.com/in/mokshit-sharma-75b5ab305/',
  resume: 'https://drive.google.com/file/d/1yqCt5a-2A4DEu9QJvIy_9b_KF6yR4xqt/view?usp=sharing',
  intro:
    'I run the whole technology stack of a live delivery marketplace as its only engineer, and I build AI agents that call real tools while plain code decides anything risky.',
};

export const education = {
  degree: 'Integrated B.Tech + M.Tech, Artificial Intelligence and Data Science',
  school: 'School of Data Science and Forecasting, Devi Ahilya Vishwavidyalaya, Indore',
  years: '2023 - 2028 (expected)',
};

// Only credentials with a certificate file on record. Drive links are the copies the issuers sent.
export const credentials: Credential[] = [
  { title: '5-Day AI Agents Intensive', issuer: 'Kaggle and Google', date: 'Dec 2025', href: 'https://drive.google.com/file/d/1NmhjV9PXbdtnp09OdMNtMaizlODUNfke/view?usp=sharing' },
  { title: 'Generative AI Foundations', issuer: 'Skillsoft', date: 'Nov 2025', href: 'https://drive.google.com/file/d/12LL5X1XFkZa-KYVSoCFUJZ7zyR9aB1wr/view?usp=sharing' },
  { title: 'Generative AI Foundations: IT Integration with Generative AI', issuer: 'Infosys Springboard', date: 'Nov 2024', href: 'https://drive.google.com/file/d/1FGNt8vyrA4aseMvbjoMUgsXYuAgrszPy/view?usp=sharing' },
  { title: 'Excel', issuer: 'Infosys Springboard', date: 'Nov 2024', href: 'https://drive.google.com/file/d/1C0E6VwPqfuZyaZkvkLYWOFl5JvfWJ48R/view?usp=sharing' },
  { title: 'AI Masterclass', issuer: 'Freedom of AI', date: 'Jan 2024', href: 'https://drive.google.com/file/d/1-0og7kJTOzSJeSR6zaWQwypVVCQjOU19/view?usp=sharing' },
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
