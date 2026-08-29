import React from 'react';
import { SkillsMap } from '@/lib/types';

interface SkillsGridProps {
  skills?: SkillsMap;
}

export default function SkillsGrid({ skills }: SkillsGridProps) {
  const defaultCategories = [
    {
      title: 'Frontend & Client Architecture',
      list: ['Next.js 16 (App Router)', 'React 19', 'TypeScript', 'Tailwind CSS', 'TanStack Query', 'HTML5 / SCSS', 'Responsive UI/UX'],
    },
    {
      title: 'Backend & Database Systems',
      list: ['Node.js', 'Express.js', 'PostgreSQL (Prisma)', 'MongoDB (Mongoose)', 'RESTful API Architecture', 'JWT Authentication & RBAC', 'Zod Data Validation'],
    },
    {
      title: 'Geospatial & Data Engineering',
      list: ['OpenStreetMap Data Ingestion', 'Overpass API & Overpass Kumi', 'Valhalla Routing Engine', 'OSRM Fallback Integration', 'Bounding Box Spatial Queries', 'ETL Data Pipelines'],
    },
    {
      title: 'Security, Cloud & DevOps',
      list: ['Cloudinary Media Management', 'PBKDF2 Password Hashing', 'HMAC Session Security', 'Git & GitHub Workflows', 'cPanel & Linux Node Hosting', 'Rate Limiting & CORS Hardening'],
    },
  ];

  const categoriesToRender =
    skills && Object.keys(skills).length > 0
      ? Object.entries(skills).map(([key, items]) => ({
          title: key,
          list: items,
        }))
      : defaultCategories;

  return (
    <section id="skills" className="section container reveal">
      <div className="section-header">
        <span className="section-num">02</span>
        <h2 className="section-title">Technical Capabilities</h2>
      </div>

      <div className="skills-container">
        <div className="skills-grid">
          {categoriesToRender.map((col, idx) => (
            <div key={idx} className="skill-col">
              <h4>{col.title}</h4>
              <ul className="skill-list">
                {col.list.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
