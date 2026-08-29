"use client";

import React, { useEffect, useState, use } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';
import { Upload, ArrowLeft, Save, Code, Heading } from 'lucide-react';
import Link from 'next/link';
import Alert from '@/components/Alert';

type Context = {
  params: Promise<{ slug: string }>;
};

export default function EditPostPage({ params }: Context) {
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
    category: 'Architecture',
    excerpt: '',
    content: '',
    coverImage: '',
    tagsStr: '',
    published: true,
  });

  useEffect(() => {
    async function loadPost() {
      try {
        const res = await fetch(`/api/posts/${slug}`);
        if (!res.ok) throw new Error('Post not found');
        const p = await res.json();
        setFormData({
          id: p.id,
          title: p.title || '',
          slug: p.slug || '',
          category: p.category || 'Architecture',
          excerpt: p.excerpt || '',
          content: p.content || '',
          coverImage: p.coverImage || '',
          tagsStr: Array.isArray(p.tags) ? p.tags.join(', ') : '',
          published: Boolean(p.published),
        });
      } catch (err: any) {
        setMessage({ type: 'error', text: err.message || 'Failed to load post' });
      } finally {
        setLoading(false);
      }
    }
    loadPost();
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
        setFormData((prev) => ({ ...prev, coverImage: result.url }));
        setMessage({ type: 'success', text: 'Cover image uploaded successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Image upload failed' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Upload error. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const insertSnippet = (snippet: string) => {
    setFormData((prev) => ({ ...prev, content: prev.content + snippet }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    const tags = formData.tagsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags,
        }),
      });

      if (!res.ok) throw new Error('Failed to save article updates');

      setMessage({ type: 'success', text: 'Article updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>Loading article...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <Link
            href="/admin/posts"
            className="btn btn-outline"
            style={{ marginBottom: '12px', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={14} /> Back to Articles
          </Link>
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em' }}>Edit: {formData.title}</h1>
        </div>

        <button onClick={handleSubmit} disabled={saving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <Alert type={message.type as 'error' | 'success' | 'warning'} message={message.text} />

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Main Editor */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            Article Content
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Article Title</label>
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
            <label className="form-label">Meta Description / Excerpt</label>
            <textarea
              className="form-input"
              rows={2}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="form-label" style={{ margin: 0 }}>
                Article Markdown Body
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => insertSnippet('\n\n### Heading Title\n')}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '3px 8px', fontSize: '11px' }}
                >
                  <Heading size={12} /> Heading
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet('\n\n```typescript\n// your code here\n```\n')}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '3px 8px', fontSize: '11px' }}
                >
                  <Code size={12} /> Code Block
                </button>
              </div>
            </div>
            <textarea
              className="form-input"
              rows={16}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: '1.6' }}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tags (Comma-separated)</label>
            <input
              type="text"
              className="form-input"
              value={formData.tagsStr}
              onChange={(e) => setFormData({ ...formData, tagsStr: e.target.value })}
            />
          </div>
        </div>

        {/* Media & Meta Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Cover Image</h3>
            {formData.coverImage && (
              <div
                style={{
                  width: '100%',
                  height: '150px',
                  backgroundImage: `url('${formData.coverImage}')`,
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
                {uploading ? 'Uploading...' : 'Replace Cover Image'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PNG, JPG, WEBP (Max 5MB)</div>
              <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} style={{ display: 'none' }} />
            </label>

            <div className="form-group" style={{ marginTop: '16px' }}>
              <label className="form-label">Image URL</label>
              <input
                type="text"
                className="form-input"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              />
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Publishing Settings</h3>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Architecture">Architecture</option>
                <option value="Backend">Backend & Databases</option>
                <option value="Security">Security & Auth</option>
                <option value="Next.js">Next.js & React</option>
                <option value="Performance">Performance & Tuning</option>
                <option value="DevOps">DevOps & Cloud</option>
              </select>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '12px' }}>
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              />
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Published to Public Blog</span>
            </label>

            <button type="submit" disabled={saving} className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>
              {saving ? 'Saving...' : 'Update Article'}
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
