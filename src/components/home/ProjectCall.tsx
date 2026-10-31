import { Link } from 'react-router-dom';
import { profile } from '../../data/profile';
import { openAssistant } from '../../agent/bus';

// The closing card: an invitation to get in touch, rising over the timeline as in the reference. The full form
// lives in the Contact room.

export default function ProjectCall() {
  return (
    <section id="contact" data-section="contact" aria-labelledby="contact-title" className="call-section">
      <div className="shell">
        <div className="call-card">
          <p className="ui flex items-center gap-2 text-charcoal/80"><span className="call-dot" aria-hidden />{profile.availability}</p>
          <h2 id="contact-title" className="call-title">
            <span className="block">Got a project?</span>
            <span className="block text-charcoal/45">Let’s build it together.</span>
          </h2>
          <p className="mt-6 max-w-[34rem] text-[1.125rem] leading-[1.6] text-charcoal/80">
            A job, an internship, a freelance build or a collaboration. Tell me what you are working on and I reply by email.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/contact" className="pill pill-solid">Start a conversation</Link>
            <a href={`mailto:${profile.email}`} className="pill">Email me</a>
            <button type="button" className="pill" onClick={() => openAssistant('What kind of roles is he open to?')}>Ask my AI first</button>
          </div>
        </div>
      </div>
    </section>
  );
}
