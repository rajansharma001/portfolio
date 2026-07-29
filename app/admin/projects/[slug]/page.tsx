"use client";

import React, { useEffect, useState, use } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';
import { Upload, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Alert from '@/components/Alert';

type Context = {
  params: Promise<{ slug: string }>;
};

export default function EditProjectPage({ params }: Context) {
  const { slug } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    slug: '',
    type: 'SaaS' as 'SaaS' | 'Client' | 'Personal' | 'WordPress',
    tagline: '',
    impact: '',
    description: '',
    thumbnail: '',
    techStackStr: '',
    liveUrl: '',
    githubUrl: '',
    backendGithubUrl: '',
    featured: false,
    published: true,
    order: 1,
  });

  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch(`/api/projects/${slug}`);
        if (!res.ok) throw new Error('Project not found');
        const p = await res.json();
        setFormData({
          id: p.id,
          title: p.title || '',
          slug: p.slug || '',
          type: p.type || 'SaaS',
          tagline: p.tagline || '',
          impact: p.impact || '',
          description: p.description || '',
          thumbnail: p.thumbnail || '',
          techStackStr: Array.isArray(p.techStack) ? p.techStack.join(', ') : '',
          liveUrl: p.liveUrl || '',
          githubUrl: p.githubUrl || '',
          backendGithubUrl: p.backendGithubUrl || '',
          featured: Boolean(p.featured),
          published: Boolean(p.published),
          order: p.order || 1,
        });
      } catch (err: any) {
        setMessage({ type: 'error', text: err.message || 'Failed to load project' });
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [slug, router]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append('file', file);
    data.append('type', 'image');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (res.ok && result.url) {
        setFormData((prev) => ({ ...prev, thumbnail: result.url }));
      } else {
        setMessage({ type: 'error', text: result.error || 'Image upload failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Upload error' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const techStack = formData.techStackStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`/api/projects/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          techStack,
        }),
      });

      if (!res.ok) throw new Error('Failed to save project updates');

      setMessage({ type: 'success', text: 'Project saved successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>Loading project details...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <Link href="/admin/projects" className="btn btn-outline" style={{ marginBottom: '16px', padding: '6px 12px' }}>
            <ArrowLeft size={14} /> Back to Projects
          </Link>
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em' }}>Edit Project: {formData.title}</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="button" onClick={handleSubmit} disabled={saving} className="btn btn-primary">
            {saving ? 'Updating Project...' : 'Publish Updates'}
          </button>
        </div>
      </div>

      <Alert type={message.type as 'error' | 'success' | 'warning'} message={message.text} />

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="card">
          <div className="form-group">
            <label className="form-label">Project Title</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">URL Slug</label>
            <input
              type="text"
              className="form-input"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Short Summary</label>
            <textarea
              className="form-input"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Case Study / Tagline</label>
            <textarea
              className="form-input"
              rows={6}
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Impact Statement</label>
            <input
              type="text"
              className="form-input"
              value={formData.impact}
              onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tech Stack (comma-separated)</label>
            <input
              type="text"
              className="form-input"
              value={formData.techStackStr}
              onChange={(e) => setFormData({ ...formData, techStackStr: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Live Demo URL</label>
              <input
                type="url"
                className="form-input"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input
                type="url"
                className="form-input"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Backend GitHub URL (optional)</label>
            <input
              type="url"
              className="form-input"
              value={formData.backendGithubUrl}
              onChange={(e) => setFormData({ ...formData, backendGithubUrl: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Media</h3>
            {formData.thumbnail && (
              <img src={formData.thumbnail} alt="Preview" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }} />
            )}
            <label style={{ display: 'block', border: '2px dashed var(--border)', borderRadius: '8px', padding: '32px', textAlign: 'center', cursor: 'pointer' }}>
              <div className="text-secondary" style={{ marginBottom: '8px' }}>
                <Upload size={24} style={{ margin: '0 auto' }} />
              </div>
              <p className="text-secondary">{uploading ? 'Uploading...' : 'Drag & Drop Image\nor click to browse'}</p>
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
            <input
              type="text"
              className="form-input"
              style={{ marginTop: '16px' }}
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
            />
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Settings</h3>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <option value="SaaS">SaaS</option>
                <option value="Client">Client</option>
                <option value="Personal">Personal</option>
                <option value="WordPress">WordPress</option>
              </select>
            </div>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '12px' }}>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              />
              <span style={{ fontSize: '14px' }}>Featured Project</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              />
              <span style={{ fontSize: '14px' }}>Published</span>
            </label>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
