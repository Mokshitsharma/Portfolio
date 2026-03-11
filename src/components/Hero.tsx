import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ArrowDown, Download, ExternalLink } from 'lucide-react';
import { playSound } from '../utils/sounds';

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Build Typing Effect
  const [buildText, setBuildText] = useState('');
  const buildRoles = ['Production AI Systems', 'Scalable ML Pipelines', 'Predictive Analytics'];
  const [buildIndex, setBuildIndex] = useState(0);
  const [isBuildDeleting, setIsBuildDeleting] = useState(false);
  
  // Role Typing Effect
  const [roleText, setRoleText] = useState('');
  const roles = ['Machine Learning Engineer', 'AI Systems Architect', 'Data Science Specialist'];
  const [roleIndex, setRoleIndex] = useState(0);
  const [isRoleDeleting, setIsRoleDeleting] = useState(false);

  // Build Typing Effect Logic
  useEffect(() => {
    const handleTyping = () => {
      const current = buildRoles[buildIndex];
      if (isBuildDeleting) {
        setBuildText(current.substring(0, buildText.length - 1));
      } else {
        setBuildText(current.substring(0, buildText.length + 1));
      }

      if (!isBuildDeleting && buildText === current) {
        setTimeout(() => setIsBuildDeleting(true), 2000);
      } else if (isBuildDeleting && buildText === '') {
        setIsBuildDeleting(false);
        setBuildIndex((prev) => (prev + 1) % buildRoles.length);
      }
    };

    const timer = setTimeout(handleTyping, isBuildDeleting ? 50 : 150);
    return () => clearTimeout(timer);
  }, [buildText, isBuildDeleting, buildIndex]);

  // Role Typing Effect Logic
  useEffect(() => {
    const handleTyping = () => {
      const current = roles[roleIndex];
      if (isRoleDeleting) {
        setRoleText(current.substring(0, roleText.length - 1));
      } else {
        setRoleText(current.substring(0, roleText.length + 1));
      }

      if (!isRoleDeleting && roleText === current) {
        setTimeout(() => setIsRoleDeleting(true), 1500);
      } else if (isRoleDeleting && roleText === '') {
        setIsRoleDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    };

    const timer = setTimeout(handleTyping, isRoleDeleting ? 40 : 100);
    return () => clearTimeout(timer);
  }, [roleText, isRoleDeleting, roleIndex]);

  // Three.js Background
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: '#FEFACD',
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 3;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) - 0.5;
      mouseY = (event.clientY / window.innerHeight) - 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;

      // Smooth mouse follow
      particlesMesh.position.x += (mouseX * 0.5 - particlesMesh.position.x) * 0.05;
      particlesMesh.position.y += (-mouseY * 0.5 - particlesMesh.position.y) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-accent/20 bg-accent/5 text-accent text-sm font-medium tracking-wider uppercase">
          Welcome to my digital space
        </div>
        
        <h1 className="text-5xl md:text-8xl font-bold mb-4 leading-tight">
          Hi, I’m <span className="text-gradient">Mokshit Sharma</span>
        </h1>
        
        <div className="text-2xl md:text-4xl text-accent font-display mb-8 h-10 md:h-12">
          {roleText}<span className="animate-pulse ml-1">|</span>
        </div>
        
        <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
          Machine Learning Engineer focused on building <span className="text-white font-medium text-glow">production-ready AI systems</span> with measurable impact.
          <br />
          I specialize in end-to-end ML development, combining a rigorous metrics-driven mindset with a passion for solving complex business problems through data-driven precision.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="#projects" 
            onClick={() => playSound('click')}
            className="glow-button flex items-center gap-2 group"
          >
            View My Work
            <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
          <a 
            href="https://drive.google.com/file/d/1yqCt5a-2A4DEu9QJvIy_9b_KF6yR4xqt/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playSound('click')}
            className="px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-2 font-medium"
          >
            Download Resume
            <Download size={18} />
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity">
        <ArrowDown size={32} className="text-accent" />
      </div>
    </section>
  );
};

export default Hero;
