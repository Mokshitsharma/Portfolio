import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Principles from './components/Principles';
import AlsoBuilt from './components/AlsoBuilt';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProjectsDetail from './pages/ProjectsDetail';
import InternshipsDetail from './pages/InternshipsDetail';

// Scroll to the top on route change, or to the #section when the URL has one.
const ScrollManager = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};

const Home = () => (
  <>
    <Hero />
    <Projects />
    <Principles />
    <AlsoBuilt />
    <Experience />
    <Skills />
    <Certifications />
    <Contact />
  </>
);

export default function App() {
  return (
    <Router>
      <ScrollManager />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] btn-primary">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsDetail />} />
          <Route path="/internships" element={<InternshipsDetail />} />
          <Route path="/skills" element={<Navigate to="/#skills" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
