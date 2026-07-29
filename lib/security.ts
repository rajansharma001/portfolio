/**
 * Basic input sanitization to strip HTML tags and prevent XSS injections.
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim();
}

/**
 * Validates image upload extension & MIME types.
 */
export function isValidImageFile(filename: string, mimeType: string): boolean {
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'];
  const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif'];
  
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return allowedExtensions.includes(ext) && allowedMimeTypes.includes(mimeType);
}

/**
 * Validates document upload extension & MIME types (e.g. PDF resume).
 */
export function isValidPdfFile(filename: string, mimeType: string): boolean {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return ext === '.pdf' && mimeType === 'application/pdf';
}
