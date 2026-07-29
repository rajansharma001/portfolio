import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { isValidImageFile, isValidPdfFile } from '@/lib/security';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const uploadType = formData.get('type') as string || 'image';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const filename = file.name;
    const mimeType = file.type;

    // Validate file type
    if (uploadType === 'resume') {
      if (!isValidPdfFile(filename, mimeType)) {
        return NextResponse.json(
          { error: 'Invalid resume file type. Only PDF files are allowed.' },
          { status: 400 }
        );
      }
    } else {
      if (!isValidImageFile(filename, mimeType)) {
        return NextResponse.json(
          { error: 'Invalid image file type. Allowed: PNG, JPG, WEBP, SVG, GIF' },
          { status: 400 }
        );
      }
    }

    // Ensure uploads directory exists
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // Generate safe filename
    const ext = filename.substring(filename.lastIndexOf('.'));
    const cleanName = uploadType === 'resume'
      ? 'resume.pdf'
      : `upload_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;

    const filePath = path.join(UPLOAD_DIR, cleanName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${cleanName}`;
    return NextResponse.json({ url: publicUrl, filename: cleanName });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }
}
