"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FolderKanban, Cpu, Briefcase, Settings, LogOut, ArrowLeft } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

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
    { label: 'Overview', href: '/admin', icon: <FolderKanban size={18} /> },
    { label: 'Projects', href: '/admin/projects', icon: <FolderKanban size={18} /> },
    { label: 'Skills', href: '/admin/skills', icon: <Cpu size={18} /> },
    { label: 'Experience', href: '/admin/experience', icon: <Briefcase size={18} /> },
    { label: 'Settings & Resume', href: '/admin/settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            R
          </div>
          <div>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>Rajan Portfolio</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Admin CMS</div>
          </div>
        </div>

        <nav className="admin-nav" style={{ padding: '1.5rem', flex: 1 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
                style={{ padding: '10px 12px', marginBottom: '4px' }}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '1.5rem' }}>
          <button
            onClick={handleLogout}
            className="btn btn-outline"
            style={{ width: '100%', justifyContent: 'center', color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className="admin-main-wrapper">
        <header className="admin-header">
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Press / to search..."
              style={{
                background: 'var(--bg-main)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '8px 16px',
                color: 'var(--text-primary)',
                width: '300px',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/admin/projects/new" className="btn btn-outline" style={{ padding: '8px 16px' }}>
              + Quick Add
            </Link>
            <Link href="/" title="Back to Public Site" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-hover)', color: 'var(--text-primary)' }}>
              <ArrowLeft size={16} />
            </Link>
          </div>
        </header>

        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
