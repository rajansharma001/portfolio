"use client";

import React, { useState, useRef } from 'react';
import { PortfolioSettings } from '@/lib/types';
import { Download } from 'lucide-react';

interface HeroProps {
  settings?: PortfolioSettings | null;
}

interface TerminalLine {
  type: 'in' | 'out' | 'err';
  content: string;
}

export default function Hero({ settings }: HeroProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'out', content: `Welcome! Type <span style="color:#ff6188;">'help'</span> to see available commands.` },
  ]);
  const [inputVal, setInputVal] = useState('');
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  const rawName = settings?.name || 'RAJAN SHARMA';
  const nameParts = rawName.toUpperCase().split(' ');
  const firstName = nameParts[0] || 'RAJAN';
  const lastName = nameParts.slice(1).join(' ') || 'SHARMA';

  const commands: Record<string, string> = {
    help: `Available commands: <span style="color:#ffbd2e">skills</span>, <span style="color:#ffbd2e">exp</span>, <span style="color:#ffbd2e">contact</span>, <span style="color:#ffbd2e">theme</span>, <span style="color:#ffbd2e">clear</span>`,
    skills: 'Stack: Next.js 16 | React 19 | TypeScript | Node.js | Express | PostgreSQL | MongoDB | Tailwind',
    exp: 'Experience: Full-Stack Engineer (Independent) | Ex-Data Entry (Souq Al Baladi) | CTEVT Diploma',
    contact: `Email: ${settings?.email || 'email.rajan001@gmail.com'} | Location: ${settings?.location || 'Kathmandu, Bagmati Prov, Nepal'}`,
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
          content: `<span style="color:#ff5f56">Command not found: ${val}. Type 'help' for options.</span>`,
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
    if (settings?.resumeUrl) {
      window.open(settings.resumeUrl, '_blank');
    } else if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <section className="hero container reveal" id="about">
      <div className="hero-grid">
        <div className="hero-main">
          <div className="hero-title-group">
            <span className="hero-role">{settings?.role || 'Full-Stack Software Engineer'}</span>
            <h1 className="text-huge">
              {firstName}
              <br />
              {lastName}
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
          <span>{settings?.location || 'Kathmandu, Bagmati Prov, Nepal (UTC +5:45)'}</span>
        </div>
        <div className="fact-item">
          <span className="label">Core Stack</span>
          <span>Next.js / Node.js / PostgreSQL / MongoDB</span>
        </div>
        <div className="fact-item">
          <span className="label">Engineering Focus</span>
          <span>Scalable Architecture & Web Systems</span>
        </div>
      </div>

      <div className="hero-actions">
        <a href="#work" className="btn btn-primary">
          View Featured Works
        </a>
        <button onClick={handlePrint} className="btn btn-outline" type="button" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Download size={16} />
          {settings?.resumeUrl ? 'Download CV' : 'Print CV'}
        </button>
      </div>
    </section>
  );
}
