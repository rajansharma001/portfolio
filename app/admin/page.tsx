"use client";

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { Users, Eye, Globe, MapPin, ArrowUpRight, FolderKanban } from 'lucide-react';
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

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<SkillsMap>({});
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData>({ totalViews: 0, uniqueVisitors: 0, visits: [] });

  useEffect(() => {
    async function loadData() {
      try {
        const [resProjects, resSkills, resExp, resSettings, resAnalytics] = await Promise.all([
          fetch('/api/projects?admin=true').then((r) => r.json()),
          fetch('/api/skills').then((r) => r.json()),
          fetch('/api/experience').then((r) => r.json()),
          fetch('/api/settings').then((r) => r.json()),
          fetch('/api/analytics/track').then((r) => r.json()).catch(() => ({ totalViews: 0, uniqueVisitors: 0, visits: [] })),
        ]);

        setProjects(resProjects || []);
        setSkills(resSkills || {});
        setExperience(resExp || []);
        setSettings(resSettings);
        if (resAnalytics) setAnalytics(resAnalytics);
      } catch (err) {
        console.error('Error loading admin dashboard stats:', err);
      }
    }

    loadData();
  }, []);

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

  return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em' }}>Welcome back, Rajan 👋</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            Real-time portfolio overview, traffic analytics, and visitor locations.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: 'rgba(22, 163, 74, 0.1)', color: 'var(--status-success)' }}>
            ● Portfolio is Live
          </span>
          <Link href="/admin/projects/new" className="btn btn-primary">
            Add Project
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div className="form-label">Total Page Views</div>
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

        <div className="card" style={{ borderLeft: '4px solid var(--accent-purple)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div className="form-label">Total Projects</div>
            <FolderKanban size={18} color="var(--accent-purple)" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '4px' }}>{projects.length}</div>
          <div style={{ fontSize: '12px', color: 'var(--status-success)' }}>{projects.filter((p) => p.published).length} Published</div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div className="form-label">Top Visitor Country</div>
            <Globe size={18} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {sortedLocations.length > 0 ? (
              <>
                <span>{sortedLocations[0][1].flag}</span>
                <span>{sortedLocations[0][0]}</span>
              </>
            ) : (
              <span style={{ fontSize: '16px', color: 'var(--text-dim)', fontWeight: '500' }}>No visits yet</span>
            )}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Highest traffic source</div>
        </div>
      </div>

      {/* Visitor Analytics & Location Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Recent Visitors Table */}
        <div className="card">
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
