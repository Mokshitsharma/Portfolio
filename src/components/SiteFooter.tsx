import { Link } from 'react-router-dom';
import { profile } from '../data/profile';
import { nav } from './Header';

export default function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-joint bg-char text-bone">
      <div className="flex" aria-hidden>
        <span className="rail flex-1 bg-route" />
        <span className="rail flex-1 bg-signal" />
        <span className="rail flex-1 bg-field" />
      </div>
      <div className="shell grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="label text-stone">Write to me</p>
          <a href={`mailto:${profile.email}`} className="headline mt-3 inline-block break-words text-[clamp(1.5rem,3.4vw,2.6rem)] text-bone no-underline hover:text-brass">
            {profile.email}
          </a>
          <p className="ui mt-5 text-stone">
            {profile.currentRole}, {profile.currentOrgShort}. {profile.location}.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-10 gap-y-2 self-end">
          <ul className="ui space-y-2">
            {nav.map((n) => (
              <li key={n.to}><Link to={n.to} className="link text-bone/85 hover:text-bone">{n.label}</Link></li>
            ))}
          </ul>
          <ul className="ui space-y-2">
            <li><a href={profile.github} target="_blank" rel="noopener noreferrer" className="link text-bone/85 hover:text-bone">GitHub</a></li>
            <li><a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="link text-bone/85 hover:text-bone">LinkedIn</a></li>
            <li><a href={profile.resume} target="_blank" rel="noopener noreferrer" className="link text-bone/85 hover:text-bone">Résumé</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
