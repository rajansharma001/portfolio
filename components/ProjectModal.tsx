"use client";

import React, { useEffect } from 'react';
import { Project } from '@/lib/types';
import {
  X,
  ExternalLink,
  Github,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  AlertCircle,
  Clock,
  User,
  Workflow,
} from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
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

  const details = project.details || {};
  const hasFeatures = details.features && details.features.length > 0;

  return (
    <div className="modal-overlay active" onClick={onClose} style={{ display: 'flex', zIndex: 1100 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '840px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2.5rem',
          borderRadius: '12px',
        }}
      >
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className="project-type-tag">{project.type || 'Full-Stack'}</span>
              {project.featured && <span className="featured-badge">Featured Case Study</span>}
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
              {project.title}
            </h2>
            {project.tagline && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
                {project.tagline}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Close Case Study Modal"
            style={{
              background: 'var(--bg-main)',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Project Meta Chips */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
            padding: '14px',
            background: 'var(--bg-main)',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={16} color="var(--accent)" />
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Role</div>
              <div style={{ fontSize: '12px', fontWeight: '700' }}>{details.role || 'Lead Engineer'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} color="var(--accent)" />
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Timeline</div>
              <div style={{ fontSize: '12px', fontWeight: '700' }}>{details.duration || 'Production System'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="var(--accent)" />
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Status</div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--status-success)' }}>
                ● Deployed & Operational
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ExternalLink size={14} /> Live Production Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Github size={14} /> Frontend / Main Repository
            </a>
          )}
          {project.backendGithubUrl && (
            <a
              href={project.backendGithubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Github size={14} /> Backend API Repository
            </a>
          )}
        </div>

        {/* Problem & Solution Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '2rem' }}>
          {/* Problem */}
          <div className="card" style={{ background: 'var(--bg-main)', borderLeft: '4px solid #ef4444' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444' }}>
              <AlertCircle size={16} /> Engineering Challenge
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {details.problem || project.description}
            </p>
          </div>

          {/* Solution */}
          <div className="card" style={{ background: 'var(--bg-main)', borderLeft: '4px solid #10b981' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}>
              <CheckCircle2 size={16} /> Architectural Solution
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {details.solution || project.impact || 'Engineered with clean architectural patterns, type-safety, and optimized database indexing.'}
            </p>
          </div>
        </div>

        {/* Architecture Flow Section */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Workflow size={18} color="var(--accent)" /> System Architecture & Data Pipeline
          </h4>
          <div
            style={{
              padding: '16px',
              background: 'var(--bg-main)',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              lineHeight: '1.6',
              color: 'var(--text-primary)',
            }}
          >
            {details.architecture ? (
              <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{details.architecture}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ color: 'var(--accent-cyan)' }}>
                  [Client UI / Next.js 16] &rarr; [JWT Auth Middleware / Zod Validation] &rarr; [Node.js / Express REST API]
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  &darr; [Atomic Queries / Aggregation Pipeline] &rarr; [MongoDB / PostgreSQL] &rarr; [Cloud CDN / Asset Storage]
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Features Built */}
        {hasFeatures && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="var(--accent)" /> Key Shipped Capabilities
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
              {details.features?.map((feat, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    fontSize: '13px',
                    padding: '8px 12px',
                    background: 'var(--bg-main)',
                    borderRadius: '6px',
                  }}
                >
                  <CheckCircle2 size={16} color="var(--status-success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack Pills */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={16} color="var(--accent)" /> Technologies Applied
          </h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {project.techStack?.map((tech, idx) => (
              <span
                key={idx}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '4px 10px',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Engineering Takeaways */}
        {details.takeaways && (
          <div style={{ padding: '16px', background: 'var(--bg-hover)', borderLeft: '3px solid var(--accent)', borderRadius: '4px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
              Engineering Takeaway
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: 0, lineHeight: '1.6' }}>
              {details.takeaways}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
