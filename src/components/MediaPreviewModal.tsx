import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Download, FileText, Image as ImageIcon, Palette, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

interface MediaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  type: 'shade' | 'picture';
  productName?: string;
}

export function getGoogleDriveFileId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export function getGoogleDriveThumbnail(url: string, sz = 'w1000'): string | null {
  const fileId = getGoogleDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=${sz}`;
  }
  return null;
}

export function getGoogleDrivePreviewIframe(url: string): string | null {
  const fileId = getGoogleDriveFileId(url);
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

  const fileId = getGoogleDriveFileId(url);
  const thumbnailUrl = fileId ? getGoogleDriveThumbnail(url) : (url.startsWith('http') ? url : null);
  const iframeUrl = fileId ? getGoogleDrivePreviewIframe(url) : null;

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
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${
                type === 'shade'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {type === 'shade' ? <Palette className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-[0.625rem] font-bold uppercase tracking-widest text-slate-400">
                  {type === 'shade' ? 'Official Shade Card / Color Palette' : 'Genuine Product Photo'}
                </span>
                <h3 className="text-sm sm:text-base font-bold font-serif text-white truncate max-w-xs sm:max-w-md">
                  {productName ? `${productName} - ${title}` : title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3.5 py-2 rounded-xl border border-slate-700 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Drive</span>
              </a>

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
            {thumbnailUrl ? (
              <div className="relative max-w-full max-h-[60vh] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-black flex items-center justify-center">
                <img
                  src={thumbnailUrl}
                  alt={title}
                  className="max-h-[60vh] w-auto object-contain transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    // Fallback to iframe embed if thumbnail fails to load
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && iframeUrl) {
                      const iframe = document.createElement('iframe');
                      iframe.src = iframeUrl;
                      iframe.className = 'w-full h-[50vh] rounded-2xl border-0';
                      parent.appendChild(iframe);
                    }
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : iframeUrl ? (
              <iframe
                src={iframeUrl}
                title={title}
                className="w-full h-[55vh] rounded-2xl border border-slate-800 shadow-xl bg-slate-900"
                allow="autoplay"
              />
            ) : (
              <div className="text-center p-8 space-y-4">
                <FileText className="w-12 h-12 text-slate-500 mx-auto" />
                <p className="text-slate-300 text-sm">
                  Document preview is hosted externally on Google Drive.
                </p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-lg"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View High-Res File on Google Drive</span>
                </a>
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
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Full File</span>
              </a>
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
