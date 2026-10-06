import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { profile } from '../data/portfolio';

const links = [
  { name: 'Work', href: '/#work' },
  { name: 'How I build', href: '/#principles' },
  { name: 'Experience', href: '/#experience' },
  { name: 'All projects', href: '/projects' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors ${scrolled || open ? 'bg-plum/90 backdrop-blur border-b border-line' : 'bg-transparent'}`}
    >
      <nav className="wrap flex h-16 items-center justify-between gap-6" aria-label="Main">
        <Link to="/" className="font-display text-xl font-extrabold tracking-tight" onClick={() => setOpen(false)}>
          Mokshit Sharma
        </Link>

        <ul className="hidden items-center gap-7 text-sm text-muted md:flex">
          {links.map((l) => (
            <li key={l.name}>
              <Link to={l.href} className="hover:text-paper transition-colors">
                {l.name}
              </Link>
            </li>
          ))}
        </ul>

        <a href={`mailto:${profile.email}`} className="hidden md:inline-flex btn-primary !py-1.5 text-sm">
          Hire me
        </a>

        <button
          className="md:hidden p-2 -mr-2"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden wrap pb-8 pt-2 h-[calc(100dvh-4rem)]">
          <ul className="flex flex-col gap-5 font-display text-3xl font-semibold">
            {links.map((l) => (
              <li key={l.name}>
                <Link to={l.href} onClick={() => setOpen(false)}>
                  {l.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/#contact" onClick={() => setOpen(false)}>
                Contact
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
