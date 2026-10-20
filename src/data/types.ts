// Content model for the whole site. Pages render from these types; no copy lives in components
// except interface labels.

export type Category = 'production' | 'agents' | 'ml' | 'fullstack' | 'data' | 'tools' | 'learning';

// How far a project got. Shown on every project so a reader can tell a live system from an exercise.
export type Maturity =
  | 'production' // real users depend on it
  | 'deployed' // publicly reachable
  | 'working' // runs end to end, not deployed
  | 'in-progress' // actively being built
  | 'prototype' // partial or early
  | 'notebook' // analysis or model in a notebook or single script
  | 'coursework'; // study material

export interface ExternalLink {
  label: string;
  href: string;
  kind: 'repo' | 'demo' | 'store' | 'document' | 'site';
}

export interface Project {
  id: string; // stable id shared with the career-research registry (P01...)
  slug: string;
  name: string;
  category: Category;
  maturity: Maturity;
  period: string; // human-readable, e.g. "Oct 2026" or "Aug-Sep 2026"
  summary: string;
  stack: string[];
  links: ExternalLink[];
  linkNote?: string; // e.g. why there is no public code
  tests?: string; // how many tests exist and how they were counted
  relation?: string; // versions, predecessors, shared code
  caseStudy?: boolean; // has a page at /projects/:slug
  featured?: boolean; // shown on the home page
}

export interface Stage {
  label: string;
  note?: string;
  kind?: 'model' | 'rule' | 'human' | 'io'; // who acts at this stage
}

export interface MapGroup {
  title: string;
  items: { name: string; note?: string }[];
}

export interface Figure {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

export interface Fact {
  label: string;
  value: string;
  source: string; // where the number comes from, shown under the table
}

export interface CaseSection {
  heading: string;
  body?: string[]; // paragraphs
  points?: string[];
}

export interface CaseStudy {
  slug: string;
  layout: 'production' | 'agent' | 'model' | 'engineering';
  title: string; // page h1
  lede: string;
  context: string; // who it is for and why it exists
  role: string;
  status: string;
  flow?: { title: string; caption: string; stages: Stage[] };
  map?: { title: string; caption: string; groups: MapGroup[] };
  decisions: { title: string; body: string }[];
  sections: CaseSection[];
  facts?: Fact[];
  quality?: string[]; // testing, evaluation and measured results
  figures?: Figure[];
  related?: string[]; // slugs
}

export interface RoleTitle {
  title: string;
  from: string; // YYYY-MM
}

export interface Role {
  id: string; // E01...
  org: string;
  place?: string;
  title: string;
  titles?: RoleTitle[]; // progression inside one organisation, oldest first
  start: string; // YYYY-MM
  end: string; // YYYY-MM or 'present'
  type: 'Employment' | 'Internship' | 'Virtual internship' | 'Internship programme';
  terms?: string; // e.g. "Part-time, remote, unpaid" when a document states it
  summary?: string;
  work?: string[];
  projects?: string[]; // project slugs
  proof?: ExternalLink[];
}

export interface Skill {
  name: string;
  projects: string[]; // project slugs that show it
}

export interface SkillGroup {
  id: string;
  title: string;
  intro: string;
  skills: Skill[];
}

export interface Credential {
  title: string;
  issuer: string;
  date: string;
  href?: string;
}
