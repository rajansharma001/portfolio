"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  FolderKanban,
  BookOpen,
  Cpu,
  Mail,
  Download,
  Github,
  Linkedin,
  Sun,
  Moon,
  ArrowRight,
  Sparkles,
  Command,
  X,
} from 'lucide-react';
import { Project, SkillsMap } from '@/lib/types';

interface CommandPaletteProps {
  projects?: Project[];
  skills?: SkillsMap;
  onOpenProject?: (project: Project) => void;
  onShowToast?: (msg: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface PaletteItem {
  id: string;
  category: 'Projects' | 'Blog' | 'Skills' | 'Actions';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
}

export default function CommandPalette({
  projects = [],
  skills = {},
  onOpenProject,
  onShowToast,
  isOpen,
  onClose,
}: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const copyEmail = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText('email.rajan001@gmail.com');
      onShowToast?.('Copied email.rajan001@gmail.com to clipboard!');
    }
    onClose();
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
    onClose();
  };

  const scrollTo = (id: string) => {
    onClose();
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(`/#${id}`);
    }
  };

  // Build items list
  const allItems: PaletteItem[] = [
    // Actions
    {
      id: 'action-resume',
      category: 'Actions',
      title: 'Download Resume / CV (PDF)',
      subtitle: 'Open active CV document',
      icon: <Download size={16} color="var(--accent)" />,
      action: () => {
        window.open('/uploads/resume.pdf', '_blank');
        onClose();
      },
    },
    {
      id: 'action-email',
      category: 'Actions',
      title: 'Copy Email Address',
      subtitle: 'email.rajan001@gmail.com',
      icon: <Mail size={16} color="#10b981" />,
      action: copyEmail,
    },
    {
      id: 'action-theme',
      category: 'Actions',
      title: 'Toggle Dark / Light Theme',
      subtitle: 'Switch theme palette',
      icon: <Sun size={16} color="#f59e0b" />,
      action: toggleTheme,
    },
    {
      id: 'action-github',
      category: 'Actions',
      title: 'Open GitHub Profile',
      subtitle: 'github.com/rajansharma001',
      icon: <Github size={16} />,
      action: () => {
        window.open('https://github.com/rajansharma001', '_blank');
        onClose();
      },
    },
    {
      id: 'action-linkedin',
      category: 'Actions',
      title: 'Open LinkedIn Profile',
      subtitle: 'linkedin.com/in/rajansharma001',
      icon: <Linkedin size={16} color="#3b82f6" />,
      action: () => {
        window.open('https://linkedin.com/in/rajansharma001', '_blank');
        onClose();
      },
    },
    {
      id: 'action-contact',
      category: 'Actions',
      title: 'Send Direct Message',
      subtitle: 'Scroll to contact form & FAQs',
      icon: <Sparkles size={16} color="var(--accent)" />,
      action: () => scrollTo('contact'),
    },

    // Projects
    ...projects.map((p) => ({
      id: `proj-${p.id || p.slug}`,
      category: 'Projects' as const,
      title: p.title,
      subtitle: p.tagline || (p.techStack || []).slice(0, 4).join(', '),
      icon: <FolderKanban size={16} color="var(--accent)" />,
      action: () => {
        onClose();
        if (onOpenProject) {
          onOpenProject(p);
        } else if (p.liveUrl) {
          window.open(p.liveUrl, '_blank');
        } else {
          scrollTo('work');
        }
      },
    })),

    // Skills
    ...Object.entries(skills).map(([cat, list]) => ({
      id: `skill-${cat}`,
      category: 'Skills' as const,
      title: `${cat} Stack`,
      subtitle: (list || []).join(', '),
      icon: <Cpu size={16} color="#8b5cf6" />,
      action: () => scrollTo('skills'),
    })),

    // Blog
    {
      id: 'blog-main',
      category: 'Blog',
      title: 'Engineering Journal / Articles',
      subtitle: 'Read technical insights and architecture breakdowns',
      icon: <BookOpen size={16} color="#06b6d4" />,
      action: () => {
        onClose();
        router.push('/blog');
      },
    },
  ];

  // Filter Items
  const filteredItems = query.trim()
    ? allItems.filter((item) => {
        const text = `${item.title} ${item.subtitle || ''} ${item.category}`.toLowerCase();
        return text.includes(query.toLowerCase());
      })
    : allItems;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={onClose} style={{ display: 'flex', zIndex: 1200, alignItems: 'flex-start', paddingTop: '10vh' }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '620px',
          padding: 0,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-primary)',
          }}
        >
          <Search size={18} color="var(--accent)" />
          <input
            ref={inputRef}
            type="text"
            className="form-input"
            style={{
              border: 'none',
              padding: 0,
              fontSize: '15px',
              background: 'transparent',
              outline: 'none',
              flex: 1,
            }}
            placeholder="Type a command or search projects, skills, articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              padding: '2px 6px',
              background: 'var(--bg-main)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              color: 'var(--text-muted)',
            }}
          >
            ESC
          </span>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '8px' }}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--bg-hover)' : 'transparent',
                    borderLeft: isSelected ? '3px solid var(--accent)' : '3px solid transparent',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                    <div style={{ flexShrink: 0 }}>{item.icon}</div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: '12px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'var(--bg-main)',
                        color: 'var(--text-dim)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.category}
                    </span>
                    {isSelected && <ArrowRight size={14} color="var(--accent)" />}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ padding: '2.5rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No matching commands or projects found.
            </div>
          )}
        </div>

        {/* Footer Shortcut Guide */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 18px',
            background: 'var(--bg-main)',
            borderTop: '1px solid var(--border)',
            fontSize: '11px',
            color: 'var(--text-dim)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <div style={{ display: 'flex', gap: '12px' }}>
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <div>⌘K Global Search</div>
        </div>
      </div>
    </div>
  );
}
