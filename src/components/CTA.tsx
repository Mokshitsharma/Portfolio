import React from 'react';
import { Download, Mail, Linkedin, Github, ArrowRight } from 'lucide-react';
import { playSound } from '../utils/sounds';

interface CTAProps {
  title?: string;
  subtitle?: string;
  showSocials?: boolean;
}

const CTA: React.FC<CTAProps> = ({ 
  title = "Open to ML / Data Science Internships", 
  subtitle = "Ready to contribute to high-impact AI projects and production-ready ML systems.",
  showSocials = true
}) => {
  return (
    <section className="py-16 bg-accent/5 border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 max-w-6xl mx-auto">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{title}</h2>
            <p className="text-slate-400 text-lg max-w-xl">{subtitle}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a 
              href="https://drive.google.com/file/d/1yqCt5a-2A4DEu9QJvIy_9b_KF6yR4xqt/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSound('click')}
              className="glow-button flex items-center gap-2"
            >
              Download Resume <Download size={18} />
            </a>
            
            <a 
              href="#contact"
              onClick={() => playSound('click')}
              className="px-8 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-2 font-medium text-white"
            >
              Contact Me <Mail size={18} />
            </a>

            {showSocials && (
              <div className="flex items-center gap-3 ml-2">
                <a 
                  href="https://www.linkedin.com/in/mokshit-sharma-75b5ab305/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-accent hover:border-accent/50 transition-all"
                >
                  <Linkedin size={18} />
                </a>
                <a 
                  href="https://github.com/Mokshitsharma" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-accent hover:border-accent/50 transition-all"
                >
                  <Github size={18} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
