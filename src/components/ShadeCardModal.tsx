import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, Download, Eye, Trash2, Palette, Phone, ExternalLink } from 'lucide-react';
import { Product } from '../types';
import { useProducts } from '../hooks/useProducts';
import { getGoogleDriveThumbnail } from './MediaPreviewModal';

interface UploadedShadeFile {
  id: string;
  productId: string;
  productName: string;
  fileName: string;
  fileType: 'pdf' | 'image';
  dataUrl: string;
  title: string;
  notes?: string;
  uploadedAt: string;
}

interface ShadeCardModalProps {
  product: Product | null;
  productsCatalog?: Product[];
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (prod: Product) => void;
}

export const ShadeCardModal: React.FC<ShadeCardModalProps> = ({
  product,
  productsCatalog: productsCatalogProp,
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const { products: hookProducts } = useProducts();
  const productsCatalog = productsCatalogProp || hookProducts || [];
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(product);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedShadeFile[]>([]);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    setSelectedProduct(product);
  }, [product]);

  // Load uploaded shade cards from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ved_yarn_shade_cards_v1');
      if (saved) {
        setUploadedFiles(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load saved shade cards:', e);
    }
  }, []);

  const saveToLocalStorage = (files: UploadedShadeFile[]) => {
    try {
      localStorage.setItem('ved_yarn_shade_cards_v1', JSON.stringify(files));
      setUploadedFiles(files);
    } catch (e) {
      console.error('Failed to save shade card:', e);
    }
  };

  const handleDeleteUploadedFile = (id: string) => {
    if (confirm('Are you sure you want to remove this shade card file?')) {
      const filtered = uploadedFiles.filter((f) => f.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  if (!isOpen) return null;

  const currentProd = selectedProduct || (productsCatalog && productsCatalog.length > 0 ? productsCatalog[0] : null);

  const rawShadeLink = currentProd ? (currentProd.shadeUrl || currentProd.shadeCardUrl || currentProd.shadePdfUrl || '') : '';
  const resolvedShadeImg = rawShadeLink
    ? (getGoogleDriveThumbnail(rawShadeLink) || (rawShadeLink.startsWith('http') ? rawShadeLink : ''))
    : '';
  const resolvedProdImg = currentProd
    ? (currentProd.pictureUrl
      ? (getGoogleDriveThumbnail(currentProd.pictureUrl) || currentProd.pictureUrl)
      : (currentProd.imageUrl || currentProd.image || ''))
    : '';

  // Filter uploaded shade files for this product or all
  const productUploadedFiles = currentProd
    ? uploadedFiles.filter((f) => f.productId === currentProd.id)
    : uploadedFiles;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-gradient-to-r from-slate-950 via-red-900 to-amber-950 text-white border-b border-red-800/40">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center shadow-md">
                🎨
              </div>
              <div>
                <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-amber-300 block">
                  Ved Yarn Shade Card Library
                </span>
                <h2 className="text-base sm:text-xl font-extrabold font-serif text-white">
                  Color Shades & PDF Storage
                </h2>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
              id="close-shade-modal-btn"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Product Selector Bar */}
          <div className="bg-slate-100 dark:bg-slate-800/80 p-3 sm:p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 shrink-0">
                Select Product:
              </span>
              <select
                value={currentProd?.id || ''}
                onChange={(e) => {
                  const p = productsCatalog.find((prod) => prod.id === e.target.value);
                  if (p) {
                    setSelectedProduct(p);
                    if (onSelectProduct) onSelectProduct(p);
                  }
                }}
                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm font-bold px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-red-500 truncate min-w-0 flex-1 sm:w-80"
              >
                {productsCatalog.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.countOrDenier})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200 flex-1">
            
            <div className="space-y-6">
              
              {/* Product Summary */}
              {currentProd && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[0.625rem] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 block">
                      {currentProd.categoryLabel} • {currentProd.countOrDenier}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                      {currentProd.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Mill / Origin: {currentProd.origin}
                    </p>
                  </div>

                  <a
                    href={`https://wa.me/917986716117?text=Hello%20Ved%20Enterprises,%20please%20send%20me%20the%20complete%20shade%20card%20PDF%20for%20${encodeURIComponent(currentProd.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shrink-0"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Request PDF on WhatsApp</span>
                  </a>
                </div>
              )}

              {/* Section 1: Saved Custom Shade Files & PDFs for this Product (if any) */}
              {productUploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    <span>Saved Shade Files & PDFs ({productUploadedFiles.length})</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {productUploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 relative group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-xl ${file.fileType === 'pdf' ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {file.title}
                              </h5>
                              <span className="text-[0.625rem] text-slate-500 dark:text-slate-400 block truncate">
                                {file.fileName} • {file.uploadedAt}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteUploadedFile(file.id)}
                            className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                            title="Delete file"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {file.notes && (
                          <p className="text-[0.6875rem] text-slate-600 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                            "{file.notes}"
                          </p>
                        )}

                        {/* File Preview / Actions */}
                        {file.fileType === 'image' && (
                          <div className="h-32 w-full rounded-xl overflow-hidden bg-slate-950/20 border border-slate-200 dark:border-slate-700">
                            <img
                              src={file.dataUrl}
                              alt={file.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-1">
                          {file.fileType === 'pdf' ? (
                            <button
                              onClick={() => setPreviewPdfUrl(file.dataUrl)}
                              className="flex-1 inline-flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1.5 px-3 rounded-xl transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Preview PDF</span>
                            </button>
                          ) : (
                            <a
                              href={file.dataUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 inline-flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-3 rounded-xl transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Full Image</span>
                            </a>
                          )}

                          <a
                            href={file.dataUrl}
                            download={file.fileName}
                            className="inline-flex items-center justify-center gap-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 text-xs font-bold py-1.5 px-3 rounded-xl transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 2: Catalog Shade Card Image & Color Swatches */}
              {currentProd ? (
                <div className="space-y-4">
                  {/* Catalog Shade Card Photo or Google Drive Link */}
                  {rawShadeLink ? (
                    <div className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                          Yarn Shade Card & Color Spectrum
                        </span>
                        <a
                          href={rawShadeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open Drive Link / PDF</span>
                        </a>
                      </div>

                      {resolvedShadeImg ? (
                        <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-950/20 border border-slate-200 dark:border-slate-800 shadow-inner">
                          <img
                            src={resolvedShadeImg}
                            alt={`${currentProd.name} Shade Card`}
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        <div className="p-6 bg-slate-100 dark:bg-slate-900 rounded-xl text-center space-y-2">
                          <FileText className="w-10 h-10 text-amber-500 mx-auto" />
                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            Shade Card PDF / Document available for {currentProd.name}.
                          </p>
                          <a
                            href={rawShadeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl"
                          >
                            View Shade Document on Google Drive
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    resolvedProdImg && (
                      <div className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                          Yarn Cone / Specimen Photo
                        </span>
                        <div className="relative h-56 sm:h-64 w-full rounded-2xl overflow-hidden bg-slate-950/20 border border-slate-200 dark:border-slate-800 shadow-inner">
                          <img
                            src={resolvedProdImg}
                            alt={currentProd.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                    )
                  )}

                  {/* Catalog Shade Colors */}
                  {currentProd.shades && currentProd.shades.length > 0 ? (
                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                        Color Shades Spectrum ({currentProd.shades.length} Colors)
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                        {currentProd.shades.map((shade, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
                          >
                            {shade.imageUrl ? (
                              <img
                                src={shade.imageUrl}
                                alt={shade.colorName}
                                className="w-9 h-9 rounded-lg object-cover border border-slate-300 dark:border-slate-600 shrink-0"
                              />
                            ) : shade.hex ? (
                              <span
                                className="w-9 h-9 rounded-lg border border-slate-300 dark:border-slate-600 shrink-0 shadow-xs"
                                style={{ backgroundColor: shade.hex }}
                              />
                            ) : (
                              <span className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center justify-center shrink-0">
                                #{shade.shadeNo}
                              </span>
                            )}
                            <div className="min-w-0 flex-1">
                              <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                                {shade.colorName}
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block">
                                Shade No. {shade.shadeNo}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-3">
                      <Palette className="w-6 h-6 text-amber-500 shrink-0" />
                      <div>
                        <p className="font-bold">Official Mill Shade Cards & Custom Colors for {currentProd.name}</p>
                        <p className="opacity-90">
                          Contact VED Enterprises on WhatsApp (+91 7986716117) to request physical yarn shade cards, hank specimens, or customized dye lot matches!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <p className="text-xs font-bold">Select a yarn product from the dropdown above to view shade cards & color spectra.</p>
                </div>
              )}

            </div>

          </div>

          {/* PDF Preview Modal Frame if previewing */}
          {previewPdfUrl && (
            <div className="absolute inset-0 z-30 bg-slate-950/95 flex flex-col p-4">
              <div className="flex items-center justify-between pb-3 text-white border-b border-slate-800">
                <span className="text-xs font-bold text-amber-400">PDF Shade Card Previewer</span>
                <button
                  onClick={() => setPreviewPdfUrl(null)}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <iframe
                src={previewPdfUrl}
                title="PDF Preview"
                className="w-full flex-1 rounded-xl mt-3 border border-slate-800"
              />
            </div>
          )}

          {/* Footer */}
          <div className="p-4 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>🎨 Official Shade Card & Color Spectrum Library • VED Enterprises</span>
            <button
              onClick={onClose}
              className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-1.5 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              Close
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
