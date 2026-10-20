import { caseStudies } from './data/caseStudies';
import { rolePages } from './data/rolePages';
import { profile, site } from './data/profile';

// Per-route metadata. The prerender script writes it into each HTML file; the client updates it on navigation.

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  type?: 'website' | 'article' | 'profile';
}

const suffix = `${profile.name}`;

const fixed: PageMeta[] = [
  {
    path: '/',
    title: `${profile.name}, applied AI and full-stack engineer`,
    description: `${profile.currentRole} at Movigo, running a live delivery platform as its only engineer, and builder of AI agents with deterministic guardrails. Case studies, projects and experience.`,
    type: 'profile',
  },
  {
    path: '/projects',
    title: `Projects, ${suffix}`,
    description: 'Every published project, from a live logistics platform and agent systems to machine learning notebooks, with status, stack and code links.',
  },
  {
    path: '/experience',
    title: `Experience, ${suffix}`,
    description: `${profile.currentRole} at Movigo Innovations since April 2026, and internships in data science, AI and software development from 2024.`,
  },
  {
    path: '/skills',
    title: `Skills, ${suffix}`,
    description: 'Skills grouped by engineering domain, each linked to the projects that use it.',
  },
  {
    path: '/about',
    title: `About, ${suffix}`,
    description: 'How I work across production software and AI systems, with education and credentials.',
  },
  {
    path: '/achievements',
    title: `Achievements, ${suffix}`,
    description: 'Certificates, the degree in progress, Movigo apps on Google Play and the App Store, the PayPal AI Hackathon 2026 entry and Kaggle Playground entries.',
  },
  {
    path: '/roles',
    title: `Roles, ${suffix}`,
    description: 'One page per role: data analyst, data scientist, data engineer, AI/ML, machine learning, agentic and generative AI, Python, full-stack and software engineering.',
  },
  {
    path: '/contact',
    title: `Contact, ${suffix}`,
    description: 'Email or send a message about a role or a project.',
  },
];

export const caseStudyMeta: PageMeta[] = caseStudies.map((c) => ({
  path: `/projects/${c.slug}`,
  title: `${c.title}, ${suffix}`,
  description: c.lede.length > 200 ? `${c.lede.slice(0, c.lede.lastIndexOf(' ', 197))}...` : c.lede,
  type: 'article',
}));

export const notFoundMeta: PageMeta = {
  path: '/404',
  title: `Page not found, ${suffix}`,
  description: 'This page does not exist.',
};

export const roleMeta: PageMeta[] = rolePages.map((r) => ({
  path: `/roles/${r.slug}`,
  title: `${r.title}, ${suffix}`,
  description: r.fit.length > 200 ? `${r.fit.slice(0, r.fit.lastIndexOf(' ', 197))}...` : r.fit,
}));

export const publicPages: PageMeta[] = [...fixed, ...caseStudyMeta, ...roleMeta];

export function metaFor(pathname: string): PageMeta {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return publicPages.find((p) => p.path === clean) ?? notFoundMeta;
}

export const canonical = (path: string) => `${site.url}${path === '/' ? '/' : path}`;

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${site.url}/#person`,
        name: profile.name,
        jobTitle: profile.currentRole,
        worksFor: { '@type': 'Organization', name: profile.currentOrg },
        address: { '@type': 'PostalAddress', addressLocality: 'Indore', addressCountry: 'IN' },
        alumniOf: { '@type': 'CollegeOrUniversity', name: 'Devi Ahilya Vishwavidyalaya' },
        url: site.url,
        sameAs: [profile.github, profile.linkedin],
      },
      { '@type': 'WebSite', '@id': `${site.url}/#website`, url: site.url, name: site.name, publisher: { '@id': `${site.url}/#person` } },
    ],
  };
}

// Plain string head tags, used by the prerender script. Kept here so both sides agree on the markup.
export function headTags(meta: PageMeta): string {
  const url = canonical(meta.path);
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    meta.path === '/404' ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${meta.type ?? 'website'}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${site.url}/og.png" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="${esc(`${profile.name}, ${profile.headline}`)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${site.url}/og.png" />`,
  ];
  if (meta.path === '/') tags.push(`<script type="application/ld+json">${JSON.stringify(personJsonLd())}</script>`);
  return tags.join('\n    ');
}
