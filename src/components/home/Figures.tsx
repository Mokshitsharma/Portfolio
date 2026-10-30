import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { pet } from '../../data/profile';
import { projects } from '../../data/projects';
import { fetchProject } from '../../agent/bus';

// Mario beside the project map: asked to fetch, he hops and the map opens on one of the case studies.

const fetchable = projects.filter((p) => p.caseStudy && !p.archiveOnly);
const still = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function MarioFetch() {
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
      <button type="button" onClick={bring} className="fig-pet shrink-0" aria-label={`Ask ${pet.name} to fetch a project`}>
        <img key={hop} src={pet.src} alt="" width={pet.width} height={pet.height} loading="lazy" decoding="async" className={`h-28 w-auto ${hop ? 'is-hopping' : ''}`} />
      </button>
      <div className="pb-1">
        <button type="button" onClick={bring} className="btn btn-line !min-h-10">{brought ? 'Fetch another' : `${pet.name}, fetch me one`}</button>
        <p className="ui mt-2 min-h-[1.5rem] text-charcoal" aria-live="polite">
          {p && <>Fetched <Link to={`/projects/${p.slug}`} className="link font-semibold text-brass">{p.name}</Link>; marked on the map.</>}
        </p>
      </div>
    </div>
  );
}
