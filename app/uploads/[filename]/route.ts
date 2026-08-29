import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { existsSync } from 'node:fs';

export async function GET(req: NextRequest, { params }: { params: { filename: string } }) {
  const filename = params.filename;
  if (!filename) {
    return new NextResponse('File not found', { status: 404 });
  }

  // Prevent directory traversal
  const cleanBaseName = path.basename(filename);
  if (cleanBaseName !== filename) {
    return new NextResponse('Invalid filename', { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'public', 'uploads', cleanBaseName);

  if (!existsSync(filePath)) {
    return new NextResponse('File not found', { status: 404 });
  }

  try {
    const fileBuffer = await fs.readFile(filePath);
    
    // Determine content type
    const ext = path.extname(cleanBaseName).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === '.pdf') contentType = 'application/pdf';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.gif') contentType = 'image/gif';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
