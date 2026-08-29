import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ProjectModel, IProject } from '@/models/Project';
import { verifyRequestAuth } from '@/lib/auth';
import { ensureDatabaseSeeded } from '@/lib/auto-seed';
import { getCache, setCache, invalidateCache } from '@/lib/cache';

const CACHE_KEY = 'public_projects_list';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const isAdminMode = searchParams.get('admin') === 'true' && verifyRequestAuth(req);

  if (!isAdminMode) {
    const cached = await getCache<any[]>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      });
    }
  }

  try {
    await connectToDatabase();
    await ensureDatabaseSeeded();

    if (isAdminMode) {
      const projects = await ProjectModel.find({}).sort({ order: 1 }).lean();
      return NextResponse.json(projects);
    }

    const projects = await ProjectModel.find({ published: true }).sort({ order: 1 }).lean();
    await setCache(CACHE_KEY, projects, 300);
    await invalidateCache('portfolio_full_bundle');

    return NextResponse.json(projects, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('MongoDB Projects GET error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyRequestAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const body = (await req.json()) as Partial<IProject>;

    if (!body.title || !body.slug) {
      return NextResponse.json({ error: 'Title and Slug are required' }, { status: 400 });
    }

    const existing = await ProjectModel.findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json({ error: 'A project with this slug already exists' }, { status: 400 });
    }

    const count = await ProjectModel.countDocuments();

    const newProject = await ProjectModel.create({
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      slug: body.slug,
      title: body.title,
      type: body.type || 'SaaS',
      tagline: body.tagline || '',
      impact: body.impact || '',
      description: body.description || '',
      thumbnail: body.thumbnail || '',
      techStack: Array.isArray(body.techStack) ? body.techStack : [],
      liveUrl: body.liveUrl || '',
      githubUrl: body.githubUrl || '',
      backendGithubUrl: body.backendGithubUrl || '',
      featured: Boolean(body.featured),
      published: Boolean(body.published),
      order: count + 1,
    });

    // Invalidate caches
    await invalidateCache(CACHE_KEY);
    await invalidateCache('portfolio_full_bundle');

    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    console.error('MongoDB Project create error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!verifyRequestAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const updatedProjects = (await req.json()) as IProject[];

    if (!Array.isArray(updatedProjects)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    // Bulk write order updates
    const bulkOps = updatedProjects.map((p, index) => ({
      updateOne: {
        filter: { id: p.id },
        update: { $set: { order: index + 1 } },
      },
    }));

    if (bulkOps.length > 0) {
      await ProjectModel.bulkWrite(bulkOps);
    }

    // Invalidate caches
    await invalidateCache(CACHE_KEY);
    await invalidateCache('portfolio_full_bundle');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to reorder projects' }, { status: 500 });
  }
}
