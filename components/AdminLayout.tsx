"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FolderKanban,
  Cpu,
  Briefcase,
  Settings,
  LogOut,
  ArrowLeft,
  Mail,
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  BarChart3,
  CalendarCheck,
  Menu,
  X,
  Plus,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    async function fetchUnread() {
      try {
        const res = await fetch('/api/messages');
        if (res.ok) {
          const messages = await res.json();
          const unread = (messages || []).filter((m: any) => !m.read).length;
          setUnreadCount(unread);
        }
      } catch {}
    }
    fetchUnread();
  }, [pathname]);

  // Close drawer on path change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { label: 'Overview', href: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'Planner & Daily Hub', href: '/admin/planner', icon: <CalendarCheck size={18} /> },
    { label: 'Visitor Analytics', href: '/admin/analytics', icon: <BarChart3 size={18} /> },
    { label: 'Lead Pipeline & CRM', href: '/admin/messages', icon: <Mail size={18} />, badge: unreadCount },
    { label: 'Content & FAQs', href: '/admin/content', icon: <HelpCircle size={18} /> },
    { label: 'Blog Articles', href: '/admin/posts', icon: <BookOpen size={18} /> },
    { label: 'Projects', href: '/admin/projects', icon: <FolderKanban size={18} /> },
    { label: 'Skills', href: '/admin/skills', icon: <Cpu size={18} /> },
    { label: 'Experience', href: '/admin/experience', icon: <Briefcase size={18} /> },
    { label: 'Settings & Resume', href: '/admin/settings', icon: <Settings size={18} /> },
  ];

  const getPageTitle = (path: string) => {
    if (path === '/admin') return 'Dashboard';
    if (path.startsWith('/admin/planner')) return 'Daily Planner';
    if (path.startsWith('/admin/analytics')) return 'Analytics';
    if (path.startsWith('/admin/messages')) return 'Leads CRM';
    if (path.startsWith('/admin/content')) return 'Content & FAQs';
    if (path.startsWith('/admin/posts')) return 'Articles';
    if (path.startsWith('/admin/projects')) return 'Projects';
    if (path.startsWith('/admin/skills')) return 'Skills';
    if (path.startsWith('/admin/experience')) return 'Experience';
    if (path.startsWith('/admin/settings')) return 'Settings';
    return 'Admin';
  };

  return (
    <div className="admin-layout">
      {/* Desktop Sidebar */}
      <aside className="admin-sidebar desktop-only">
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#ffffff', fontSize: '15px' }}>
            R
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '14px', color: '#ffffff', letterSpacing: '-0.01em' }}>Rajan Portfolio</div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>PRODUCTION CMS</div>
          </div>
        </div>

        <nav className="admin-nav" style={{ padding: '1rem', flex: 1, overflowY: 'auto' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
                style={{ padding: '9px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '6px', marginBottom: '2px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {Boolean(item.badge && item.badge > 0) && (
                  <span style={{ background: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: '800', padding: '2px 7px', borderRadius: '10px', fontFamily: 'var(--font-mono)' }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={handleLogout}
            className="btn btn-outline"
            style={{ width: '100%', justifyContent: 'center', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', background: 'transparent', padding: '8px 12px', fontSize: '13px' }}
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div
          onClick={() => setMobileDrawerOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 4000,
            display: 'flex',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '280px',
              maxWidth: '82vw',
              height: '100%',
              background: 'var(--bg-sidebar)',
              borderRight: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '10px 0 30px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#ffffff' }}>
                  R
                </div>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '14px', color: '#ffffff' }}>Rajan Portfolio</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Admin CMS</div>
                </div>
              </div>

              <button
                onClick={() => setMobileDrawerOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <nav style={{ padding: '1rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`admin-nav-item ${isActive ? 'active' : ''}`}
                    style={{ padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '6px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {Boolean(item.badge && item.badge > 0) && (
                      <span style={{ background: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: '800', padding: '2px 7px', borderRadius: '10px' }}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
              <button
                onClick={handleLogout}
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', background: 'transparent' }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Wrapper */}
      <div className="admin-main-wrapper">
        {/* Header Bar */}
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="mobile-only-btn"
              style={{
                background: 'none',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '6px',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>

            <span className="mobile-only" style={{ fontWeight: '800', fontSize: '15px', color: '#ffffff', letterSpacing: '-0.01em' }}>
              {getPageTitle(pathname)}
            </span>

            <div style={{ fontSize: '13px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }} className="header-status-text desktop-only">
              PRODUCTION CMS • HARDENED
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              href="/blog"
              target="_blank"
              className="btn btn-outline btn-sm desktop-only-btn"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
            >
              <BookOpen size={13} /> Blog
            </Link>
            <Link
              href="/admin/posts/new"
              className="btn btn-outline btn-sm desktop-only-btn"
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
            >
              + Post
            </Link>
            <Link
              href="/admin/projects/new"
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', padding: '6px 10px' }}
            >
              <Plus size={14} /> Project
            </Link>
            <Link
              href="/"
              title="Back to Public Site"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--bg-hover)',
                color: '#ffffff',
                border: '1px solid var(--border)',
                flexShrink: 0,
              }}
            >
              <ArrowLeft size={16} />
            </Link>
          </div>
        </header>

        <main className="admin-main">{children}</main>

        {/* Mobile Sticky Bottom Navigation Bar */}
        <nav className="admin-bottom-nav mobile-only">
          <Link href="/admin" className={`bottom-nav-item ${pathname === '/admin' ? 'active' : ''}`}>
            <LayoutDashboard size={18} />
            <span>Dash</span>
          </Link>
          <Link href="/admin/planner" className={`bottom-nav-item ${pathname.startsWith('/admin/planner') ? 'active' : ''}`}>
            <CalendarCheck size={18} />
            <span>Planner</span>
          </Link>
          <Link href="/admin/messages" className={`bottom-nav-item ${pathname.startsWith('/admin/messages') ? 'active' : ''}`}>
            <div style={{ position: 'relative' }}>
              <Mail size={18} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-6px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#ef4444',
                  }}
                />
              )}
            </div>
            <span>Leads</span>
          </Link>
          <Link href="/admin/analytics" className={`bottom-nav-item ${pathname.startsWith('/admin/analytics') ? 'active' : ''}`}>
            <BarChart3 size={18} />
            <span>Stats</span>
          </Link>
          <button type="button" onClick={() => setMobileDrawerOpen(true)} className="bottom-nav-item">
            <Menu size={18} />
            <span>More</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
