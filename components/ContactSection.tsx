"use client";

import React, { useState } from 'react';
import { PortfolioSettings, DEFAULT_FAQS } from '@/lib/types';
import { Mail, Send, CheckCircle2, AlertCircle, Sparkles, Clock, Layers } from 'lucide-react';

interface ContactSectionProps {
  settings?: PortfolioSettings | null;
  onShowToast?: (msg: string) => void;
  initialInquiryTopic?: string;
}

export default function ContactSection({ settings, onShowToast, initialInquiryTopic }: ContactSectionProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [inquiryType, setInquiryType] = useState('Full-Time Engineering Role');
  const [timeline, setTimeline] = useState('Immediate / 1 Month');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: initialInquiryTopic ? `Hi Rajan,\n\nI'm reaching out regarding your work on ${initialInquiryTopic}...` : '',
    website_url: '',
  });

  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  React.useEffect(() => {
    fetchCaptcha();
  }, []);

  React.useEffect(() => {
    if (initialInquiryTopic) {
      setInquiryType('Custom System / MVP Build');
      setFormData((prev) => ({
        ...prev,
        message: `Hi Rajan,\n\nI'm reaching out regarding your work on ${initialInquiryTopic}. We have a project requirement and would like to discuss feasibility and timeline.`,
      }));
    }
  }, [initialInquiryTopic]);

  const fetchCaptcha = async () => {
    try {
      const res = await fetch('/api/captcha');
      const data = await res.json();
      if (data.question && data.token) {
        setCaptchaQuestion(data.question);
        setCaptchaToken(data.token);
        setCaptchaAnswer('');
      }
    } catch (err) {
      console.error('Failed to fetch CAPTCHA', err);
    }
  };

  const faqs = settings?.faqs && settings.faqs.length > 0 ? settings.faqs : DEFAULT_FAQS;

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);
    setIsSent(false);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          inquiryType,
          timeline,
          captchaAnswer,
          captchaToken,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSent(true);
        if (onShowToast) {
          onShowToast('Inquiry delivered to Rajan! Response within 24h.');
        }
        setFormData({ name: '', email: '', message: '', website_url: '' });
        fetchCaptcha();
      } else {
        fetchCaptcha();
        setFormError(data.error || 'Failed to deliver inquiry.');
      }
    } catch {
      fetchCaptcha();
      setFormError('Network error. Please try again or email directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inquiryTypes = [
    'Full-Time Engineering Role',
    'Custom System / MVP Build',
    'POS / LMS Platform',
    'Architecture Consulting',
  ];

  const timelineOptions = ['Immediate / 1 Month', '1–3 Months', 'Exploring / Flexible'];

  return (
    <section id="contact" className="section container reveal">
      <div className="section-header">
        <span className="section-num">05</span>
        <h2 className="section-title">Contact & Inquiries</h2>
      </div>

      <div className="contact-grid">
        {/* Left Side: FAQ & Direct Reach-out */}
        <div>
          <h3 className="text-h3" style={{ marginBottom: '1.5rem' }}>
            Frequently Asked
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginBottom: '2.5rem' }}>
            {faqs.map((faq, idx) => {
              const isActive = activeFaq === idx;
              return (
                <div key={idx} className={`faq-item ${isActive ? 'active' : ''}`}>
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isActive}
                  >
                    {faq.q} <span className="faq-icon">+</span>
                  </button>
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <span className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Direct Email
            </span>
            <a
              href={`mailto:${settings?.email || 'email.rajan001@gmail.com'}`}
              style={{
                fontSize: '1rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                wordBreak: 'break-all',
                fontWeight: 600,
              }}
            >
              <Mail size={16} color="var(--accent)" /> {settings?.email || 'email.rajan001@gmail.com'}
            </a>
          </div>
        </div>

        {/* Right Side: High-Converting Lead Generation Form */}
        <div>
          <span className="label" style={{ marginBottom: '0.5rem', color: 'var(--accent)', display: 'block' }}>
            Direct Engineering Inquiry
          </span>
          <h2 className="text-h2" style={{ marginBottom: '1.5rem', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
            Start a Project Discussion
          </h2>

          <form className="contact-form" id="contact-form" onSubmit={handleSubmit}>
            {formError && (
              <div
                style={{
                  color: '#ef4444',
                  fontSize: '0.85rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  padding: '12px',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '4px',
                }}
              >
                <AlertCircle size={16} /> {formError}
              </div>
            )}

            {isSent && (
              <div
                style={{
                  color: '#10b981',
                  fontSize: '0.85rem',
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '14px',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '4px',
                }}
              >
                <CheckCircle2 size={16} /> Inquiry delivered successfully! I will review your requirements and respond within 24 hours.
              </div>
            )}

            {/* Inquiry Scope Pills */}
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} color="var(--accent)" /> Inquiry Scope
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '6px' }}>
                {inquiryTypes.map((type) => {
                  const isSelected = inquiryType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setInquiryType(type)}
                      style={{
                        padding: '8px 10px',
                        fontSize: '11px',
                        fontWeight: '600',
                        fontFamily: 'var(--font-sans)',
                        textAlign: 'center',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        background: isSelected ? 'var(--accent)' : 'var(--bg-primary)',
                        color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                        border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border-color)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timeline Selection */}
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} color="var(--accent)" /> Target Timeline
              </label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {timelineOptions.map((opt) => {
                  const isSelected = timeline === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setTimeline(opt)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '11px',
                        fontWeight: '600',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        background: isSelected ? 'var(--text-primary)' : 'var(--bg-primary)',
                        color: isSelected ? 'var(--bg-primary)' : 'var(--text-secondary)',
                        border: isSelected ? '1px solid var(--text-primary)' : '1px solid var(--border-color)',
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                className="form-input"
                required
                placeholder="e.g. Alex Henderson"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Your Work / Personal Email</label>
              <input
                type="email"
                id="email"
                className="form-input"
                required
                placeholder="e.g. alex@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isSubmitting}
              />
            </div>

            {/* Honeypot field */}
            <div className="form-group" style={{ display: 'none', opacity: 0, position: 'absolute', left: '-9999px' }} aria-hidden="true">
              <label htmlFor="website_url">Website</label>
              <input
                type="text"
                id="website_url"
                className="form-input"
                tabIndex={-1}
                autoComplete="off"
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Project Requirements / Role Details</label>
              <textarea
                id="message"
                className="form-input"
                required
                placeholder="Describe your tech stack, system goals, or engineering role..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                disabled={isSubmitting}
                rows={4}
              />
            </div>

            {captchaQuestion && (
              <div className="form-group">
                <label htmlFor="captcha">Security Verification: {captchaQuestion} = ?</label>
                <input
                  type="text"
                  id="captcha"
                  className="form-input"
                  required
                  placeholder="Answer"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled={isSubmitting}>
              <Send size={16} />
              {isSubmitting ? 'Delivering Inquiry...' : 'Submit Engineering Inquiry'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
