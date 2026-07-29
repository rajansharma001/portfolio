import React from 'react';
import { Github, ExternalLink, ArrowRight } from 'lucide-react';
import { Project } from '@/lib/types';

interface FeaturedProjectsProps {
  projects: Project[];
  onOpenModal: (p: Project) => void;
}

export default function FeaturedProjects({ projects, onOpenModal }: FeaturedProjectsProps) {
  const featured = projects.filter((p) => p.featured).slice(0, 2);

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Featured Projects</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h2 className="section-title">Featured Case Studies</h2>
              <p className="section-subtitle">
                High-impact solutions built with modern technologies.
              </p>
            </div>
            <a href="#" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
              View all projects <ArrowRight size={14} />
            </a>
          </div>
        </div>

        <div className="featured-grid">
          {featured.map((project, idx) => (
            <div key={project.id} className="project-card">
              <div className="project-img-wrapper" style={{ backgroundImage: `url('${project.thumbnail}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="project-img-overlay-badges">
                  <span className="badge-tag badge-purple">SaaS</span>
                  <span className="badge-tag badge-green">Featured</span>
                </div>
              </div>

              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.description}</p>

                <div className="impact-strip">
                  <div className="impact-strip-accent" />
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {(project.impact || project.tagline).split('|').map((point, i) => (
                      <li key={i}>{point.trim()}</li>
                    ))}
                  </ul>
                </div>

                <div className="project-techs">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <span key={tech} className="tech-pill">{tech}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button onClick={() => onOpenModal(project)} className="btn btn-primary" style={{ flex: 1 }}>
                    Case Study
                  </button>
                  
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ flex: 1 }}>
                      Live Demo <ExternalLink size={14} />
                    </a>
                  )}
                  
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.6rem' }} title={project.backendGithubUrl ? "Frontend Repo" : "GitHub Repo"}>
                      <Github size={18} />
                    </a>
                  )}
                  
                  {project.backendGithubUrl && (
                    <a href={project.backendGithubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.6rem' }} title="Backend Repo">
                      <Github size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
