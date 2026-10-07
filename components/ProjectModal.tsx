"use client";

import React, { useEffect } from 'react';
import { Project } from '@/lib/types';
import {
  X,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  Cpu,
  Layers,
  Clock,
  User,
  Workflow,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onOpenContact?: (projectName?: string) => void;
}

export default function ProjectModal({ project, onClose, onOpenContact }: ProjectModalProps) {
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

  const handleDiscussProject = () => {
    onClose();
    if (onOpenContact) {
      onOpenContact(project.title);
    } else {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div
      className="modal-overlay active"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(6px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '4px',
          padding: '2.25rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          color: 'var(--text-primary)',
        }}
      >
        {/* Top Bar: Tags & Close Button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.5rem',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                padding: '4px 10px',
                borderRadius: '2px',
                color: 'var(--text-primary)',
                letterSpacing: '0.04em',
              }}
            >
              {project.type || 'Full-Stack Architecture'}
            </span>
            {project.featured && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  background: 'var(--text-primary)',
                  color: 'var(--bg-primary)',
                  padding: '4px 10px',
                  borderRadius: '2px',
                  letterSpacing: '0.04em',
                }}
              >
                Featured Case Study
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Close Modal"
            style={{
              background: 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: '2px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.15s ease',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Project Title & Tagline */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
              fontWeight: '800',
              letterSpacing: '-0.03em',
              lineHeight: '1.2',
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}
          >
            {project.title}
          </h2>
          {project.tagline && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              {project.tagline}
            </p>
          )}
        </div>

        {/* Monochrome Metadata Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            padding: '14px 18px',
            background: 'var(--bg-primary)',
            borderRadius: '2px',
            border: '1px solid var(--border-color)',
            marginBottom: '1.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={16} color="var(--text-primary)" />
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                Role
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {details.role || 'Full-Stack Software Engineer'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={16} color="var(--text-primary)" />
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                Scope
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {details.duration || 'Production Deployment'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={16} color="var(--text-primary)" />
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                Status
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                Deployed & Operational
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
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <ExternalLink size={14} /> Open Live Production System
            </a>
          )}

          <button
            type="button"
            onClick={handleDiscussProject}
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <MessageSquare size={14} /> Discuss Project / Inquire
          </button>
        </div>

        {/* Problem & Solution Grid (Monochrome) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '1.75rem',
          }}
        >
          {/* Engineering Challenge */}
          <div
            style={{
              padding: '16px 18px',
              background: 'var(--bg-primary)',
              borderRadius: '2px',
              border: '1px solid var(--border-color)',
              borderLeft: '3px solid var(--text-primary)',
            }}
          >
            <h4
              style={{
                fontSize: '12px',
                fontWeight: '700',
                marginBottom: '8px',
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.04em',
              }}
            >
              Engineering Challenge
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              {details.problem || project.description}
            </p>
          </div>

          {/* Architectural Solution */}
          <div
            style={{
              padding: '16px 18px',
              background: 'var(--bg-primary)',
              borderRadius: '2px',
              border: '1px solid var(--border-color)',
              borderLeft: '3px solid var(--text-primary)',
            }}
          >
            <h4
              style={{
                fontSize: '12px',
                fontWeight: '700',
                marginBottom: '8px',
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.04em',
              }}
            >
              Architectural Solution
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              {details.solution || project.impact || 'Engineered with clean architectural patterns, type-safety, and optimized database indexing.'}
            </p>
          </div>
        </div>

        {/* System Architecture Flow */}
        <div
          style={{
            padding: '18px 20px',
            background: 'var(--bg-primary)',
            borderRadius: '2px',
            border: '1px solid var(--border-color)',
            marginBottom: '1.75rem',
          }}
        >
          <h4
            style={{
              fontSize: '13px',
              fontWeight: '700',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
            }}
          >
            <Workflow size={15} color="var(--text-primary)" /> System Architecture & Data Flow
          </h4>
          <div
            style={{
              padding: '14px 16px',
              background: 'var(--bg-secondary)',
              borderRadius: '2px',
              border: '1px solid var(--border-color)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              lineHeight: '1.7',
              color: 'var(--text-primary)',
            }}
          >
            {details.architecture ? (
              <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{details.architecture}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  [Client Interface / Next.js] &rarr; [JWT Middleware / Validation] &rarr; [Node.js REST Engine]
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  &darr; [Atomic Queries / Aggregation Pipeline] &rarr; [MongoDB / PostgreSQL] &rarr; [Cloud Storage]
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Features Built */}
        {hasFeatures && (
          <div
            style={{
              padding: '18px 20px',
              background: 'var(--bg-primary)',
              borderRadius: '2px',
              border: '1px solid var(--border-color)',
              marginBottom: '1.75rem',
            }}
          >
            <h4
              style={{
                fontSize: '13px',
                fontWeight: '700',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
              }}
            >
              <Layers size={15} color="var(--text-primary)" /> Key Shipped Capabilities
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
              {details.features?.map((feat, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    fontSize: '13px',
                    padding: '8px 12px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '2px',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <CheckCircle2 size={15} color="var(--text-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-primary)' }}>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack Pills (Monochrome) */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h4
            style={{
              fontSize: '12px',
              fontWeight: '700',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            <Cpu size={14} color="var(--text-primary)" /> Technologies Applied
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
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '2px',
                  color: 'var(--text-primary)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Engineering Takeaways (Monochrome) */}
        {details.takeaways && (
          <div
            style={{
              padding: '16px 18px',
              background: 'var(--bg-primary)',
              borderLeft: '3px solid var(--text-primary)',
              borderRadius: '2px',
              marginBottom: '1.75rem',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                marginBottom: '4px',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.04em',
              }}
            >
              Engineering Takeaway
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.6' }}>
              {details.takeaways}
            </p>
          </div>
        )}

        {/* Bottom CTA Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-color)',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Interested in discussing system architecture or similar requirements?
          </span>
          <button
            type="button"
            onClick={handleDiscussProject}
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            Start Project Discussion <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
