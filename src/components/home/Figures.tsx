import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { companion } from '../../data/profile';
import NamanOrb from '../NamanOrb';
import { projects } from '../../data/projects';
import { fetchProject } from '../../agent/bus';

// Naman beside the project map: asked to fetch, he hops happily and the map opens on one of the case studies.

const fetchable = projects.filter((p) => p.caseStudy && !p.archiveOnly);
const still = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function NamanFetch() {
  const [hop, setHop] = useState(0);
  const [brought, setBrought] = useState<string | null>(null);
  const order = useRef<string[]>([]);

  // A shuffled order, so he rarely brings the same project twice running.
  const bring = () => {
    if (!order.current.length) order.current = fetchable.map((p) => p.slug).sort(() => Math.random() - 0.5);
    const slug = order.current.pop()!;
    setHop((h) => h + 1);
    window.setTimeout(() => { setBrought(slug); fetchProject(slug); }, still() ? 0 : 650);
  };
  const p = brought ? projects.find((x) => x.slug === brought) : null;

  return (
    <div className="flex items-end gap-4">
      <button type="button" onClick={bring} className="fig-pet shrink-0" aria-label={`Ask ${companion.name} to fetch a project`}>
        <span key={hop} className={`block h-28 ${hop ? 'is-hopping' : ''}`}><NamanOrb mode={brought ? 'happy' : 'waiting'} className="h-full w-auto" /></span>
      </button>
      <div className="pb-1">
        <button type="button" onClick={bring} className="btn btn-line !min-h-10">{brought ? 'Fetch another' : `${companion.name}, fetch me one`}</button>
        <p className="ui mt-2 min-h-[1.5rem] text-charcoal" aria-live="polite">
          {p && <>Fetched <Link to={`/projects/${p.slug}`} className="link font-semibold text-brass">{p.name}</Link>; marked on the map.</>}
        </p>
      </div>
    </div>
  );
}
