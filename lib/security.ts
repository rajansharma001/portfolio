import path from 'path';
import crypto from 'crypto';

/**
 * Strips dangerous HTML tags, attributes, and script payloads to prevent XSS.
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Validates and sanitizes email addresses.
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string' || email.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates URLs ensuring they only use safe http/https schemes (blocks javascript:, data:, etc.)
 */
export function isValidSafeUrl(urlStr: string): boolean {
  if (!urlStr || typeof urlStr !== 'string') return false;
  const trimmed = urlStr.trim();
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) return true; // Relative paths allowed
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validates uploaded files (images & documents) preventing executable files and directory traversal.
 */
export function validateUploadFile(
  filename: string,
  mimeType: string,
  sizeBytes: number,
  type: 'image' | 'pdf' = 'image'
): { valid: boolean; error?: string } {
  // Size bounds
  const maxImageSize = 5 * 1024 * 1024; // 5MB
  const maxPdfSize = 10 * 1024 * 1024;  // 10MB

  if (type === 'image' && sizeBytes > maxImageSize) {
    return { valid: false, error: 'Image size exceeds maximum limit of 5MB.' };
  }
  if (type === 'pdf' && sizeBytes > maxPdfSize) {
    return { valid: false, error: 'Document size exceeds maximum limit of 10MB.' };
  }

  // Prevent directory traversal
  const cleanBaseName = path.basename(filename);
  if (cleanBaseName.includes('..') || cleanBaseName.includes('/') || cleanBaseName.includes('\\')) {
    return { valid: false, error: 'Invalid filename detected.' };
  }

  const ext = path.extname(cleanBaseName).toLowerCase();

  if (type === 'image') {
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.ico'];
    const allowedMimes = [
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/svg+xml',
      'image/gif',
      'image/x-icon',
      'image/vnd.microsoft.icon',
    ];
    if (!allowedExtensions.includes(ext) || !allowedMimes.includes(mimeType.toLowerCase())) {
      return { valid: false, error: 'Invalid image format. Allowed formats: PNG, JPG, WEBP, SVG, GIF.' };
    }
  }

  if (type === 'pdf') {
    if (ext !== '.pdf' || mimeType.toLowerCase() !== 'application/pdf') {
      return { valid: false, error: 'Invalid document format. Only PDF files are allowed.' };
    }
  }

  return { valid: true };
}

/**
 * Generates an unpredictable, cryptographically safe filename for uploads.
 */
export function generateSafeFileName(originalName: string): string {
  const ext = path.extname(path.basename(originalName)).toLowerCase();
  const random = crypto.randomBytes(8).toString('hex');
  const timestamp = Date.now();
  return `upload_${timestamp}_${random}${ext}`;
}

/**
 * Verifies request origin against the host to prevent Cross-Site Request Forgery (CSRF).
 */
export function verifyCsrfOrigin(originHeader: string | null, hostHeader: string | null): boolean {
  if (!originHeader || !hostHeader) return true; // Standard non-browser or same-origin direct
  try {
    const originHost = new URL(originHeader).host;
    return originHost === hostHeader;
  } catch {
    return false;
  }
}
