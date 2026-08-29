import React from 'react';
import { SkillsMap } from '@/lib/types';

interface SkillsGridProps {
  skills?: SkillsMap;
}

export default function SkillsGrid({ skills }: SkillsGridProps) {
  const defaultCategories = [
    {
      title: 'Frontend Development',
      list: [
        'JavaScript (ES6+)',
        'TypeScript',
        'React / Next.js',
        'Tailwind CSS / Shadcn',
        'HTML5 / CSS Modules',
      ],
    },
    {
      title: 'Backend & Databases',
      list: [
        'Node.js / Express',
        'REST API Architecture',
        'PostgreSQL / Prisma',
        'MongoDB / Mongoose',
        'JWT & OAuth',
      ],
    },
    {
      title: 'CMS & Design',
      list: [
        'WordPress',
        'Elementor Interface Design',
        'PHP Basics',
        'UI/UX Design Systems',
      ],
    },
    {
      title: 'DevOps & Tools',
      list: [
        'Git / GitHub',
        'Linux Server Administration',
        'cPanel Deployment',
        'Postman / API Testing',
      ],
    },
  ];

  // Map dynamic skills if available
  const categoriesToRender = skills && Object.keys(skills).length > 0
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
