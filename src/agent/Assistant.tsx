import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUp, Play, X } from 'lucide-react';
import { ASSISTANT } from './config';
import { getContext, queueDiagram, showDiagram, type DiagramCommand } from './bus';
import { projectBySlug } from '../data/projects';
import { architectureFor } from '../data/architecture';

// The assistant panel. Loaded on first open. Answers stream from /api/chat; an answer can end with a diagram
// command, which plays a walkthrough or selects a component on the project's architecture sheet.

type Msg = { role: 'user' | 'assistant'; content: string; diagram?: DiagramCommand; failed?: boolean };

const DIRECTIVE = /\[\[diagram:([a-z0-9-]+):(?:node=([a-z0-9-]+)|([a-z0-9-]+))\]\]/;

function parseDirective(text: string): { text: string; diagram?: DiagramCommand } {
  const m = text.match(DIRECTIVE);
  const clean = text.replace(/\[\[diagram:[^\]]*\]\]/g, '').replace(/\[\[[^\]]*$/, '').trimEnd();
  if (!m) return { text: clean };
  const arch = architectureFor(m[1]);
  if (!arch) return { text: clean };
  const node = m[2] && arch.nodes.some((n) => n.id === m[2]) ? m[2] : undefined;
  const walkthrough = m[3] && arch.walkthroughs.some((w) => w.id === m[3]) ? m[3] : undefined;
  return { text: clean, diagram: node || walkthrough ? { slug: m[1], node, walkthrough } : undefined };
}

// A small Markdown subset: paragraphs, "- " lists, **bold** and [links](/path).
function Rich({ text, onNavigate }: { text: string; onNavigate: () => void }) {
  const inline = (s: string, key: string): ReactNode[] =>
    s.split(/(\[[^\]]+\]\([^)\s]+\)|\*\*[^*]+\*\*)/g).map((part, i) => {
      const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      if (link) {
        const [, label, href] = link;
        if (href.startsWith('/')) return <Link key={`${key}${i}`} to={href} onClick={onNavigate} className="link font-semibold text-brass">{label}</Link>;
        if (/^https?:\/\//.test(href)) return <a key={`${key}${i}`} href={href} target="_blank" rel="noopener noreferrer" className="link font-semibold text-brass">{label}</a>;
        return label;
      }
      if (part.startsWith('**') && part.endsWith('**')) return <strong key={`${key}${i}`}>{part.slice(2, -2)}</strong>;
      return part;
    });
  return (
    <>
      {text.split(/\n{2,}/).map((block, b) => {
        const rows = block.split('\n');
        if (rows.every((r) => /^\s*[-*] /.test(r))) {
          return <ul key={b} className="mt-2 space-y-1.5 first:mt-0">{rows.map((r, i) => <li key={i} className="flex gap-2"><span className="mt-[0.55rem] h-1 w-1 shrink-0 bg-charcoal" aria-hidden /><span>{inline(r.replace(/^\s*[-*] /, ''), `${b}-${i}-`)}</span></li>)}</ul>;
        }
        return <p key={b} className="mt-2 first:mt-0">{rows.map((r, i) => <span key={i}>{i > 0 && <br />}{inline(r, `${b}-${i}-`)}</span>)}</p>;
      })}
    </>
  );
}

function suggestions(slug: string | undefined, node: string | undefined): string[] {
  const p = slug ? projectBySlug(slug) : undefined;
  const arch = slug ? architectureFor(slug) : undefined;
  if (p && arch) {
    const n = node ? arch.nodes.find((x) => x.id === node) : undefined;
    return [
      n ? `What does the ${n.label} component do, and why?` : `Show me how ${p.name} handles a request`,
      `What was Mokshit's role in ${p.name}?`,
      `How is ${p.name} tested?`,
    ];
  }
  if (p) return [`Explain ${p.name} briefly`, `What decisions shaped ${p.name}?`, 'Which related projects should I look at?'];
  return ['Which projects show agentic AI?', 'What does Mokshit do at Movigo?', 'Show me how Naman processes a request', 'Which projects use Docker or cloud deployment?'];
}

export default function Assistant({ initial, onClose }: { initial: string; onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const asked = useRef(false);

  const pageSlug = pathname.match(/^\/projects\/([a-z0-9-]+)/)?.[1];
  const ctx = getContext();
  const slug = ctx.slug ?? pageSlug;
  const mobile = () => window.matchMedia('(max-width: 767px)').matches;

  useEffect(() => { input.current?.focus(); }, []);
  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight }); }, [msgs]);
  useEffect(() => {
    if (initial && !asked.current) { asked.current = true; void send(initial); }
  }, [initial]); // eslint-disable-line react-hooks/exhaustive-deps

  function runDiagram(cmd: DiagramCommand) {
    if (window.location.pathname === `/projects/${cmd.slug}`) showDiagram(cmd);
    else { queueDiagram(cmd); navigate(`/projects/${cmd.slug}`); }
    if (mobile()) onClose(); // the diagram needs the whole screen on a phone
  }

  async function send(question: string) {
    const q = question.trim();
    if (!q || busy) return;
    const history: Msg[] = [...msgs, { role: 'user', content: q }];
    setMsgs([...history, { role: 'assistant', content: '' }]);
    setDraft('');
    setBusy(true);
    const c = getContext();
    let text = '';
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.slice(-8).map(({ role, content }) => ({ role, content })),
          context: { path: window.location.pathname, slug: c.slug ?? pageSlug, node: c.node, walkthrough: c.walkthrough },
        }),
      });
      if (!res.body) throw new Error('no body');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        const shown = parseDirective(text).text;
        setMsgs((m) => [...m.slice(0, -1), { role: 'assistant', content: shown }]);
      }
      const final = parseDirective(text);
      setMsgs((m) => [...m.slice(0, -1), { role: 'assistant', content: final.text, diagram: final.diagram, failed: !res.ok }]);
      if (final.diagram && res.ok) runDiagram(final.diagram);
    } catch {
      setMsgs((m) => [...m.slice(0, -1), { role: 'assistant', content: 'The assistant could not be reached. Check your connection and ask again.', failed: true }]);
    } finally {
      setBusy(false);
      input.current?.focus();
    }
  }

  const onSubmit = (e: FormEvent) => { e.preventDefault(); void send(draft); };
  const closeOnPhone = () => { if (mobile()) onClose(); };
  const ideas = suggestions(slug, ctx.node);

  return (
    <aside aria-label={ASSISTANT.name} className="assistant fixed inset-0 z-[70] flex flex-col bg-ivory md:inset-auto md:bottom-0 md:right-0 md:top-16 md:w-[25rem] md:border-l md:border-charcoal">
      <div className="flex items-center justify-between gap-4 border-b border-seam px-4 py-3">
        <div>
          <p className="font-sans text-[1rem] font-semibold text-charcoal">{ASSISTANT.name}</p>
          <p className="fine text-slate">Answers from this site’s records only</p>
        </div>
        <button type="button" onClick={onClose} className="detail-close" aria-label="Close the assistant"><X size={20} aria-hidden /></button>
      </div>

      <div ref={log} className="flex-1 overflow-y-auto px-4 py-4 font-sans text-[0.9375rem] leading-[1.55]" aria-live="polite">
        <p className="text-charcoal">
          Ask about Mokshit’s projects, how they are built, his experience or his skills. On a project with an architecture
          sheet, I can play its flow for you.
        </p>
        {msgs.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'ml-8 mt-4 border border-seam bg-white px-3 py-2' : 'mt-4'}>
            {m.role === 'user' ? (
              <p>{m.content}</p>
            ) : m.content ? (
              <div className={m.failed ? 'text-held' : 'text-charcoal'}><Rich text={m.content} onNavigate={closeOnPhone} /></div>
            ) : (
              <p className="text-slate">Reading the records…</p>
            )}
            {m.diagram && (
              <button type="button" className="arch-btn mt-3" onClick={() => runDiagram(m.diagram!)}>
                <Play size={15} aria-hidden />{m.diagram.walkthrough ? 'Play it on the diagram' : 'Show it on the diagram'}
              </button>
            )}
          </div>
        ))}
        {!busy && (
          <ul className="mt-5 flex flex-col items-start gap-2" aria-label="Suggested questions">
            {ideas.map((s) => (
              <li key={s}><button type="button" onClick={() => void send(s)} className="border border-seam bg-white px-3 py-2 text-left text-[0.875rem] text-charcoal hover:border-charcoal">{s}</button></li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={onSubmit} className="flex items-end gap-2 border-t border-seam p-3">
        <label htmlFor="assistant-q" className="sr-only">Your question</label>
        <textarea
          id="assistant-q"
          ref={input}
          rows={2}
          maxLength={600}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void send(draft); } }}
          placeholder="Ask about a project, a skill or a role"
          className="field-input min-h-11 flex-1 resize-none !py-2 text-[0.9375rem]"
        />
        <button type="submit" disabled={busy || !draft.trim()} className="btn btn-brass !min-h-11 !px-3 disabled:opacity-40" aria-label="Send">
          <ArrowUp size={18} aria-hidden />
        </button>
      </form>
    </aside>
  );
}
