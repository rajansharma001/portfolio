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
import { Project, SkillsMap, ExperienceItem, PortfolioSettings, SectionVisibility, DEFAULT_VISIBILITY } from '@/lib/types';

export default function HomePage() {
  const [settings, setSettings] = useState<PortfolioSettings>({
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
    codeSnippet: '',
    sectionVisibility: DEFAULT_VISIBILITY,
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<SkillsMap>({});
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  const vis: SectionVisibility = settings.sectionVisibility || DEFAULT_VISIBILITY;

  // Fetch all data from cached bundle endpoint
  useEffect(() => {
    async function fetchData() {
      try {
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: window.location.pathname }),
        }).catch(() => {});

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
      {vis.showScrollProgress && (
        <div id="scroll-progress" style={{ width: `${scrollProgress}%` }} />
      )}

      {/* Toast Notification */}
      <div id="toast" className={toastMessage ? 'show' : ''}>
        {toastMessage || ''}
      </div>

      <Header visibility={vis} projectCount={projects.length} />

      <main>
        {vis.showHero && <Hero settings={settings} visibility={vis} />}

        {vis.showMarquee && <Marquee />}

        {vis.showProjects && (
          <FeaturedProjects projects={projects} loading={loading} onOpenModal={(p) => setSelectedProject(p)} />
        )}

        {vis.showSkills && <SkillsGrid skills={skills} />}

        {vis.showExperience && (
          <ExperienceTimeline experience={experience} settings={settings} />
        )}

        {vis.showProcess && <ProcessGrid settings={settings} />}

        {vis.showContact && (
          <ContactSection settings={settings} onShowToast={handleShowToast} />
        )}
      </main>

      {vis.showFooter && <Footer settings={settings} />}

      <Modal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  );
}
