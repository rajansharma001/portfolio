import { NextRequest, NextResponse } from 'next/server';
import { readJsonData, writeJsonData } from '@/lib/json-db';
import { Project } from '@/lib/types';
import { verifyRequestAuth } from '@/lib/auth';

const FILE_NAME = 'projects.json';

type Context = {
  params: Promise<{ slug: string }>;
};

export async function GET(req: NextRequest, { params }: Context) {
  try {
    const { slug } = await params;
    const projects = await readJsonData<Project[]>(FILE_NAME);
    const project = projects.find((p) => p.slug === slug || p.id === slug);

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
    const { slug } = await params;
    const updates = (await req.json()) as Partial<Project>;
    const projects = await readJsonData<Project[]>(FILE_NAME);
    const index = projects.findIndex((p) => p.slug === slug || p.id === slug);

    if (index === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    projects[index] = {
      ...projects[index],
      ...updates,
    };

    await writeJsonData(FILE_NAME, projects);
    return NextResponse.json(projects[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Context) {
  if (!verifyRequestAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const projects = await readJsonData<Project[]>(FILE_NAME);
    const filtered = projects.filter((p) => p.slug !== slug && p.id !== slug);

    if (filtered.length === projects.length) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await writeJsonData(FILE_NAME, filtered);
    return NextResponse.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
