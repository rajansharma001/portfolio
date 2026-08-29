"use client";

import React, { useState, useRef } from 'react';
import { PortfolioSettings } from '@/lib/types';

interface HeroProps {
  settings?: PortfolioSettings | null;
}

interface TerminalLine {
  type: 'in' | 'out' | 'err';
  content: string;
}

export default function Hero({ settings }: HeroProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'out', content: `Welcome! Type <span style="color:#ff6188;">'help'</span> to see available commands.` }
  ]);
  const [inputVal, setInputVal] = useState('');
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  const commands: Record<string, string> = {
    help: `Available commands: <span style="color:#ffbd2e">skills</span>, <span style="color:#ffbd2e">exp</span>, <span style="color:#ffbd2e">contact</span>, <span style="color:#ffbd2e">theme</span>, <span style="color:#ffbd2e">clear</span>`,
    skills: 'Stack: Next.js | TypeScript | Node.js | Express | PostgreSQL | MongoDB | Tailwind',
    exp: 'Experience: Full-Stack Engineer (Self-Employed) | Ex-Data Entry (Souq Al Baladi) | CTEVT Diploma',
    contact: `Email: ${settings?.email || 'email.rajan001@gmail.com'} | Location: Kohalpur, Nepal`,
    theme: 'Toggling visual theme...',
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = inputVal.trim().toLowerCase();
      if (!val) return;

      const newLines: TerminalLine[] = [...lines, { type: 'in', content: val }];

      if (val === 'clear') {
        setLines([]);
      } else if (val === 'theme') {
        const root = document.documentElement;
        const currentTheme = root.getAttribute('data-theme');
        if (currentTheme === 'dark') {
          root.removeAttribute('data-theme');
          localStorage.setItem('theme', 'light');
        } else {
          root.setAttribute('data-theme', 'dark');
          localStorage.setItem('theme', 'dark');
        }
        newLines.push({ type: 'out', content: commands.theme });
        setLines(newLines);
      } else if (commands[val]) {
        newLines.push({ type: 'out', content: commands[val] });
        setLines(newLines);
      } else {
        newLines.push({
          type: 'err',
          content: `<span style="color:#ff5f56">Command not found: ${val}. Type 'help' for options.</span>`
        });
        setLines(newLines);
      }

      setInputVal('');
      setTimeout(() => {
        if (terminalBodyRef.current) {
          terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
        }
      }, 50);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <section className="hero container reveal" id="about">
      <div className="status-badge" style={{ marginBottom: '2rem', alignSelf: 'flex-start' }}>
        <span className="dot"></span> {settings?.availabilityBadgeText || 'Open to remote & local full-stack roles'}
      </div>

      <div className="hero-grid">
        <div className="hero-main">
          <div className="hero-title-group">
            <span className="hero-role">{settings?.role || 'Software & Web Engineer'}</span>
            <h1 className="text-huge">
              RAJAN<br />SHARMA
            </h1>
          </div>
        </div>

        <div className="terminal">
          <div className="terminal-header">
            <div className="terminal-dots">
              <div className="terminal-btn red"></div>
              <div className="terminal-btn yellow"></div>
              <div className="terminal-btn green"></div>
            </div>
            <div className="terminal-title">rajan-cli v2.4 (interactive)</div>
          </div>
          <div className="terminal-body" id="terminal-body" ref={terminalBodyRef}>
            {lines.map((line, idx) => (
              <div key={idx} className="terminal-line">
                {line.type === 'in' ? (
                  <>
                    <span className="prompt">guest@rajan:~$ </span>
                    <span className="cmd-out">{line.content}</span>
                  </>
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: line.content }} />
                )}
              </div>
            ))}
            <div className="terminal-input-row">
              <span className="prompt">guest@rajan:~$ </span>
              <input
                type="text"
                id="terminal-input"
                placeholder="type command..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                spellCheck="false"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="hero-quick-facts">
        <div className="fact-item">
          <span className="label">Location</span>
          <span>{settings?.location || 'Kohalpur, Nepal'} (UTC +5:45)</span>
        </div>
        <div className="fact-item">
          <span className="label">Core Stack</span>
          <span>Next.js / Node.js / TypeScript</span>
        </div>
        <div className="fact-item">
          <span className="label">Engineering Focus</span>
          <span>Scalable Architecture & Web Systems</span>
        </div>
      </div>

      <div className="hero-actions">
        <a href="#work" className="btn btn-primary">
          View Portfolio
        </a>
        <button onClick={handlePrint} className="btn btn-outline" type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Print CV
        </button>
      </div>
    </section>
  );
}
