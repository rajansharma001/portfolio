"use client";

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import FeaturedProjects from '@/components/FeaturedProjects';
import SkillsGrid from '@/components/SkillsGrid';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import ProcessGrid from '@/components/ProcessGrid';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import ProjectModal from '@/components/ProjectModal';
import CommandPalette from '@/components/CommandPalette';
import {
  Project,
  SkillsMap,
  ExperienceItem,
  PortfolioSettings,
  SectionVisibility,
  DEFAULT_VISIBILITY,
} from '@/lib/types';

export default function HomePage() {
  const [settings, setSettings] = useState<PortfolioSettings>({
    name: 'Rajan Sharma',
    role: 'Full-Stack Software Engineer',
    headline: 'Building production-grade web systems, REST APIs & scalable backends.',
    heroImpactText: '16 production systems shipped across LMS, POS, tourism & geospatial domains.',
    location: 'Kathmandu, Bagmati Prov, Nepal (UTC +5:45)',
    email: 'email.rajan001@gmail.com',
    phone: '+977 9800000000',
    isAvailableForHire: true,
    availabilityBadgeText: 'Open for Roles',
    availabilityBadgeDate: 'Oct 2026',
    resumeUrl: '/uploads/resume.pdf',
    bio: 'Full-Stack Software Engineer specializing in Next.js, TypeScript, Node.js, Express, PostgreSQL, and MongoDB architectures.',
    codeSnippet: '',
    sectionVisibility: DEFAULT_VISIBILITY,
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<SkillsMap>({});
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  const vis: SectionVisibility = settings.sectionVisibility || DEFAULT_VISIBILITY;

  // Fetch all data from cached bundle endpoint
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/portfolio-data');
        if (res.ok) {
          const bundle = await res.json();
          if (bundle.settings && bundle.settings.name) {
            setSettings({
              ...bundle.settings,
              sectionVisibility: bundle.settings.sectionVisibility || DEFAULT_VISIBILITY,
            });
          }
          if (Array.isArray(bundle.projects) && bundle.projects.length > 0) setProjects(bundle.projects);
          if (bundle.skills && Object.keys(bundle.skills).length > 0) setSkills(bundle.skills);
          if (Array.isArray(bundle.experience) && bundle.experience.length > 0) setExperience(bundle.experience);
        }
      } catch (err) {
        console.error('Failed to load portfolio data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Global Command Palette Shortcut Listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll progress & reveal animations
  useEffect(() => {
    if (!vis.showScrollProgress) return;

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = windowHeight > 0 ? (totalScroll / windowHeight) * 100 : 0;
      setScrollProgress(scroll);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [vis.showScrollProgress]);

  // Section reveal animations
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal');
      const windowHeight = window.innerHeight;
      reveals.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - 80) {
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
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      {vis.showScrollProgress && <div id="scroll-progress" style={{ width: `${scrollProgress}%` }} />}

      {/* Toast Notification */}
      <div id="toast" className={toastMessage ? 'show' : ''}>
        {toastMessage || ''}
      </div>

      <Header
        visibility={vis}
        settings={settings}
        projectCount={projects.length}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      <main>
        {vis.showHero && (
          <Hero
            settings={settings}
            visibility={vis}
            skills={skills}
            projects={projects}
          />
        )}

        {vis.showMarquee && <Marquee settings={settings} />}

        {vis.showProjects && (
          <FeaturedProjects
            projects={projects}
            loading={loading}
            onOpenModal={(p) => setSelectedProject(p)}
          />
        )}

        {vis.showSkills && <SkillsGrid skills={skills} />}

        {vis.showExperience && (
          <ExperienceTimeline experience={experience} settings={settings} />
        )}

        {vis.showProcess && <ProcessGrid settings={settings} />}

        {vis.showContact && <ContactSection settings={settings} onShowToast={handleShowToast} />}
      </main>

      {vis.showFooter && <Footer settings={settings} />}

      {/* Interactive Case Study Modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      {/* Global Interactive Command Palette (Cmd + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        projects={projects}
        skills={skills}
        onOpenProject={(p) => setSelectedProject(p)}
        onShowToast={handleShowToast}
      />
    </>
  );
}
