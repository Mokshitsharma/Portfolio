import { Link } from 'react-router-dom';
import CinemaStory from '../components/home/CinemaStory';
import Doors from '../components/home/Doors';
import ProjectMap from '../components/home/ProjectMap';
import BackInTime from '../components/home/BackInTime';
import ProjectCall from '../components/home/ProjectCall';
import { Certifications, KnowMore, Skills, Social, Testimonials } from '../components/home/Sections';
import { projects } from '../data/projects';

// The home page as a cinematic walk (docs/redesign/DESIGN.md): the introduction, the doors to each room of the portfolio, then the project ecosystem, experience and the rest. The assistant's orb sits on
// every page.

function Ecosystem() {
  return (
    <section id="projects" data-section="projects" aria-labelledby="projects-title" className="scroll-mt-16 border-t border-seam py-24 md:py-28">
      <div className="shell">
        <p className="label text-brass">R01 · Projects</p>
        <h2 id="projects-title" className="cine-h2 mt-2">The project ecosystem</h2>
        <p className="mt-4 max-w-[38rem] text-[1.125rem] leading-[1.6] text-charcoal/75">
          Choose an area, open its branch, then a project. The ones marked Deep dive open with their architecture drawn out.
        </p>
        <div className="mt-12"><ProjectMap /></div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/projects" className="pill pill-solid">All {projects.length} projects</Link>
          <Link to="/projects/settleai" className="pill">See a deep dive</Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="home relative overflow-x-clip">
      <CinemaStory />
      <Doors />
      <Ecosystem />
      <BackInTime />
      <Certifications />
      <Skills />
      <Testimonials />
      <KnowMore />
      <ProjectCall />
      <Social />
    </div>
  );
}
