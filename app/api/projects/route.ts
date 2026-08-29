import { NextRequest, NextResponse } from 'next/server';
import { readJsonData, writeJsonData } from '@/lib/json-db';
import { Project } from '@/lib/types';
import { verifyRequestAuth } from '@/lib/auth';

const FILE_NAME = 'projects.json';

export async function GET(req: NextRequest) {
  try {
    const projects = await readJsonData<Project[]>(FILE_NAME);
    const { searchParams } = new URL(req.url);
    const isAdminMode = searchParams.get('admin') === 'true' && verifyRequestAuth(req);

    if (isAdminMode) {
      // Sort by order ascending
      projects.sort((a, b) => (a.order || 0) - (b.order || 0));
      return NextResponse.json(projects);
    }

    // Filter published projects for public visitors
    const published = projects
      .filter((p) => p.published)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    return NextResponse.json(published);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyRequestAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const newProject = await req.json() as Partial<Project>;
    
    if (!newProject.title || !newProject.slug) {
      return NextResponse.json({ error: 'Title and Slug are required' }, { status: 400 });
    }

    const projects = await readJsonData<Project[]>(FILE_NAME);
    
    // Check slug collision
    if (projects.some((p) => p.slug === newProject.slug)) {
      return NextResponse.json({ error: 'Project with this slug already exists' }, { status: 400 });
    }

    const fullProject: Project = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      slug: newProject.slug,
      title: newProject.title,
      type: newProject.type || 'SaaS',
      tagline: newProject.tagline || '',
      impact: newProject.impact || '',
      description: newProject.description || '',
      thumbnail: newProject.thumbnail || '',
      techStack: Array.isArray(newProject.techStack) ? newProject.techStack : [],
      liveUrl: newProject.liveUrl || '',
      githubUrl: newProject.githubUrl || '',
      backendGithubUrl: newProject.backendGithubUrl || '',
      featured: Boolean(newProject.featured),
      published: newProject.published !== undefined ? Boolean(newProject.published) : true,
      order: projects.length + 1,
    };

    projects.push(fullProject);
    await writeJsonData(FILE_NAME, projects);

    return NextResponse.json(fullProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!verifyRequestAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Reorder projects or bulk update
    const updatedProjects = await req.json() as Project[];
    if (!Array.isArray(updatedProjects)) {
      return NextResponse.json({ error: 'Expected array of projects' }, { status: 400 });
    }

    await writeJsonData(FILE_NAME, updatedProjects);
    return NextResponse.json({ success: true, count: updatedProjects.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update projects list' }, { status: 500 });
  }
}
