import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ProjectModel } from '@/models/Project';
import { SkillModel } from '@/models/Skill';
import { ExperienceModel } from '@/models/Experience';
import { SettingModel } from '@/models/Setting';
import { ensureDatabaseSeeded } from '@/lib/auto-seed';
import { getCache, setCache } from '@/lib/cache';
import { FALLBACK_BUNDLE } from '@/lib/fallback-data';

const CACHE_KEY = 'portfolio_full_bundle';

export async function GET() {
  const startTime = Date.now();

  // 1. Check Redis & Memory Cache (<1ms)
  const cachedData = await getCache<any>(CACHE_KEY);
  if (cachedData && cachedData.projects && cachedData.projects.length > 0) {
    return NextResponse.json(cachedData, {
      headers: {
        'X-Cache': 'HIT',
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  }

  try {
    await connectToDatabase();
    await ensureDatabaseSeeded();

    const [settings, projects, skillsRecords, experience] = await Promise.all([
      SettingModel.findOne({ key: 'global_settings' }).lean(),
      ProjectModel.find({ published: true }).sort({ order: 1 }).lean(),
      SkillModel.find({}).lean(),
      ExperienceModel.find({}).sort({ period: -1 }).lean(),
    ]);

    const skillsMap: Record<string, string[]> = {};
    (skillsRecords || []).forEach((r: any) => {
      skillsMap[r.category] = r.skills || [];
    });

    const hasLiveProjects = Array.isArray(projects) && projects.length > 0;

    const bundle = {
      settings: settings || FALLBACK_BUNDLE.settings,
      projects: hasLiveProjects ? projects : FALLBACK_BUNDLE.projects,
      skills: Object.keys(skillsMap).length > 0 ? skillsMap : FALLBACK_BUNDLE.skills,
      experience: Array.isArray(experience) && experience.length > 0 ? experience : FALLBACK_BUNDLE.experience,
    };

    // Store in cache for 5 minutes (300s)
    await setCache(CACHE_KEY, bundle, 300);

    return NextResponse.json(bundle, {
      headers: {
        'X-Cache': 'MISS',
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error: any) {
    console.warn('Portfolio database connection notice (serving fallback bundle):', error?.message || error);

    // Cache fallback bundle temporarily to avoid repeated database timeout overhead
    await setCache(CACHE_KEY, FALLBACK_BUNDLE, 60);

    return NextResponse.json(FALLBACK_BUNDLE, {
      status: 200,
      headers: {
        'X-Cache': 'FALLBACK',
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  }
}
