"use client";

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { Plus, Edit, Trash2, Star, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { Project } from '@/lib/types';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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
    
    // Swap
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    // Update order numbers
    newProjects.forEach((p, i) => { p.order = i + 1; });

    setProjects(newProjects);

    // Save to API
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

  return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em' }}>Projects Manager</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '8px' }}>
            Organize and publish your case studies.
          </p>
        </div>

        <Link href="/admin/projects/new" className="btn btn-primary">
          <Plus size={16} /> New Project
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <input type="text" className="form-input" placeholder="Search projects..." style={{ width: '300px' }} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <select className="form-input" style={{ width: 'auto' }}>
            <option>All Types</option>
            <option>SaaS</option>
            <option>Client</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>Loading projects...</div>
      ) : (
        <div className="grid-3">
          {projects.map((project, idx) => (
            <div key={project.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              
              {/* Card Image Header */}
              <div style={{ 
                height: '140px', 
                background: project.thumbnail ? `url(${project.thumbnail}) center/cover` : 'var(--bg-hover)', 
                position: 'relative' 
              }}>
                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                  {project.featured && (
                    <span className="badge badge-featured">
                      <Star size={12} /> Featured
                    </span>
                  )}
                  {project.published ? (
                    <span className="badge badge-published">
                      <Eye size={12} /> Published
                    </span>
                  ) : (
                    <span className="badge badge-draft">
                      <EyeOff size={12} /> Draft
                    </span>
                  )}
                </div>
                
                {/* Project Type Badge */}
                <div style={{ position: 'absolute', bottom: '-12px', left: '16px' }}>
                  <span className="badge badge-type">
                    {project.type}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '24px 16px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>
                  {project.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {project.description || project.tagline || 'No description provided.'}
                </p>
                
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                  {/* Order Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      onClick={() => moveOrder(idx, 'up')}
                      disabled={idx === 0}
                      className="btn btn-outline"
                      style={{ padding: '4px 8px', borderColor: 'transparent' }}
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => moveOrder(idx, 'down')}
                      disabled={idx === projects.length - 1}
                      className="btn btn-outline"
                      style={{ padding: '4px 8px', borderColor: 'transparent' }}
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Link href={`/admin/projects/${project.slug}`} className="btn btn-outline btn-sm">
                      <Edit size={14} /> Edit
                    </Link>
                    <button
                      onClick={() => deleteProject(project)}
                      className="btn btn-outline btn-sm"
                      style={{ color: 'var(--status-danger)', borderColor: 'transparent', padding: '4px 8px' }}
                      title="Delete"
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
