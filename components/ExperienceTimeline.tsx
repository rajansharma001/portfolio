import React from 'react';
import { Check } from 'lucide-react';
import { ExperienceItem, PortfolioSettings } from '@/lib/types';

interface ExperienceTimelineProps {
  experience: ExperienceItem[];
  settings: PortfolioSettings;
}

export default function ExperienceTimeline({ experience, settings }: ExperienceTimelineProps) {
  return (
    <section id="experience" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag" style={{ color: 'var(--accent)' }}>EXPERIENCE</span>
          <p className="section-subtitle" style={{ margin: '0.5rem 0 0 0', maxWidth: '600px' }}>
            Proven track record designing business systems, SaaS products, and client platforms.
          </p>
        </div>

        <div className="exp-layout">
          {/* Left Timeline */}
          <div className="timeline">
            {experience.map((item, idx) => (
              <div key={item.id} className="timeline-item">
                <div className="timeline-dot">
                  <div style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%' }} />
                </div>
                <div className="timeline-date">{item.period}</div>
                <h3 className="timeline-title">{item.role}</h3>
                <div className="timeline-company">{item.company}</div>
                <p className="timeline-desc">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Right Card */}
          <div>
            <div className="what-i-bring-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>What I Bring to the Table</h3>
              
              {settings.whatIBring && settings.whatIBring.map((item, idx) => (
                <div key={idx} className="check-item"><Check size={18} /> {item}</div>
              ))}
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
