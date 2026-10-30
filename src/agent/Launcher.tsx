import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { onOpenAssistant } from './bus';

// Mounts the assistant panel when something asks for it (header button, hero, a diagram). The panel's code loads
// on first open. On wide screens the page makes room for it instead of being covered.
const Assistant = lazy(() => import('./Assistant'));

export default function Launcher() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const opener = useRef<Element | null>(null);

  useEffect(() => onOpenAssistant((q) => {
    opener.current = document.activeElement;
    setQuestion(q);
    setOpen(true);
  }), []);

  useEffect(() => {
    document.documentElement.classList.toggle('assistant-open', open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  function close() {
    setOpen(false);
    (opener.current as HTMLElement | null)?.focus?.();
  }

  if (!open) return null;
  return (
    <Suspense fallback={null}>
      <Assistant key={question} initial={question} onClose={close} />
    </Suspense>
  );
}
