"use client";

import React, { useEffect } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { Project } from '@/lib/types';

interface ModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function Modal({ project, onClose }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const highlights = project.impact
    ? project.impact.split('. ').filter(Boolean)
    : [
        'Modular architectural design supporting high-concurrency client requests.',
        'Type-safe end-to-end data validation and schema integrity.',
        'Optimized build outputs and streamlined production deployment pipeline.',
      ];

  return (
    <div
      className={`modal-overlay ${project ? 'active' : ''}`}
      id="project-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <button className="modal-close" id="modal-close" onClick={onClose} aria-label="Close modal">
          &times;
        </button>

        <div id="modal-body">
          <span className="label" style={{ color: 'var(--accent)' }}>
            {project.type || 'SYSTEM ARCHITECTURE'}
          </span>
          <h2 className="text-h2" style={{ margin: '0.5rem 0 1.5rem 0' }}>
            {project.title}
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
            {project.description}
          </p>

          <h4 className="font-mono" style={{ marginBottom: '1rem', textTransform: 'uppercase' }}>
            Key Architectural Highlights
          </h4>
          <ul style={{ marginBottom: '2rem', paddingLeft: '1.25rem' }}>
            {highlights.map((h, i) => (
              <li
                key={i}
                style={{
                  marginBottom: '0.5rem',
                  listStyleType: 'square',
                  color: 'var(--text-secondary)',
                }}
              >
                {h.endsWith('.') ? h : `${h}.`}
              </li>
            ))}
          </ul>

          <div className="tag-group" style={{ marginBottom: '2rem' }}>
            {(project.techStack || []).map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                Live Production <ExternalLink size={12} />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Github size={14} /> Repository
              </a>
            )}

            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={onClose}
            >
              Close Overview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
