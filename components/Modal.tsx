import React from 'react';
import Image from 'next/image';
import { X, ExternalLink, Github, CheckCircle } from 'lucide-react';
import { Project } from '@/lib/types';

interface ModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function Modal({ project, onClose }: ModalProps) {
  if (!project) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '750px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2.5rem',
          position: 'relative',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255,255,255,0.05)',
            border: 'none',
            color: 'var(--text-primary)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        >
          <X size={20} />
        </button>

        <span className="badge-tag badge-purple" style={{ marginBottom: '1rem', display: 'inline-block' }}>
          {project.type} Case Study
        </span>

        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{project.title}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '1.5rem' }}>{project.tagline}</p>

        <div style={{ position: 'relative', height: '300px', marginBottom: '2rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>

        {project.impact && (
          <div style={{ background: 'rgba(37, 99, 235, 0.1)', border: '1px solid rgba(37, 99, 235, 0.2)', color: 'var(--accent)', borderRadius: 'var(--radius-sm)', padding: '1rem 1.25rem', marginBottom: '2rem', fontSize: '0.95rem' }}>
            <strong>Highlight / Impact:</strong> {project.impact}
          </div>
        )}

        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          System Overview
        </h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '2rem' }}>
          {project.description}
        </p>

        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          Technologies & Architecture
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2.5rem' }}>
          {project.techStack.map((tech) => (
            <span key={tech} className="tech-pill" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
              {tech}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ flex: 1 }}>
              <ExternalLink size={16} /> Live Application
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ flex: 1 }}>
              <Github size={16} /> {project.backendGithubUrl ? 'Frontend Code' : 'Source Code'}
            </a>
          )}
          {project.backendGithubUrl && (
            <a href={project.backendGithubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ flex: 1 }}>
              <Github size={16} /> Backend Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
