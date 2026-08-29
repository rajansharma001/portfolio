import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ProjectModel, IProject } from '@/models/Project';
import { verifyRequestAuth } from '@/lib/auth';

type Context = {
  params: Promise<{ slug: string }>;
};

export async function GET(req: NextRequest, { params }: Context) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    const project = await ProjectModel.findOne({
      $or: [{ slug }, { id: slug }],
    }).lean();

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Context) {
  if (!verifyRequestAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { slug } = await params;
    const updates = (await req.json()) as Partial<IProject>;

    const updated = await ProjectModel.findOneAndUpdate(
      { $or: [{ slug }, { id: slug }] },
      { $set: updates },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Context) {
  if (!verifyRequestAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { slug } = await params;

    const deleted = await ProjectModel.findOneAndDelete({
      $or: [{ slug }, { id: slug }],
    });

    if (!deleted) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete project' }, { status: 500 });
  }
}
