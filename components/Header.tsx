"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SectionVisibility, DEFAULT_VISIBILITY } from '@/lib/types';

interface HeaderProps {
  visibility?: SectionVisibility;
  projectCount?: number;
}

export default function Header({ visibility, projectCount }: HeaderProps) {
  const vis = visibility || DEFAULT_VISIBILITY;
  const [timeStr, setTimeStr] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (!vis.showClockWidget) return;
    function updateClock() {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const nepalTime = new Date(utc + 3600000 * 5.75);
      const hours = String(nepalTime.getHours()).padStart(2, '0');
      const minutes = String(nepalTime.getMinutes()).padStart(2, '0');
      const seconds = String(nepalTime.getSeconds()).padStart(2, '0');
      setTimeStr(`NPT ${hours}:${minutes}:${seconds}`);
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [vis.showClockWidget]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      setTheme('dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      setTheme('light');
    }
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };

  const closeMenu = () => setMobileMenuOpen(false);

  const count = projectCount ?? 16;

  return (
    <>
      <header className="site-header" id="header">
        <div className="container nav-container">
          <div className="nav-left">
            <Link href="/" className="logo">Rajan.</Link>
            {vis.showAvailabilityBadge && (
              <div className="availability-badge">
                <span className="status-dot" />
                <span className="availability-text">Open for Roles</span>
              </div>
            )}
          </div>

          <nav className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <Link href="/#work" className="nav-item" onClick={closeMenu}>
              Projects{count > 0 ? ` (${count})` : ''}
            </Link>
            <Link href="/#skills" className="nav-item" onClick={closeMenu}>Skills</Link>
            <Link href="/#experience" className="nav-item" onClick={closeMenu}>Experience</Link>
            {vis.showBlog && (
              <Link href="/blog" className="nav-item" onClick={closeMenu}>Blog</Link>
            )}
            <Link href="/#contact" className="nav-item" onClick={closeMenu}>Contact</Link>
          </nav>

          <div className="nav-right">
            {vis.showClockWidget && timeStr && (
              <div className="clock-widget">{timeStr}</div>
            )}
            {vis.showThemeToggle && (
              <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
                {theme === 'dark' ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                )}
              </button>
            )}
            <button
              className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div className="mobile-backdrop" onClick={closeMenu} />
      )}
    </>
  );
}
