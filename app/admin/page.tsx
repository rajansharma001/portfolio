"use client";

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { FolderKanban, Cpu, Briefcase, Settings, Plus, Sparkles, CheckCircle, FileText } from 'lucide-react';
import { Project, SkillsMap, ExperienceItem, PortfolioSettings } from '@/lib/types';

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<SkillsMap>({});
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [resProjects, resSkills, resExp, resSettings] = await Promise.all([
          fetch('/api/projects?admin=true').then((r) => r.json()),
          fetch('/api/skills').then((r) => r.json()),
          fetch('/api/experience').then((r) => r.json()),
          fetch('/api/settings').then((r) => r.json()),
        ]);

        setProjects(resProjects || []);
        setSkills(resSkills || {});
        setExperience(resExp || []);
        setSettings(resSettings);
      } catch (err) {
        console.error('Error loading admin dashboard stats:', err);
      }
    }

    loadData();
  }, []);

  const totalSkillsCount = Object.values(skills).reduce((sum, list) => sum + list.length, 0);

  return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em' }}>Welcome back, Rajan 👋</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            Here's what's happening with your portfolio today.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: 'rgba(22, 163, 74, 0.1)', color: 'var(--status-success)' }}>
            Portfolio is Live
          </span>
          <Link href="/admin/projects/new" className="btn btn-primary">
            Add Project
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <div className="card">
          <div className="form-label" style={{ marginBottom: '8px' }}>Total Projects</div>
          <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>{projects.length}</div>
          <div style={{ fontSize: '12px', color: 'var(--status-success)' }}>{projects.filter((p) => p.published).length} Published</div>
        </div>

        <div className="card">
          <div className="form-label" style={{ marginBottom: '8px' }}>Featured Items</div>
          <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>{projects.filter((p) => p.featured).length}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Max 4 recommended</div>
        </div>

        <div className="card">
          <div className="form-label" style={{ marginBottom: '8px' }}>Total Skills</div>
          <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>{totalSkillsCount}</div>
          <div style={{ fontSize: '12px', color: 'var(--status-success)' }}>Across {Object.keys(skills).length} categories</div>
        </div>

        <div className="card">
          <div className="form-label" style={{ marginBottom: '8px' }}>Experience Nodes</div>
          <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>{experience.length}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Career timeline records</div>
        </div>
      </div>

      {/* Dashboard Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px' }}>
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '24px' }}>Recent Activity</h3>
          <div>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '50%', marginTop: '6px' }}></div>
              <div>
                <div style={{ fontWeight: '500' }}>Admin UI Updated</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Just now • Layout & Design System</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: '8px', height: '8px', background: 'var(--status-success)', borderRadius: '50%', marginTop: '6px' }}></div>
              <div>
                <div style={{ fontWeight: '500' }}>System Initialization</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Today • Automated logging</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '8px', height: '8px', background: 'var(--text-secondary)', borderRadius: '50%', marginTop: '6px' }}></div>
              <div>
                <div style={{ fontWeight: '500' }}>Data Fetching</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Connected to API endpoints</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Traffic Widget</h3>
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-main)', borderRadius: '8px', marginTop: '24px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Chart Visualization Placeholder</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
