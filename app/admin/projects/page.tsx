"use client";

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { Plus, Edit, Trash2, Star, Eye, EyeOff, ArrowUp, ArrowDown, Search, ExternalLink } from 'lucide-react';
import { Project } from '@/lib/types';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects?admin=true');
      const data = await res.json();
      setProjects(data || []);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const toggleFeatured = async (project: Project) => {
    try {
      await fetch(`/api/projects/${project.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !project.featured }),
      });
      fetchProjects();
    } catch (err) {
      console.error('Failed to toggle featured:', err);
    }
  };

  const togglePublished = async (project: Project) => {
    try {
      await fetch(`/api/projects/${project.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !project.published }),
      });
      fetchProjects();
    } catch (err) {
      console.error('Failed to toggle published:', err);
    }
  };

  const deleteProject = async (project: Project) => {
    if (!confirm(`Are you sure you want to delete project "${project.title}"?`)) return;
    try {
      await fetch(`/api/projects/${project.slug}`, { method: 'DELETE' });
      fetchProjects();
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === projects.length - 1)) return;
    const newProjects = [...projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    newProjects.forEach((p, i) => {
      p.order = i + 1;
    });

    setProjects(newProjects);

    try {
      await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProjects),
      });
    } catch (err) {
      console.error('Failed to save reordered projects:', err);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.techStack || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = typeFilter === 'ALL' || (p.type || '').toUpperCase() === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em' }}>Projects Manager</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
            Add, reorder, feature, and publish your portfolio systems and case studies.
          </p>
        </div>

        <Link href="/admin/projects/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={16} /> Add New Project
        </Link>
      </div>

      {/* Filter & Search Toolbar */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search projects by title, tech, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>

        <select
          className="form-input"
          style={{ width: 'auto', minWidth: '160px' }}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">All Categories</option>
          <option value="SAAS">SaaS Applications</option>
          <option value="CLIENT">Client Systems</option>
          <option value="PERSONAL">Personal / Lab</option>
          <option value="WORDPRESS">WordPress / CMS</option>
        </select>
      </div>

      {loading ? (
        <div style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>Loading projects...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No projects found matching your query.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id}
              className="card"
              style={{
                padding: '0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid var(--border)',
                background: 'var(--bg-surface)',
              }}
            >
              {/* Card Image Header */}
              <div
                style={{
                  height: '150px',
                  background: project.thumbnail ? `url('${project.thumbnail}') center/cover` : 'var(--bg-hover)',
                  position: 'relative',
                  borderBottom: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-main)',
                }}
              >
                <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => togglePublished(project)}
                    className="btn btn-outline btn-sm"
                    style={{
                      background: project.published ? 'rgba(16, 185, 129, 0.9)' : 'rgba(0, 0, 0, 0.7)',
                      color: '#fff',
                      padding: '3px 8px',
                      fontSize: '11px',
                      border: 'none',
                    }}
                    title="Toggle Publish"
                  >
                    {project.published ? <Eye size={12} /> : <EyeOff size={12} />}
                    <span style={{ marginLeft: '4px' }}>{project.published ? 'Published' : 'Draft'}</span>
                  </button>
                </div>

                <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
                  <span
                    style={{
                      background: 'rgba(0, 0, 0, 0.8)',
                      color: 'var(--accent)',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: '700',
                      padding: '3px 8px',
                      border: '1px solid var(--border)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {project.type || 'SYSTEM'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>
                  {project.title}
                </h3>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    marginBottom: '12px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.5',
                  }}
                >
                  {project.description}
                </p>

                {/* Tech tags preview */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
                  {(project.techStack || []).slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        background: 'var(--bg-main)',
                        padding: '2px 6px',
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-dim)',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                  {(project.techStack || []).length > 4 && (
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)', alignSelf: 'center' }}>
                      +{(project.techStack || []).length - 4}
                    </span>
                  )}
                </div>

                {/* Bottom Action Bar */}
                <div
                  style={{
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-light)',
                  }}
                >
                  {/* Order control */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <button
                      onClick={() => moveOrder(idx, 'up')}
                      disabled={idx === 0}
                      className="btn btn-outline"
                      style={{ padding: '4px 6px', borderColor: 'transparent' }}
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => moveOrder(idx, 'down')}
                      disabled={idx === projects.length - 1}
                      className="btn btn-outline"
                      style={{ padding: '4px 6px', borderColor: 'transparent' }}
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                        style={{ padding: '4px 8px' }}
                        title="View Live"
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}
                    <Link
                      href={`/admin/projects/${project.slug}`}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Edit size={12} /> Edit
                    </Link>
                    <button
                      onClick={() => deleteProject(project)}
                      className="btn btn-outline btn-sm"
                      style={{ color: '#ef4444', borderColor: 'transparent', padding: '4px 8px' }}
                      title="Delete Project"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
