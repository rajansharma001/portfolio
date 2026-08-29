"use client";

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { ExperienceItem } from '@/lib/types';
import Alert from '@/components/Alert';

export default function AdminExperiencePage() {
  const [items, setItems] = useState<ExperienceItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetch('/api/experience')
      .then((res) => res.json())
      .then((data) => setItems(data || []));
  }, []);

  const handleAddItem = () => {
    const newItem: ExperienceItem = {
      id: `exp_${Date.now()}`,
      role: 'Full-Stack Software Engineer',
      company: 'Company / Project Name',
      period: '2024 — Present',
      location: 'Kathmandu, Nepal',
      description: 'Architected and deployed full-stack web applications.',
      highlights: ['Designed high-performance backend microservices.'],
    };
    setItems([newItem, ...items]);
  };

  const handleUpdateItem = (index: number, field: keyof ExperienceItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleUpdateHighlight = (itemIdx: number, hIdx: number, val: string) => {
    const updated = [...items];
    const highlights = [...(updated[itemIdx].highlights || [])];
    highlights[hIdx] = val;
    updated[itemIdx].highlights = highlights;
    setItems(updated);
  };

  const handleAddHighlight = (itemIdx: number) => {
    const updated = [...items];
    const highlights = [...(updated[itemIdx].highlights || [])];
    highlights.push('Engineered scalable REST APIs with PostgreSQL schema optimization.');
    updated[itemIdx].highlights = highlights;
    setItems(updated);
  };

  const handleRemoveHighlight = (itemIdx: number, hIdx: number) => {
    const updated = [...items];
    updated[itemIdx].highlights = (updated[itemIdx].highlights || []).filter((_, i) => i !== hIdx);
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (!confirm('Are you sure you want to delete this experience record?')) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      });

      if (!res.ok) throw new Error('Failed to update experience timeline');
      setMessage({ type: 'success', text: 'Experience records saved successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em' }}>Background & Experience</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
            Manage career milestones, roles, and verified achievement bullets shown in Section 03.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleAddItem} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} /> Add Position
          </button>
          <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save Timeline'}
          </button>
        </div>
      </div>

      <Alert type={message.type as 'error' | 'success' | 'warning'} message={message.text} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {items.map((item, idx) => (
          <div key={item.id} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                }}
              >
                Milestone #{items.length - idx} • {item.company}
              </span>
              <button
                onClick={() => handleRemoveItem(idx)}
                className="btn btn-outline btn-sm"
                style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '4px 8px' }}
                title="Delete Record"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Role Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={item.role}
                  onChange={(e) => handleUpdateItem(idx, 'role', e.target.value)}
                  placeholder="e.g. Full-Stack Software Engineer"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company / Organization</label>
                <input
                  type="text"
                  className="form-input"
                  value={item.company}
                  onChange={(e) => handleUpdateItem(idx, 'company', e.target.value)}
                  placeholder="e.g. Independent Engineer"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Time Period</label>
                <input
                  type="text"
                  className="form-input"
                  value={item.period}
                  onChange={(e) => handleUpdateItem(idx, 'period', e.target.value)}
                  placeholder="e.g. 2023 — Present"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={item.location}
                  onChange={(e) => handleUpdateItem(idx, 'location', e.target.value)}
                  placeholder="e.g. Kathmandu, Nepal"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Role Overview / Summary</label>
              <textarea
                className="form-input"
                rows={2}
                value={item.description}
                onChange={(e) => handleUpdateItem(idx, 'description', e.target.value)}
                placeholder="Core focus and summary..."
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="form-label" style={{ margin: 0 }}>
                  Achievement Bullet Points
                </label>
                <button
                  type="button"
                  onClick={() => handleAddHighlight(idx)}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '3px 8px', fontSize: '11px' }}
                >
                  + Add Bullet
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(item.highlights || []).map((h, hIdx) => (
                  <div key={hIdx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={h}
                      onChange={(e) => handleUpdateHighlight(idx, hIdx, e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(idx, hIdx)}
                      className="btn btn-outline btn-sm"
                      style={{ color: '#ef4444', borderColor: 'transparent', padding: '8px' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
