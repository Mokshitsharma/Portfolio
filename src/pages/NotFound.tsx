import { Link } from 'react-router-dom';
import { PageHeader } from '../components/ui';

export default function NotFound() {
  return (
    <>
      <PageHeader title="Wrong door" sign="No room here" line="route">
        <p>This page does not exist. The internships page is now part of Experience.</p>
      </PageHeader>
      <div className="shell py-16">
        <ul className="flex flex-wrap gap-3">
          <li><Link to="/" className="btn-ink btn">Home</Link></li>
          <li><Link to="/projects" className="btn-ghost btn">Projects</Link></li>
          <li><Link to="/experience" className="btn-ghost btn">Experience</Link></li>
        </ul>
      </div>
    </>
  );
}
