"use client";

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { Users, Eye, Globe, MapPin, ArrowUpRight, FolderKanban, Mail, FileText, Upload, CheckCircle2, Database, RefreshCw, AlertCircle, HelpCircle } from 'lucide-react';
import { Project, SkillsMap, ExperienceItem, PortfolioSettings } from '@/lib/types';

interface VisitRecord {
  ip: string;
  country: string;
  city: string;
  flag: string;
  path: string;
  userAgent: string;
  timestamp: string;
}

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  visits: VisitRecord[];
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface DbHealth {
  status: string;
  connected: boolean;
  latencyMs: number;
  host?: string;
  databaseName?: string;
  collectionsCount?: number;
  message?: string;
  checking?: boolean;
}

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<SkillsMap>({});
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({ totalViews: 0, uniqueVisitors: 0, visits: [] });
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const [dbHealth, setDbHealth] = useState<DbHealth>({
    status: 'checking',
    connected: false,
    latencyMs: 0,
    checking: true,
  });

  const checkDb = async () => {
    setDbHealth((prev) => ({ ...prev, checking: true }));
    try {
      const res = await fetch('/api/health/db');
      const data = await res.json();
      setDbHealth({
        ...data,
        checking: false,
      });
    } catch {
      setDbHealth({
        status: 'error',
        connected: false,
        latencyMs: 0,
        message: 'Could not connect to database health API.',
        checking: false,
      });
    }
  };

  const loadData = async () => {
    try {
      checkDb();

      const [resProjects, resSkills, resExp, resSettings, resAnalytics, resMessages] = await Promise.all([
        fetch('/api/projects?admin=true').then((r) => r.json()),
        fetch('/api/skills').then((r) => r.json()),
        fetch('/api/experience').then((r) => r.json()),
        fetch('/api/settings').then((r) => r.json()),
        fetch('/api/analytics/track').then((r) => r.json()).catch(() => ({ totalViews: 0, uniqueVisitors: 0, visits: [] })),
        fetch('/api/messages').then((r) => r.json()).catch(() => []),
      ]);

      setProjects(resProjects || []);
      setSkills(resSkills || {});
      setExperience(resExp || []);
      setSettings(resSettings);
      if (resAnalytics) setAnalytics(resAnalytics);
      setMessages(resMessages || []);
    } catch (err) {
      console.error('Error loading admin dashboard stats:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      return;
    }

    setUploadingPdf(true);
    setUploadStatus(null);
    const data = new FormData();
    data.append('file', file);
    data.append('type', 'resume');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (res.ok && result.url && settings) {
        // Save to settings
        const updated = { ...settings, resumeUrl: result.url };
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
        setSettings(updated);
        setUploadStatus('Resume PDF updated successfully!');
      } else {
        alert(result.error || 'Resume PDF upload failed');
      }
    } catch {
      alert('Upload error. Please try again.');
    } finally {
      setUploadingPdf(false);
    }
  };

  // Compute country breakdown
  const locationCounts: Record<string, { count: number; flag: string }> = {};
  (analytics.visits || []).forEach((v) => {
    const key = v.country || 'Unknown';
    if (!locationCounts[key]) {
      locationCounts[key] = { count: 0, flag: v.flag || '🌐' };
    }
    locationCounts[key].count += 1;
  });

  const sortedLocations = Object.entries(locationCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);

  const unreadMessages = messages.filter((m) => !m.read);

  return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em' }}>Welcome back, Rajan 👋</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>
            Production overview, recruiter inquiries, database connection health, and traffic analytics.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: 'rgba(22, 163, 74, 0.1)', color: 'var(--status-success)' }}>
            ● Portfolio Live
          </span>
          <Link href="/admin/projects/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            + Add Project
          </Link>
        </div>
      </div>

      {/* Live MongoDB Atlas Database Health Banner */}
      <div
        className="card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          padding: '16px 20px',
          background: dbHealth.connected ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
          borderLeft: `4px solid ${dbHealth.connected ? '#10b981' : '#ef4444'}`,
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Database size={22} color={dbHealth.connected ? '#10b981' : '#ef4444'} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '700', fontSize: '14px' }}>MongoDB Atlas Cloud Cluster</span>
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: dbHealth.connected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: dbHealth.connected ? '#10b981' : '#ef4444',
                  fontWeight: '700',
                }}
              >
                {dbHealth.checking ? 'CHECKING...' : dbHealth.connected ? 'CONNECTED (HEALTHY)' : 'DISCONNECTED'}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
              {dbHealth.connected
                ? `Latency: ${dbHealth.latencyMs}ms | Collections: ${dbHealth.collectionsCount} | DB: ${dbHealth.databaseName}`
                : dbHealth.message || 'Unable to connect to MongoDB Atlas cluster'}
            </div>
          </div>
        </div>

        <button
          onClick={checkDb}
          disabled={dbHealth.checking}
          className="btn btn-outline btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
        >
          <RefreshCw size={12} className={dbHealth.checking ? 'spin' : ''} />
          {dbHealth.checking ? 'Pinging Cluster...' : 'Check Connection'}
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div className="form-label">Total Impressions</div>
            <Eye size={18} color="var(--accent)" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '4px' }}>{analytics.totalViews}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Real-time page views</div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div className="form-label">Unique Visitors</div>
            <Users size={18} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '4px' }}>{analytics.uniqueVisitors}</div>
          <div style={{ fontSize: '12px', color: 'var(--accent-emerald)' }}>Recorded unique IPs</div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div className="form-label">Inbound Messages</div>
            <Mail size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '4px' }}>{messages.length}</div>
          <div style={{ fontSize: '12px', color: unreadMessages.length > 0 ? '#f59e0b' : 'var(--text-secondary)' }}>
            {unreadMessages.length} Unread inquiries
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div className="form-label">Top Location</div>
            <Globe size={18} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {sortedLocations.length > 0 ? (
              <>
                <span>{sortedLocations[0][1].flag}</span>
                <span>{sortedLocations[0][0]}</span>
              </>
            ) : (
              <span style={{ fontSize: '15px', color: 'var(--text-dim)', fontWeight: '500' }}>No visits yet</span>
            )}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Highest traffic origin</div>
        </div>
      </div>

      {/* Quick Actions & Resume Manager Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Resume Quick Upload Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="var(--accent)" /> Resume PDF Document
            </h3>
            {settings?.resumeUrl && (
              <a
                href={settings.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                View PDF <ArrowUpRight size={14} />
              </a>
            )}
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            The PDF resume linked to the "Print / Download CV" actions across your portfolio.
          </p>

          {uploadStatus && (
            <div style={{ fontSize: '12px', color: 'var(--status-success)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} /> {uploadStatus}
            </div>
          )}

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              border: '2px dashed var(--border)',
              borderRadius: '6px',
              padding: '16px',
              cursor: 'pointer',
              background: 'var(--bg-main)',
            }}
          >
            <Upload size={18} color="var(--accent)" />
            <span style={{ fontSize: '13px', fontWeight: '700' }}>
              {uploadingPdf ? 'Uploading PDF...' : 'Upload / Replace Resume PDF'}
            </span>
            <input type="file" accept="application/pdf" onChange={handleResumeUpload} disabled={uploadingPdf} style={{ display: 'none' }} />
          </label>
        </div>

        {/* Quick System Links */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Quick Navigation</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Link
              href="/admin/projects"
              className="btn btn-outline"
              style={{ justifyContent: 'flex-start', padding: '12px', gap: '8px', fontSize: '13px' }}
            >
              <FolderKanban size={16} /> Manage Projects ({projects.length})
            </Link>

            <Link
              href="/admin/messages"
              className="btn btn-outline"
              style={{ justifyContent: 'flex-start', padding: '12px', gap: '8px', fontSize: '13px' }}
            >
              <Mail size={16} /> Inquiries ({messages.length})
            </Link>

            <Link
              href="/admin/skills"
              className="btn btn-outline"
              style={{ justifyContent: 'flex-start', padding: '12px', gap: '8px', fontSize: '13px' }}
            >
              Manage Skills ({Object.keys(skills).length} categories)
            </Link>

            <Link
              href="/admin/content"
              className="btn btn-outline"
              style={{ justifyContent: 'flex-start', padding: '12px', gap: '8px', fontSize: '13px' }}
            >
              <HelpCircle size={16} /> Content & FAQs
            </Link>

            <Link
              href="/admin/settings"
              className="btn btn-outline"
              style={{ justifyContent: 'flex-start', padding: '12px', gap: '8px', fontSize: '13px' }}
            >
              Profile & Security
            </Link>
          </div>
        </div>
      </div>

      {/* Visitor Analytics & Location Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Recent Visitors Table */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Recent Visitor Sessions</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Real-time incoming traffic locations & IP traces</p>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Live Log <ArrowUpRight size={14} />
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            {analytics.visits && analytics.visits.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '8px 12px' }}>Location</th>
                    <th style={{ padding: '8px 12px' }}>City</th>
                    <th style={{ padding: '8px 12px' }}>IP Address</th>
                    <th style={{ padding: '8px 12px' }}>Path</th>
                    <th style={{ padding: '8px 12px' }}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.visits.slice(0, 8).map((visit, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{visit.flag}</span>
                        <span>{visit.country}</span>
                      </td>
                      <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{visit.city}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-cyan)' }}>{visit.ip}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{visit.path}</td>
                      <td style={{ padding: '10px 12px', fontSize: '11px', color: 'var(--text-dim)' }}>
                        {new Date(visit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
                No live visitor traffic recorded yet. Open your portfolio in a browser tab to record your first live visit!
              </div>
            )}
          </div>
        </div>

        {/* Top Locations Card */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="var(--accent)" /> Visitor Locations
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Geographic breakdown of portfolio readers</p>

          {sortedLocations.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {sortedLocations.map(([country, data]) => {
                const percentage = Math.round((data.count / (analytics.visits?.length || 1)) * 100);
                return (
                  <div key={country}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{data.flag}</span> {country}
                      </span>
                      <span style={{ color: 'var(--text-secondary)' }}>{data.count} views ({percentage}%)</span>
                    </div>
                    <div style={{ height: '6px', width: '100%', background: 'var(--bg-hover)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.max(percentage, 8)}%`, background: 'var(--accent)', borderRadius: '3px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-dim)', fontSize: '13px' }}>
              Awaiting live traffic...
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
