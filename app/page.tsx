"use client";

import React, { useEffect, useState, useRef } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import FeaturedProjects from '@/components/FeaturedProjects';
import SkillsGrid from '@/components/SkillsGrid';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import ProcessGrid from '@/components/ProcessGrid';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import Modal from '@/components/Modal';
import { Project, SkillsMap, ExperienceItem, PortfolioSettings } from '@/lib/types';

export default function HomePage() {
  const [settings, setSettings] = useState<PortfolioSettings | null>({
    name: 'Rajan Sharma',
    role: 'Full-Stack Software Engineer',
    headline: 'Building production-grade web systems, REST APIs & scalable backends.',
    location: 'Kathmandu, Bagmati Prov, Nepal (UTC +5:45)',
    email: 'email.rajan001@gmail.com',
    phone: '+977 9800000000',
    isAvailableForHire: true,
    availabilityBadgeText: 'Available for Roles',
    resumeUrl: '/uploads/resume.pdf',
    bio: 'Full-Stack Software Engineer specializing in Next.js, TypeScript, Node.js, Express, PostgreSQL, and MongoDB architectures.',
    codeSnippet: `// rajan.config.ts\nexport const engineer = {\n  name: "Rajan Sharma",\n  role: "Full-Stack Software Engineer",\n  location: "Kathmandu, Nepal",\n  stack: ["Next.js", "TypeScript", "Node.js", "Express", "PostgreSQL", "MongoDB"],\n  projects: 16,\n  status: "Available for Engineering Roles"\n};`,
    heroTechChips: [],
    heroStats: [],
    whatIBring: [],
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<SkillsMap>({});
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const cursorRef = useRef<HTMLDivElement>(null);

  // 1. Fetch dynamic data from MongoDB in background & track visitor view
  useEffect(() => {
    async function fetchData() {
      try {
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: window.location.pathname }),
        }).catch(() => {});

        const [resSettings, resProjects, resSkills, resExp] = await Promise.all([
          fetch('/api/settings').then((r) => r.json()).catch(() => null),
          fetch('/api/projects').then((r) => r.json()).catch(() => []),
          fetch('/api/skills').then((r) => r.json()).catch(() => ({})),
          fetch('/api/experience').then((r) => r.json()).catch(() => []),
        ]);

        if (resSettings && resSettings.name) setSettings(resSettings);
        if (Array.isArray(resProjects) && resProjects.length > 0) setProjects(resProjects);
        if (resSkills && Object.keys(resSkills).length > 0) setSkills(resSkills);
        if (Array.isArray(resExp) && resExp.length > 0) setExperience(resExp);
      } catch (err) {
        console.error('Failed to load portfolio data:', err);
      }
    }

    fetchData();
  }, []);

  // 2. Custom Cursor & Interactive Hover Effects
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('a, button, input, textarea, .filter-btn, .project-card, .faq-question, .project-visual, .open-modal-btn')
      ) {
        cursor.classList.add('hover');
      } else {
        cursor.classList.remove('hover');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // 3. Scroll Progress Indicator & Reveal Animations
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = windowHeight > 0 ? (totalScroll / windowHeight) * 100 : 0;
      setScrollProgress(scroll);

      // Section reveal animation triggers
      const reveals = document.querySelectorAll('.reveal');
      const windowHeightPx = window.innerHeight;
      reveals.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeightPx - 100) {
          element.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShowToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div id="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* Interactive Custom Cursor */}
      <div className="cursor-dot" id="cursor" ref={cursorRef} />

      {/* Global Toast Notification */}
      <div id="toast" className={toastMessage ? 'show' : ''}>
        {toastMessage || 'Message Sent Successfully'}
      </div>

      <Header />

      <main>
        {/* Hero Section */}
        <Hero settings={settings} />

        {/* Marquee Ticker */}
        <Marquee />

        {/* 01: Featured Works & Case Studies (Recruiter Priority #1: Proof of Work) */}
        <FeaturedProjects projects={projects} onOpenModal={(p) => setSelectedProject(p)} />

        {/* 02: Technical Capabilities & Stack (Recruiter Priority #2: Skills Match) */}
        <SkillsGrid skills={skills} />

        {/* 03: Background & Experience (Recruiter Priority #3: Verified Career History) */}
        <ExperienceTimeline experience={experience} settings={settings} />

        {/* 04: Engineering Methodology (Recruiter Priority #4: Technical Process) */}
        <ProcessGrid />

        {/* 05: Contact & FAQ (Recruiter Priority #5: Inbound Hiring Inquiries) */}
        <ContactSection settings={settings} onShowToast={handleShowToast} />
      </main>

      <Footer />

      {/* Architectural Project Spec Modal */}
      <Modal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  );
}
