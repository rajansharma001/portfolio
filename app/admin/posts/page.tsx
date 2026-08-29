"use client";

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, BookOpen, Clock } from 'lucide-react';
import { BlogPost } from '@/lib/types';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts?admin=true');
      const data = await res.json();
      setPosts(data || []);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const togglePublished = async (post: BlogPost) => {
    try {
      await fetch(`/api/posts/${post.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published }),
      });
      fetchPosts();
    } catch (err) {
      console.error('Failed to toggle published state:', err);
    }
  };

  const deletePost = async (post: BlogPost) => {
    if (!confirm(`Are you sure you want to delete post "${post.title}"?`)) return;
    try {
      await fetch(`/api/posts/${post.slug}`, { method: 'DELETE' });
      fetchPosts();
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em' }}>Engineering Articles & Blog</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
            Write and publish technical posts to rank higher on Google search and AI engines.
          </p>
        </div>

        <Link href="/admin/posts/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={16} /> Write New Article
        </Link>
      </div>

      <div style={{ marginBottom: '24px', position: 'relative', maxWidth: '400px' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
        <input
          type="text"
          className="form-input"
          placeholder="Search articles by title or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ paddingLeft: '36px' }}
        />
      </div>

      {loading ? (
        <div style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>Loading articles...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No articles found.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="card"
              style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              {/* Header Image */}
              <div
                style={{
                  height: '140px',
                  background: post.coverImage ? `url('${post.coverImage}') center/cover` : 'var(--bg-main)',
                  position: 'relative',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <button
                    onClick={() => togglePublished(post)}
                    className="btn btn-outline btn-sm"
                    style={{
                      background: post.published ? 'rgba(16, 185, 129, 0.9)' : 'rgba(0, 0, 0, 0.7)',
                      color: '#fff',
                      padding: '3px 8px',
                      fontSize: '11px',
                      border: 'none',
                    }}
                    title="Toggle Publish"
                  >
                    {post.published ? <Eye size={12} /> : <EyeOff size={12} />}
                    <span style={{ marginLeft: '4px' }}>{post.published ? 'Published' : 'Draft'}</span>
                  </button>
                </div>

                <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
                  <span
                    style={{
                      background: 'rgba(0, 0, 0, 0.8)',
                      color: 'var(--accent)',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: '700',
                      padding: '3px 8px',
                      border: '1px solid var(--border)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>
                  {post.title}
                </h3>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    marginBottom: '12px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.5',
                  }}
                >
                  {post.excerpt}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-dim)', marginBottom: '16px' }}>
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  <span>{post.views} views • {post.readTimeMinutes} min read</span>
                </div>

                {/* Actions */}
                <div
                  style={{
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-light)',
                  }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="btn btn-outline btn-sm"
                    style={{ padding: '4px 10px', fontSize: '12px' }}
                  >
                    Preview
                  </Link>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link
                      href={`/admin/posts/${post.slug}`}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Edit size={12} /> Edit
                    </Link>
                    <button
                      onClick={() => deletePost(post)}
                      className="btn btn-outline btn-sm"
                      style={{ color: '#ef4444', borderColor: 'transparent', padding: '4px 8px' }}
                      title="Delete Article"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
