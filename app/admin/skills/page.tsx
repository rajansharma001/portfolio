"use client";

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Trash2, Save, X } from 'lucide-react';
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
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skills),
      });

      if (!res.ok) throw new Error('Failed to update skills');
      setMessage({ type: 'success', text: 'Skills updated and published successfully!' });
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
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em' }}>Technical Capabilities</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
            Manage the 4 core technical pillars and skill items shown in Section 02.
          </p>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
            placeholder="New Category Name (e.g. Cloud & Infrastructure)"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <button onClick={handleAddCategory} className="btn btn-outline" style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} /> Add Category
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {Object.keys(skills).map((category) => (
          <div key={category} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--accent)', textTransform: 'uppercase' }}>
                {category}
              </h3>
              <button
                onClick={() => handleRemoveCategory(category)}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.7 }}
                title="Delete Category"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Skill tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem', flex: 1 }}>
              {skills[category].map((skill, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    background: 'var(--bg-main)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)',
                    borderRadius: '3px',
                  }}
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(category, i)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', padding: 0 }}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>

            {/* Add skill input */}
            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <input
                type="text"
                className="form-input"
                placeholder={`Add item to ${category}...`}
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
