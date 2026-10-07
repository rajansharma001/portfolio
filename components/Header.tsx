"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { SectionVisibility, DEFAULT_VISIBILITY, PortfolioSettings } from '@/lib/types';
import {
  Search,
  Sun,
  Moon,
  X,
  Shield,
  CalendarCheck,
  FileText,
  Linkedin,
  Mail,
  ArrowRight,
  ExternalLink,
  Clock,
  LayoutDashboard,
  CheckCircle2,
} from 'lucide-react';

interface HeaderProps {
  visibility?: SectionVisibility;
  settings?: PortfolioSettings | null;
  projectCount?: number;
  onOpenCommandPalette?: () => void;
}

export default function Header({
  visibility,
  settings,
  projectCount,
  onOpenCommandPalette,
}: HeaderProps) {
  const vis = visibility || DEFAULT_VISIBILITY;
  const [timeStr, setTimeStr] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const badgeText = settings?.availabilityBadgeText || 'Open for Roles';
  const badgeDate = settings?.availabilityBadgeDate || 'Oct 2026';
  const totalProjects = projectCount || 16;
  const resumeUrl = settings?.resumeUrl || '/uploads/resume.pdf';

  // Live Kathmandu Clock
  useEffect(() => {
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
  }, []);

  // Theme Initializer
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

  // Lock body scroll when mobile menu is open & listen for Escape
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
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

  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);

  return (
    <>
      <header className="site-header" id="header">
        <div className="container nav-container">
          {/* Logo & Availability Status */}
          <div className="nav-left">
            <Link href="/" className="logo">
              Rajan.
            </Link>
            {vis.showAvailabilityBadge && (
              <div className="availability-badge">
                <span className="status-dot" />
                <span className="availability-text">{badgeText}</span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    color: 'var(--text-muted)',
                    marginLeft: '4px',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {badgeDate}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="nav-links desktop-nav">
            <Link href="/#work" className="nav-item">
              Projects
            </Link>
            <Link href="/#skills" className="nav-item">
              Skills
            </Link>
            <Link href="/#experience" className="nav-item">
              Experience
            </Link>
            {vis.showBlog && (
              <Link href="/blog" className="nav-item">
                Blog
              </Link>
            )}
            <Link href="/#contact" className="nav-item">
              Contact
            </Link>
          </nav>

          {/* Header Controls */}
          <div className="nav-right">
            {/* Command Palette Trigger */}
            {onOpenCommandPalette && (
              <button
                type="button"
                onClick={onOpenCommandPalette}
                className="command-trigger-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                title="Open Command Palette (Cmd + K / Ctrl + K)"
              >
                <Search size={13} color="var(--accent)" />
                <span className="cmd-text" style={{ fontSize: '11px' }}>Search</span>
                <kbd
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    borderRadius: '3px',
                    padding: '1px 5px',
                    fontSize: '10px',
                  }}
                >
                  ⌘K
                </kbd>
              </button>
            )}

            {/* Live Kathmandu Time Widget */}
            {vis.showClockWidget && timeStr && (
              <div className="clock-widget">{timeStr}</div>
            )}

            {/* Desktop Admin Shortcut Icon */}
            <Link
              href="/admin"
              className="admin-header-shortcut"
              title="Admin Portal & Daily Planner"
              aria-label="Admin Portal"
            >
              <Shield size={14} />
            </Link>

            {/* Theme Toggle Button */}
            {vis.showThemeToggle && (
              <button
                type="button"
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <Sun size={16} />
                ) : (
                  <Moon size={16} />
                )}
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MOBILE NAVIGATION DRAWER (Full-Featured, Modern, Touch-Friendly, PWA-Ready) */}
      {/* ========================================================================= */}
      <div
        className={`mobile-drawer-portal ${mobileMenuOpen ? 'open' : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Backdrop overlay */}
        <div
          className="mobile-drawer-backdrop"
          onClick={closeMenu}
          aria-label="Close menu backdrop"
        />

        {/* Drawer Sliding Panel */}
        <div className="mobile-drawer-panel">
          {/* Drawer Top Header */}
          <div className="mobile-drawer-header">
            <div className="mobile-drawer-brand">
              <Link href="/" className="logo" onClick={closeMenu}>
                Rajan.
              </Link>
              <div className="mobile-drawer-status">
                <span className="status-dot" />
                <span>{badgeText}</span>
              </div>
            </div>

            <button
              type="button"
              className="mobile-drawer-close-btn"
              onClick={closeMenu}
              aria-label="Close Navigation"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="mobile-drawer-body">
            {/* Live Clock / Location Tag */}
            <div className="mobile-drawer-meta-pill">
              <Clock size={13} color="var(--accent)" />
              <span>{timeStr || 'NPT (UTC+5:45)'}</span>
              <span className="mobile-meta-divider">&bull;</span>
              <span>Kathmandu, Nepal</span>
            </div>

            {/* Primary Section Links */}
            <nav className="mobile-nav-list">
              <Link
                href="/#work"
                className="mobile-nav-link"
                onClick={closeMenu}
              >
                <div className="mobile-nav-link-left">
                  <span className="mobile-nav-index">01</span>
                  <span className="mobile-nav-title">Projects</span>
                </div>
                <div className="mobile-nav-link-right">
                  <span className="mobile-nav-badge">{totalProjects} Systems</span>
                  <ArrowRight size={15} className="mobile-nav-arrow" />
                </div>
              </Link>

              <Link
                href="/#skills"
                className="mobile-nav-link"
                onClick={closeMenu}
              >
                <div className="mobile-nav-link-left">
                  <span className="mobile-nav-index">02</span>
                  <span className="mobile-nav-title">Skills &amp; Tech Stack</span>
                </div>
                <div className="mobile-nav-link-right">
                  <ArrowRight size={15} className="mobile-nav-arrow" />
                </div>
              </Link>

              <Link
                href="/#experience"
                className="mobile-nav-link"
                onClick={closeMenu}
              >
                <div className="mobile-nav-link-left">
                  <span className="mobile-nav-index">03</span>
                  <span className="mobile-nav-title">Experience &amp; Track</span>
                </div>
                <div className="mobile-nav-link-right">
                  <ArrowRight size={15} className="mobile-nav-arrow" />
                </div>
              </Link>

              {vis.showBlog && (
                <Link
                  href="/blog"
                  className="mobile-nav-link"
                  onClick={closeMenu}
                >
                  <div className="mobile-nav-link-left">
                    <span className="mobile-nav-index">04</span>
                    <span className="mobile-nav-title">Engineering Blog</span>
                  </div>
                  <div className="mobile-nav-link-right">
                    <ArrowRight size={15} className="mobile-nav-arrow" />
                  </div>
                </Link>
              )}

              <Link
                href="/#contact"
                className="mobile-nav-link"
                onClick={closeMenu}
              >
                <div className="mobile-nav-link-left">
                  <span className="mobile-nav-index">05</span>
                  <span className="mobile-nav-title">Contact &amp; Inquiries</span>
                </div>
                <div className="mobile-nav-link-right">
                  <span className="mobile-nav-badge open-badge">Get in Touch</span>
                  <ArrowRight size={15} className="mobile-nav-arrow" />
                </div>
              </Link>
            </nav>

            {/* ========================================================= */}
            {/* ADMIN ACCESS CARD (Solves standalone mobile PWA login issue) */}
            {/* ========================================================= */}
            <div className="mobile-admin-card">
              <div className="mobile-admin-card-head">
                <div className="mobile-admin-label">
                  <Shield size={14} color="var(--accent)" />
                  <span>ADMIN WORKSPACE</span>
                </div>
                <span className="mobile-pwa-pill">Installed PWA Link</span>
              </div>
              <p className="mobile-admin-desc">
                Direct access to your administrative panel, daily tasks, habit tracker, and visitor analytics.
              </p>

              <div className="mobile-admin-actions">
                <Link
                  href="/admin"
                  className="mobile-admin-primary-btn"
                  onClick={closeMenu}
                >
                  <div className="mobile-admin-btn-inner">
                    <LayoutDashboard size={16} />
                    <div style={{ textAlign: 'left' }}>
                      <div className="mobile-admin-btn-title">Admin Dashboard &amp; CMS</div>
                      <div className="mobile-admin-btn-sub">Manage content, messages &amp; settings</div>
                    </div>
                  </div>
                  <ArrowRight size={15} />
                </Link>

                <Link
                  href="/admin/planner"
                  className="mobile-admin-secondary-btn"
                  onClick={closeMenu}
                >
                  <div className="mobile-admin-btn-inner">
                    <CalendarCheck size={16} />
                    <div style={{ textAlign: 'left' }}>
                      <div className="mobile-admin-btn-title">Planner &amp; Daily Schedule</div>
                      <div className="mobile-admin-btn-sub">Todos, habits, timeline &amp; notes</div>
                    </div>
                  </div>
                  <span className="mobile-planner-tag">Mobile Tool</span>
                </Link>
              </div>
            </div>

            {/* Quick Action Utilities Row */}
            <div className="mobile-drawer-utilities">
              {onOpenCommandPalette && (
                <button
                  type="button"
                  className="mobile-util-btn"
                  onClick={() => {
                    closeMenu();
                    onOpenCommandPalette();
                  }}
                >
                  <Search size={15} />
                  <span>Search (⌘K)</span>
                </button>
              )}

              <button
                type="button"
                className="mobile-util-btn"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-util-btn"
                onClick={closeMenu}
              >
                <FileText size={15} />
                <span>Resume PDF</span>
              </a>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="mobile-drawer-footer">
            <div className="mobile-drawer-footer-left">
              <a
                href="https://linkedin.com/in/rajansharma001"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-social-link"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={16} />
                <span>LinkedIn</span>
              </a>
              <a
                href={`mailto:${settings?.email || 'email.rajan001@gmail.com'}`}
                className="mobile-social-link"
                aria-label="Send Email"
              >
                <Mail size={16} />
                <span>Email</span>
              </a>
            </div>
            <div className="mobile-drawer-footer-right">
              <span>&copy; {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
