import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { profile } from '../data/profile';
import { LIMITS, validateContact, type ContactErrors } from '../../api/_lib/validate';

type Status = 'idle' | 'sending' | 'sent' | 'failed';
const empty = { name: '', email: '', message: '', website: '' };

// `tone` matches the surface the form sits on: light on the contact page, dark on the home page.
export default function ContactForm({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark';
  const labelTone = dark ? 'text-haze' : 'text-graphite';
  const input = dark ? 'field-input-dark' : 'field-input';
  const errTone = dark ? 'text-held-light' : 'text-held';
  const [data, setData] = useState(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>('idle');

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((d) => ({ ...d, [name]: value }));
    if (errors[name as keyof ContactErrors]) setErrors((x) => ({ ...x, [name]: undefined }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validateContact(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const firstBad = e.currentTarget.querySelector<HTMLElement>('[aria-invalid="true"]');
      firstBad?.focus();
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
      setData(empty);
    } catch {
      setStatus('failed');
    }
  };

  const field = (name: 'name' | 'email', label: string, type: string, autoComplete: string, max: number) => (
    <div>
      <label htmlFor={`contact-${name}`} className={`label block ${labelTone}`}>{label}</label>
      <input
        id={`contact-${name}`}
        name={name}
        type={type}
        autoComplete={autoComplete}
        maxLength={max}
        required
        value={data[name]}
        onChange={onChange}
        aria-invalid={errors[name] ? true : undefined}
        aria-describedby={errors[name] ? `contact-${name}-error` : undefined}
        className={`${input} mt-2`}
      />
      {errors[name] && <p id={`contact-${name}-error`} className={`ui mt-1.5 ${errTone}`}>{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6" action="/api/contact" method="post">
      <div className="grid gap-6 sm:grid-cols-2">
        {field('name', 'Your name', 'text', 'name', LIMITS.name)}
        {field('email', 'Your email', 'email', 'email', LIMITS.email)}
      </div>
      <div>
        <label htmlFor="contact-message" className={`label block ${labelTone}`}>Message</label>
        <p id="contact-message-hint" className={`fine mt-1 ${dark ? 'text-haze' : ''}`}>The role or project, the team, and what you would want me to work on.</p>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          maxLength={LIMITS.message}
          value={data.message}
          onChange={onChange}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? 'contact-message-hint contact-message-error' : 'contact-message-hint'}
          className={`${input} mt-2 resize-y`}
        />
        {errors.message && <p id="contact-message-error" className={`ui mt-1.5 ${errTone}`}>{errors.message}</p>}
      </div>
      {/* Left empty by people; bots that fill every field are dropped by the server. */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={data.website} onChange={onChange} />
      </div>
      <div className="flex flex-wrap items-center gap-5">
        <button type="submit" disabled={status === 'sending'} className={`${dark ? 'btn-sodium' : 'btn-ink'} btn disabled:opacity-70`}>
          {status === 'sending' ? (
            <>
              <Loader2 size={18} className="animate-spin motion-reduce:animate-none" aria-hidden /> Sending
            </>
          ) : (
            'Send message'
          )}
        </button>
        <p role="status" className="ui">
          {status === 'sent' && <span className={dark ? 'text-field-light' : 'text-clear'}>Message sent. I reply to the email address you gave.</span>}
          {status === 'failed' && (
            <span className={errTone}>
              The message did not send. Email me at{' '}
              <a className="link" href={`mailto:${profile.email}`}>{profile.email}</a> instead.
            </span>
          )}
        </p>
      </div>
    </form>
  );
}
