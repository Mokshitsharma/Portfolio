import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';

// The detail view every interactive object in the house opens: a framed credential, a project file, a plaque, a
// domain or role display. A native modal dialog, so the page behind is inert, Escape closes it and focus stays
// inside; on close, focus returns to the object that opened it.

export function useDetail<T>() {
  const [item, setItem] = useState<T | null>(null);
  const open = useCallback((x: T) => setItem(x), []);
  const close = useCallback(() => setItem(null), []);
  return { item, open, close };
}

export function Detail({ open, onClose, title, sign, tint, children }: { open: boolean; onClose: () => void; title: string; sign?: string; tint?: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const id = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      opener.current = document.activeElement as HTMLElement | null;
      d.showModal();
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={`${id}-t`}
      className="detail"
      style={tint ? { ['--tint' as string]: tint } : undefined}
      onClose={() => {
        onClose();
        opener.current?.focus();
      }}
      // A click on the dialog element itself is a click on the backdrop around the panel.
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
    >
      {open && (
        <div className="detail-panel">
          <div className="flex items-start justify-between gap-6">
            <div>
              {sign && <p className="sign" style={{ color: tint ?? 'var(--color-brass)' }}>{sign}</p>}
              <h2 id={`${id}-t`} className="headline mt-2 text-[clamp(1.9rem,3.6vw,2.6rem)] text-charcoal">{title}</h2>
            </div>
            <button type="button" onClick={() => ref.current?.close()} className="detail-close" autoFocus>
              <X size={20} aria-hidden />
              <span className="sr-only">Close</span>
            </button>
          </div>
          <div className="mt-6">{children}</div>
        </div>
      )}
    </dialog>
  );
}
