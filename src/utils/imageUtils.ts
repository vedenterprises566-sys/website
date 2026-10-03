/**
 * Image Utilities for Ved Enterprises
 * Provides robust resolution of Google Drive media files, usercontent CDN URLs,
 * and high-availability thumbnail fallbacks for web browsers.
 */

/**
 * Extracts the unique Google Drive File ID from various Google Drive URL formats:
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/uc?export=view&id=FILE_ID
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/thumbnail?id=FILE_ID
 * - https://lh3.googleusercontent.com/d/FILE_ID
 */
export function extractGoogleDriveFileId(url?: string | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Never attempt to parse base64 data URLs or blob URLs as Google Drive file IDs
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return null;

  // Must belong to Google domains
  const isGoogleDomain =
    trimmed.includes('google.com') ||
    trimmed.includes('googleusercontent.com') ||
    trimmed.includes('drive.google');
  if (!isGoogleDomain) return null;

  // Match /file/d/{id} or /d/{id}
  const dMatch = trimmed.match(/\/(?:file\/)?d\/([a-zA-Z0-9_-]{20,})/);
  if (dMatch) return dMatch[1];

  // Match id={id}
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{20,})/);
  if (idMatch) return idMatch[1];

  // Match googleusercontent.com/d/{id}
  const userContentMatch = trimmed.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]{20,})/);
  if (userContentMatch) return userContentMatch[1];

  return null;
}

/**
 * Resolves any image URL (Google Drive, user content, external, or local asset)
 * into a directly displayable browser URL that will NOT be blocked by Google COOP/CORB.
 */
export function resolveProductImageUrl(url?: string | null, size = 'w1200'): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // If already a data URL or relative path, return directly
  if (trimmed.startsWith('data:') || trimmed.startsWith('/') || trimmed.startsWith('./')) {
    return trimmed;
  }

  // Check if it's a Google Drive link
  const fileId = extractGoogleDriveFileId(trimmed);
  if (fileId) {
    // Primary: Google UserContent edge CDN (official, unrestricted for anyone-with-link)
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  return trimmed;
}

/**
 * Provides a secondary fallback URL for Google Drive images (Google Drive thumbnail API)
 */
export function getDriveThumbnailFallback(url?: string | null, size = 'w800'): string | null {
  const fileId = extractGoogleDriveFileId(url);
  if (!fileId) return null;
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=${size}`;
}

/**
 * Graceful error handler for <img> elements displaying product or shade photos.
 * If the primary CDN fails, attempts thumbnail fallback before hiding.
 */
export function handleProductImageError(
  event: React.SyntheticEvent<HTMLImageElement>,
  originalUrl?: string | null
): void {
  const img = event.currentTarget;
  if (!img) return;

  const fileId = extractGoogleDriveFileId(originalUrl || img.src);
  const fallbackUrl = fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w800` : null;

  // If we haven't tried the thumbnail fallback yet and we have a valid Drive ID
  if (fallbackUrl && img.src !== fallbackUrl && !img.dataset.triedFallback) {
    img.dataset.triedFallback = 'true';
    img.src = fallbackUrl;
    return;
  }

  // Otherwise gracefully hide the broken image element
  img.style.display = 'none';
}

/**
 * Detects if a shade card link is a PDF document
 */
export function isPdfShadeCard(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const lower = url.toLowerCase().trim();
  if (lower.startsWith('data:application/pdf') || lower.includes('.pdf')) return true;
  // If explicitly flagged as a PDF view link or document
  if (lower.includes('drive.google.com/file/d/') && (lower.includes('/view') || lower.includes('/preview'))) {
    if (!lower.includes('.jpg') && !lower.includes('.jpeg') && !lower.includes('.png') && !lower.includes('.webp') && !lower.includes('googleusercontent.com/d/')) {
      return true;
    }
  }
  return false;
}

/**
 * Resolves shade card URL for viewing:
 * - If data URL -> returns original data URL directly (both image & pdf base64)
 * - If PDF on Google Drive -> returns embeddable preview URL https://drive.google.com/file/d/{id}/preview
 * - If Image on Google Drive -> returns direct edge CDN URL https://lh3.googleusercontent.com/d/{id}
 * - Otherwise returns original URL
 */
export function resolveShadeCardUrl(url?: string | null): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  const fileId = extractGoogleDriveFileId(trimmed);
  if (!fileId) return trimmed;

  if (isPdfShadeCard(trimmed)) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

