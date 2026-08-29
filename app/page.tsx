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
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<SkillsMap>({});
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const cursorRef = useRef<HTMLDivElement>(null);

  // 1. Fetch dynamic data & track visitor view
  useEffect(() => {
    async function fetchData() {
      try {
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: window.location.pathname }),
        }).catch(() => {});

        const [resSettings, resProjects, resSkills, resExp] = await Promise.all([
          fetch('/api/settings').then((r) => r.json()),
          fetch('/api/projects').then((r) => r.json()),
          fetch('/api/skills').then((r) => r.json()),
          fetch('/api/experience').then((r) => r.json()),
        ]);

        setSettings(resSettings);
        setProjects(resProjects || []);
        setSkills(resSkills || {});
        setExperience(resExp || []);
      } catch (err) {
        console.error('Failed to load portfolio data:', err);
      } finally {
        setLoading(false);
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
  }, [loading]);

  // 3. Top Scroll Progress Indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 4. Scroll Reveal Animations
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const revealEls = document.querySelectorAll('.reveal');
    revealEls.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [loading, projects, experience]);

  const handleShowToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--accent)',
          fontFamily: 'var(--font-mono)',
          fontSize: '1rem',
          fontWeight: 700,
        }}
      >
        <span>INITIALIZING SECURE ENVIRONMENT...</span>
      </div>
    );
  }

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
