import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { verifyRequestAuth } from '@/lib/auth';
import { validateUploadFile, generateSafeFileName } from '@/lib/security';
import { v2 as cloudinary } from 'cloudinary';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Configure Cloudinary (will auto-detect CLOUDINARY_URL or individual keys if present)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    const filename = file.name || 'unknown';
    const mimeType = file.type || 'application/octet-stream';
    const sizeBytes = file.size || 0;

    if (!file.name) {
      console.warn("File object is missing 'name' property.");
    }

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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Upload to Cloudinary if configured (Required for Vercel Serverless)
    if (process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_URL) {
      const publicUrl = await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'portfolio',
            resource_type: uploadType === 'resume' ? 'raw' : 'image', // raw for PDFs
            format: uploadType === 'resume' ? 'pdf' : undefined,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result?.secure_url as string);
          }
        );
        uploadStream.end(buffer);
      });

      return NextResponse.json({ url: publicUrl, filename: publicUrl.split('/').pop() });
    }

    // 4. Fallback: Local Filesystem (Will fail on Vercel with EROFS)
    try {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
    } catch (e: any) {
      console.warn('Could not create upload directory:', e.message);
    }

    const safeName = uploadType === 'resume' ? 'resume.pdf' : generateSafeFileName(filename);
    const targetPath = path.resolve(UPLOAD_DIR, safeName);

    // Defense in depth: Verify target stays strictly inside UPLOAD_DIR
    const resolvedUploadDir = path.resolve(UPLOAD_DIR);
    if (!targetPath.startsWith(resolvedUploadDir)) {
      return NextResponse.json({ error: 'Invalid destination path' }, { status: 400 });
    }

    await fs.writeFile(targetPath, buffer);
    const publicUrl = `/uploads/${safeName}`;
    
    return NextResponse.json({ url: publicUrl, filename: safeName });
  } catch (error: any) {
    console.error('UPLOAD ERROR:', error);
    
    // Provide a helpful error message if it's the Vercel read-only issue
    if (error.message?.includes('EROFS')) {
      return NextResponse.json({ 
        error: 'Vercel filesystem is read-only. You must add Cloudinary environment variables (CLOUDINARY_URL) to your Vercel project to upload files.' 
      }, { status: 500 });
    }
    
    return NextResponse.json({ error: `File upload processing failed: ${error.message}` }, { status: 500 });
  }
}
