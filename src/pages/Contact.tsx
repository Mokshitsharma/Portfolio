import { Github, Linkedin } from 'lucide-react';
import { profile } from '../data/profile';
import ContactForm from '../components/ContactForm';

export default function Contact() {
  return (
    <section aria-labelledby="contact-title" className="grid-texture min-h-screen pt-28 text-bone md:pt-36">
      <div className="shell grid gap-14 pb-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
          <p className="sign text-brass">The courtyard</p>
          <h1 id="contact-title" className="display mt-4 text-[clamp(3.5rem,8vw,7rem)]">Write to me</h1>
          <p className="lede mt-6 font-sans text-stone">Email is the fastest way to reach me. The form sends the same email.</p>
          <a href={`mailto:${profile.email}`} className="headline mt-10 inline-block break-words text-[clamp(1.35rem,2.4vw,1.9rem)] text-brass no-underline hover:underline">
            {profile.email}
          </a>
          <ul className="ui mt-8 space-y-3">
            <li><a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-bone"><Linkedin size={18} aria-hidden /><span className="link">LinkedIn</span><span className="sr-only"> (opens in a new tab)</span></a></li>
            <li><a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-bone"><Github size={18} aria-hidden /><span className="link">GitHub</span><span className="sr-only"> (opens in a new tab)</span></a></li>
            <li className="label pt-2 text-stone">{profile.location}</li>
          </ul>
        </div>
        <div className="self-start border border-joint bg-char p-6 text-bone md:p-10">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
