import type { ExternalLink } from './types';
import { projectBySlug } from './projects';

// Plaques on the Achievements page: things done, as distinct from certificates (profile.ts). Each one is
// documented in the project records; none claims a placing, a rank or a result that has not happened.

export interface Plaque {
  id: string;
  title: string;
  context: string; // who or what it belongs to
  when: string;
  status?: string;
  body: string[];
  internal?: { label: string; to: string }[];
  external?: ExternalLink[];
}

export const plaques: Plaque[] = [
  {
    id: 'paypal-hackathon',
    title: 'PayPal AI Hackathon 2026',
    context: 'Entry: SettleAI',
    when: 'Submissions close 12 November 2026',
    status: 'In progress',
    body: [
      'SettleAI is my entry: escrow for real-world jobs that AI agents hire people to do. Agents scope the job and judge photo proof; a deterministic guard approves every payout, and every step becomes a signed receipt anyone can verify offline.',
      'Judging takes place in December 2026.',
    ],
    internal: [{ label: 'Read the SettleAI case study', to: '/projects/settleai' }],
  },
  {
    id: 'movigo-stores',
    title: 'Movigo apps on Google Play and the App Store',
    context: 'Movigo Innovations Pvt. Ltd.',
    when: '2026',
    body: [
      'I build and release the Movigo driver and retailer apps. Both are on Google Play, with 1K+ installs each in October 2026, and the retailer app is also on the App Store.',
    ],
    internal: [{ label: 'Read the Movigo case study', to: '/projects/movigo' }],
    external: projectBySlug('movigo')!.links,
  },
  {
    id: 'kaggle-playground',
    title: 'Kaggle Playground entries',
    context: 'Kaggle Playground Series',
    when: 'January 2026',
    body: [
      'Two competition entries: diabetes classification over 26 health features with a blended CatBoost and LightGBM model (AUC 0.728), and student-score regression with K-fold validation and a stacked ensemble under a ridge meta-model.',
    ],
    internal: [{ label: 'See both in the archive', to: '/projects?q=Kaggle' }],
  },
];
