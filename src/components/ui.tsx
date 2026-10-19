import type { ReactNode } from 'react';
import { ArrowUpRight, FileText, Github, Smartphone } from 'lucide-react';
import { maturityLabel } from '../data/projects';
import type { ExternalLink, Maturity } from '../data/types';
import type { Line } from '../data/visuals';

// Small shared pieces.

// Quiet text tag. Colour only where it carries meaning: green for live systems, yellow for active work.
const tagTone: Record<Maturity, string> = {
  production: 'text-clear border-clear/50',
  deployed: 'text-clear border-clear/50',
  working: 'border-current/30',
  'in-progress': 'border-route',
  prototype: 'border-current/30',
  notebook: 'border-current/20 opacity-80',
  coursework: 'border-current/20 opacity-80',
};

export function StatusMark({ maturity, className = '', tone = 'light' }: { maturity: Maturity; className?: string; tone?: 'light' | 'dark' }) {
  const live = maturity === 'production' || maturity === 'deployed';
  const toneClass = live && tone === 'dark' ? 'text-field-light border-field-light/50' : tagTone[maturity];
  return (
    <span className={`label inline-flex items-center whitespace-nowrap border px-2 py-0.5 ${toneClass} ${className}`}>
      <span className="sr-only">Status: </span>
      {maturityLabel[maturity]}
    </span>
  );
}

const icon = { repo: Github, demo: ArrowUpRight, store: Smartphone, document: FileText, site: ArrowUpRight };

export function Links({ links, className = '' }: { links: ExternalLink[]; className?: string }) {
  if (links.length === 0) return null;
  return (
    <ul className={`flex flex-wrap gap-x-6 gap-y-2 ${className}`}>
      {links.map((l) => {
        const Icon = icon[l.kind];
        return (
          <li key={l.href}>
            <a href={l.href} target="_blank" rel="noopener noreferrer" className="ui inline-flex items-center gap-2 font-medium">
              <Icon size={16} aria-hidden className="shrink-0" />
              <span className="link">{l.label}</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export const lineBg: Record<Line, string> = { route: 'bg-route', signal: 'bg-signal', field: 'bg-field', ink: 'bg-mist' };
export const lineText: Record<Line, string> = { route: 'text-route', signal: 'text-signal-light', field: 'text-field-light', ink: 'text-mist' };

// Dark opening plate shared by inner pages.
export function PageHeader({ title, children, crumb, line = 'route', aside }: { title: string; children?: ReactNode; crumb?: ReactNode; line?: Line; aside?: ReactNode }) {
  return (
    <header className="plate grid-texture relative overflow-hidden pt-28 md:pt-36">
      <div className="shell grid gap-10 pb-14 md:pb-20 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          {crumb && <div className="label mb-6 text-mist">{crumb}</div>}
          <h1 className="display text-[clamp(3.25rem,9vw,8.5rem)]">{title}</h1>
          {children && <div className="lede mt-6 max-w-2xl font-sans text-mist">{children}</div>}
        </div>
        {aside}
      </div>
      <div className={`rail ${lineBg[line]}`} aria-hidden />
    </header>
  );
}

// Section heading used on light pages: an expanded label, then a condensed headline.
export function SectionHead({ id, kicker, title, children, aside, tone = 'light' }: { id: string; kicker: string; title: string; children?: ReactNode; aside?: ReactNode; tone?: 'light' | 'dark' }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
      <div className="max-w-3xl">
        <p className={`label ${tone === 'dark' ? 'text-mist' : 'text-graphite'}`}>{kicker}</p>
        <h2 id={id} className="headline mt-3 text-[clamp(2.25rem,5vw,4rem)]">{title}</h2>
        {children && <div className={`lede mt-5 max-w-2xl ${tone === 'dark' ? 'font-sans text-mist' : 'text-graphite'}`}>{children}</div>}
      </div>
      {aside}
    </div>
  );
}
