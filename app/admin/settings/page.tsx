"use client";

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Save, Upload, FileText, CheckCircle2, ExternalLink, RefreshCw } from 'lucide-react';
import { PortfolioSettings } from '@/lib/types';
import Alert from '@/components/Alert';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data));
  }, []);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    if (file.type !== 'application/pdf') {
      setMessage({ type: 'error', text: 'Only PDF files are allowed.' });
      return;
    }

    setUploadingPdf(true);
    setMessage({ type: '', text: '' });
    const data = new FormData();
    data.append('file', file);
    data.append('type', 'resume');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (res.ok && result.url) {
        setSettings({ ...settings, resumeUrl: result.url });
        setMessage({ type: 'success', text: 'Resume PDF uploaded and updated successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Resume PDF upload failed' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Upload error. Please try again.' });
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error('Failed to update settings');
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <AdminLayout>
        <div style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>Loading site settings...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em' }}>Profile & Resume Settings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
            Manage profile metadata, resume PDF document, and contact information.
          </p>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <Alert type={message.type as 'error' | 'success' | 'warning'} message={message.text} />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Main Settings Form */}
        <form onSubmit={handleSave} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            Identity & Contact Details
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role Title</label>
              <input
                type="text"
                className="form-input"
                value={settings.role}
                onChange={(e) => setSettings({ ...settings, role: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-input"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-input"
              value={settings.location}
              onChange={(e) => setSettings({ ...settings, location: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Professional Bio / Summary</label>
            <textarea
              className="form-input"
              rows={3}
              value={settings.bio}
              onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
              placeholder="Brief summary of your background and core focus..."
              required
            />
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: '700', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginTop: '12px' }}>
            Terminal Snippet
          </h2>

          <div className="form-group">
            <label className="form-label">Interactive Hero Terminal Code Block</label>
            <textarea
              className="form-input"
              rows={6}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}
              value={settings.codeSnippet}
              onChange={(e) => setSettings({ ...settings, codeSnippet: e.target.value })}
            />
          </div>

          <button type="submit" disabled={saving} className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>

        {/* Sidebar: Resume PDF Upload & Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="var(--accent)" /> Resume PDF Manager
            </h3>

            <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '1.25rem', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700' }}>Current File</span>
                <span style={{ fontSize: '11px', color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={12} /> Active
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
                {settings.resumeUrl || '/uploads/resume.pdf'}
              </div>

              {settings.resumeUrl && (
                <a
                  href={settings.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  View Current Resume <ExternalLink size={12} />
                </a>
              )}
            </div>

            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed var(--border)',
                borderRadius: '8px',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'var(--bg-main)',
                transition: 'border-color 0.2s',
              }}
            >
              <Upload size={28} color="var(--accent)" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {uploadingPdf ? 'Uploading PDF...' : 'Upload New Resume'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Click to browse (PDF only, max 10MB)
              </div>
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                disabled={uploadingPdf}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '12px' }}>Quick Tips</h3>
            <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: '1.6' }}>
              <li style={{ marginBottom: '6px' }}>Uploading a new resume will automatically replace the existing PDF file.</li>
              <li style={{ marginBottom: '6px' }}>Keep your role title and location concise for optimal recruiter visibility.</li>
              <li>Terminal commands update instantly when you save changes.</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
