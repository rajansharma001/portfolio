import React from 'react';
import { Server, Layout, Database, Wrench } from 'lucide-react';
import { SkillsMap } from '@/lib/types';

interface SkillsGridProps {
  skills: SkillsMap;
}

const CATEGORY_ICONS: Record<string, { icon: React.ReactNode, color: string }> = {
  Backend: { icon: <Server size={18} color="#22c55e" />, color: 'rgba(34, 197, 94, 0.1)' },
  Frontend: { icon: <Layout size={18} color="#3b82f6" />, color: 'rgba(59, 130, 246, 0.1)' },
  Database: { icon: <Database size={18} color="#c084fc" />, color: 'rgba(192, 132, 252, 0.1)' },
  Tools: { icon: <Wrench size={18} color="#f97316" />, color: 'rgba(249, 115, 22, 0.1)' },
  'Tools & Others': { icon: <Wrench size={18} color="#f97316" />, color: 'rgba(249, 115, 22, 0.1)' },
};

export default function SkillsGrid({ skills }: SkillsGridProps) {
  const categories = ['Backend', 'Frontend', 'Database', 'Tools'];

  return (
    <section id="skills" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag" style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>TECHNICAL SKILLS</span>
          <p className="section-subtitle" style={{ display: 'inline-block', marginLeft: '1rem', margin: 0 }}>
            Technologies and tools I use to build scalable solutions.
          </p>
        </div>

        <div className="skills-grid">
          {categories.map((category) => {
            const list = skills[category] || skills['Tools & Others'] || [];
            const meta = CATEGORY_ICONS[category] || CATEGORY_ICONS['Backend'];

            return (
              <div key={category} className="skill-card">
                <div className="skill-header">
                  <div className="skill-icon-wrap" style={{ background: meta.color }}>
                    {meta.icon}
                  </div>
                  <span className="skill-title">{category === 'Tools' ? 'Tools & Others' : category}</span>
                </div>

                <div className="skill-list">
                  {list.map((skill) => (
                    <div key={skill} className="skill-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" fill="var(--text-secondary)"></circle></svg>
                      <span style={{ color: 'var(--text-primary)' }}>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
