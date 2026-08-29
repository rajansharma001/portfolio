import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { PostModel, IPost } from '@/models/Post';
import { verifyRequestAuth } from '@/lib/auth';

type Context = {
  params: Promise<{ slug: string }>;
};

export async function GET(req: NextRequest, { params }: Context) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    const post = await PostModel.findOneAndUpdate(
      { $or: [{ slug }, { id: slug }] },
      { $inc: { views: 1 } },
      { new: true }
    ).lean();

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Context) {
  if (!verifyRequestAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { slug } = await params;
    const updates = (await req.json()) as Partial<IPost>;

    if (updates.content) {
      const wordCount = updates.content.split(/\s+/).length;
      updates.readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    }

    const updated = await PostModel.findOneAndUpdate(
      { $or: [{ slug }, { id: slug }] },
      { $set: updates },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Context) {
  if (!verifyRequestAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { slug } = await params;

    const deleted = await PostModel.findOneAndDelete({
      $or: [{ slug }, { id: slug }],
    });

    if (!deleted) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Post deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete post' }, { status: 500 });
  }
}
