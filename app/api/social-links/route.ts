import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { SocialLinkModel, ISocialLink } from '@/models/SocialLink';
import { verifyRequestAuth } from '@/lib/auth';

export async function GET() {
  try {
    await connectToDatabase();
    let links = await SocialLinkModel.find({}).lean();

    if (links.length === 0) {
      const defaultLinks = [
        { id: 'social_github', name: 'GitHub', url: 'https://github.com/rajansharma001', icon: 'github' },
        { id: 'social_linkedin', name: 'LinkedIn', url: 'https://linkedin.com/in/rajansharma001', icon: 'linkedin' },
        { id: 'social_email', name: 'Email', url: 'mailto:email.rajan001@gmail.com', icon: 'mail' },
      ];
      await SocialLinkModel.insertMany(defaultLinks);
      links = defaultLinks;
    }

    return NextResponse.json(links);
  } catch (error) {
    console.error('MongoDB SocialLinks GET error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyRequestAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const links = (await req.json()) as ISocialLink[];

    if (!Array.isArray(links)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    await SocialLinkModel.deleteMany({});
    if (links.length > 0) {
      await SocialLinkModel.insertMany(links);
    }

    return NextResponse.json(links);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update social links' }, { status: 500 });
  }
}
