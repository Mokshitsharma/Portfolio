import { Link } from 'react-router-dom';
import { credentials, inProgress } from '../data/profile';
import { plaques } from '../data/achievements';
import { PageHeader } from '../components/ui';
import { CredentialWall, EducationFrame, PlaqueWall } from '../components/records';

// The display wall: certificates in frames, the degree, and plaques for things done. Every object opens its
// record; nothing here is a placing or a rank that has not been awarded.

export default function Achievements() {
  return (
    <>
      <PageHeader title="Achievements" sign="The display wall" line="signal">
        <p>
          Certificates, the degree in progress, and work that reached the public: apps on two stores, a hackathon entry
          and Kaggle Playground entries. Select any frame or plaque to see its record.
        </p>
      </PageHeader>

      <section aria-labelledby="plaques" className="shell py-16 md:py-20">
        <h2 id="plaques" className="headline text-[clamp(2rem,4vw,3rem)]">Plaques</h2>
        <p className="lede mt-3 max-w-2xl text-slate">{inProgress[0].title} is under way; the others are complete.</p>
        <div className="mt-10"><PlaqueWall items={plaques} /></div>
      </section>

      <section aria-labelledby="frames" className="border-y border-seam bg-limestone">
        <div className="shell py-16 md:py-20">
          <h2 id="frames" className="headline text-[clamp(2rem,4vw,3rem)]">Framed credentials</h2>
          <p className="lede mt-3 max-w-2xl text-slate">
            Frames with a certificate on record open the issuer’s copy. The rest show the credential as it was confirmed.
          </p>
          <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-start">
            <EducationFrame />
            <CredentialWall items={credentials} className="xl:!grid-cols-2" />
          </div>
        </div>
      </section>

      <section className="shell py-16">
        <p className="ui text-slate">
          The work behind these is in the <Link to="/projects" className="link text-charcoal">project archive</Link> and
          the <Link to="/experience" className="link text-charcoal">experience timeline</Link>.
        </p>
      </section>
    </>
  );
}
