"use client";

import React, { useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { Project } from '@/lib/types';

interface FeaturedProjectsProps {
  projects: Project[];
  onOpenModal: (project: Project) => void;
}

export default function FeaturedProjects({ projects, onOpenModal }: FeaturedProjectsProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filterTabs = [
    { label: 'All Systems', value: 'all' },
    { label: 'Full-Stack Apps', value: 'saas' },
    { label: 'Web Systems', value: 'client' },
  ];

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'all') return true;
    const type = (p.type || '').toLowerCase();
    if (activeFilter === 'saas') {
      return type.includes('saas') || type.includes('fullstack') || type.includes('internal') || type.includes('developer');
    }
    if (activeFilter === 'client') {
      return type.includes('client') || type.includes('wordpress') || type.includes('cms') || type.includes('education');
    }
    return type === activeFilter;
  });

  return (
    <section id="work" className="section container reveal">
      <div className="section-header">
        <span className="section-num">03</span>
        <h2 className="section-title">Featured Works</h2>
      </div>

      <div className="project-filters">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            className={`filter-btn ${activeFilter === tab.value ? 'active' : ''}`}
            onClick={() => setActiveFilter(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="projects-list">
        {filteredProjects.map((project) => (
          <article key={project.id} className="project-card">
            <div className="project-info">
              <h3 className="text-h2">{project.title.toUpperCase()}</h3>
              <p className="project-desc">{project.description}</p>

              <div className="tag-group">
                {(project.techStack || []).map((tech) => (
                  <span key={tech} className="tag">
                    {tech}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm open-modal-btn"
                  onClick={() => onOpenModal(project)}
                >
                  Inspect Specs
                </button>

                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    Live Demo <ExternalLink size={12} />
                  </a>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{ padding: '0.5rem 0.75rem' }}
                    title="Source Code"
                  >
                    <Github size={14} />
                  </a>
                )}
              </div>
            </div>

            <div
              className="project-visual open-modal-btn"
              onClick={() => onOpenModal(project)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onOpenModal(project)}
            >
              {project.thumbnail && !project.thumbnail.includes('unsplash') ? (
                <div
                  style={{
                    width: '88%',
                    height: '75%',
                    border: '1px solid var(--border-color)',
                    backgroundImage: `url('${project.thumbnail}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: 'var(--bg-primary)',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '80%',
                    height: '60%',
                    border: '2px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '1rem',
                    gap: '1rem',
                  }}
                >
                  <div style={{ height: '20px', width: '40%', background: 'var(--border-color)' }}></div>
                  <div style={{ flexGrow: 1, display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '30%', background: 'var(--border-color)', opacity: 0.5 }}></div>
                    <div style={{ width: '70%', background: 'var(--border-color)', opacity: 0.2 }}></div>
                  </div>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
