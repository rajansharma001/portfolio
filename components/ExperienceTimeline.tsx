import React from 'react';
import { ExperienceItem, PortfolioSettings } from '@/lib/types';

interface ExperienceTimelineProps {
  experience: ExperienceItem[];
  settings?: PortfolioSettings | null;
}

export default function ExperienceTimeline({ experience }: ExperienceTimelineProps) {
  // Fallback defaults if experience array is empty
  const defaultExperience: ExperienceItem[] = [
    {
      id: 'exp_1',
      role: 'Full-Stack Web Developer',
      company: 'Independent Engineer',
      period: '2023 — Present',
      location: 'Kohalpur, Nepal',
      description: 'Architect and deploy production-ready full-stack applications with Next.js, TypeScript, and Node.js backend services.',
      highlights: [
        'Architect and deploy production-ready full-stack applications with Next.js, TypeScript, and Node.js backend services.',
        'Designed high-capacity business platforms including the NexZen Restro management suite and custom tour portals (Ambikeshori Travels).',
        'Execute entire technical cycles: schema modeling, responsive interface design, authentication flows, and Linux/cPanel server deployment.',
      ],
    },
    {
      id: 'exp_2',
      role: 'Data Entry Operator',
      company: 'Souq Al Baladi',
      period: 'Jul 2023 — Jul 2025',
      location: 'Qatar',
      description: 'Managed complex enterprise databases, maintaining zero-error records across large-scale daily inventory workflows.',
      highlights: [
        'Managed complex enterprise databases, maintaining zero-error records across large-scale daily inventory workflows.',
      ],
    },
    {
      id: 'exp_3',
      role: 'Computer Operator / IT Specialist',
      company: 'Manakamana Trade Pvt. Ltd.',
      period: '2022 — 2023',
      location: 'Nepal',
      description: 'Oversee network operations, hardware diagnosis, system maintenance, and staff technical support.',
      highlights: [
        'Oversee network operations, hardware diagnosis, system maintenance, and staff technical support.',
      ],
    },
  ];

  const itemsToRender = experience && experience.length > 0 ? experience : defaultExperience;

  return (
    <section id="experience" className="section container reveal">
      <div className="section-header">
        <span className="section-num">01</span>
        <h2 className="section-title">Background & Experience</h2>
      </div>

      <div className="cv-grid">
        <div className="timeline">
          {itemsToRender.map((item) => (
            <div key={item.id} className="timeline-item">
              <div className="timeline-meta">
                <span className="job-date">{item.period}</span>
                <span className="company-name">{item.company}</span>
              </div>
              <div className="job-content">
                <div className="job-title">{item.role}</div>
                <ul className="job-bullets">
                  {item.highlights && item.highlights.length > 0 ? (
                    item.highlights.map((bullet, bIdx) => <li key={bIdx}>{bullet}</li>)
                  ) : (
                    <li>{item.description}</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="side-col">
          <div className="side-box">
            <h3>Education</h3>
            <div className="edu-item">
              <div className="edu-degree">Diploma in Computer Engineering</div>
              <div className="edu-school">CTEVT (3-Year Technical Track)</div>
            </div>
            <div className="edu-item">
              <div className="edu-degree">Bachelor of Business Studies</div>
              <div className="edu-school">Enrolled / Ongoing</div>
            </div>
          </div>

          <div className="side-box">
            <h3>Languages</h3>
            <ul className="job-bullets" style={{ paddingLeft: 0, listStyle: 'none' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong>English</strong> <span>Professional</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong>Nepali</strong> <span>Native</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong>Hindi</strong> <span>Fluent</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
