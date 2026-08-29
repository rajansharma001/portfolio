"use client";

import React, { useEffect, useState, use } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';
import { Upload, ArrowLeft, Save } from 'lucide-react';
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
    type: 'SaaS',
    description: '',
    impact: '',
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
          description: p.description || '',
          impact: p.impact || '',
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
  }, [slug]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage({ type: '', text: '' });
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
        setMessage({ type: 'success', text: 'Thumbnail image uploaded successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Image upload failed' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Upload error. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

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

      setMessage({ type: 'success', text: 'Project updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>Loading project details...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <Link
            href="/admin/projects"
            className="btn btn-outline"
            style={{ marginBottom: '12px', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={14} /> Back to Projects
          </Link>
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em' }}>Edit: {formData.title}</h1>
        </div>

        <button onClick={handleSubmit} disabled={saving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <Alert type={message.type as 'error' | 'success' | 'warning'} message={message.text} />

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Main Details */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            Project Specifications
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
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
          </div>

          <div className="form-group">
            <label className="form-label">Project Overview & Description</label>
            <textarea
              className="form-input"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Architectural Highlights & Impact Metrics</label>
            <textarea
              className="form-input"
              rows={3}
              value={formData.impact}
              onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Technologies (Comma-separated)</label>
            <input
              type="text"
              className="form-input"
              value={formData.techStackStr}
              onChange={(e) => setFormData({ ...formData, techStackStr: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
            <label className="form-label">Backend GitHub URL (Optional)</label>
            <input
              type="url"
              className="form-input"
              value={formData.backendGithubUrl}
              onChange={(e) => setFormData({ ...formData, backendGithubUrl: e.target.value })}
            />
          </div>
        </div>

        {/* Media & Publishing Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Thumbnail Visual</h3>
            {formData.thumbnail && (
              <div
                style={{
                  width: '100%',
                  height: '150px',
                  backgroundImage: `url('${formData.thumbnail}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  border: '1px solid var(--border)',
                }}
              />
            )}

            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed var(--border)',
                borderRadius: '6px',
                padding: '24px 16px',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'var(--bg-main)',
              }}
            >
              <Upload size={24} color="var(--accent)" style={{ marginBottom: '6px' }} />
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {uploading ? 'Uploading...' : 'Replace Image'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PNG, JPG, WEBP (Max 5MB)</div>
              <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} style={{ display: 'none' }} />
            </label>

            <div className="form-group" style={{ marginTop: '16px' }}>
              <label className="form-label">Image URL</label>
              <input
                type="text"
                className="form-input"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              />
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Configuration</h3>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="SaaS">SaaS Application</option>
                <option value="Client">Client System</option>
                <option value="Personal">Personal / Research</option>
                <option value="WordPress">WordPress / CMS</option>
              </select>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '12px' }}>
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              />
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Published to Portfolio</span>
            </label>

            <button type="submit" disabled={saving} className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>
              {saving ? 'Saving...' : 'Update Project'}
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
