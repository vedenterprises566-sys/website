/**
 * Subdomain and routing utilities for Ved Enterprises Admin Panel
 */

/**
 * Checks if the current window location is on the admin subdomain
 * e.g., admin.ved.enterprises or admin.localhost
 */
export function isAdminSubdomain(): boolean {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname.toLowerCase();
  return (
    hostname === 'admin.ved.enterprises' ||
    hostname.startsWith('admin.') ||
    hostname.includes('admin.')
  );
}

/**
 * Returns the URL to the main public website
 */
export function getMainWebsiteUrl(): string {
  if (typeof window === 'undefined') return '/';
  
  const hostname = window.location.hostname.toLowerCase();
  
  // If on local development
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    if (hostname.startsWith('admin.')) {
      const port = window.location.port ? `:${window.location.port}` : '';
      return `${window.location.protocol}//${hostname.replace(/^admin\./, '')}${port}/`;
    }
    return '/';
  }

  // If on production admin subdomain (admin.ved.enterprises)
  if (hostname === 'admin.ved.enterprises' || hostname.startsWith('admin.')) {
    return 'https://www.ved.enterprises/';
  }

  return '/';
}

/**
 * Returns the URL for accessing the Admin Portal
 * Uses admin.ved.enterprises when in production, or /admin when local
 */
export function getAdminPortalUrl(): string {
  if (typeof window === 'undefined') return '/admin';

  const hostname = window.location.hostname.toLowerCase();

  // If already on admin subdomain, stay on root
  if (isAdminSubdomain()) {
    return '/';
  }

  // In production ved.enterprises
  if (hostname === 'ved.enterprises' || hostname === 'www.ved.enterprises') {
    return 'https://admin.ved.enterprises';
  }

  // Localhost or preview deployment
  return '/admin';
}

/**
 * Format bytes to readable string (KB or MB)
 */
export function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 KB';
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${Math.round(kb)} KB`;
  }
  return `${(kb / 1024).toFixed(1)} MB`;
}

/**
 * Compresses an image client-side to ensure fast uploads and low storage footprints
 */
export function compressImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<{ dataUrl: string; sizeFormatted: string; fileName: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const rawUrl = readerEvent.target?.result as string;
          resolve({
            dataUrl: rawUrl,
            sizeFormatted: formatFileSize(file.size),
            fileName: file.name,
          });
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);

        // Approximate base64 size
        const approximateBytes = Math.round((dataUrl.length * 3) / 4);
        resolve({
          dataUrl,
          sizeFormatted: formatFileSize(approximateBytes),
          fileName: file.name,
        });
      };
      img.onerror = () => {
        const rawUrl = readerEvent.target?.result as string;
        resolve({
          dataUrl: rawUrl,
          sizeFormatted: formatFileSize(file.size),
          fileName: file.name,
        });
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Reads a PDF or Image file for shade cards
 */
export function readShadeCardFile(
  file: File
): Promise<{ dataUrl: string; fileType: 'pdf' | 'image'; sizeFormatted: string; fileName: string }> {
  return new Promise((resolve, reject) => {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const sizeFormatted = formatFileSize(file.size);

    if (isPdf) {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          dataUrl: e.target?.result as string,
          fileType: 'pdf',
          sizeFormatted,
          fileName: file.name,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    } else {
      // It's an image, optimize it
      compressImageFile(file).then((res) => {
        resolve({
          dataUrl: res.dataUrl,
          fileType: 'image',
          sizeFormatted: res.sizeFormatted,
          fileName: file.name,
        });
      }).catch(reject);
    }
  });
}
