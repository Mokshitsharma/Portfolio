import HeroAbout from '../components/home/HeroAbout';
import Bookshelf from '../components/home/Bookshelf';
import { Certifications, Contact, Experience, KnowMore, Skills, Social, Testimonials } from '../components/home/Sections';

// The home page, in the order of the final specification (docs/redesign/DESIGN.md): 1-2 opening and about me,
// 3 projects (the bookshelf), 4 experience, 5 certifications, 6 skills, 7 testimonials (hidden until real ones
// exist), 8 want to know more about me, 9 contact, 10 social links. The assistant's orb sits on every page.
export default function Home() {
  return (
    <div className="home relative overflow-x-clip">
      <HeroAbout />
      <Bookshelf />
      <Experience />
      <Certifications />
      <Skills />
      <Testimonials />
      <KnowMore />
      <Contact />
      <Social />
    </div>
  );
}
