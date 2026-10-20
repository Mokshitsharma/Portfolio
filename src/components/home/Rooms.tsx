import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { caseStudyBySlug } from '../../data/caseStudies';
import { cardFor } from '../../data/cards';
import { maturityLabel, projectBySlug, projects } from '../../data/projects';
import { miniFlows } from '../../data/visuals';
import type { Category } from '../../data/types';
import { Benchmark, Calibration, KindKey, Pipeline, type StageKind } from './Evidence';

// The four project rooms on the home page. Each shows its strongest projects with their own evidence (a chart,
// a pipeline, screenshots, counted facts) and lists the rest of the room, all from src/data.

export const p = (slug: string) => projectBySlug(slug)!;

// Where a project name leads: its case study if it has one, otherwise the archive filtered to it.
export const projectHref = (slug: string) => (p(slug).caseStudy ? `/projects/${slug}` : `/projects?q=${encodeURIComponent(p(slug).name)}`);

export function ProjectLink({ slug }: { slug: string }) {
  return <Link to={projectHref(slug)} className="link text-bone">{p(slug).name}</Link>;
}

export interface RoomDef {
  id: string; // section id
  title: string;
  categories: Category[];
  tint: string;
  line: string;
  archive: string; // archive anchor
}

export const rooms: RoomDef[] = [
  { id: 'room-ml', title: 'Machine learning', categories: ['ml'], tint: '#8fd0db', line: 'Models evaluated on held-out data, with the reasons behind each prediction.', archive: '/projects#ml' },
  { id: 'room-agents', title: 'Agentic and generative AI', categories: ['agents'], tint: '#e2b877', line: 'Agents that call real tools, with code checking their plans and a person approving the risky step.', archive: '/projects#agents' },
  { id: 'room-data', title: 'Data science and analytics', categories: ['data'], tint: '#ece4d6', line: 'Pipelines into SQL, pandas and Power BI, mostly market and retail data.', archive: '/projects#data' },
  { id: 'room-software', title: 'Software and full-stack', categories: ['production', 'fullstack', 'tools'], tint: '#cf915d', line: 'Products with money, races and restarts handled in code, and engines built from first principles.', archive: '/projects#production' },
];

export const roomProjects = (r: RoomDef) => projects.filter((x) => r.categories.includes(x.category));

function Room({ room, children, featured }: { room: RoomDef; children: ReactNode; featured: string[] }) {
  const rest = roomProjects(room).filter((x) => !featured.includes(x.slug));
  return (
    <section id={room.id} aria-labelledby={`${room.id}-title`} className="relative z-10 py-28 md:py-36" style={{ ['--tint' as string]: room.tint }}>
      <div className="shell lg:pr-52">
        <div className="read-panel -mx-4 px-4 py-8 sm:mx-0 sm:px-6 lg:p-0">
          <p className="sign" style={{ color: room.tint }}>{roomProjects(room).length} projects in this room</p>
          <h2 id={`${room.id}-title`} className="serif-display mt-3 max-w-[40rem] text-[clamp(2.5rem,5.2vw,4.4rem)] text-bone">{room.title}</h2>
          <p className="mt-4 max-w-[36rem] font-sans text-[clamp(1.05rem,1.4vw,1.25rem)] leading-snug text-bone/85">{room.line}</p>
          <div className="mt-14 space-y-16">{children}</div>
          {rest.length > 0 && (
            <div className="mt-16 border-t border-joint pt-6">
              <h3 className="fine text-stone">Also in this room</h3>
              <ul className="ui mt-3 grid gap-x-8 gap-y-1.5 sm:grid-cols-2 xl:grid-cols-3">
                {rest.map((x) => (
                  <li key={x.slug} className="flex items-baseline justify-between gap-3 border-b border-joint/60 py-1.5">
                    <ProjectLink slug={x.slug} />
                    <span className="fine whitespace-nowrap text-stone">{maturityLabel[x.maturity]}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Link to={room.archive} className="btn btn-line mt-8">See this room in the archive</Link>
        </div>
      </div>
    </section>
  );
}

function Feature({ slug, area, children, visual }: { slug: string; area?: string; children: ReactNode; visual?: ReactNode }) {
  const x = p(slug);
  return (
    <article aria-labelledby={`${slug}-t`} className={`grid gap-10 border-t border-joint pt-9 ${visual ? 'xl:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] xl:gap-14' : ''}`}>
      <div className="max-w-[40rem]">
        <p className="fine text-stone">{area ?? `${maturityLabel[x.maturity]}, ${x.period}`}</p>
        <h3 id={`${slug}-t`} className="serif-display mt-1 text-[clamp(1.9rem,3.2vw,2.6rem)] text-bone">{x.name}</h3>
        {children}
        <Link to={projectHref(slug)} className="btn btn-line mt-7">{x.caseStudy ? `Read the ${x.name} case study` : 'Open in the archive'}</Link>
      </div>
      {visual && <div className="self-center">{visual}</div>}
    </article>
  );
}

const Lede = ({ children }: { children: ReactNode }) => <p className="ui mt-4 text-[1.0625rem] text-bone/85">{children}</p>;

function Stats({ items }: { items: [string, string][] }) {
  return (
    <dl className="mt-7 flex flex-wrap gap-x-12 gap-y-5">
      {items.map(([v, l]) => (
        <div key={l} className="stat"><dt>{l}</dt><dd>{v}</dd></div>
      ))}
    </dl>
  );
}

function Shot({ src, alt, width, height, caption }: { src: string; alt: string; width: number; height: number; caption?: string }) {
  return (
    <figure className="border border-joint bg-char">
      <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" className="block h-auto w-full" />
      {caption && <figcaption className="fine px-3 py-2 text-stone">{caption}</figcaption>}
    </figure>
  );
}

const Panel = ({ children }: { children: ReactNode }) => <div className="border border-joint bg-char/85 p-5 sm:p-6">{children}</div>;

/* ------------------------------------------------------------ Machine learning */

export function MachineLearningRoom() {
  const aiba = caseStudyBySlug('ai-business-analytics')!.figures![0];
  return (
    <Room room={rooms[0]} featured={['cricxai', 'sensei-ai', 'ai-business-analytics', 'customer-churn-xai']}>
      <Feature slug="cricxai" visual={<Panel><Calibration /></Panel>}>
        <Lede>{p('cricxai').summary}</Lede>
        <Stats items={[['0.749', 'dismissal ROC-AUC'], ['0.867', 'runs, mean absolute error'], ['1.36M', 'deliveries']]} />
        <p className="ui mt-6 text-bone/90">Features are leakage-safe and validation is grouped by match. 71 pytest tests.</p>
      </Feature>
      <Feature slug="sensei-ai">
        <Lede>{p('sensei-ai').summary}</Lede>
        <p className="ui mt-3 text-bone/90">{cardFor('sensei-ai').detail}</p>
      </Feature>
      <Feature slug="ai-business-analytics" visual={<Shot {...aiba} />}>
        <Lede>{p('ai-business-analytics').summary}</Lede>
        <p className="ui mt-3 text-bone/90">{cardFor('ai-business-analytics').detail}</p>
      </Feature>
      <Feature slug="customer-churn-xai">
        <Lede>{p('customer-churn-xai').summary}</Lede>
        <p className="fine mt-3 text-stone">{p('customer-churn-xai').relation}</p>
      </Feature>
    </Room>
  );
}

/* ------------------------------------------------------------ Agentic AI */

const agentNotes: Record<string, string> = {
  toolforge: 'Fits a 102-endpoint spec into a 16,000-character prompt budget for free-tier models. 8 of 8 live PokéAPI calls passed.',
  voicedesk: 'Common requests take fast paths with no model call; each turn is measured against a 1.5-second round trip.',
  dociq: 'Hybrid BM25 and vector retrieval. Offline evaluation: 11 of 11 retrieval hits and 1 of 1 correct refusal.',
};

export function AgentsRoom() {
  const settle = caseStudyBySlug('settleai')!;
  const stages = settle.flow!.stages.map((s) => ({ label: s.label, kind: (s.kind ?? 'io') as StageKind }));
  return (
    <Room room={rooms[1]} featured={['settleai', 'naman', 'toolforge', 'dociq', 'voicedesk']}>
      <div className="max-w-[40rem]"><KindKey /></div>
      <Feature slug="settleai" area="PayPal AI Hackathon 2026 entry, in development" visual={<Shot {...settle.figures![0]} />}>
        <Lede>{settle.lede}</Lede>
        <p className="serif-display mt-6 text-2xl text-bone">No agent holds a tool that can move money.</p>
        <div className="mt-6"><Pipeline stages={stages} vertical /></div>
        <ul className="ui mt-6 grid gap-x-8 gap-y-2 text-bone/90 sm:grid-cols-2">
          <li>146 unit, integration and end-to-end tests.</li>
          <li>A 50-way concurrency test never overspends escrow.</li>
          <li>Receipts verify offline in 81 ms; one changed byte breaks them.</li>
          <li>In its evaluation: 0% false releases, every tampered proof caught.</li>
        </ul>
      </Feature>
      <Feature
        slug="naman"
        visual={
          <Panel>
            <p className="fine text-stone">One request through the agent graph</p>
            <div className="mt-5"><Pipeline stages={miniFlows.naman as { label: string; kind: StageKind }[]} /></div>
            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-joint pt-6">
              <div className="stat"><dt>outreach emails with an unsupported claim, before a code verifier</dt><dd>48 of 49</dd></div>
              <div className="stat"><dt>after the verifier</dt><dd className="!text-brass">0 of 21</dd></div>
            </dl>
          </Panel>
        }
      >
        <Lede>{p('naman').summary}</Lede>
        <p className="ui mt-4 text-bone/90">Approval is its own LangGraph node, so after a pause every tool runs exactly once. 164 pytest tests.</p>
      </Feature>
      <ul className="divide-y divide-joint border-y border-joint">
        {(['toolforge', 'dociq', 'voicedesk'] as const).map((slug) => (
          <li key={slug} className="grid gap-5 py-7 xl:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] xl:gap-14">
            <div className="max-w-[40rem]">
              <h3 className="serif-display text-[1.75rem] text-bone"><ProjectLink slug={slug} /></h3>
              <p className="ui mt-2 text-bone/80">{cardFor(slug).pitch}</p>
              <p className="ui mt-3 text-stone">{agentNotes[slug]}</p>
            </div>
            <div className="self-center"><Pipeline stages={miniFlows[slug] as { label: string; kind: StageKind }[]} /></div>
          </li>
        ))}
      </ul>
    </Room>
  );
}

/* ------------------------------------------------------------ Data */

// Counted facts from each project's record in projects.ts.
const dataLedger: { slug: string; value: string; label: string }[] = [
  { slug: 'zomato-sql', value: '9,551', label: 'restaurants from 15 countries, queried with joins, CTEs and window functions' },
  { slug: 'paytm-dashboard', value: '4', label: 'ETL stages lining up Paytm’s share price with competitors and market events, feeding 2 Power BI dashboards' },
  { slug: 'nifty50-dashboard', value: '50', label: 'NIFTY 50 constituents with fundamentals and price history, modelled in Power BI' },
  { slug: 'nifty50-live', value: '1 min', label: 'polling interval for prices and fundamentals of all 50 stocks' },
  { slug: 'bmw-sales', value: '2010-24', label: 'worldwide BMW sales explored, with a Power BI dashboard' },
  { slug: 'youtube-analysis', value: 'Every', label: 'video on a channel pulled through the YouTube Data API, with engagement metrics for Power BI' },
];

export function DataRoom() {
  return (
    <Room room={rooms[2]} featured={dataLedger.map((d) => d.slug)}>
      <table className="w-full max-w-[60rem] border-collapse">
        <caption className="fine pb-3 text-left text-stone">What each analysis covers, counted from its records.</caption>
        <thead className="sr-only">
          <tr><th scope="col">Project</th><th scope="col">Figure</th><th scope="col">What it measures</th></tr>
        </thead>
        <tbody>
          {dataLedger.map((d) => (
            <tr key={d.slug} className="border-t border-joint align-baseline">
              <th scope="row" className="ui w-[34%] py-4 pr-4 text-left font-medium"><ProjectLink slug={d.slug} /></th>
              <td className="serif-display w-[18%] py-4 pr-4 text-[1.75rem] text-bone">{d.value}</td>
              <td className="ui py-4 text-stone">{d.label}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Room>
  );
}

/* ------------------------------------------------------------ Software */

export function SoftwareRoom() {
  const movigo = p('movigo');
  return (
    <Room room={rooms[3]} featured={['movigo', 'routecore', 'refera', 'hyperlocal-marketplace', 'dairy-collection-manager']}>
      <Feature
        slug="movigo"
        area="Production platform, current employer"
        visual={
          <div className="grid max-w-[34rem] grid-cols-2 items-end gap-4 sm:gap-6">
            <img src="/images/movigo-retailer-vehicles.jpg" alt="Movigo retailer app home screen with a search bar, the coins wallet banner and six vehicle types to book." width={540} height={705} loading="lazy" decoding="async" className="block h-auto w-full border border-joint" />
            <img src="/images/movigo-retailer-coins.jpg" alt="Movigo retailer app coins wallet screen showing available coins, a weekly milestone and how coins are redeemed." width={540} height={1005} loading="lazy" decoding="async" className="block h-auto w-full border border-joint" />
          </div>
        }
      >
        <Lede>
          A delivery marketplace connecting retailers with two-, three- and four-wheeler drivers. I rebuilt it after an
          outsourced team delivered designs but no software, and I run the backend, both apps and the operations console.
        </Lede>
        <dl className="mt-7 grid grid-cols-2 gap-x-8 gap-y-5">
          {[['400+', 'API routes'], ['40', 'data models'], ['3', 'store listings'], ['1K+', 'installs per app on Google Play']].map(([v, l]) => (
            <div key={l} className="stat"><dt>{l}</dt><dd>{v}</dd></div>
          ))}
        </dl>
        <ul className="ui mt-7 space-y-2.5 border-l-2 border-brass pl-4 text-bone/90">
          <li>One conditional database write makes exactly one of several accepting drivers win a booking.</li>
          <li>Pricing, zones, surge and dispatch radius change from the console, with no app release.</li>
          <li>One road-distance matrix call per booking instead of one per driver.</li>
        </ul>
        <ul className="fine mt-5 flex flex-wrap gap-x-5 gap-y-1.5">
          {movigo.links.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-bone">
                <span className="link">{l.label}</span><ArrowUpRight size={14} aria-hidden /><span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </Feature>
      <Feature slug="routecore" visual={<Panel><Benchmark /></Panel>}>
        <Lede>{p('routecore').summary}</Lede>
        <p className="ui mt-4 text-bone/90">At 100,000 points the hand-built k-d tree is 408 times faster than brute force. 47 JUnit tests in 8 suites.</p>
      </Feature>
      <ul className="divide-y divide-joint border-y border-joint">
        {(['refera', 'hyperlocal-marketplace', 'dairy-collection-manager'] as const).map((slug) => (
          <li key={slug} className="max-w-[48rem] py-7">
            <h3 className="serif-display text-[1.75rem] text-bone"><ProjectLink slug={slug} /></h3>
            <p className="ui mt-2 text-bone/80">{cardFor(slug).pitch}</p>
            <p className="ui mt-2 text-stone">{cardFor(slug).detail}{p(slug).tests ? ` ${p(slug).tests}` : ''}</p>
          </li>
        ))}
      </ul>
    </Room>
  );
}
