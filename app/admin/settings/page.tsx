"use client";

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Save, Upload, FileText, CheckCircle2, ExternalLink, ShieldCheck, KeyRound, Lock, Eye } from 'lucide-react';
import { PortfolioSettings, DEFAULT_VISIBILITY } from '@/lib/types';
import Alert from '@/components/Alert';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Password change state
  const [pwData, setPwData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPw, setChangingPw] = useState(false);
  const [pwMessage, setPwMessage] = useState({ type: '', text: '' });

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
    
    // Ensure sectionVisibility is included in payload
    const payloadToSave = {
      ...settings,
      sectionVisibility: settings.sectionVisibility || DEFAULT_VISIBILITY
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadToSave),
      });

      if (!res.ok) throw new Error('Failed to update settings');
      setMessage({ type: 'success', text: 'Settings saved successfully in MongoDB Atlas!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMessage({ type: '', text: '' });

    if (pwData.newPassword !== pwData.confirmPassword) {
      setPwMessage({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }

    if (pwData.newPassword.length < 6) {
      setPwMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    setChangingPw(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: pwData.currentPassword,
          newPassword: pwData.newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPwMessage({ type: 'success', text: 'Password successfully updated and hashed in MongoDB Atlas!' });
        setPwData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPwMessage({ type: 'error', text: data.error || 'Failed to update password.' });
      }
    } catch {
      setPwMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setChangingPw(false);
    }
  };

  if (!settings) {
    return (
      <AdminLayout>
        <div style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>Loading site settings...</div>
      </AdminLayout>
    );
  }

  const vis = settings.sectionVisibility || DEFAULT_VISIBILITY;

  const visibilityFields: { key: keyof typeof DEFAULT_VISIBILITY; label: string }[] = [
    { key: 'showHero', label: 'Hero Section' },
    { key: 'showAvailabilityBadge', label: 'Availability Badge' },
    { key: 'showMarquee', label: 'Tech Stack Marquee' },
    { key: 'showProjects', label: 'Projects Section' },
    { key: 'showSkills', label: 'Skills Section' },
    { key: 'showExperience', label: 'Experience Section' },
    { key: 'showProcess', label: 'Process Section' },
    { key: 'showContact', label: 'Contact Section' },
    { key: 'showBlog', label: 'Blog in Navigation' },
    { key: 'showScrollProgress', label: 'Scroll Progress Bar' },
    { key: 'showFooter', label: 'Footer Section' },
    { key: 'showResumeButton', label: 'Resume Download Button' },
    { key: 'showClockWidget', label: 'Clock Widget' },
    { key: 'showThemeToggle', label: 'Theme Toggle' },
  ];

  const handleVisibilityToggle = (key: keyof typeof DEFAULT_VISIBILITY) => {
    setSettings({
      ...settings,
      sectionVisibility: {
        ...vis,
        [key]: !vis[key]
      }
    });
  };

  return (
    <AdminLayout>
      <style dangerouslySetInnerHTML={{ __html: `
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
          flex-shrink: 0;
        }
        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: var(--border-light);
          transition: .3s;
          border-radius: 24px;
        }
        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
        }
        .toggle-switch input:checked + .toggle-slider {
          background-color: var(--accent);
        }
        .toggle-switch input:checked + .toggle-slider:before {
          transform: translateX(20px);
        }
      `}} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em' }}>Profile & Security Settings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
            Manage profile metadata, site visibility, resume document, and secure admin password credentials.
          </p>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <Alert type={message.type as 'error' | 'success' | 'warning'} message={message.text} />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Column: Profile Form + Security Password Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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

            <button type="submit" disabled={saving} className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>

          {/* Section Visibility Controls Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', borderBottom: '1px solid var(--border)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={20} color="var(--accent)" /> Section Visibility Controls
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Toggle the visibility of specific sections and elements across your portfolio. 
              Don't forget to save changes above.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {visibilityFields.map((field) => (
                <div key={field.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                    {field.label}
                  </span>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={vis[field.key] !== false} 
                      onChange={() => handleVisibilityToggle(field.key)} 
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Change Admin Password Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <KeyRound size={20} color="var(--accent)" /> Admin Security & Password
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}>
                <ShieldCheck size={14} /> PBKDF2 SHA-512 Active
              </span>
            </div>

            <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '6px', padding: '12px 16px', fontSize: '13px' }}>
              <div style={{ color: 'var(--text-dim)', marginBottom: '2px' }}>Registered Admin Account</div>
              <div style={{ fontWeight: '700', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>email.rajan001@gmail.com</div>
            </div>

            <Alert type={pwMessage.type as 'error' | 'success' | 'warning'} message={pwMessage.text} />

            <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={pwData.currentPassword}
                  onChange={(e) => setPwData({ ...pwData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={pwData.newPassword}
                    onChange={(e) => setPwData({ ...pwData, newPassword: e.target.value })}
                    placeholder="Min 6 characters"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={pwData.confirmPassword}
                    onChange={(e) => setPwData({ ...pwData, confirmPassword: e.target.value })}
                    placeholder="Re-type new password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={changingPw}
                className="btn btn-outline"
                style={{
                  width: '100%',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderColor: 'var(--accent)',
                  color: '#ffffff',
                }}
              >
                <Lock size={14} /> {changingPw ? 'Updating Password...' : 'Update & Encrypt New Password'}
              </button>
            </form>
          </div>
        </div>

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
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '12px' }}>Security Standards</h3>
            <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: '1.6' }}>
              <li style={{ marginBottom: '6px' }}>Passwords are hashed using 100,000 rounds of PBKDF2 with SHA-512.</li>
              <li style={{ marginBottom: '6px' }}>Every password update generates a cryptographically unique 16-byte salt.</li>
              <li>Plaintext passwords are never saved in database or returned in API responses.</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
