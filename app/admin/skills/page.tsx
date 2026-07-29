"use client";

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Trash2, Save } from 'lucide-react';
import { SkillsMap } from '@/lib/types';
import Alert from '@/components/Alert';

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<SkillsMap>({});
  const [newSkillInput, setNewSkillInput] = useState<Record<string, string>>({});
  const [newCategoryName, setNewCategoryName] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetch('/api/skills')
      .then((res) => res.json())
      .then((data) => setSkills(data || {}));
  }, []);

  const handleAddSkill = (category: string) => {
    const text = newSkillInput[category]?.trim();
    if (!text) return;

    setSkills((prev) => ({
      ...prev,
      [category]: [...(prev[category] || []), text],
    }));

    setNewSkillInput((prev) => ({ ...prev, [category]: '' }));
  };

  const handleRemoveSkill = (category: string, index: number) => {
    setSkills((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  const handleAddCategory = () => {
    const name = newCategoryName.trim();
    if (!name || skills[name]) return;

    setSkills((prev) => ({
      ...prev,
      [name]: [],
    }));
    setNewCategoryName('');
  };

  const handleRemoveCategory = (category: string) => {
    if (!confirm(`Delete entire category "${category}"?`)) return;
    setSkills((prev) => {
      const copy = { ...prev };
      delete copy[category];
      return copy;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skills),
      });

      if (!res.ok) throw new Error('Failed to update skills');
      setMessage({ type: 'success', text: 'Skills saved successfully!' });
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
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Manage Skills</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Add, remove, or organize technical skill categories.
          </p>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn btn-primary">
          <Save size={16} /> {saving ? 'Saving...' : 'Save All Skills'}
        </button>
      </div>

      <Alert type={message.type as 'error' | 'success' | 'warning'} message={message.text} />

      {/* Add New Category Control */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            className="form-input"
            placeholder="New Category Name (e.g. DevOps & Cloud)"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <button onClick={handleAddCategory} className="btn btn-outline" style={{ whiteSpace: 'nowrap' }}>
            <Plus size={16} /> Add Category
          </button>
        </div>
      </div>

      <div className="grid-2">
        {Object.keys(skills).map((category) => (
          <div key={category} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{category}</h3>
              <button
                onClick={() => handleRemoveCategory(category)}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                title="Delete Category"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {skills[category].map((skill, i) => (
                <span
                  key={i}
                  className="tech-chip"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.85rem',
                  }}
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(category, i)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', display: 'flex' }}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder={`Add skill to ${category}...`}
                value={newSkillInput[category] || ''}
                onChange={(e) => setNewSkillInput({ ...newSkillInput, [category]: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(category);
                  }
                }}
              />
              <button onClick={() => handleAddSkill(category)} className="btn btn-outline btn-sm">
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
