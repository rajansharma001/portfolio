import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { verifyRequestAuth } from '@/lib/auth';
import { validateUploadFile, generateSafeFileName } from '@/lib/security';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function POST(req: NextRequest) {
  // 1. Enforce Server-Side Authorization
  if (!verifyRequestAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const uploadType = (formData.get('type') as string) || 'image';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const filename = file.name;
    const mimeType = file.type;
    const sizeBytes = file.size;

    // 2. Strict File Validation
    const validation = validateUploadFile(
      filename,
      mimeType,
      sizeBytes,
      uploadType === 'resume' ? 'pdf' : 'image'
    );

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error || 'Invalid file uploaded' }, { status: 400 });
    }

    // 3. Ensure uploads directory exists safely
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // 4. Generate Safe, Unpredictable Filename preventing path traversal
    const safeName = uploadType === 'resume' ? 'resume.pdf' : generateSafeFileName(filename);
    const targetPath = path.resolve(UPLOAD_DIR, safeName);

    // Defense in depth: Verify target stays strictly inside UPLOAD_DIR
    if (!targetPath.startsWith(path.resolve(UPLOAD_DIR))) {
      return NextResponse.json({ error: 'Invalid destination path' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await fs.writeFile(targetPath, buffer);

    const publicUrl = `/uploads/${safeName}`;
    return NextResponse.json({ url: publicUrl, filename: safeName });
  } catch (error) {
    return NextResponse.json({ error: 'File upload processing failed.' }, { status: 500 });
  }
}
