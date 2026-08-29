import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { PostModel, IPost } from '@/models/Post';
import { verifyRequestAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const isAdminMode = searchParams.get('admin') === 'true' && verifyRequestAuth(req);

    if (isAdminMode) {
      const posts = await PostModel.find({}).sort({ publishedAt: -1 }).lean();
      return NextResponse.json(posts);
    }

    const published = await PostModel.find({ published: true }).sort({ publishedAt: -1 }).lean();
    return NextResponse.json(published);
  } catch (error) {
    console.error('MongoDB Posts GET error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyRequestAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const newPost = (await req.json()) as Partial<IPost>;

    if (!newPost.title || !newPost.slug) {
      return NextResponse.json({ error: 'Title and Slug are required' }, { status: 400 });
    }

    const existing = await PostModel.findOne({ slug: newPost.slug });
    if (existing) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 400 });
    }

    const wordCount = (newPost.content || '').split(/\s+/).length;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

    const created = await PostModel.create({
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
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create blog post' }, { status: 500 });
  }
}
