import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { BlogPost } from '@/lib/types';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rajansharma.dev';
  
  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  try {
    const postsPath = path.join(process.cwd(), 'data', 'posts.json');
    if (fs.existsSync(postsPath)) {
      const raw = fs.readFileSync(postsPath, 'utf-8');
      const posts: BlogPost[] = JSON.parse(raw);
      
      posts.filter(p => p.published).forEach(post => {
        entries.push({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: new Date(post.publishedAt || Date.now()),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    }
  } catch (e) {
    console.error('Error generating sitemap posts:', e);
  }

  return entries;
}
