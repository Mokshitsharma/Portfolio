import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { profile } from '../data/profile';

export const nav = [
  { to: '/projects', label: 'Projects' },
  { to: '/experience', label: 'Experience' },
  { to: '/skills', label: 'Skills' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  // Close on navigation.
  useEffect(() => setOpen(false), [pathname]);

  // Over the home page's opening scene the bar is transparent; it gains its background once the page scrolls.
  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const home = pathname === '/';
  const clear = home && atTop && !open;

  // Escape closes the menu and returns focus to the toggle; opening moves focus to the first link.
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>('a')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `label relative py-2 no-underline transition-colors hover:text-paper ${isActive ? `text-paper after:absolute after:inset-x-0 after:-bottom-[1px] after:h-[3px] ${home ? 'after:bg-brass' : 'after:bg-sodium'}` : 'text-mist'}`;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b text-paper transition-colors duration-300 ${clear ? 'border-transparent bg-transparent' : home ? 'border-joint bg-soot/90 backdrop-blur-sm' : 'border-night-rule bg-night/95 backdrop-blur-sm'}`}>
      <div className="shell flex h-16 items-center justify-between gap-6">
        <Link to="/" className="group flex items-center gap-3 no-underline">
          <span className={`inline-block h-3 w-3 transition-transform group-hover:rotate-45 ${home ? 'bg-brass' : 'bg-sodium'}`} aria-hidden />
          <span className="font-sans text-lg font-bold tracking-tight" style={{ fontStretch: '78%' }}>{profile.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {nav.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to} className={linkClass}>
                  {n.label}
                </NavLink>
              </li>
            ))}
            <li>
              <a href={profile.resume} target="_blank" rel="noopener noreferrer" className={`btn !min-h-9 !px-4 ${home ? 'btn-brass' : 'btn-sodium'}`}>
                Résumé<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </nav>

        <button
          ref={button}
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>

      <div id="mobile-menu" ref={panel} hidden={!open} className="border-t border-night-rule bg-night md:hidden">
        <nav aria-label="Main" className="shell py-4">
          <ul>
            {nav.map((n) => (
              <li key={n.to} className="border-b border-night-rule last:border-0">
                <NavLink to={n.to} className={({ isActive }) => `headline block py-3.5 text-3xl no-underline ${isActive ? 'text-route' : 'text-paper'}`}>
                  {n.label}
                </NavLink>
              </li>
            ))}
            <li className="pt-4">
              <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="btn-route btn">
                Résumé<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
