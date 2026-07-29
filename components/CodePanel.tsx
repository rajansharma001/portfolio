"use client";

import React from 'react';

interface CodePanelProps {
  snippet?: string;
}

export default function CodePanel({ snippet }: CodePanelProps) {
  const defaultSnippet = `const developer = {
  name: 'Rajan Sharma',
  role: 'Backend-Focused Full Stack Developer',
  skills: ['Node.js', 'TypeScript', 'Next.js',
           'PostgreSQL', 'React', 'REST APIs'],
  passion: 'Building products that solve real problems',
  location: 'Kohalpur, Nepal',
  openTo: 'International Opportunities'
};

// Let's build something amazing together 🚀`;

  const highlightCode = (code: string) => {
    let highlighted = code
      .replace(/const/g, '<span style="color: #60a5fa">const</span>')
      .replace(/developer/g, '<span style="color: #f8fafc">developer</span>')
      .replace(/name:|role:|skills:|passion:|location:|openTo:/g, (match) => `<span style="color: #f472b6">${match}</span>`)
      .replace(/'([^']*)'/g, '<span style="color: #cbd5e1">\'$1\'</span>')
      .replace(/(\/\/.*)/g, '<span style="color: #64748b">$1</span>');
    return { __html: highlighted };
  };

  return (
    <div className="code-panel">
      <div className="code-header">
        <div className="code-dots">
          <div className="code-dot" style={{ background: '#ef4444' }} />
          <div className="code-dot" style={{ background: '#eab308' }} />
          <div className="code-dot" style={{ background: '#22c55e' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
          <span style={{ color: '#3178c6', fontWeight: 'bold' }}>TS</span> TypeScript
        </div>
      </div>
      <div className="code-body">
        <pre style={{ margin: 0 }}>
          <code dangerouslySetInnerHTML={highlightCode(snippet || defaultSnippet)} />
        </pre>
      </div>
    </div>
  );
}
