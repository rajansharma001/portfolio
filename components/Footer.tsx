import React from 'react';
import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';
import { PortfolioSettings } from '@/lib/types';

interface FooterProps {
  settings?: PortfolioSettings | null;
}

export default function Footer({ settings }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <strong>{(settings?.name || 'Rajan Sharma').toUpperCase()}</strong>
          <span className="footer-role">{settings?.role || 'Full-Stack Software Engineer'}</span>
        </div>

        <div className="footer-links">
          <a href="https://github.com/rajansharma001" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github size={18} />
          </a>
          <a href="https://linkedin.com/in/rajansharma001" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin size={18} />
          </a>
          <a href={`mailto:${settings?.email || 'email.rajan001@gmail.com'}`} aria-label="Email">
            <Mail size={18} />
          </a>
        </div>

        <div className="footer-meta">
          <Link href="/blog">Blog</Link>
          <span>&copy; {new Date().getFullYear()} &middot; Kathmandu, Nepal</span>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: 'inherit', textTransform: 'inherit', textDecoration: 'underline' }}>
            Back to Top &uarr;
          </button>
        </div>
      </div>
    </footer>
  );
}
