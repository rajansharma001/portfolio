"use client";

import React from 'react';
import { PortfolioSettings, SectionVisibility, DEFAULT_VISIBILITY } from '@/lib/types';
import { Download, MapPin, Layers, Cpu } from 'lucide-react';

interface HeroProps {
  settings?: PortfolioSettings | null;
  visibility?: SectionVisibility;
}

export default function Hero({ settings, visibility }: HeroProps) {
  const vis = visibility || DEFAULT_VISIBILITY;
  const rawName = settings?.name || 'Rajan Sharma';
  const nameParts = rawName.toUpperCase().split(' ');
  const firstName = nameParts[0] || 'RAJAN';
  const lastName = nameParts.slice(1).join(' ') || 'SHARMA';

  const handleResume = () => {
    if (settings?.resumeUrl) {
      window.open(settings.resumeUrl, '_blank');
    } else if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <section className="hero container" id="about">
      <div className="hero-content">
        <div className="hero-title-group">
          <span className="hero-role">{settings?.role || 'Full-Stack Software Engineer'}</span>
          <h1 className="hero-name">
            {firstName}<br />{lastName}
          </h1>
          <p className="hero-headline">
            {settings?.headline || 'Building production-grade web systems, REST APIs & scalable backends.'}
          </p>
        </div>

        <div className="hero-quick-facts">
          <div className="fact-item">
            <MapPin size={14} className="fact-icon" />
            <div>
              <span className="fact-label">Location</span>
              <span className="fact-value">{settings?.location || 'Kathmandu, Nepal'}</span>
            </div>
          </div>
          <div className="fact-item">
            <Layers size={14} className="fact-icon" />
            <div>
              <span className="fact-label">Core Stack</span>
              <span className="fact-value">Next.js / Node.js / PostgreSQL / MongoDB</span>
            </div>
          </div>
          <div className="fact-item">
            <Cpu size={14} className="fact-icon" />
            <div>
              <span className="fact-label">Focus</span>
              <span className="fact-value">Scalable Architecture & Web Systems</span>
            </div>
          </div>
        </div>

        <div className="hero-actions">
          <a href="#work" className="btn btn-primary">
            View Projects
          </a>
          {vis.showResumeButton && (
            <button onClick={handleResume} className="btn btn-outline" type="button">
              <Download size={16} />
              {settings?.resumeUrl ? 'Download CV' : 'Print CV'}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
