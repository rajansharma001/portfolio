import { MetadataRoute } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import { PostModel } from '@/models/Post';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    await connectToDatabase();
    const posts = await PostModel.find({ published: true }).lean();

    posts.forEach((post: any) => {
      entries.push({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.publishedAt || Date.now()),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  } catch (e) {
    console.error('Error generating dynamic sitemap from MongoDB:', e);
  }

  return entries;
}
