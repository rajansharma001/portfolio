"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BlogPost } from '@/lib/types';
import { Clock, Search, ArrowRight, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './blog.module.css';

export default function BlogListingPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const POSTS_PER_PAGE = 6;

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

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.tags || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'ALL' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE) || 1;
  
  const currentPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const recentPosts = useMemo(() => {
    return posts.slice(0, 4);
  }, [posts]);

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div className="page-wrapper">
      <Header />

      <main className="blog-main">
        <div className="container">
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

        {/* Boxed Container Layout */}
        <div className={styles.layoutContainer}>
          
          {/* Main Content Area (70%) */}
          <div className={styles.mainContent}>
            {loading ? (
              <div className={styles.postsGrid}>
                <div className="loading-skeleton" />
                <div className="loading-skeleton" />
                <div className="loading-skeleton" />
                <div className="loading-skeleton" />
              </div>
            ) : currentPosts.length === 0 ? (
              <div className="blog-empty">
                <p>No articles found matching your criteria.</p>
              </div>
            ) : (
              <>
                <div className={styles.postsGrid}>
                  {currentPosts.map((post) => (
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

                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button 
                      className={styles.paginationBtn} 
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>
                    <span className={styles.pageInfo}>
                      Page {currentPage} of {totalPages}
                    </span>
                    <button 
                      className={styles.paginationBtn} 
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sticky Sidebar Area (30%) */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>Recent Posts</h3>
              {loading ? (
                <div className={styles.recentPostList}>
                   <p className={styles.recentPostMeta}>Loading...</p>
                </div>
              ) : (
                <div className={styles.recentPostList}>
                  {recentPosts.map((post) => (
                    <div key={post.id} className={styles.recentPostItem}>
                      <h4 className={styles.recentPostTitle}>
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h4>
                      <span className={styles.recentPostMeta}>
                        {new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>Topics</h3>
              <div className="tag-group">
                {categories.filter(c => c !== 'ALL').map(cat => (
                  <button 
                    key={cat} 
                    className="tag"
                    onClick={() => {
                      setSelectedCategory(cat);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{ 
                      cursor: 'pointer', 
                      background: selectedCategory === cat ? 'var(--text-primary)' : 'var(--bg-secondary)', 
                      color: selectedCategory === cat ? 'var(--bg-primary)' : 'var(--text-secondary)' 
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
