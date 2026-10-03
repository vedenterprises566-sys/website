import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Download, FileText, Image as ImageIcon, Palette, ShieldCheck } from 'lucide-react';
import { extractGoogleDriveFileId, isPdfShadeCard } from '../utils/imageUtils';

interface MediaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  type: 'shade' | 'picture';
  productName?: string;
}

export function getGoogleDriveFileId(url: string): string | null {
  return extractGoogleDriveFileId(url);
}

export function getGoogleDriveThumbnail(url: string, sz = 'w1000'): string | null {
  const fileId = extractGoogleDriveFileId(url);
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
  return null;
}

export function getGoogleDrivePreviewIframe(url: string): string | null {
  const fileId = extractGoogleDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return null;
}

export const MediaPreviewModal: React.FC<MediaPreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  url,
  type,
  productName,
}) => {
  if (!isOpen || !url) return null;

  const trimmed = (url || '').trim();
  const fileId = extractGoogleDriveFileId(trimmed);
  const isPdf = isPdfShadeCard(trimmed);
  const isDataUrl = trimmed.startsWith('data:');

  const [imgError, setImgError] = useState<boolean>(false);
  const [triedFallback, setTriedFallback] = useState<boolean>(false);

  let displayImageUrl: string | null = null;
  let displayIframeUrl: string | null = null;

  if (isDataUrl) {
    if (trimmed.startsWith('data:application/pdf')) {
      displayIframeUrl = trimmed;
    } else {
      displayImageUrl = trimmed;
    }
  } else if (fileId) {
    if (isPdf) {
      displayIframeUrl = `https://drive.google.com/file/d/${fileId}/preview`;
    } else {
      displayImageUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  } else if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    if (isPdf) {
      displayIframeUrl = trimmed;
    } else {
      displayImageUrl = trimmed;
    }
  }

  const driveOpenUrl = fileId
    ? `https://drive.google.com/file/d/${fileId}/view?usp=sharing`
    : (trimmed.startsWith('http') ? trimmed : null);

  const downloadFilename = `${(productName || title || 'file').toLowerCase().replace(/[^a-z0-9_-]/g, '_')}.${isPdf ? 'pdf' : 'jpg'}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative w-full max-w-4xl bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Top Bar Header */}
          <div className="px-5 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${
                  type === 'shade'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}
              >
                {type === 'shade' ? <Palette className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-[0.625rem] font-bold uppercase tracking-widest text-slate-400">
                  {type === 'shade' ? (isPdf ? 'Official PDF Shade Document' : 'Official Shade Card / Color Palette') : 'Genuine Product Photo'}
                </span>
                <h3 className="text-sm sm:text-base font-bold font-serif text-white truncate max-w-xs sm:max-w-md">
                  {productName ? `${productName} - ${title}` : title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {driveOpenUrl && (
                <a
                  href={driveOpenUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3.5 py-2 rounded-xl border border-slate-700 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Drive</span>
                </a>
              )}

              {isDataUrl && (
                <a
                  href={trimmed}
                  download={downloadFilename}
                  className="hidden sm:inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3.5 py-2 rounded-xl border border-slate-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                id="close-media-modal-btn"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Media Body Viewport */}
          <div className="p-4 sm:p-6 flex-1 overflow-y-auto flex flex-col items-center justify-center min-h-[320px] bg-slate-950/60 relative">
            {displayImageUrl && !imgError ? (
              <div className="relative max-w-full max-h-[60vh] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-black flex items-center justify-center">
                <img
                  src={displayImageUrl}
                  alt={title}
                  className="max-h-[60vh] w-auto object-contain transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    if (fileId && !triedFallback) {
                      setTriedFallback(true);
                      e.currentTarget.src = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
                    } else {
                      setImgError(true);
                    }
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : displayIframeUrl ? (
              <iframe
                src={displayIframeUrl}
                title={title}
                className="w-full h-[60vh] rounded-2xl border border-slate-800 shadow-xl bg-slate-900"
                allow="autoplay"
              />
            ) : (
              <div className="text-center p-8 space-y-4">
                <FileText className="w-12 h-12 text-slate-500 mx-auto" />
                <p className="text-slate-300 text-sm">
                  {isPdf ? 'Official Shade Card Document' : 'Resource file attached to this product.'}
                </p>
                {driveOpenUrl ? (
                  <a
                    href={driveOpenUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-lg"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View High-Res File on Google Drive</span>
                  </a>
                ) : isDataUrl ? (
                  <a
                    href={trimmed}
                    download={downloadFilename}
                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download File Directly</span>
                  </a>
                ) : null}
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Direct Mill Resource from Ved Enterprises</span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {driveOpenUrl && (
                <a
                  href={driveOpenUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full File</span>
                </a>
              )}

              {isDataUrl && (
                <a
                  href={trimmed}
                  download={downloadFilename}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </a>
              )}

              <button
                onClick={onClose}
                className="flex-1 sm:flex-initial bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-4 py-2 rounded-xl transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
