"use client";

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Trash2, Save } from 'lucide-react';
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
      role: 'Full Stack Engineer',
      company: 'Company Name',
      period: '2024 - Present',
      location: 'Location',
      description: 'Role overview and key focus areas.',
      highlights: ['Key achievement 1', 'Key achievement 2'],
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
    const highlights = [...updated[itemIdx].highlights];
    highlights[hIdx] = val;
    updated[itemIdx].highlights = highlights;
    setItems(updated);
  };

  const handleAddHighlight = (itemIdx: number) => {
    const updated = [...items];
    updated[itemIdx].highlights.push('New key achievement');
    setItems(updated);
  };

  const handleRemoveHighlight = (itemIdx: number, hIdx: number) => {
    const updated = [...items];
    updated[itemIdx].highlights = updated[itemIdx].highlights.filter((_, i) => i !== hIdx);
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (!confirm('Are you sure you want to delete this experience record?')) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
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
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Manage Experience Timeline</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Edit career milestones, highlights, and roles shown on your portfolio timeline.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleAddItem} className="btn btn-outline">
            <Plus size={16} /> Add Position
          </button>
          <button onClick={handleSave} disabled={saving} className="btn btn-primary">
            <Save size={16} /> {saving ? 'Saving...' : 'Save Timeline'}
          </button>
        </div>
      </div>

      <Alert type={message.type as 'error' | 'success' | 'warning'} message={message.text} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '850px' }}>
        {items.map((item, idx) => (
          <div key={item.id} className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span className="badge" style={{ borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}>
                Position #{items.length - idx}
              </span>
              <button
                onClick={() => handleRemoveItem(idx)}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
              >
                <Trash2 size={16} /> Delete Record
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Job Title / Role</label>
                <input
                  type="text"
                  className="form-input"
                  value={item.role}
                  onChange={(e) => handleUpdateItem(idx, 'role', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company / Client</label>
                <input
                  type="text"
                  className="form-input"
                  value={item.company}
                  onChange={(e) => handleUpdateItem(idx, 'company', e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Time Period</label>
                <input
                  type="text"
                  className="form-input"
                  value={item.period}
                  onChange={(e) => handleUpdateItem(idx, 'period', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={item.location}
                  onChange={(e) => handleUpdateItem(idx, 'location', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Role Description</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={item.description}
                onChange={(e) => handleUpdateItem(idx, 'description', e.target.value)}
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Bullet Achievements / Highlights</label>
                <button onClick={() => handleAddHighlight(idx)} className="btn btn-outline btn-sm">
                  + Add Bullet
                </button>
              </div>

              {item.highlights.map((h, hIdx) => (
                <div key={hIdx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={h}
                    onChange={(e) => handleUpdateHighlight(idx, hIdx, e.target.value)}
                  />
                  <button
                    onClick={() => handleRemoveHighlight(idx, hIdx)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
