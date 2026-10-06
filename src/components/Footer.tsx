import { profile } from '../data/portfolio';

export default function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="wrap flex flex-col gap-4 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>
          {profile.name}, {profile.role.toLowerCase()} in {profile.location.split(',')[0]}.
        </p>
        <p className="flex gap-6">
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-paper">GitHub</a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-paper">LinkedIn</a>
          <a href={`mailto:${profile.email}`} className="hover:text-paper">Email</a>
        </p>
      </div>
    </footer>
  );
}
