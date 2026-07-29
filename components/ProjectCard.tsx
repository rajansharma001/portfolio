import React from 'react';
import Image from 'next/image';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
  isFeatured?: boolean;
  onOpenModal?: (project: Project) => void;
}

export default function ProjectCard({ project, isFeatured = false, onOpenModal }: ProjectCardProps) {
  if (isFeatured) {
    return (
      <div className="featured-project">
        <div className="featured-img-container" style={{ position: 'relative' }}>
          <Image
            src={project.thumbnail || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&auto=format&fit=crop&q=80'}
            alt={project.title}
            fill
            sizes="100vw"
            className="featured-img"
          />
        </div>

        <div className="featured-content">
          <div className="featured-title">
            <span>{project.title}</span>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  <Github size={18} />
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <span>Visit Live</span>
                  <ArrowUpRight size={16} />
                </a>
              )}
              {onOpenModal && !project.liveUrl && (
                <button onClick={() => onOpenModal(project)} className="btn btn-primary">
                  View Case Study
                </button>
              )}
            </div>
          </div>
          
          <p className="featured-desc">
            {project.tagline} {project.impact && <strong>Impact: {project.impact}</strong>}
          </p>

          <div className="tech-list">
            {project.techStack.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Minimalist List for non-featured projects
  return (
    <div className="project-list-item">
      <div>
        <h4 className="project-list-title">{project.title}</h4>
        <p className="project-list-desc">{project.tagline}</p>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          {project.type}
        </span>
        {onOpenModal && (
          <button onClick={() => onOpenModal(project)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }}>
            Details
          </button>
        )}
      </div>
    </div>
  );
}
