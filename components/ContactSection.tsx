"use client";

import React, { useState } from 'react';
import { PortfolioSettings } from '@/lib/types';

interface ContactSectionProps {
  settings?: PortfolioSettings | null;
  onShowToast?: (msg: string) => void;
}

export default function ContactSection({ onShowToast }: ContactSectionProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const faqs = [
    {
      q: 'Availability & Work Modes',
      a: 'I am available for full-time remote developer positions, hybrid roles, or targeted contract development projects worldwide.',
    },
    {
      q: 'Full-Stack Workflow',
      a: 'From designing DB schemas to building sleek Next.js interfaces and configuring production environments, I take full ownership of technical delivery.',
    },
    {
      q: 'Time Zone Alignment',
      a: 'Based in Nepal (UTC+5:45), easily coordinating overlap with Asian, European, and US morning working hours.',
    },
  ];

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onShowToast) {
      onShowToast('Message Sent Successfully');
    }
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="section container reveal">
      <div className="container-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem' }}>
        {/* Left Side: FAQ */}
        <div>
          <h2 className="text-h3" style={{ marginBottom: '2rem' }}>
            Frequently Asked
          </h2>
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
                    paddingBottom: isActive ? '2rem' : '0px',
                  }}
                >
                  <p>{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Message Form */}
        <div>
          <span className="label" style={{ marginBottom: '0.5rem', color: 'var(--accent)', display: 'block' }}>
            Initiate Contact
          </span>
          <h2 className="text-h2" style={{ marginBottom: '2rem' }}>
            Send a Message
          </h2>

          <form className="contact-form" id="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                className="form-input"
                required
                placeholder="e.g. Jane Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input
                type="email"
                id="email"
                className="form-input"
                required
                placeholder="e.g. jane@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Project Details / Message</label>
              <textarea
                id="message"
                className="form-input"
                required
                placeholder="Describe your project or inquiry..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
