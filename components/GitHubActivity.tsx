"use client";

import React, { useEffect, useState } from 'react';
import { GitCommit, Github, ExternalLink, Activity } from 'lucide-react';

interface CommitItem {
  repo: string;
  message: string;
  sha: string;
  date: string;
  url: string;
}

export default function GitHubActivity() {
  const [commits, setCommits] = useState<CommitItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/github/activity')
      .then((res) => res.json())
      .then((data) => {
        if (data.recentCommits) {
          setCommits(data.recentCommits);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getRelativeTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Recently';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="card" style={{ marginTop: '2.5rem', background: 'var(--bg-main)', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Github size={18} color="var(--accent)" />
          <h3 style={{ fontSize: '15px', fontWeight: '700' }}>Live GitHub Commit Activity</h3>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--status-success)', fontFamily: 'var(--font-mono)', fontWeight: '700', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--status-success)' }} />
            Active
          </span>
        </div>

        <a
          href="https://github.com/rajansharma001"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          @rajansharma001 <ExternalLink size={12} />
        </a>
      </div>

      {loading ? (
        <div style={{ padding: '1.5rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
          Pinging GitHub event stream...
        </div>
      ) : commits.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {commits.slice(0, 4).map((c, idx) => (
            <a
              key={idx}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-light)',
                borderRadius: '6px',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'border-color 0.2s',
              }}
              className="table-row-hover"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                <GitCommit size={15} color="var(--accent)" style={{ flexShrink: 0 }} />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.message}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {c.repo.replace('rajansharma001/', '')}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', flexShrink: 0, marginLeft: '12px' }}>
                {getRelativeTime(c.date)}
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
          Recent repository activity verified.
        </div>
      )}
    </div>
  );
}
