import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CTA from './components/CTA';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Certifications from './components/Certifications';
import WhyWorkWithMe from './components/WhyWorkWithMe';
import CurrentlyLearning from './components/CurrentlyLearning';
import AboutMe from './components/AboutMe';
import Scrolltelling from './components/Scrolltelling';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AIChat from './components/AIChat';
import ProjectsDetail from './pages/ProjectsDetail';
import InternshipsDetail from './pages/InternshipsDetail';
import SkillsDetail from './pages/SkillsDetail';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Home = () => {
  useEffect(() => {
    // Page load animation
    gsap.from('body', {
      opacity: 0,
      duration: 1.5,
      ease: 'power3.out'
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (!targetId) return;
        const target = document.querySelector(targetId);
        if (target) {
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth'
          });
        }
      });
    });
  }, []);

  return (
    <>
      <Hero />
      <CTA 
        title="Open to ML / Data Science Internships" 
        subtitle="Ready to contribute to high-impact AI projects and production-ready ML systems with a focus on measurable results."
      />
      <AboutMe />
      <WhyWorkWithMe />
      <Scrolltelling />
      <Projects />
      <Experience />
      <Skills />
      <Certifications />
      <CurrentlyLearning />
      <Achievements />
      <CTA 
        title="Let's Build Intelligent Systems Together" 
        subtitle="Currently seeking internship opportunities where I can apply my ML expertise to solve complex business challenges."
        showSocials={true}
      />
      <Contact />
      <Footer />
      <AIChat />
    </>
  );
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <main className="relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsDetail />} />
          <Route path="/internships" element={<InternshipsDetail />} />
          <Route path="/skills" element={<SkillsDetail />} />
        </Routes>
      </main>
    </Router>
  );
}
