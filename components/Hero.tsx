"use client";

import React, { useState, useRef, useEffect } from 'react';
import { PortfolioSettings, SectionVisibility, DEFAULT_VISIBILITY } from '@/lib/types';
import { Download, MapPin, Layers, Cpu, Terminal as TerminalIcon } from 'lucide-react';

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
  
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'input', text: 'whoami' },
    { type: 'output', text: settings?.role || 'Full-Stack Software Engineer' },
    { type: 'input', text: 'cat status.txt' },
    { type: 'output', text: settings?.availabilityBadgeText || 'Available for Roles' },
    { type: 'output', text: 'System ready.' }
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
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [terminalHistory]);

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim().toLowerCase();
    const newHistory = [...terminalHistory, { type: 'input', text: terminalInput }];

    if (cmd === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else if (cmd === 'help') {
      newHistory.push({ type: 'output', text: 'Available commands: whoami, skills, experience, contact, clear' });
    } else if (cmd === 'skills') {
      newHistory.push({ type: 'output', text: 'Next.js, TypeScript, Node.js, Express, PostgreSQL, MongoDB' });
    } else if (cmd === 'experience') {
      newHistory.push({ type: 'output', text: '16+ production systems engineered.' });
    } else if (cmd === 'contact') {
      newHistory.push({ type: 'output', text: `Email: ${settings?.email || 'email.rajan001@gmail.com'}` });
    } else if (cmd === 'whoami') {
      newHistory.push({ type: 'output', text: settings?.name || 'Rajan Sharma' });
    } else {
      newHistory.push({ type: 'error', text: `Command not found: ${terminalInput}. Type 'help' for available commands.` });
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

        <div className="hero-terminal">
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="terminal-title">
                <TerminalIcon size={12} style={{ display: 'inline', marginRight: '4px' }} /> guest@{firstName.toLowerCase()} ~ zsh
              </div>
            </div>
            <div className="terminal-body" onClick={() => document.getElementById('terminal-input')?.focus()}>
              {terminalHistory.map((line, idx) => (
                <div key={idx} className={`terminal-line ${line.type}`}>
                  {line.type === 'input' && <span className="prompt">~/guest {`>`}&nbsp;</span>}
                  <span className="content">{line.text}</span>
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
                />
              </form>
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
