import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, X, Github, Linkedin } from 'lucide-react';
import { cn } from '../lib/utils';
import { playSound } from '../utils/sounds';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: isHomePage ? '#home' : '/' },
    { name: 'Projects', href: isHomePage ? '#projects' : '/#projects' },
    { name: 'Experience', href: isHomePage ? '#experience' : '/#experience' },
    { name: 'Certifications', href: isHomePage ? '#certifications' : '/#certifications' },
    { name: 'Contact', href: isHomePage ? '#contact' : '/#contact' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "bg-[var(--bg-secondary)]/80 backdrop-blur-lg border-b border-white/5 py-3" : "bg-transparent"
    )}>
      {/* Scroll Progress Bar */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-accent transition-all duration-100" style={{ width: `${scrollProgress}%` }} />

      <div className="container mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          onClick={() => playSound('click')}
          className="text-2xl font-display font-bold tracking-tighter group"
        >
          MS<span className="text-accent group-hover:animate-pulse">.</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={() => playSound('click')}
              className="text-sm font-medium text-slate-400 hover:text-accent transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <a href="https://github.com/Mokshitsharma" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-accent transition-colors">
            <Github size={20} />
          </a>
          <a href="https://www.linkedin.com/in/mokshit-sharma-75b5ab305/" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-accent transition-colors">
            <Linkedin size={20} />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-slate-200"
          onClick={() => {
            setIsMobileMenuOpen(!isMobileMenuOpen);
            playSound('click');
          }}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 bg-[var(--bg-secondary)] z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-500 md:hidden",
        isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {navLinks.map((link) => (
          <a 
            key={link.name} 
            href={link.href}
            className="text-3xl font-display font-bold hover:text-accent transition-colors"
            onClick={() => {
              setIsMobileMenuOpen(false);
              playSound('click');
            }}
          >
            {link.name}
          </a>
        ))}
        <div className="flex gap-6 mt-8">
          <a href="https://github.com/Mokshitsharma" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-accent transition-colors">
            <Github size={32} />
          </a>
          <a href="https://www.linkedin.com/in/mokshit-sharma-75b5ab305/" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-accent transition-colors">
            <Linkedin size={32} />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
