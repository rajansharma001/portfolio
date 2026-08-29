"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BlogPost } from '@/lib/types';
import { Clock, Search, ArrowRight, Tag, BookOpen } from 'lucide-react';

export default function BlogListingPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        setPosts(data || []);
      } catch (err) {
        console.error('Failed to load blog posts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  const categories = ['ALL', ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="container" style={{ paddingTop: 'calc(var(--nav-height) + 3rem)', paddingBottom: '6rem', flex: 1 }}>
        {/* Page Header */}
        <div style={{ marginBottom: '3rem', borderBottom: '2px solid var(--text-primary)', paddingBottom: '1.5rem' }}>
          <span className="section-num" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <BookOpen size={16} /> TECHNICAL WRITING & ARCHITECTURE NOTES
          </span>
          <h1 className="text-h2" style={{ textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            Engineering Journal
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', marginTop: '8px', maxWidth: '700px' }}>
            Articles, system breakdowns, database optimizations, and backend architecture insights by Rajan Sharma.
          </p>
        </div>

        {/* Search & Category Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <div className="project-filters" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '34px', fontSize: '0.85rem', padding: '0.6rem 0.8rem 0.6rem 34px' }}
            />
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
            LOADING ARTICLES...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No articles found matching your criteria.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2.5rem' }}>
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                style={{
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'border-color 0.2s',
                }}
              >
                {/* Visual Thumbnail */}
                <Link href={`/blog/${post.slug}`}>
                  <div
                    style={{
                      height: '180px',
                      background: post.coverImage ? `url('${post.coverImage}') center/cover` : 'var(--bg-primary)',
                      borderBottom: '1px solid var(--border-color)',
                      position: 'relative',
                    }}
                  >
                    <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                      <span className="tag" style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
                        {post.category}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Article Info */}
                <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '12px' }}>
                    <span>{new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {post.readTimeMinutes} min read
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.35rem', fontWeight: '800', lineHeight: '1.3', marginBottom: '12px' }}>
                    <Link href={`/blog/${post.slug}`} style={{ color: 'var(--text-primary)' }}>
                      {post.title}
                    </Link>
                  </h2>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem', flex: 1 }}>
                    {post.excerpt}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.5rem' }}>
                    {(post.tags || []).slice(0, 3).map((tag) => (
                      <span key={tag} className="tag" style={{ fontSize: '0.65rem' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: 'auto' }}>
                    <Link
                      href={`/blog/${post.slug}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--accent)',
                        textTransform: 'uppercase',
                      }}
                    >
                      Read Article <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
