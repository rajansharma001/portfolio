"use client";

import React, { useEffect, useState } from 'react';
import { Github, ExternalLink, FileText } from 'lucide-react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedProjects from '@/components/FeaturedProjects';
import ProjectCard from '@/components/ProjectCard';
import SkillsGrid from '@/components/SkillsGrid';
import ExperienceTimeline from '@/components/ExperienceTimeline';
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

  const [activeFilter, setActiveFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    async function fetchData() {
      try {
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

  if (loading || !settings) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
        <div>Loading Portfolio...</div>
      </div>
    );
  }

  // Filter out featured 2 projects for the small grid
  const featuredSlugs = ['restroos', 'tripnest'];
  let moreProjects = projects.filter((p) => !featuredSlugs.includes(p.slug.toLowerCase()));
  
  if (activeFilter !== 'All') {
    moreProjects = moreProjects.filter(p => p.type === activeFilter);
  }

  const filterTabs = ['All', 'SaaS', 'Client', 'Personal', 'WordPress'];

  const displayedProjects = moreProjects.slice(0, visibleCount);

  return (
    <div>
      <Header />

      <main>
        {/* Hero Section */}
        <Hero settings={settings} />

        {/* Featured Projects (RestroOS & TripNest) */}
        <FeaturedProjects projects={projects} onOpenModal={(p) => setSelectedProject(p)} />

        {/* More Projects (Grid with Filters) */}
        <section className="section" style={{ paddingTop: '1rem' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-tag" style={{ color: 'var(--text-secondary)' }}>MORE PROJECTS</span>
              <div className="filters-row">
                {filterTabs.map(tab => (
                  <button 
                    key={tab} 
                    className={`filter-btn ${activeFilter === tab ? 'active' : ''}`}
                    onClick={() => {
                      setActiveFilter(tab);
                      setVisibleCount(6);
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="small-projects-grid">
              {displayedProjects.map((project) => (
                <div key={project.id} className="small-project-card">
                  <div className="small-img-wrapper" style={{ backgroundImage: `url('${project.thumbnail}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  </div>
                  
                  <div className="small-project-content">
                    <h4 className="small-title">{project.title}</h4>
                    <p className="small-desc">{project.description}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <button onClick={() => setSelectedProject(project)} className="btn btn-primary btn-sm" style={{ flex: 1, padding: '0.4rem' }}>
                        <FileText size={14} /> Case Study
                      </button>
                      
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '0.4rem 0.6rem' }} title="Live Demo">
                          <ExternalLink size={14} />
                        </a>
                      )}
                      
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '0.4rem 0.6rem' }} title={project.backendGithubUrl ? "Frontend Repo" : "GitHub Repo"}>
                          <Github size={14} />
                        </a>
                      )}
                      
                      {project.backendGithubUrl && (
                        <a href={project.backendGithubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '0.4rem 0.6rem' }} title="Backend Repo">
                          <Github size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {visibleCount < moreProjects.length && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                <button 
                  onClick={() => setVisibleCount(prev => prev + 6)} 
                  className="btn btn-secondary"
                  style={{ padding: '0.8rem 2rem' }}
                >
                  Load More Projects
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Technical Skills Matrix */}
        <SkillsGrid skills={skills} />

        {/* Experience Timeline */}
        <ExperienceTimeline experience={experience} settings={settings} />

        {/* Contact Section */}
        <ContactSection settings={settings} />
      </main>

      <Footer />

      {/* Case Study Preview Modal */}
      <Modal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
