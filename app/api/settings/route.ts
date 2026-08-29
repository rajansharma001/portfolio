import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { SettingModel, ISetting } from '@/models/Setting';
import { verifyRequestAuth } from '@/lib/auth';

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await SettingModel.findOne({ key: 'global_settings' }).lean();

    if (!settings) {
      settings = await SettingModel.create({
        key: 'global_settings',
        name: 'Rajan Sharma',
        role: 'Full-Stack Software Engineer',
        headline: 'Building production-grade web systems, REST APIs & scalable backends.',
        location: 'Kathmandu, Bagmati Prov, Nepal',
        email: 'email.rajan001@gmail.com',
        phone: '+977 9800000000',
        isAvailableForHire: true,
        availabilityBadgeText: 'Available for Roles',
        resumeUrl: '/uploads/resume.pdf',
        bio: 'Full-Stack Software Engineer with proven experience delivering complex web platforms, Learning Management Systems, POS architectures, and OpenStreetMap data ingestion pipelines using Next.js, TypeScript, Node.js, Express, PostgreSQL, and MongoDB.',
        codeSnippet: `// rajan.config.ts\nexport const engineer = {\n  name: "Rajan Sharma",\n  role: "Full-Stack Software Engineer",\n  location: "Kathmandu, Nepal",\n  stack: ["Next.js", "TypeScript", "Node.js", "Express", "PostgreSQL", "MongoDB"],\n  status: "Available for Engineering Roles"\n};`,
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('MongoDB Settings GET error:', error);
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyRequestAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const updates = (await req.json()) as Partial<ISetting>;

    const updated = await SettingModel.findOneAndUpdate(
      { key: 'global_settings' },
      { $set: updates },
      { new: true, upsert: true }
    ).lean();

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update settings' }, { status: 500 });
  }
}
