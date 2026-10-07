"use client";

import React, { useState, useRef, useEffect } from 'react';
import { PortfolioSettings, SectionVisibility, DEFAULT_VISIBILITY, SkillsMap, Project } from '@/lib/types';
import { Download, MapPin, Layers, Cpu, Terminal as TerminalIcon } from 'lucide-react';
import { triggerConfetti } from '@/lib/confetti';

interface HeroProps {
  settings?: PortfolioSettings | null;
  visibility?: SectionVisibility;
  skills?: SkillsMap;
  projects?: Project[];
}

export default function Hero({ settings, visibility, skills, projects }: HeroProps) {
  const vis = visibility || DEFAULT_VISIBILITY;
  const rawName = settings?.name || 'Rajan Sharma';
  const nameParts = rawName.toUpperCase().split(' ');
  const firstName = nameParts[0] || 'RAJAN';
  const lastName = nameParts.slice(1).join(' ') || 'SHARMA';

  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'input', text: 'help' },
    {
      type: 'output',
      text: `Available commands:
  whoami          - Display engineer bio & credentials
  skills          - Inspect active technical stack
  projects        - List shipped production systems
  cat resume      - Output condensed ASCII resume
  contact         - Get direct reach-out channels
  sudo hire-rajan - Run instant hiring pipeline 🚀
  clear           - Reset terminal session`,
    },
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const handleResume = () => {
    if (settings?.resumeUrl) {
      window.open(settings.resumeUrl, '_blank');
    } else if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const scrollToBottom = () => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [terminalHistory]);

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawCmd = terminalInput.trim();
    if (!rawCmd) return;

    const cmd = rawCmd.toLowerCase();
    const newHistory = [...terminalHistory, { type: 'input', text: rawCmd }];

    if (cmd === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else if (cmd === 'help') {
      newHistory.push({
        type: 'output',
        text: `Available commands:
  whoami          - Display engineer bio & credentials
  skills          - Inspect active technical stack
  projects        - List shipped production systems
  cat resume      - Output condensed ASCII resume
  contact         - Get direct reach-out channels
  sudo hire-rajan - Run instant hiring pipeline 🚀
  clear           - Reset terminal session`,
      });
    } else if (cmd === 'whoami') {
      newHistory.push({
        type: 'output',
        text: `${settings?.name || 'Rajan Sharma'}
Role: ${settings?.role || 'Full-Stack Software Engineer'}
Location: ${settings?.location || 'Kathmandu, Bagmati Prov, Nepal'}
Bio: ${settings?.bio || 'Building scalable web systems, REST APIs & resilient database architectures.'}`,
      });
    } else if (cmd === 'skills') {
      if (skills && Object.keys(skills).length > 0) {
        const skillsText = Object.entries(skills)
          .map(([cat, list]) => `[${cat}]: ${(list || []).join(', ')}`)
          .join('\n');
        newHistory.push({ type: 'output', text: skillsText });
      } else {
        newHistory.push({
          type: 'output',
          text: `[Frontend]: Next.js 16, React 19, TypeScript, Tailwind CSS
[Backend]: Node.js, Express.js, REST APIs, JWT RBAC
[Databases]: PostgreSQL, Prisma ORM, MongoDB, Mongoose
[DevOps]: Docker, CI/CD, Git, Cloudinary, cPanel`,
        });
      }
    } else if (cmd === 'projects') {
      if (projects && projects.length > 0) {
        const listText = projects
          .slice(0, 5)
          .map((p, idx) => `${idx + 1}. ${p.title} (${p.type || 'Full-Stack'}) - ${(p.techStack || []).slice(0, 3).join(', ')}`)
          .join('\n');
        newHistory.push({
          type: 'output',
          text: `Total Projects: ${projects.length} shipped\n${listText}\n...type 'help' or view full grid below.`,
        });
      } else {
        newHistory.push({
          type: 'output',
          text: '16+ production systems shipped across LMS, POS, tourism & geospatial pipelines.',
        });
      }
    } else if (cmd === 'cat resume' || cmd === 'cat resume.txt' || cmd === 'cat resume.pdf') {
      newHistory.push({
        type: 'output',
        text: `================================================
  RAJAN SHARMA — Full-Stack Software Engineer
  Kathmandu, Nepal | email.rajan001@gmail.com
================================================
• 16 Shipped Production Software Systems
• Core: Next.js, TypeScript, Node.js, Express, PostgreSQL, MongoDB
• Focus: Scalable Distributed Backends, High-Performance Frontends
• PDF Link: ${settings?.resumeUrl || '/uploads/resume.pdf'}
================================================`,
      });
    } else if (cmd === 'contact') {
      newHistory.push({
        type: 'output',
        text: `Email: ${settings?.email || 'email.rajan001@gmail.com'}
Phone: ${settings?.phone || '+977 9800000000'}
GitHub: https://github.com/rajansharma001
LinkedIn: https://linkedin.com/in/rajansharma001`,
      });
    } else if (cmd === 'sudo hire-rajan' || cmd === 'hire-rajan' || cmd === 'hire') {
      triggerConfetti();
      newHistory.push({
        type: 'output',
        text: `🎉 EXCELLENT DECISION! Initiating recruiter onboarding sequence...
Status: 200 OK — Interview schedule pipeline unlocked.
Redirecting to direct message channel in 1 second...`,
      });
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 1000);
    } else if (cmd === 'theme') {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        newHistory.push({ type: 'output', text: 'Theme switched to Light mode.' });
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        newHistory.push({ type: 'output', text: 'Theme switched to Dark mode.' });
      }
    } else {
      newHistory.push({
        type: 'error',
        text: `zsh: command not found: ${rawCmd}. Type 'help' for available commands.`,
      });
    }

    setTerminalHistory(newHistory);
    setTerminalInput('');
  };

  return (
    <section className="hero container" id="about">
      <div className="hero-grid">
        <div className="hero-content">
          <div className="hero-title-group">
            <span className="hero-role">{settings?.role || 'Full-Stack Software Engineer'}</span>
            <h1 className="hero-name">
              {firstName}
              <br />
              {lastName}
            </h1>
            <p className="hero-headline">
              {settings?.headline || 'Building production-grade web systems, REST APIs & scalable backends.'}
            </p>
            <p
              className="hero-impact"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                color: 'var(--accent)',
                marginTop: '1rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}
            >
              {settings?.heroImpactText || '16 production systems shipped across LMS, POS, tourism & geospatial domains.'}
            </p>
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

        <div className="hero-terminal">
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>
              <div className="terminal-title">
                <TerminalIcon size={12} style={{ display: 'inline', marginRight: '4px' }} /> guest@{firstName.toLowerCase()} ~ zsh
              </div>
            </div>
            <div className="terminal-body" onClick={() => document.getElementById('terminal-input')?.focus()}>
              {terminalHistory.map((line, idx) => (
                <div key={idx} className={`terminal-line ${line.type}`}>
                  {line.type === 'input' && <span className="prompt">~/guest {`>`}&nbsp;</span>}
                  <span className="content" style={{ whiteSpace: 'pre-wrap' }}>
                    {line.text}
                  </span>
                </div>
              ))}

              <form onSubmit={handleTerminalSubmit} className="terminal-input-row">
                <span className="prompt">~/guest {`>`}&nbsp;</span>
                <input
                  id="terminal-input"
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  autoComplete="off"
                  spellCheck="false"
                  placeholder="type 'sudo hire-rajan'..."
                />
              </form>
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>
      </div>

      <div className="hero-quick-facts" style={{ marginTop: '2rem' }}>
        <div className="fact-item">
          <MapPin size={14} className="fact-icon" />
          <div>
            <span className="fact-label">Location</span>
            <span className="fact-value">
              {settings?.quickFacts?.location || settings?.location || 'Kathmandu, Bagmati Prov, Nepal'}
            </span>
          </div>
        </div>
        <div className="fact-item">
          <Layers size={14} className="fact-icon" />
          <div>
            <span className="fact-label">Core Stack</span>
            <span className="fact-value">{settings?.quickFacts?.coreStack || 'Next.js / Node.js / PostgreSQL / MongoDB'}</span>
          </div>
        </div>
        <div className="fact-item">
          <Cpu size={14} className="fact-icon" />
          <div>
            <span className="fact-label">Focus</span>
            <span className="fact-value">{settings?.quickFacts?.focus || 'Scalable Architecture & Web Systems'}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
