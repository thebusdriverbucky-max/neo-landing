export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const ALLOWED_UPLOAD_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

export class UploadPolicyError extends Error {
  constructor(message: string, public readonly status: 400 | 413) {
    super(message);
  }
}

export function assertAllowedImage(file: Pick<File, 'size' | 'type'>): void {
  if (file.size <= 0) {
    throw new UploadPolicyError('The uploaded file is empty', 400);
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadPolicyError('Image is too large (maximum 5 MiB)', 413);
  }
  if (!ALLOWED_UPLOAD_TYPES.has(file.type.toLowerCase())) {
    throw new UploadPolicyError('Only JPEG, PNG, and WebP images are allowed', 400);
  }
}
