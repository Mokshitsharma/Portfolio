import { Link } from 'react-router-dom';
import { profile } from '../data/profile';
import { nav } from './Header';

export default function SiteFooter() {
  return (
    <footer className="plate relative z-10">
      <div className="flex" aria-hidden>
        <span className="rail flex-1 bg-route" />
        <span className="rail flex-1 bg-signal" />
        <span className="rail flex-1 bg-field" />
      </div>
      <div className="shell grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="label text-mist">Write to me</p>
          <a href={`mailto:${profile.email}`} className="headline mt-3 inline-block break-all text-[clamp(1.75rem,4vw,3.25rem)] text-paper no-underline hover:text-route">
            {profile.email}
          </a>
          <p className="ui mt-5 text-mist">
            {profile.currentRole}, {profile.currentOrgShort}. {profile.location}.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-10 gap-y-2 self-end">
          <ul className="ui space-y-2">
            {nav.map((n) => (
              <li key={n.to}><Link to={n.to} className="link text-paper/85 hover:text-paper">{n.label}</Link></li>
            ))}
          </ul>
          <ul className="ui space-y-2">
            <li><a href={profile.github} target="_blank" rel="noopener noreferrer" className="link text-paper/85 hover:text-paper">GitHub</a></li>
            <li><a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="link text-paper/85 hover:text-paper">LinkedIn</a></li>
            <li><a href={profile.resume} target="_blank" rel="noopener noreferrer" className="link text-paper/85 hover:text-paper">Résumé</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
