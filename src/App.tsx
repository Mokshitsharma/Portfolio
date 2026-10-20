import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import CaseStudyPage from './pages/CaseStudyPage';
import Experience from './pages/Experience';
import Skills from './pages/Skills';
import About from './pages/About';
import Contact from './pages/Contact';
import Achievements from './pages/Achievements';
import Roles from './pages/Roles';
import RolePage from './pages/RolePage';
import NotFound from './pages/NotFound';

// Shared by the browser entry (main.tsx) and the prerender entry (entry-server.tsx).
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:slug" element={<CaseStudyPage />} />
        <Route path="experience" element={<Experience />} />
        <Route path="skills" element={<Skills />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="roles" element={<Roles />} />
        <Route path="roles/:slug" element={<RolePage />} />
        {/* Old address of the experience page. Vercel also redirects it with a 301. */}
        <Route path="internships" element={<Navigate to="/experience" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
