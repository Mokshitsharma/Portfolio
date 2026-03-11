import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 border-t border-[var(--border-primary)]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <a href="#home" className="text-2xl font-display font-bold tracking-tighter mb-2 block text-[var(--text-primary)]">
              MS<span className="text-accent">.</span>
            </a>
            <p className="text-[var(--text-secondary)] text-sm">
              AI & Data Science Engineer based in Indore, India.
            </p>
          </div>

          <div className="flex gap-8 text-sm font-mono text-[var(--text-secondary)] uppercase tracking-widest">
            <a href="#home" className="hover:text-accent transition-colors">Home</a>
            <a href="#projects" className="hover:text-accent transition-colors">Projects</a>
            <a href="#skills" className="hover:text-accent transition-colors">Skills</a>
            <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
          </div>

          <div className="text-[var(--text-secondary)] text-sm font-mono">
            © {new Date().getFullYear()} Mokshit Sharma. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
