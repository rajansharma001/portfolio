"use client";

import React, { useState } from 'react';
import { Mail, MapPin, Phone, Zap } from 'lucide-react';
import { PortfolioSettings } from '@/lib/types';

interface ContactSectionProps {
  settings: PortfolioSettings;
}

export default function ContactSection({ settings }: ContactSectionProps) {
  return (
    <section id="contact" className="section" style={{ textAlign: 'center' }}>
      <div className="container">
        <div className="section-header" style={{ marginBottom: '3rem' }}>
          <span className="section-tag" style={{ color: 'var(--accent)' }}>LET&apos;S WORK TOGETHER</span>
          <p className="section-subtitle" style={{ margin: '0.5rem auto 0 auto' }}>
            Open to international opportunities, remote roles, and technical collaborations.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <div className="badge-intl" style={{ marginBottom: 0, padding: '0.4rem 1rem' }}>
            Available for Remote & International Roles
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a href={`mailto:${settings.email || 'hello@rajan-sharma.dev'}`} className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
              <Mail size={18} /> Email Me
            </a>
            <a href="https://github.com/rajansharma001" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.8rem 2rem' }}>
              GitHub
            </a>
            <a href="https://linkedin.com/in/rajansharma001" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.8rem 2rem' }}>
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
