import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Mail, Github, Linkedin, Download, Loader2 } from 'lucide-react';
import { profile } from '../data/portfolio';

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

const field =
  'w-full rounded-xl border border-line bg-plum px-4 py-3 text-paper placeholder:text-muted/60 focus:border-propose focus:outline-none';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section">
      <div className="wrap grid gap-14 lg:grid-cols-2">
        <div>
          <h2 className="section-title">Hiring for agents?</h2>
          <p className="lede">
            I’m looking for a full-time role building AI agents and LLM products, remote or in Indore. Email is the fastest way to reach me.
          </p>

          <ul className="mt-10 space-y-4 text-lg">
            <li>
              <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-3 text-link">
                <Mail size={20} aria-hidden /> {profile.email}
              </a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-link">
                <Linkedin size={20} aria-hidden /> LinkedIn
              </a>
            </li>
            <li>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-link">
                <Github size={20} aria-hidden /> GitHub
              </a>
            </li>
            <li>
              <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-link">
                <Download size={20} aria-hidden /> Résumé (PDF)
              </a>
            </li>
          </ul>
          <p className="mt-8 text-muted">{profile.location}</p>
        </div>

        <form className="space-y-5 rounded-2xl border border-line bg-plum-2 p-6 md:p-8" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm text-muted">Your name</span>
              <input name="name" type="text" required autoComplete="name" value={formData.name} onChange={handleChange} className={field} />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-muted">Your email</span>
              <input name="email" type="email" required autoComplete="email" value={formData.email} onChange={handleChange} className={field} />
            </label>
          </div>
          <label className="block">
            <span className="mb-2 block text-sm text-muted">Message</span>
            <textarea
              name="message"
              rows={5}
              required
              placeholder="The role, the team and what you’d want me to build"
              value={formData.message}
              onChange={handleChange}
              className={`${field} resize-none`}
            />
          </label>
          <button type="submit" disabled={status === 'loading'} className="btn-primary w-full justify-center disabled:opacity-60">
            {status === 'loading' ? (
              <>
                Sending <Loader2 size={18} className="animate-spin" aria-hidden />
              </>
            ) : (
              'Send message'
            )}
          </button>
          <p role="status" className="min-h-6 text-sm">
            {status === 'success' && <span className="text-pass">Message sent. I’ll reply to the email you gave.</span>}
            {status === 'error' && (
              <span className="text-deny">
                The message didn’t send. Email me at {profile.email} instead.
              </span>
            )}
          </p>
        </form>
      </div>
    </section>
  );
}
