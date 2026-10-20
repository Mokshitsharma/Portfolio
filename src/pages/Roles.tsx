import { rolePages } from '../data/rolePages';
import { PageHeader } from '../components/ui';
import { RoleBoard } from '../components/records';

// The wall of role displays: one board per role, each opening its own page with five projects and a résumé.

export default function Roles() {
  return (
    <>
      <PageHeader title="Roles" sign="The noticeboard" line="route">
        <p>One page for each kind of role I apply for: the fit in two sentences, five projects, the relevant experience and the résumé for that role.</p>
      </PageHeader>
      <div className="shell py-16 md:py-20">
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {rolePages.map((r) => <li key={r.slug}><RoleBoard slug={r.slug} /></li>)}
        </ul>
      </div>
    </>
  );
}
