import { NextRequest, NextResponse } from 'next/server';
import { readJsonData, writeJsonData } from '@/lib/json-db';
import { BlogPost } from '@/lib/types';
import { verifyRequestAuth } from '@/lib/auth';

const FILE_NAME = 'posts.json';

type Context = {
  params: Promise<{ slug: string }>;
};

export async function GET(req: NextRequest, { params }: Context) {
  try {
    const { slug } = await params;
    const posts = await readJsonData<BlogPost[]>(FILE_NAME);
    const postIndex = posts.findIndex((p) => p.slug === slug || p.id === slug);

    if (postIndex === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Increment view count asynchronously
    posts[postIndex].views = (posts[postIndex].views || 0) + 1;
    writeJsonData(FILE_NAME, posts).catch(() => {});

    return NextResponse.json(posts[postIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Context) {
  if (!verifyRequestAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const updates = (await req.json()) as Partial<BlogPost>;
    const posts = await readJsonData<BlogPost[]>(FILE_NAME);
    const index = posts.findIndex((p) => p.slug === slug || p.id === slug);

    if (index === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (updates.content) {
      const wordCount = updates.content.split(/\s+/).length;
      updates.readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    }

    posts[index] = {
      ...posts[index],
      ...updates,
    };

    await writeJsonData(FILE_NAME, posts);
    return NextResponse.json(posts[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Context) {
  if (!verifyRequestAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const posts = await readJsonData<BlogPost[]>(FILE_NAME);
    const filtered = posts.filter((p) => p.slug !== slug && p.id !== slug);

    if (filtered.length === posts.length) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await writeJsonData(FILE_NAME, filtered);
    return NextResponse.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
