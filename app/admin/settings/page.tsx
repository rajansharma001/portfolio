"use client";

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Save, Upload, FileText } from 'lucide-react';
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

    setUploadingPdf(true);
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
        setMessage({ type: 'success', text: 'Resume PDF uploaded successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Resume PDF upload failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Upload error' });
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error('Failed to update settings');
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <AdminLayout>
        <div style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>Loading site settings...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Portfolio Settings & Resume</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Update hero headline, bio, contact details, IDE snippet, and upload your resume PDF.
          </p>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn btn-primary">
          <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <Alert type={message.type as 'error' | 'success' | 'warning'} message={message.text} />

      <form onSubmit={handleSave} className="card" style={{ padding: '2rem', maxWidth: '850px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--accent-cyan)' }}>
          Recruiter Hero & Branding
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
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
            <label className="form-label">Professional Role Title</label>
            <input
              type="text"
              className="form-input"
              value={settings.role}
              onChange={(e) => setSettings({ ...settings, role: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Recruiter Headline</label>
          <textarea
            className="form-textarea"
            rows={3}
            value={settings.headline}
            onChange={(e) => setSettings({ ...settings, headline: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Bio / Profile Summary</label>
          <textarea
            className="form-textarea"
            rows={3}
            value={settings.bio}
            onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Availability Badge Text</label>
            <input
              type="text"
              className="form-input"
              value={settings.availabilityBadgeText}
              onChange={(e) => setSettings({ ...settings, availabilityBadgeText: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Resume PDF File</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input
                type="text"
                className="form-input"
                value={settings.resumeUrl}
                onChange={(e) => setSettings({ ...settings, resumeUrl: e.target.value })}
              />
              <label className="btn btn-outline" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <Upload size={16} /> {uploadingPdf ? 'Uploading...' : 'Upload PDF'}
                <input type="file" accept="application/pdf" onChange={handlePdfUpload} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '2rem 0 1rem 0', color: 'var(--accent-emerald)' }}>
          Contact Information
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
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
          <label className="form-label">Location / Relocation Note</label>
          <input
            type="text"
            className="form-input"
            value={settings.location}
            onChange={(e) => setSettings({ ...settings, location: e.target.value })}
            required
          />
        </div>

        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '2rem 0 1rem 0', color: 'var(--accent-purple)' }}>
          Hero IDE Code Panel Snippet
        </h2>

        <div className="form-group">
          <label className="form-label">Code Block Snippet (displayed on hero right panel)</label>
          <textarea
            className="form-textarea"
            rows={7}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
            value={settings.codeSnippet}
            onChange={(e) => setSettings({ ...settings, codeSnippet: e.target.value })}
          />
        </div>

        <button type="submit" disabled={saving} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
          {saving ? 'Saving Settings...' : 'Save All Settings'}
        </button>
      </form>
    </AdminLayout>
  );
}
