"use client";

import React, { useState } from 'react';
import { ExternalLink, Github, ChevronDown } from 'lucide-react';
import { Project } from '@/lib/types';

interface FeaturedProjectsProps {
  projects: Project[];
  onOpenModal: (project: Project) => void;
}

export default function FeaturedProjects({ projects, onOpenModal }: FeaturedProjectsProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(4);

  const getFilterCounts = () => {
    const counts: Record<string, number> = { all: projects.length };
    projects.forEach((p) => {
      const type = (p.type || '').toLowerCase();
      if (type.includes('full-stack') || type.includes('saas') || type.includes('backend')) {
        counts['fullstack'] = (counts['fullstack'] || 0) + 1;
      } else if (type.includes('client') || type.includes('commercial')) {
        counts['client'] = (counts['client'] || 0) + 1;
      } else if (type.includes('personal') || type.includes('education')) {
        counts['personal'] = (counts['personal'] || 0) + 1;
      } else if (type.includes('wordpress') || type.includes('cms')) {
        counts['wordpress'] = (counts['wordpress'] || 0) + 1;
      }
    });
    return counts;
  };

  const counts = getFilterCounts();

  const filterTabs = [
    { label: `All (${counts.all || 0})`, value: 'all' },
    { label: `Full-Stack (${counts.fullstack || 0})`, value: 'fullstack' },
    { label: `Client (${counts.client || 0})`, value: 'client' },
    { label: `Personal (${counts.personal || 0})`, value: 'personal' },
    { label: `WordPress (${counts.wordpress || 0})`, value: 'wordpress' },
  ];

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'all') return true;
    const type = (p.type || '').toLowerCase();
    if (activeFilter === 'fullstack') return type.includes('full-stack') || type.includes('saas') || type.includes('backend');
    if (activeFilter === 'client') return type.includes('client') || type.includes('commercial');
    if (activeFilter === 'personal') return type.includes('personal') || type.includes('education');
    if (activeFilter === 'wordpress') return type.includes('wordpress') || type.includes('cms');
    return true;
  });

  const displayedProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  const handleFilterChange = (val: string) => {
    setActiveFilter(val);
    setVisibleCount(4);
  };

  return (
    <section id="work" className="section container reveal">
      <div className="section-header">
        <span className="section-num">01</span>
        <h2 className="section-title">Featured Works</h2>
      </div>

      <div className="project-filters">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            className={`filter-btn ${activeFilter === tab.value ? 'active' : ''}`}
            onClick={() => handleFilterChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="projects-list">
        {displayedProjects.map((project, idx) => (
          <article key={project.id || idx} className="project-card">
            <div className="project-info">
              <div className="project-meta">
                <span className="project-type-tag">{project.type || 'Project'}</span>
              </div>

              <h3 className="project-title">{project.title}</h3>

              <p className="project-desc">{project.description}</p>

              {project.impact && (
                <div className="project-impact">
                  {project.impact}
                </div>
              )}

              <div className="tag-group">
                {(project.techStack || []).map((tech) => (
                  <span key={tech} className="tag">{tech}</span>
                ))}
              </div>

              <div className="project-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => onOpenModal(project)}
                >
                  View Details
                </button>

                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                    Live Demo <ExternalLink size={12} />
                  </a>
                )}

                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm btn-icon" title="Source Code">
                    <Github size={14} />
                  </a>
                )}
              </div>
            </div>

            <div
              className="project-visual"
              onClick={() => onOpenModal(project)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onOpenModal(project)}
            >
              {project.thumbnail && !project.thumbnail.includes('unsplash') ? (
                <div className="project-thumb" style={{ backgroundImage: `url('${project.thumbnail}')` }} />
              ) : (
                <div className="project-placeholder">
                  <div className="placeholder-bar short" />
                  <div className="placeholder-body">
                    <div className="placeholder-sidebar" />
                    <div className="placeholder-main" />
                  </div>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {hasMore && (
        <div className="load-more-wrapper">
          <button onClick={() => setVisibleCount((prev) => prev + 4)} className="btn btn-outline btn-load-more">
            Load More ({filteredProjects.length - visibleCount} remaining) <ChevronDown size={16} />
          </button>
        </div>
      )}
    </section>
  );
}
