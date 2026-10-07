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
  Sparkles,
  AlertCircle,
  Clock,
  User,
  Workflow,
  ArrowRight,
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
        background: 'rgba(0, 0, 0, 0.75)',
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
          borderRadius: '12px',
          padding: '2rem 2.25rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          position: 'relative',
        }}
      >
        {/* Top Bar: Tags & Close Button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.25rem',
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
                padding: '3px 10px',
                borderRadius: '4px',
                color: 'var(--accent)',
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
                  background: 'var(--accent)',
                  color: '#ffffff',
                  padding: '3px 10px',
                  borderRadius: '4px',
                }}
              >
                ★ Featured Case Study
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Close Case Study Modal"
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background 0.2s',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Project Title & Tagline */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
              color: 'var(--text-primary)',
              marginBottom: '6px',
            }}
          >
            {project.title}
          </h2>
          {project.tagline && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              {project.tagline}
            </p>
          )}
        </div>

        {/* Meta Stats Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            padding: '14px 18px',
            background: 'var(--bg-primary)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            marginBottom: '1.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={16} color="var(--accent)" />
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                Engineering Role
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {details.role || 'Full-Stack Software Engineer'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={16} color="var(--accent)" />
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                Project Scope
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {details.duration || 'Production Deployment'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={16} color="#10b981" />
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                System Status
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#10b981' }}>
                ● Deployed & Operational
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons (CTAs for Leads & Demos) */}
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
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              borderColor: 'var(--accent)',
              color: 'var(--accent)',
            }}
          >
            <MessageSquare size={14} /> Discuss Similar Build / Hire
          </button>
        </div>

        {/* Problem & Solution Symmetrical Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '1.75rem',
          }}
        >
          {/* Problem */}
          <div
            style={{
              padding: '16px 18px',
              background: 'var(--bg-primary)',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              borderLeft: '4px solid #ef4444',
            }}
          >
            <h4
              style={{
                fontSize: '13px',
                fontWeight: '700',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#ef4444',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <AlertCircle size={15} /> Engineering Challenge
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              {details.problem || project.description}
            </p>
          </div>

          {/* Solution */}
          <div
            style={{
              padding: '16px 18px',
              background: 'var(--bg-primary)',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              borderLeft: '4px solid #10b981',
            }}
          >
            <h4
              style={{
                fontSize: '13px',
                fontWeight: '700',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#10b981',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <CheckCircle2 size={15} /> Architectural Solution
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              {details.solution || project.impact || 'Engineered with clean architectural patterns, type-safety, and optimized database indexing.'}
            </p>
          </div>
        </div>

        {/* Architecture Flow Section */}
        <div
          style={{
            padding: '18px 20px',
            background: 'var(--bg-primary)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            marginBottom: '1.75rem',
          }}
        >
          <h4
            style={{
              fontSize: '14px',
              fontWeight: '700',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-primary)',
            }}
          >
            <Workflow size={16} color="var(--accent)" /> System Architecture & Data Pipeline
          </h4>
          <div
            style={{
              padding: '14px 16px',
              background: 'var(--bg-secondary)',
              borderRadius: '6px',
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
                <div style={{ color: 'var(--accent)' }}>
                  [Client UI / Next.js 16] &rarr; [JWT Auth Middleware / Zod Validation] &rarr; [Node.js REST API]
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  &darr; [Atomic Queries / Aggregation Pipeline] &rarr; [MongoDB / PostgreSQL] &rarr; [Cloud CDN Storage]
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
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              marginBottom: '1.75rem',
            }}
          >
            <h4
              style={{
                fontSize: '14px',
                fontWeight: '700',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--text-primary)',
              }}
            >
              <Layers size={16} color="var(--accent)" /> Key Shipped Capabilities
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
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <CheckCircle2 size={15} color="#10b981" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-primary)' }}>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack Pills */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h4
            style={{
              fontSize: '13px',
              fontWeight: '700',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
            }}
          >
            <Cpu size={15} color="var(--accent)" /> Technologies Applied
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
          <div
            style={{
              padding: '16px 18px',
              background: 'var(--bg-primary)',
              borderLeft: '4px solid var(--accent)',
              borderRadius: '6px',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                marginBottom: '4px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Engineering Takeaway
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: 0, lineHeight: '1.6' }}>
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
            Interested in building a similar production system?
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
