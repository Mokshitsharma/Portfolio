import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { onOpenAssistant, openAssistant } from './bus';
import { ASSISTANT } from './config';
import { projectBySlug } from '../data/projects';
import NamanOrb from '../components/NamanOrb';

// The assistant's way in, on every page: Naman's orb in the bottom-right corner. Tapping it offers questions for the
// section in view; choosing one (or "Ask anything") opens the side panel with that question. The panel's code
// loads on first open, and on wide screens the page makes room for it. When the site first opens, a note points
// at the orb so a visitor knows the assistant is there; it goes once they use it, close it, or after a while.
const Assistant = lazy(() => import('./Assistant'));

const SUGGEST: Record<string, string[]> = {
  about: ['What kind of engineer is Mokshit?', 'What are his main technical interests?', 'What is his experience beyond full-stack development?'],
  projects: ['Which projects demonstrate agentic AI?', 'What AI/ML projects has he built?', 'Which projects demonstrate data engineering?'],
  experience: ['What did he build at Movigo?', 'What were his responsibilities at Movigo?', 'What did he do in his internships?'],
  certifications: ['Which certifications has he completed?', 'What is his education?'],
  skills: ['What is his experience with RAG?', 'Which projects use LangGraph or MCP?', 'What experience does he have with voice AI?'],
  more: ['How does he approach building a product?', 'How does he learn new things?'],
  contact: ['How can I collaborate with him?', 'What kind of roles is he open to?'],
};

function useSection() {
  const { pathname } = useLocation();
  const [section, setSection] = useState('about');
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>('[data-section]')];
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setSection((e.target as HTMLElement).dataset.section!);
    }, { rootMargin: '-45% 0px -45% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return section;
}

const HINT_KEY = 'moksh-ai-hint-seen';

function useFirstHint() {
  const [hint, setHint] = useState(false);
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(HINT_KEY) === '1'; } catch { /* storage blocked: show it */ }
    if (seen) return;
    const show = window.setTimeout(() => {
      setHint(true);
      try { sessionStorage.setItem(HINT_KEY, '1'); } catch { /* fine */ }
    }, 900);
    const hide = window.setTimeout(() => setHint(false), 16000);
    return () => { window.clearTimeout(show); window.clearTimeout(hide); };
  }, []);
  const dismiss = () => {
    setHint(false);
    try { sessionStorage.setItem(HINT_KEY, '1'); } catch { /* fine */ }
  };
  return [hint, dismiss] as const;
}

export default function Launcher() {
  const [hint, dismissHint] = useFirstHint();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [question, setQuestion] = useState('');
  const opener = useRef<Element | null>(null);
  const { pathname } = useLocation();
  const section = useSection();

  useEffect(() => onOpenAssistant((q) => {
    opener.current = document.activeElement;
    setQuestion(q);
    setMenu(false);
    dismissHint();
    setOpen(true);
  }), []);

  useEffect(() => {
    document.documentElement.classList.toggle('assistant-open', open);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { if (open) close(); else setMenu(false); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => setMenu(false), [pathname]);

  function close() {
    setOpen(false);
    (opener.current as HTMLElement | null)?.focus?.();
  }

  const slug = pathname.match(/^\/projects\/([a-z0-9-]+)/)?.[1];
  const p = slug ? projectBySlug(slug) : undefined;
  const ideas = p
    ? [`Explain ${p.name}`, `How does the ${p.name} architecture work?`, 'What other projects belong to this category?']
    : SUGGEST[section] ?? SUGGEST.about;

  return (
    <>
      {!open && (
        <div className="orb-dock">
          {hint && !menu && (
            <div className="orb-hint" role="status">
              <p className="font-sans text-[1rem] font-semibold text-charcoal">Meet {ASSISTANT.name}.</p>
              <p className="ui mt-1 text-charcoal/80">Ask it anything about my projects, experience or skills. It answers from this site.</p>
              <div className="mt-3 flex gap-2">
                <button type="button" className="pill pill-solid !min-h-9 !px-4 !text-[0.875rem]" onClick={() => openAssistant()}>Ask a question</button>
                <button type="button" className="pill !min-h-9 !px-4 !text-[0.875rem]" onClick={dismissHint}>Not now</button>
              </div>
              <svg className="orb-hint-arrow" viewBox="0 0 60 60" aria-hidden><path d="M8 6c18 2 34 14 40 38" /><path d="M40 38l8 8 4-11" /></svg>
            </div>
          )}
          {menu && (
            <div className="orb-menu" role="dialog" aria-label={`${ASSISTANT.name}: suggested questions`}>
              <p className="fine text-slate">Ask {ASSISTANT.name} about this part of the site</p>
              <ul className="mt-2 space-y-1.5">
                {ideas.map((q) => (
                  <li key={q}><button type="button" className="orb-q" onClick={() => openAssistant(q)}>{q}</button></li>
                ))}
                <li><button type="button" className="orb-q font-semibold" onClick={() => openAssistant()}>Ask anything else</button></li>
              </ul>
            </div>
          )}
          <button type="button" className="orb-button" aria-expanded={menu} aria-label={menu ? 'Close suggested questions' : `${ASSISTANT.open}: suggested questions`} onClick={() => { dismissHint(); setMenu((m) => !m); }} data-hint={hint || undefined}>
            <NamanOrb mode={menu || hint ? 'happy' : 'waiting'} className="h-full w-full" />
          </button>
        </div>
      )}
      {open && (
        <Suspense fallback={null}>
          <Assistant key={question} initial={question} onClose={close} />
        </Suspense>
      )}
    </>
  );
}
