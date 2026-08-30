import React from 'react';
import { ExperienceItem, PortfolioSettings, DEFAULT_EDUCATION, DEFAULT_LANGUAGES } from '@/lib/types';

interface ExperienceTimelineProps {
  experience: ExperienceItem[];
  settings?: PortfolioSettings | null;
}

export default function ExperienceTimeline({ experience, settings }: ExperienceTimelineProps) {
  const defaultExperience: ExperienceItem[] = [
    {
      id: 'exp_1',
      role: 'Full-Stack Software Engineer',
      company: 'Independent Engineering & Client Delivery',
      period: '2024 — Present',
      location: 'Kathmandu, Nepal',
      description: 'Architecting and deploying full-stack web applications, custom CMS solutions, and data pipelines.',
      highlights: [
        'Built Advanced LMS with multi-role RBAC, email verification, Cloudinary storage, and audit logs.',
        'Developed RestroOS restaurant management platform and high-performance POS system.',
        'Engineered OpenStreetMap Nepal data ingestion pipeline covering all 77 districts with Prisma and PostgreSQL.',
        'Launched production tourism portals (Ambikeshori Travels, BMW Tours) reducing client operational overhead.',
      ],
    },
    {
      id: 'exp_2',
      role: 'Data Entry Operator',
      company: 'Souq Al Baladi',
      period: 'Nov 2022 — Dec 2024',
      location: 'Qatar',
      description: 'Managed enterprise retail inventory datasets, catalog updates, and operational record accuracy.',
      highlights: [
        'Processed and maintained high-volume SKU databases with high precision and zero discrepancies.',
        'Assisted in data hygiene, inventory reconciliation, and reporting workflows.',
      ],
    },
    {
      id: 'exp_3',
      role: 'Diploma in Electrical Engineering',
      company: 'Council for Technical Education and Vocational Training (CTEVT)',
      period: '2016 — 2019',
      location: 'Nepal',
      description: 'Completed foundational engineering coursework in circuit design, logic systems, and technical mathematics.',
      highlights: [
        'Built strong analytical problem-solving foundation applied to software architecture and backend algorithms.',
      ],
    },
  ];

  const itemsToRender = experience && experience.length > 0 ? experience : defaultExperience;
  const educationItems = settings?.education && settings.education.length > 0 ? settings.education : DEFAULT_EDUCATION;
  const languageItems = settings?.languages && settings.languages.length > 0 ? settings.languages : DEFAULT_LANGUAGES;

  return (
    <section id="experience" className="section container reveal">
      <div className="section-header">
        <span className="section-num">03</span>
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
            {educationItems.map((edu, idx) => (
              <div key={idx} className="edu-item" style={edu.degree.includes('Business') ? { opacity: 0.55, fontSize: '0.85em' } : {}}>
                <div className="edu-degree">{edu.degree}</div>
                <div className="edu-school">{edu.school}</div>
                {edu.note && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{edu.note}</div>}
              </div>
            ))}
          </div>

          <div className="side-box">
            <h3>Languages</h3>
            <ul className="job-bullets" style={{ paddingLeft: 0, listStyle: 'none' }}>
              {languageItems.map((lang, idx) => (
                <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong>{lang.language}</strong> <span>{lang.proficiency}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
