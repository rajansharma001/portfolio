"use client";

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BlogPost } from '@/lib/types';
import { ArrowLeft, Clock, Calendar, Eye, Share2, Tag, Check, User } from 'lucide-react';

type Context = {
  params: Promise<{ slug: string }>;
};

export default function BlogPostDetailPage({ params }: Context) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
        }
      } catch (err) {
        console.error('Failed to load post:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main className="container" style={{ paddingTop: 'calc(var(--nav-height) + 5rem)', textAlign: 'center', flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>LOADING ARTICLE...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main className="container" style={{ paddingTop: 'calc(var(--nav-height) + 5rem)', textAlign: 'center', flex: 1 }}>
          <h1 className="text-h2">Article Not Found</h1>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>The requested article does not exist or has been unpublished.</p>
          <Link href="/blog" className="btn btn-primary" style={{ marginTop: '2rem' }}>
            Back to Journal
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Generate structured schema for search engines and AI bots
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      '@type': 'Person',
      name: 'Rajan Sharma',
      url: 'https://rajansharma.dev',
    },
    publisher: {
      '@type': 'Person',
      name: 'Rajan Sharma',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://rajansharma.dev/blog/${post.slug}`,
    },
    keywords: post.tags ? post.tags.join(', ') : 'Software Engineering, Full Stack, Next.js',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Header />

      <main className="container" style={{ paddingTop: 'calc(var(--nav-height) + 3rem)', paddingBottom: '6rem', maxWidth: '880px', flex: 1 }}>
        {/* Back Link */}
        <div style={{ marginBottom: '2.5rem' }}>
          <Link
            href="/blog"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              fontWeight: '700',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
            }}
          >
            <ArrowLeft size={14} /> Back to Journal
          </Link>
        </div>

        {/* Article Header */}
        <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span className="tag" style={{ background: 'var(--accent)', color: '#fff', border: 'none' }}>
              {post.category}
            </span>
          </div>

          <h1 className="text-h2" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: '1.15', marginBottom: '1.5rem' }}>
            {post.title}
          </h1>

          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem' }}>
            {post.excerpt}
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} /> {new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} /> {post.readTimeMinutes} min read
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={14} /> {post.views} views
              </span>
            </div>

            <button
              onClick={handleShare}
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}
            >
              {copied ? <Check size={12} color="var(--status-success)" /> : <Share2 size={12} />}
              {copied ? 'Link Copied' : 'Share Article'}
            </button>
          </div>
        </header>

        {/* Cover Image if present */}
        {post.coverImage && (
          <div style={{ marginBottom: '3.5rem', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: 'auto', maxHeight: '420px', objectFit: 'cover', display: 'block' }} />
          </div>
        )}

        {/* Article Body */}
        <article
          style={{
            fontSize: '1.125rem',
            lineHeight: '1.8',
            color: 'var(--text-primary)',
          }}
        >
          {post.content.split('\n\n').map((block, idx) => {
            if (block.startsWith('### ')) {
              return (
                <h3 key={idx} style={{ fontSize: '1.5rem', fontWeight: '800', margin: '2.5rem 0 1rem 0', color: 'var(--text-primary)' }}>
                  {block.replace('### ', '')}
                </h3>
              );
            }
            if (block.startsWith('## ')) {
              return (
                <h2 key={idx} style={{ fontSize: '1.8rem', fontWeight: '800', margin: '3rem 0 1rem 0', color: 'var(--text-primary)' }}>
                  {block.replace('## ', '')}
                </h2>
              );
            }
            if (block.startsWith('```')) {
              const lines = block.split('\n');
              const lang = lines[0].replace('```', '') || 'code';
              const code = lines.slice(1, -1).join('\n');
              return (
                <div
                  key={idx}
                  style={{
                    background: 'var(--dark-bg)',
                    border: '1px solid var(--dark-border)',
                    borderRadius: '4px',
                    margin: '2rem 0',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      background: 'var(--dark-surface)',
                      padding: '8px 16px',
                      fontSize: '12px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--dark-text-muted)',
                      textTransform: 'uppercase',
                      borderBottom: '1px solid var(--dark-border)',
                    }}
                  >
                    {lang}
                  </div>
                  <pre style={{ padding: '1.5rem', margin: 0, overflowX: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#a9dc76' }}>
                    <code>{code}</code>
                  </pre>
                </div>
              );
            }
            return (
              <p key={idx} style={{ marginBottom: '1.75rem', color: 'var(--text-secondary)' }}>
                {block}
              </p>
            );
          })}
        </article>

        {/* Tags */}
        <div style={{ marginTop: '3.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {(post.tags || []).map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>

        {/* Author Bio Card */}
        <div
          style={{
            marginTop: '3.5rem',
            padding: '2rem',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              background: 'var(--accent)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '1.5rem',
              color: '#ffffff',
              flexShrink: 0,
            }}
          >
            RS
          </div>
          <div>
            <div style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '4px' }}>Rajan Sharma</div>
            <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)', marginBottom: '8px' }}>
              Full-Stack Software Engineer • Kathmandu, Nepal
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Architecting secure full-stack applications with Next.js, TypeScript, and Node.js backend microservices.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
