"use client";

import React, { useState } from 'react';
import { Mail, MapPin, Phone, Zap } from 'lucide-react';
import { PortfolioSettings } from '@/lib/types';

interface ContactSectionProps {
  settings: PortfolioSettings;
}

export default function ContactSection({ settings }: ContactSectionProps) {
  return (
    <section id="contact" className="section" style={{ textAlign: 'center', paddingBottom: '3rem' }}>
      <div className="container">
        <div className="section-header" style={{ marginBottom: '2rem' }}>
          <span className="section-tag" style={{ color: 'var(--accent)' }}>LET&apos;S WORK TOGETHER</span>
          <h2 className="section-title" style={{ justifyContent: 'center', margin: '0.5rem 0' }}>Get In Touch</h2>
          <p className="section-subtitle" style={{ margin: '0.5rem auto 0 auto', maxWidth: '550px' }}>
            Open to international opportunities, remote roles, and technical collaborations.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginBottom: '4rem' }}>
          <div className="badge-intl" style={{ marginBottom: 0, padding: '0.4rem 1rem' }}>
            Available for Remote & International Roles
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a href={`mailto:${settings.email || 'email.rajan001@gmail.com'}`} className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
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

        {/* Integrated Footer Bar */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>Designed & developed by <strong>Rajan Sharma</strong>.</p>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)' }}>Built with Next.js, TypeScript, and modern web standards.</p>
          <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
            © {new Date().getFullYear()} All rights reserved.
          </div>
        </div>
      </div>
    </section>
  );
}
