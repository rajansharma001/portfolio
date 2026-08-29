"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BlogPost } from '@/lib/types';
import { Clock, Search, ArrowRight, BookOpen } from 'lucide-react';

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
    <div className="page-wrapper">
      <Header />

      <main className="container blog-main">
        {/* Page Header */}
        <div className="blog-header">
          <span className="section-num">
            <BookOpen size={16} /> Engineering Journal
          </span>
          <h1 className="blog-title">Blog</h1>
          <p className="blog-subtitle">
            Technical writing, system breakdowns, and architecture insights.
          </p>
        </div>

        {/* Search & Category Tabs */}
        <div className="blog-controls">
          <div className="project-filters blog-filters">
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

          <div className="blog-search">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="blog-loading">
            <div className="loading-skeleton" />
            <div className="loading-skeleton" />
            <div className="loading-skeleton" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="blog-empty">
            <p>No articles found matching your criteria.</p>
          </div>
        ) : (
          <div className="blog-grid">
            {filteredPosts.map((post) => (
              <article key={post.id} className="blog-card">
                <Link href={`/blog/${post.slug}`} className="blog-card-thumb">
                  <div
                    className="blog-card-image"
                    style={{
                      backgroundImage: post.coverImage ? `url('${post.coverImage}')` : undefined,
                    }}
                  >
                    <span className="blog-card-category">{post.category}</span>
                  </div>
                </Link>

                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    <span>{new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    <span className="blog-card-read">
                      <Clock size={12} /> {post.readTimeMinutes} min
                    </span>
                  </div>

                  <h2 className="blog-card-title">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  <p className="blog-card-excerpt">{post.excerpt}</p>

                  <div className="blog-card-tags">
                    {(post.tags || []).slice(0, 3).map((tag) => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                  </div>

                  <div className="blog-card-footer">
                    <Link href={`/blog/${post.slug}`} className="blog-read-link">
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
