import { Link } from 'react-router-dom';
import { credentials, education, inProgress, profile } from '../data/profile';
import { PageHeader } from '../components/ui';

export default function About() {
  return (
    <>
      <PageHeader title="About" sign="The entrance hall" line="signal">
        <p>{profile.currentRole} at Movigo, in the fourth year of an integrated degree in AI and data science, based in Indore.</p>
      </PageHeader>

      <div className="shell grid gap-16 py-16 md:py-24 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="measure space-y-6 text-[1.25rem] leading-[1.75]">
          <p>
            Since April 2026 I have been the only engineer at Movigo, a delivery marketplace in Indore. When I joined, an
            outsourced team had produced designs but no working software. I rebuilt the product from scratch: the Node.js
            backend, the Flutter apps for drivers and retailers, the operations console and the hosting. I started as an app
            developer and have been Founding Engineer and Tech Lead since June.
          </p>
          <p>
            That job is where most of my engineering judgement comes from. Two drivers accept the same booking at the same
            moment; a payment callback arrives twice; a cheap phone kills the app that is supposed to ring.
            Each of those is now a specific piece of code, described in the{' '}
            <Link to="/projects/movigo" className="link">Movigo case study</Link>.
          </p>
        </div>
        <aside className="self-start border border-joint border-t-[3px] border-t-brass bg-char p-8 text-bone lg:mt-2">
          <p className="label text-brass">The rule behind the agent work</p>
          <p className="headline mt-4 text-[clamp(1.75rem,3vw,2.5rem)]">
            A model may propose. Code I can test decides anything that moves money, changes data or reaches a person.
          </p>
          <p className="ui mt-5 text-stone">
            See it in <Link to="/projects/settleai" className="link text-bone">SettleAI</Link>,{' '}
            <Link to="/projects/toolforge" className="link text-bone">ToolForge</Link> and{' '}
            <Link to="/projects/naman" className="link text-bone">Naman</Link>.
          </p>
        </aside>
        <div className="measure space-y-6 text-[1.25rem] leading-[1.75] lg:col-start-1">
          <p>
            Alongside that job I build agent systems, and a person approves the risky steps in every one of them. Before
            Movigo I did internships in data science, analytics, AI and software development, mostly short programmes, and a
            long list of machine learning, BI and tooling projects. They are all in the{' '}
            <Link to="/projects" className="link">project archive</Link>, labelled by how far each one got. Coursework
            from the degree, such as the semester VII machine learning notebooks and Python exercises, is not listed there.
          </p>
        </div>
      </div>

      <section aria-labelledby="edu" className="border-t border-joint bg-char">
        <div className="shell grid gap-14 py-16 md:py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <p className="label text-stone">Education</p>
            <h2 id="edu" className="headline mt-3 text-[clamp(2rem,3.5vw,2.75rem)]">{education.degree}</h2>
            <p className="mt-3">{education.school}</p>
            <p className="ui mt-1 text-stone">{education.years}. {education.grade}.</p>
            <div className="mt-10 border-l-2 border-brass pl-5">
              <p className="label text-stone">In progress</p>
              {inProgress.map((i) => (
                <p key={i.title} className="ui mt-2"><span className="font-semibold">{i.title}</span>. {i.detail}</p>
              ))}
            </div>
          </div>
          <div>
            <h2 className="label text-stone">Certificates</h2>
            <ul className="mt-3 border-t border-stone/60">
              {credentials.map((c) => (
                <li key={c.title} className="grid grid-cols-[1fr_auto] gap-x-4 border-b border-joint py-4">
                  <span>
                    {c.href ? (
                      <a href={c.href} target="_blank" rel="noopener noreferrer" className="link font-sans text-lg font-semibold">
                        {c.title}<span className="sr-only"> (certificate, opens in a new tab)</span>
                      </a>
                    ) : (
                      <span className="font-sans text-lg font-semibold">{c.title}</span>
                    )}
                    <span className="ui block text-stone">{c.issuer}</span>
                  </span>
                  {c.date && <span className="label whitespace-nowrap text-stone">{c.date}</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
