"use client";

import React, { useState } from 'react';
import { PortfolioSettings } from '@/lib/types';
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface ContactSectionProps {
  settings?: PortfolioSettings | null;
  onShowToast?: (msg: string) => void;
}

export default function ContactSection({ settings, onShowToast }: ContactSectionProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const faqs = [
    {
      q: 'Engineering Roles & Availability',
      a: 'I am open to full-time remote engineering positions, hybrid roles, and contract architectural projects worldwide.',
    },
    {
      q: 'Full-Stack Technical Scope',
      a: 'From relational/document database schemas and REST APIs to reactive Next.js frontends and production deployment, I handle end-to-end technical delivery.',
    },
    {
      q: 'Timezone & Collaboration',
      a: 'Based in Kathmandu, Nepal (UTC+5:45), coordinating seamlessly with Asian, European, and US working schedules.',
    },
  ];

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
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSent(true);
        if (onShowToast) {
          onShowToast('Message Sent Successfully!');
        }
        setFormData({ name: '', email: '', message: '' });
      } else {
        setFormError(data.error || 'Failed to deliver message.');
      }
    } catch {
      setFormError('Network error. Please try again or email directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section container reveal">
      <div className="section-header">
        <span className="section-num">05</span>
        <h2 className="section-title">Contact & Inquiries</h2>
      </div>

      <div className="contact-grid">
        {/* Left Side: FAQ & Direct Email */}
        <div>
          <h3 className="text-h3" style={{ marginBottom: '1.5rem' }}>
            Frequently Asked
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
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
                  <div
                    className="faq-answer"
                    style={{
                      maxHeight: isActive ? '200px' : '0px',
                      paddingBottom: isActive ? '1.5rem' : '0px',
                    }}
                  >
                    <p>{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <span className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Direct Electronic Mail
            </span>
            <a
              href={`mailto:${settings?.email || 'email.rajan001@gmail.com'}`}
              style={{
                fontSize: '1.1rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                wordBreak: 'break-all',
              }}
            >
              <Mail size={16} /> {settings?.email || 'email.rajan001@gmail.com'}
            </a>
          </div>
        </div>

        {/* Right Side: Message Form */}
        <div>
          <span className="label" style={{ marginBottom: '0.5rem', color: 'var(--accent)', display: 'block' }}>
            Inbound Hiring Inquiry
          </span>
          <h2 className="text-h2" style={{ marginBottom: '1.5rem', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
            Send a Direct Message
          </h2>

          <form className="contact-form" id="contact-form" onSubmit={handleSubmit}>
            {formError && (
              <div style={{ color: '#ef4444', fontSize: '13px', background: 'rgba(239, 68, 68, 0.1)', padding: '10px 14px', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} /> {formError}
              </div>
            )}

            {isSent && (
              <div style={{ color: '#10b981', fontSize: '13px', background: 'rgba(16, 185, 129, 0.1)', padding: '10px 14px', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} /> Message delivered successfully! I will respond within 24 hours.
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                className="form-input"
                required
                placeholder="e.g. Sarah Jenkins"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input
                type="email"
                id="email"
                className="form-input"
                required
                placeholder="e.g. sarah@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Inquiry / Opportunity Details</label>
              <textarea
                id="message"
                className="form-input"
                required
                placeholder="Describe your project, engineering role, or technical requirements..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                disabled={isSubmitting}
                rows={4}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled={isSubmitting}>
              <Send size={16} />
              {isSubmitting ? 'Delivering Message...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
