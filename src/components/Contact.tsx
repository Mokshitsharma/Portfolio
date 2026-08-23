import React, { useState } from 'react';
import { Mail, Send, Github, Linkedin, MapPin, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    <section id="contact" className="py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6">Let's <span className="text-gradient">Connect</span></h2>
              <p className="text-[var(--text-secondary)] mb-12 text-lg">
                I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
              </p>

              <div className="space-y-8">
                <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-slate-950 transition-all">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-widest mb-1">Email Me</p>
                    <a href="mailto:sharman48520@gmail.com" className="text-lg font-medium hover:text-accent transition-colors text-[var(--text-primary)]">sharman48520@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-slate-950 transition-all">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-widest mb-1">Location</p>
                    <p className="text-lg font-medium text-[var(--text-primary)]">Indore, Madhya Pradesh, India</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <a href="https://github.com/Mokshitsharma" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-secondary)] hover:text-accent hover:border-accent/50 transition-all">
                    <Github size={24} />
                  </a>
                  <a href="https://www.linkedin.com/in/mokshit-sharma-75b5ab305/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-secondary)] hover:text-accent hover:border-accent/50 transition-all">
                    <Linkedin size={24} />
                  </a>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 md:p-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="contact-name" className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-widest ml-1">Name</label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:border-accent/50 focus:outline-none transition-all placeholder:text-[var(--text-secondary)]/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact-email" className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-widest ml-1">Email</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:border-accent/50 focus:outline-none transition-all placeholder:text-[var(--text-secondary)]/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-message" className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-widest ml-1">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    placeholder="Tell me about your project..."
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:border-accent/50 focus:outline-none transition-all resize-none placeholder:text-[var(--text-secondary)]/50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="glow-button w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>Sending <Loader2 size={18} className="animate-spin" /></>
                  ) : (
                    <>Send Message <Send size={18} /></>
                  )}
                </button>
                {status === 'success' && (
                  <p className="flex items-center gap-2 text-emerald-400 text-sm">
                    <CheckCircle2 size={16} /> Message sent — I'll get back to you soon.
                  </p>
                )}
                {status === 'error' && (
                  <p className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle size={16} /> Something went wrong. Please email me directly instead.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
