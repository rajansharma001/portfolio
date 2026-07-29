import React from 'react';
import { Download, ArrowRight, Github, Linkedin, Mail, Calendar, Code, Server, Terminal, FileCode2, Globe, Atom, Database, Boxes } from 'lucide-react';
import CodePanel from './CodePanel';
import { PortfolioSettings } from '@/lib/types';

interface HeroProps {
  settings: PortfolioSettings;
}

export default function Hero({ settings }: HeroProps) {
  // Helper to map string icon names to Lucide components
  const renderIcon = (iconName: string, color: string, size: number = 18) => {
    switch(iconName.toLowerCase()) {
      case 'calendar': return <Calendar size={size} color={color} />;
      case 'code': return <Code size={size} color={color} />;
      case 'server': return <Server size={size} color={color} />;
      case 'terminal': return <Terminal size={size} color={color} />;
      case 'filecode2': return <FileCode2 size={size} color={color} />;
      case 'globe': return <Globe size={size} color={color} />;
      case 'atom': return <Atom size={size} color={color} />;
      case 'database': return <Database size={size} color={color} />;
      default: return <Boxes size={size} color={color} />;
    }
  };

  return (
    <section id="about" className="section">
      <div className="container">
        <div className="hero-grid">
          {/* Left Side */}
          <div>
            <div className="badge-intl">
              {settings.availabilityBadgeText || 'Open to International Opportunities'}
            </div>

            <h1 className="hero-title-main">
              Hi, I&apos;m<br/>
              Rajan <span className="gradient-text">Sharma</span>
            </h1>
            <div className="hero-role">
              {settings.role || 'Backend-Focused Full Stack Developer'}
            </div>

            <p className="hero-pitch">
              {settings.headline || 'I build secure, scalable, and high-performance web applications with Node.js, TypeScript, Next.js, PostgreSQL, and React.'}
            </p>

            {settings.heroTechChips && settings.heroTechChips.length > 0 && (
              <div className="hero-tech-chips">
                {settings.heroTechChips.map((chip, idx) => (
                  <span key={idx} className="hero-tech-chip">
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      {renderIcon(chip.iconText, chip.iconColor, 14)}
                    </span> 
                    {chip.name}
                  </span>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="#projects" className="btn btn-primary">
                <span>View My Work</span>
                <ArrowRight size={16} />
              </a>

              <a
                href={settings.resumeUrl || '/uploads/resume.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <Download size={16} />
                <span>Download Resume</span>
              </a>

              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                <a href="https://github.com/rajansharma001" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.6rem' }}>
                  <Github size={18} />
                </a>
                <a href="https://linkedin.com/in/rajansharma001" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.6rem' }}>
                  <Linkedin size={18} />
                </a>
                <a href={`mailto:${settings.email}`} className="btn btn-secondary" style={{ padding: '0.6rem' }}>
                  <Mail size={18} />
                </a>
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: '500', flexWrap: 'wrap' }}>
              <span>Open to International Opportunities</span>
              <span style={{ color: 'var(--border-light)' }}>•</span>
              <span>Remote Friendly</span>
              <span style={{ color: 'var(--border-light)' }}>•</span>
              <span>Backend-Focused</span>
            </div>
          </div>

          {/* Right Side */}
          <div>
            <CodePanel snippet={settings.codeSnippet} />
            
            {settings.heroStats && settings.heroStats.length > 0 && (
              <div className="hero-stats">
                {settings.heroStats.map((stat, idx) => (
                  <div key={idx} className="hero-stat-card">
                    <div className="stat-top">
                      {renderIcon(stat.icon, stat.iconColor)}
                      <span className="stat-value">{stat.value}</span>
                    </div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

