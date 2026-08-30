"use client";

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Save, Plus, Trash2, HelpCircle, Layers, GraduationCap, Languages, Sparkles } from 'lucide-react';
import {
  PortfolioSettings,
  FAQItem,
  ProcessStep,
  EducationItem,
  LanguageItem,
  DEFAULT_FAQS,
  DEFAULT_PROCESS_STEPS,
  DEFAULT_EDUCATION,
  DEFAULT_LANGUAGES,
  DEFAULT_QUICK_FACTS,
} from '@/lib/types';
import Alert from '@/components/Alert';

export default function AdminContentPage() {
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState<'faqs' | 'process' | 'hero' | 'education'>('faqs');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        setSettings({
          ...data,
          faqs: data.faqs && data.faqs.length > 0 ? data.faqs : DEFAULT_FAQS,
          processSteps: data.processSteps && data.processSteps.length > 0 ? data.processSteps : DEFAULT_PROCESS_STEPS,
          education: data.education && data.education.length > 0 ? data.education : DEFAULT_EDUCATION,
          languages: data.languages && data.languages.length > 0 ? data.languages : DEFAULT_LANGUAGES,
          quickFacts: data.quickFacts || DEFAULT_QUICK_FACTS,
          heroImpactText: data.heroImpactText || '16 production systems shipped across LMS, POS, tourism & geospatial domains.',
        });
      });
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error('Failed to save content updates');
      setMessage({ type: 'success', text: 'All content and FAQs successfully saved to database!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error saving content.' });
    } finally {
      setSaving(false);
    }
  };

  // FAQ Handlers
  const handleAddFaq = () => {
    if (!settings) return;
    const newFaqs = [...(settings.faqs || []), { q: 'New Question', a: 'Answer text goes here.' }];
    setSettings({ ...settings, faqs: newFaqs });
  };

  const handleUpdateFaq = (index: number, field: 'q' | 'a', value: string) => {
    if (!settings || !settings.faqs) return;
    const updated = [...settings.faqs];
    updated[index] = { ...updated[index], [field]: value };
    setSettings({ ...settings, faqs: updated });
  };

  const handleRemoveFaq = (index: number) => {
    if (!settings || !settings.faqs) return;
    const updated = settings.faqs.filter((_, i) => i !== index);
    setSettings({ ...settings, faqs: updated });
  };

  // Process Steps Handlers
  const handleAddProcessStep = () => {
    if (!settings) return;
    const count = (settings.processSteps || []).length + 1;
    const num = String(count).padStart(2, '0');
    const newSteps = [...(settings.processSteps || []), { num, title: 'New Step', desc: 'Description of the methodology step.' }];
    setSettings({ ...settings, processSteps: newSteps });
  };

  const handleUpdateProcessStep = (index: number, field: keyof ProcessStep, value: string) => {
    if (!settings || !settings.processSteps) return;
    const updated = [...settings.processSteps];
    updated[index] = { ...updated[index], [field]: value };
    setSettings({ ...settings, processSteps: updated });
  };

  const handleRemoveProcessStep = (index: number) => {
    if (!settings || !settings.processSteps) return;
    const updated = settings.processSteps.filter((_, i) => i !== index);
    setSettings({ ...settings, processSteps: updated });
  };

  // Education Handlers
  const handleAddEducation = () => {
    if (!settings) return;
    const newEdu = [...(settings.education || []), { degree: 'Degree / Certificate', school: 'Institution Name', note: '' }];
    setSettings({ ...settings, education: newEdu });
  };

  const handleUpdateEducation = (index: number, field: keyof EducationItem, value: string) => {
    if (!settings || !settings.education) return;
    const updated = [...settings.education];
    updated[index] = { ...updated[index], [field]: value };
    setSettings({ ...settings, education: updated });
  };

  const handleRemoveEducation = (index: number) => {
    if (!settings || !settings.education) return;
    const updated = settings.education.filter((_, i) => i !== index);
    setSettings({ ...settings, education: updated });
  };

  // Language Handlers
  const handleAddLanguage = () => {
    if (!settings) return;
    const newLang = [...(settings.languages || []), { language: 'Language', proficiency: 'Proficiency Level' }];
    setSettings({ ...settings, languages: newLang });
  };

  const handleUpdateLanguage = (index: number, field: keyof LanguageItem, value: string) => {
    if (!settings || !settings.languages) return;
    const updated = [...settings.languages];
    updated[index] = { ...updated[index], [field]: value };
    setSettings({ ...settings, languages: updated });
  };

  const handleRemoveLanguage = (index: number) => {
    if (!settings || !settings.languages) return;
    const updated = settings.languages.filter((_, i) => i !== index);
    setSettings({ ...settings, languages: updated });
  };

  if (!settings) {
    return (
      <AdminLayout>
        <div style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>Loading content manager...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em' }}>Site Content & FAQs</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
            Customize website copy, FAQs, engineering methodology steps, hero quick facts, and background credentials.
          </p>
        </div>

        <button onClick={() => handleSave()} disabled={saving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={16} /> {saving ? 'Saving...' : 'Save All Content'}
        </button>
      </div>

      <Alert type={message.type as 'error' | 'success' | 'warning'} message={message.text} />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setActiveTab('faqs')}
          style={{
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'faqs' ? '2px solid var(--accent)' : '2px solid transparent',
            color: activeTab === 'faqs' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: activeTab === 'faqs' ? '700' : '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <HelpCircle size={16} /> FAQs ({(settings.faqs || []).length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('process')}
          style={{
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'process' ? '2px solid var(--accent)' : '2px solid transparent',
            color: activeTab === 'process' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: activeTab === 'process' ? '700' : '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Layers size={16} /> Methodology Steps ({(settings.processSteps || []).length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          style={{
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'hero' ? '2px solid var(--accent)' : '2px solid transparent',
            color: activeTab === 'hero' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: activeTab === 'hero' ? '700' : '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Sparkles size={16} /> Hero Facts & Metrics
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('education')}
          style={{
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'education' ? '2px solid var(--accent)' : '2px solid transparent',
            color: activeTab === 'education' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: activeTab === 'education' ? '700' : '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <GraduationCap size={16} /> Education & Languages
        </button>
      </div>

      {/* Tab 1: FAQs */}
      {activeTab === 'faqs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              These FAQs appear in the accordion on the public Contact section.
            </p>
            <button
              type="button"
              onClick={handleAddFaq}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={14} /> Add New FAQ
            </button>
          </div>

          {(settings.faqs || []).map((faq, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                  FAQ #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveFaq(idx)}
                  className="btn btn-outline btn-sm"
                  style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', padding: '4px 8px' }}
                  title="Delete FAQ"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Question</label>
                <input
                  type="text"
                  className="form-input"
                  value={faq.q}
                  onChange={(e) => handleUpdateFaq(idx, 'q', e.target.value)}
                  placeholder="e.g. Engineering Roles & Availability"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Answer</label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={faq.a}
                  onChange={(e) => handleUpdateFaq(idx, 'a', e.target.value)}
                  placeholder="e.g. I am open to full-time remote engineering positions..."
                  required
                />
              </div>
            </div>
          ))}

          <button onClick={() => handleSave()} disabled={saving} className="btn btn-primary" style={{ marginTop: '12px' }}>
            {saving ? 'Saving...' : 'Save FAQs'}
          </button>
        </div>
      )}

      {/* Tab 2: Methodology / Process Steps */}
      {activeTab === 'process' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              These steps are showcased in the 4-card Engineering Methodology grid.
            </p>
            <button
              type="button"
              onClick={handleAddProcessStep}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={14} /> Add Step
            </button>
          </div>

          {(settings.processSteps || []).map((step, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                  Step {idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveProcessStep(idx)}
                  className="btn btn-outline btn-sm"
                  style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', padding: '4px 8px' }}
                  title="Delete Step"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Step #</label>
                  <input
                    type="text"
                    className="form-input"
                    value={step.num}
                    onChange={(e) => handleUpdateProcessStep(idx, 'num', e.target.value)}
                    placeholder="01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Step Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={step.title}
                    onChange={(e) => handleUpdateProcessStep(idx, 'title', e.target.value)}
                    placeholder="e.g. Analyze & Architect"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={step.desc}
                  onChange={(e) => handleUpdateProcessStep(idx, 'desc', e.target.value)}
                  placeholder="Defining system requirements..."
                  required
                />
              </div>
            </div>
          ))}

          <button onClick={() => handleSave()} disabled={saving} className="btn btn-primary" style={{ marginTop: '12px' }}>
            {saving ? 'Saving...' : 'Save Process Steps'}
          </button>
        </div>
      )}

      {/* Tab 3: Hero Quick Facts & Impact Line */}
      {activeTab === 'hero' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              Hero Recruiter Impact Statement
            </h2>
            <div className="form-group">
              <label className="form-label">Quantifiable Impact Metric Line</label>
              <input
                type="text"
                className="form-input"
                value={settings.heroImpactText || ''}
                onChange={(e) => setSettings({ ...settings, heroImpactText: e.target.value })}
                placeholder="16 production systems shipped across LMS, POS, tourism & geospatial domains."
              />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Displayed directly beneath your hero headline on the homepage.
              </span>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              Hero Bottom Quick Facts
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Customize the three fact items located at the bottom of the Hero section.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Fact 1: Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.quickFacts?.location || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      quickFacts: {
                        ...(settings.quickFacts || DEFAULT_QUICK_FACTS),
                        location: e.target.value,
                      },
                    })
                  }
                  placeholder="Kathmandu, Bagmati Prov, Nepal"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Fact 2: Core Stack</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.quickFacts?.coreStack || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      quickFacts: {
                        ...(settings.quickFacts || DEFAULT_QUICK_FACTS),
                        coreStack: e.target.value,
                      },
                    })
                  }
                  placeholder="Next.js / Node.js / PostgreSQL / MongoDB"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Fact 3: Focus</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.quickFacts?.focus || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      quickFacts: {
                        ...(settings.quickFacts || DEFAULT_QUICK_FACTS),
                        focus: e.target.value,
                      },
                    })
                  }
                  placeholder="Scalable Architecture & Web Systems"
                />
              </div>
            </div>
          </div>

          <button onClick={() => handleSave()} disabled={saving} className="btn btn-primary" style={{ marginTop: '12px' }}>
            {saving ? 'Saving...' : 'Save Hero Facts'}
          </button>
        </div>
      )}

      {/* Tab 4: Education & Languages */}
      {activeTab === 'education' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Education Manager */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GraduationCap size={20} color="var(--accent)" /> Education Credentials
              </h2>
              <button
                type="button"
                onClick={handleAddEducation}
                className="btn btn-outline btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={14} /> Add
              </button>
            </div>

            {(settings.education || []).map((edu, idx) => (
              <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                    Item #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(idx)}
                    className="btn btn-outline btn-sm"
                    style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', padding: '2px 6px' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <div className="form-group">
                  <label className="form-label">Degree / Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={edu.degree}
                    onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)}
                    placeholder="Diploma in Electrical Engineering"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">School / Board</label>
                  <input
                    type="text"
                    className="form-input"
                    value={edu.school}
                    onChange={(e) => handleUpdateEducation(idx, 'school', e.target.value)}
                    placeholder="CTEVT"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Additional Note (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={edu.note || ''}
                    onChange={(e) => handleUpdateEducation(idx, 'note', e.target.value)}
                    placeholder="e.g. 3-Year Technical Engineering Track"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Languages Manager */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Languages size={20} color="var(--accent)" /> Languages
              </h2>
              <button
                type="button"
                onClick={handleAddLanguage}
                className="btn btn-outline btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={14} /> Add
              </button>
            </div>

            {(settings.languages || []).map((lang, idx) => (
              <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                    Language #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLanguage(idx)}
                    className="btn btn-outline btn-sm"
                    style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', padding: '2px 6px' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <div className="form-group">
                  <label className="form-label">Language</label>
                  <input
                    type="text"
                    className="form-input"
                    value={lang.language}
                    onChange={(e) => handleUpdateLanguage(idx, 'language', e.target.value)}
                    placeholder="English"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Proficiency</label>
                  <input
                    type="text"
                    className="form-input"
                    value={lang.proficiency}
                    onChange={(e) => handleUpdateLanguage(idx, 'proficiency', e.target.value)}
                    placeholder="Professional Proficiency"
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <button onClick={() => handleSave()} disabled={saving} className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
              {saving ? 'Saving...' : 'Save Education & Languages'}
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
