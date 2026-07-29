import React from 'react';

export default function Footer() {
  return (
    <footer className="footer-bar" style={{ padding: '3rem 0', textAlign: 'center' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <div className="logo-initials" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>RS</div>
          <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem' }}>Rajan Sharma</div>
        </div>

        <div className="badge-intl" style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}>
          Available for remote & international roles
        </div>
        
        <div style={{ color: 'var(--text-secondary)' }}>
          <p style={{ marginBottom: '0.25rem' }}>Designed & developed by Rajan Sharma.</p>
          <p style={{ fontSize: '0.85rem' }}>Built with Next.js, TypeScript, and modern web standards.</p>
        </div>

        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
          © {new Date().getFullYear()} All rights reserved.
        </div>
      </div>
    </footer>
  );
}
