import type { Role } from './types';

// Dates follow the offer letter or certificate for each role. Roles without a supporting document are kept
// out of the published list (see private/, git-ignored).

const drive = (id: string, label = 'Internship document'): { label: string; href: string; kind: 'document' } => ({
  label,
  href: `https://drive.google.com/file/d/${id}/view?usp=sharing`,
  kind: 'document',
});

export const roles: Role[] = [
  {
    id: 'E01',
    org: 'Movigo Innovations Pvt. Ltd.',
    place: 'Indore',
    title: 'Founding Engineer & Tech Lead',
    titles: [
      { title: 'App Developer (part-time)', from: '2026-04' },
      { title: 'Lead App Developer', from: '2026-05' },
      { title: 'Founding Engineer & Tech Lead', from: '2026-06' },
    ],
    start: '2026-04',
    end: 'present',
    type: 'Employment',
    summary:
      'The company’s only engineer. I built the product from zero and launched it, then added the data and AI layer that runs it: forecasting, cancellation-risk scoring, dispatch ranking and pricing, a voice calling agent, a support copilot and document verification.',
    work: [
      'Applied ML in production: demand forecasting, cancellation-risk scoring, smart dispatch ranking, supply-aware surge pricing, fraud and churn detection and ETA correction, tracked with MLflow and drift monitoring (reported).',
      'Cancellations fell from 40% to 12% while daily bookings grew from about 140 to about 400 in September and October 2026 (reported by Movigo).',
      'A voice calling agent that has handled 1,200+ calls and resolves 81% without a person, and a RAG support copilot for driver and retailer policy questions, both with human escalation (reported).',
      'OCR document verification with checksum validation, face match and a human-review queue, keeping identity data masked (reported).',
      'The platform underneath: a Node.js and MongoDB backend with real-time dispatch, race-safe booking acceptance and signature-verified Razorpay payments; Flutter driver and retailer apps on Google Play and the App Store.',
      'Server-driven pricing, zones and dispatch radius that operations change without an app release; releases on Codemagic; a move from a VPS to AWS (reported).',
    ],
    workAreas: ['Applied ML', 'Results', 'Voice AI and RAG', 'Document verification', 'Platform', 'Operations and cloud'],
    projects: ['movigo', 'fieldops-ai', 'movigo-broadcast'],
  },
  {
    id: 'E03', org: 'Kangaroo Software Pvt. Ltd.', place: 'Indore', title: 'Data Science Intern',
    start: '2025-10', end: '2026-01', type: 'Internship',
    summary: 'Machine-learning models and chatbots for 12+ clients of a company that builds software for other businesses, from data preparation to delivery. Each client project lifted sales by more than 30%; on average profit rose 15% and expenses fell 10% (as reported).',
    proof: [drive('1ZPBgGkkDBb1CWGArpvjBl-zUiDwCzPo1')],
  },
  {
    id: 'E05', org: 'CodeAlpha', title: 'Data Science Intern', start: '2025-11', end: '2025-12', type: 'Virtual internship',
    proof: [drive('15s2gujKW4r4wR0aO3GLJVrzZFl3oQ1Ul')],
  },
  {
    id: 'E06', org: 'SaiKet Systems', title: 'Power BI Intern', start: '2025-09', end: '2025-10', type: 'Virtual internship',
    summary: 'Data analysis and visualisation in Power BI.',
    proof: [drive('1L1smoZpG5rqaDuqyiiRZ7F5xrCGrUrFU')],
  },
  {
    id: 'E07', org: 'CODEXINTERN', title: 'AI/ML Intern', start: '2025-08', end: '2025-08', type: 'Virtual internship',
    terms: 'One month',
    proof: [drive('13TDYLf6l5M-fISFdyKeCpK9THZ8sjfgl', 'Completion certificate')],
  },
  {
    id: 'E08', org: 'CODEXINTERN', title: 'Python Development Intern', start: '2025-08', end: '2025-08', type: 'Virtual internship',
    terms: 'One month, unpaid',
  },
  {
    id: 'E09', org: 'Bluestock Fintech', title: 'Software Development Engineer Intern', start: '2025-05', end: '2025-06', type: 'Internship',
    terms: 'Part-time, remote, unpaid',
    proof: [drive('1fRrLmzs8o4JA1FHBOWhm6W_OEsr9Cp1L')],
  },
  {
    id: 'E10', org: 'Afame Technologies', title: 'Data Analyst Intern', start: '2025-02', end: '2025-03', type: 'Internship',
    proof: [drive('1S_TLmbYtnc6IfMLME0pW3wFo5Z7WhAJx')],
  },
  {
    id: 'E11', org: 'TechnoHacks Solutions Pvt. Ltd.', title: 'C and C++ Programming Intern', start: '2024-11', end: '2024-12', type: 'Internship',
    terms: 'One month',
    proof: [drive('1rMo4I9OJaZHzQVMW6GyDfd_jXPuqJ3B8')],
  },
  {
    id: 'E04', org: 'CodSoft', title: 'C++ Programming Intern', start: '2024-11', end: '2024-12', type: 'Virtual internship',
    terms: 'Four weeks',
    proof: [drive('17C14sTkWIYQkFV2SpCI5Cz2dcgO5Rs66')],
  },
  {
    id: 'E12', org: 'Evoastra Ventures', title: 'Artificial Intelligence Intern', start: '2024-10', end: '2024-11', type: 'Internship',
    terms: 'One month',
    summary: 'A sentiment-analysis pipeline on 50,000+ Reddit posts with TF-IDF features, comparing logistic regression and naive Bayes.',
  },
  {
    id: 'E13', org: 'Cognifyz Technologies', title: 'Data Science Intern', start: '2024-09', end: '2024-10', type: 'Internship',
    summary: 'Regression models that predict restaurant ratings, reaching R-squared 0.84 after feature engineering, from cleaning and exploring the data to comparing models.',
    proof: [drive('1qFCF_sY7sBTlVZ4C5Sid1u83UTrHNwz5')],
  },
  {
    id: 'E14', org: 'Edureka', title: 'Data Science and Machine Learning Internship Program', start: '2024-06', end: '2024-06', type: 'Internship programme',
    proof: [drive('1I7nzd7g--EGjRusjIJ5gIRsNwh2DXT7G', 'Certificate')],
  },
];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatMonth(ym: string) {
  if (ym === 'present') return 'present';
  const [y, m] = ym.split('-');
  return `${months[Number(m) - 1]} ${y}`;
}

export function formatRange(start: string, end: string) {
  if (start === end) return formatMonth(start);
  const [sy] = start.split('-');
  const [ey] = end.split('-');
  if (end !== 'present' && sy === ey) return `${formatMonth(start).split(' ')[0]} - ${formatMonth(end)}`;
  return `${formatMonth(start)} - ${formatMonth(end)}`;
}

export const currentRole = roles[0];
export const internships = roles.filter((r) => r.type !== 'Employment');
