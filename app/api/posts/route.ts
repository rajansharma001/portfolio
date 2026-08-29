import { NextRequest, NextResponse } from 'next/server';
import { readJsonData, writeJsonData } from '@/lib/json-db';
import { BlogPost } from '@/lib/types';
import { verifyRequestAuth } from '@/lib/auth';

const FILE_NAME = 'posts.json';

export async function GET(req: NextRequest) {
  try {
    const posts = await readJsonData<BlogPost[]>(FILE_NAME);
    const { searchParams } = new URL(req.url);
    const isAdminMode = searchParams.get('admin') === 'true' && verifyRequestAuth(req);

    if (isAdminMode) {
      posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      return NextResponse.json(posts);
    }

    const published = (posts || [])
      .filter((p) => p.published)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return NextResponse.json(published);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyRequestAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const newPost = (await req.json()) as Partial<BlogPost>;

    if (!newPost.title || !newPost.slug) {
      return NextResponse.json({ error: 'Title and Slug are required' }, { status: 400 });
    }

    const posts = await readJsonData<BlogPost[]>(FILE_NAME);

    // Check slug uniqueness
    if (posts.some((p) => p.slug === newPost.slug)) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 400 });
    }

    const wordCount = (newPost.content || '').split(/\s+/).length;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

    const fullPost: BlogPost = {
      id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      slug: newPost.slug,
      title: newPost.title,
      excerpt: newPost.excerpt || '',
      content: newPost.content || '',
      category: newPost.category || 'Engineering',
      tags: Array.isArray(newPost.tags) ? newPost.tags : [],
      coverImage: newPost.coverImage || '',
      published: Boolean(newPost.published),
      publishedAt: newPost.publishedAt || new Date().toISOString(),
      readTimeMinutes,
      views: 0,
    };

    posts.unshift(fullPost);
    await writeJsonData(FILE_NAME, posts);

    return NextResponse.json(fullPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
