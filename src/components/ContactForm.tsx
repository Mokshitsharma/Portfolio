import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { profile } from '../data/profile';
import { enquiryTypes } from '../data/home';
import { LIMITS, validateContact, type ContactErrors } from '../../api/_lib/validate';
import { STATIC_SITE } from '../site';

// The enquiry form. On Vercel it posts to /api/contact, which sends the email. A static build (the S3 copy) has
// no server, so the same form writes the email in the visitor's own mail app and says so; it never claims a
// message was sent when nothing could send it.

type Status = 'idle' | 'sending' | 'sent' | 'opened' | 'failed';
const empty = { name: '', email: '', organisation: '', type: '', message: '', website: '' };
type Field = 'name' | 'email' | 'organisation';

function mailto(d: typeof empty) {
  const subject = `Portfolio ${d.type ? `${d.type.toLowerCase()} ` : ''}enquiry from ${d.name.trim()}`;
  const body = [d.message.trim(), '', d.name.trim(), d.email.trim(), d.organisation.trim(), d.type && `Enquiry: ${d.type}`].filter((x) => x !== '' || true).filter(Boolean).join('\n');
  return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// `tone` matches the surface the form sits on.
export default function ContactForm({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark';
  const labelTone = dark ? 'text-charcoal/75' : 'text-graphite';
  const input = dark ? 'field-input-dark' : 'field-input';
  const errTone = dark ? 'text-[#ffb4a6]' : 'text-held';
  const [data, setData] = useState(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>('idle');

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData((d) => ({ ...d, [name]: value }));
    if (errors[name as keyof ContactErrors]) setErrors((x) => ({ ...x, [name]: undefined }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validateContact(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      e.currentTarget.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    if (STATIC_SITE) {
      window.location.href = mailto(data);
      setStatus('opened');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
      setData(empty);
    } catch {
      setStatus('failed');
    }
  };

  const field = (name: Field, label: string, type: string, autoComplete: string, max: number, required = true) => (
    <div>
      <label htmlFor={`contact-${name}`} className={`label block ${labelTone}`}>{label}{!required && <span className="font-normal"> (optional)</span>}</label>
      <input
        id={`contact-${name}`}
        name={name}
        type={type}
        autoComplete={autoComplete}
        maxLength={max}
        required={required}
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
    <form onSubmit={onSubmit} noValidate className="space-y-6" {...(STATIC_SITE ? {} : { action: '/api/contact', method: 'post' })}>
      <div className="grid gap-6 sm:grid-cols-2">
        {field('name', 'Your name', 'text', 'name', LIMITS.name)}
        {field('email', 'Your email', 'email', 'email', LIMITS.email)}
        {field('organisation', 'Organisation', 'text', 'organization', LIMITS.organisation, false)}
        <div>
          <label htmlFor="contact-type" className={`label block ${labelTone}`}>Enquiry type <span className="font-normal">(optional)</span></label>
          <select id="contact-type" name="type" value={data.type} onChange={onChange} className={`${input} mt-2`}>
            <option value="">Choose one</option>
            {enquiryTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" className={`label block ${labelTone}`}>The project or opportunity</label>
        <p id="contact-message-hint" className={`fine mt-1 ${dark ? 'text-charcoal/60' : 'text-slate'}`}>The role or project, the team, and what you would want me to work on.</p>
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
        <button type="submit" disabled={status === 'sending'} className={`btn ${dark ? 'bg-brass text-ivory hover:bg-charcoal' : 'btn-ink'} disabled:opacity-70`}>
          {status === 'sending' ? <><Loader2 size={18} className="animate-spin motion-reduce:animate-none" aria-hidden /> Sending</> : STATIC_SITE ? 'Write the email' : 'Send message'}
        </button>
        <p role="status" className="ui">
          {status === 'sent' && <span className={dark ? 'text-[#9be3c4]' : 'text-clear'}>Message sent. I reply to the email address you gave.</span>}
          {status === 'opened' && (
            <span className={dark ? 'text-charcoal/85' : 'text-charcoal'}>
              Your email app should now show the message; press send there. If nothing opened, write to{' '}
              <a className="link" href={`mailto:${profile.email}`}>{profile.email}</a>.
            </span>
          )}
          {status === 'failed' && (
            <span className={errTone}>
              The message did not send. Email me at <a className="link" href={`mailto:${profile.email}`}>{profile.email}</a> instead.
            </span>
          )}
        </p>
      </div>
      {STATIC_SITE && <p className={`fine ${dark ? 'text-charcoal/60' : 'text-slate'}`}>This copy of the site has no server, so the form opens your email app with the message filled in.</p>}
    </form>
  );
}
