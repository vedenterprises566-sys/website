import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Package, Send, Sparkles, MapPin, Phone, Palette, FileText } from 'lucide-react';
import { Product } from '../types';
import { getGoogleDriveThumbnail } from './MediaPreviewModal';

interface ProductModalProps {
  product: Product | null;
  isOpen?: boolean;
  onClose: () => void;
  onAddToBasket: (product: Product, qtyKg: number, event?: React.MouseEvent) => void;
  onOpenAiForProduct: (productName: string) => void;
  onOpenShadesModal?: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen = true,
  onClose,
  onAddToBasket,
  onOpenAiForProduct,
  onOpenShadesModal,
}) => {
  const [qty, setQty] = React.useState<number>(100);
  const [added, setAdded] = React.useState<boolean>(false);

  if (!product) return null;

  const rawShadeModal = product.shadeUrl || product.shadeCardUrl || product.shadePdfUrl || '';
  const resolvedShadeModal = rawShadeModal
    ? (getGoogleDriveThumbnail(rawShadeModal) || (rawShadeModal.startsWith('http') ? rawShadeModal : ''))
    : '';

  const handleAdd = (e: React.MouseEvent) => {
    onAddToBasket(product, qty, e);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col z-10"
          >
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-red-700 to-slate-900 text-white">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  {product.categoryLabel} • {product.origin}
                </span>
                <h2 className="text-xl font-bold font-serif text-white">{product.name}</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
                id="close-product-modal-btn"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200">
              
              {/* Spreadsheet Google Drive Resource Quick Links */}
              {(product.shadeUrl || product.pictureUrl) && (
                <div className="bg-slate-100 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="text-[0.625rem] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 block">
                    Spreadsheet Verified Media & Drive Links
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {product.shadeUrl && (
                      <a
                        href={product.shadeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <Palette className="w-4 h-4" />
                        <span>🎨 Open Shade Card (Google Drive)</span>
                      </a>
                    )}
                    {product.pictureUrl && (
                      <a
                        href={product.pictureUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <FileText className="w-4 h-4" />
                        <span>📷 Open Product Photo (Google Drive)</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Dedicated Shade Card & PDF Library Quick Action Bar */}
              {onOpenShadesModal && product.category !== 'garments' && (
                <div className="bg-gradient-to-r from-amber-500/15 via-red-500/10 to-amber-500/15 p-3.5 rounded-2xl border border-amber-500/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
                      🎨
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                        Color Shades & PDF Shade Cards
                      </h4>
                      <p className="text-[0.6875rem] text-slate-600 dark:text-slate-300">
                        View color spectrum or attach your custom shade PDF / images.
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      onClose();
                      onOpenShadesModal(product);
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0"
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Open Shades & PDF</span>
                  </motion.button>
                </div>
              )}

              {/* Product Image & Shade Card Gallery */}
              <div className="space-y-3">
                {product.imageUrl && (
                  <div className="relative h-56 sm:h-64 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-inner group">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end justify-between p-4">
                      <span className="text-white text-xs font-semibold bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">
                        📷 Genuine Product Photo
                      </span>
                      {product.category !== 'garments' && product.shades && product.shades.length > 0 && (
                        <span className="text-amber-300 text-xs font-bold bg-amber-950/90 backdrop-blur-md px-3 py-1 rounded-lg border border-amber-400/40">
                          🎨 {product.shades.length} Available Shades
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Full Shade Card Image (if provided) */}
                {product.category !== 'garments' && resolvedShadeModal && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                      Yarn Shade Card & Color Palette
                    </span>
                    <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                      <img
                        src={resolvedShadeModal}
                        alt={`${product.name} Shade Card`}
                        className="w-full h-full object-contain bg-slate-950/20"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                )}

                {/* Individual Yarn Color Shade Swatches */}
                {product.category !== 'garments' && product.shades && product.shades.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                      Available Yarn Color Shades
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {product.shades.map((shade, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 p-2 rounded-xl border border-slate-200 dark:border-slate-700"
                        >
                          {shade.imageUrl ? (
                            <img
                              src={shade.imageUrl}
                              alt={shade.colorName}
                              className="w-8 h-8 rounded-lg object-cover border border-slate-300 dark:border-slate-600 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          ) : shade.hex ? (
                            <span
                              className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-600 shrink-0 shadow-xs"
                              style={{ backgroundColor: shade.hex }}
                            />
                          ) : (
                            <span className="w-8 h-8 rounded-lg bg-red-600/20 text-red-600 dark:text-red-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                              #{shade.shadeNo}
                            </span>
                          )}
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                              {shade.colorName}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                              Shade #{shade.shadeNo}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Key Specs Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[0.6875rem] font-semibold text-slate-500 dark:text-slate-400 block uppercase">
                    Count / Denier
                  </span>
                  <span className="text-sm font-extrabold text-red-600 dark:text-red-400">
                    {product.countOrDenier}
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[0.6875rem] font-semibold text-slate-500 dark:text-slate-400 block uppercase">
                    Sample Status
                  </span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Available for Dispatch
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-1 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[0.6875rem] font-semibold text-slate-500 dark:text-slate-400 block uppercase">
                    Popular For
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {product.popularFor}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Product Overview & Performance
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  {product.description}
                </p>
              </div>

              {/* Recommended Uses */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                  Recommended Garment & Textile Applications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.recommendedUses.map((use, i) => (
                    <span
                      key={i}
                      className="bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 text-xs font-semibold px-3 py-1 rounded-xl border border-amber-200 dark:border-amber-800/60"
                    >
                      • {use}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                  Technical & Quality Highlights
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* All India Shipping Note */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Dispatch Direct From Ludhiana, Punjab</p>
                  <p className="text-[0.6875rem] opacity-90">
                    Bulk bales and sample hanks shipped via reliable transport networks to Gujarat, Tamil Nadu, Maharashtra, West Bengal, UP, Rajasthan, and Haryana.
                  </p>
                </div>
              </div>

              {/* Quantity Selector & Add to Inquiry */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Estimated Required Quantity (Kg)
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={10}
                      step={10}
                      value={qty}
                      onChange={(e) => setQty(Math.max(10, parseInt(e.target.value) || 10))}
                      className="w-28 sm:w-32 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-center outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <span className="text-xs font-medium text-slate-500">Kilograms (Kg)</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAdd}
                    className={`sm:ml-auto font-bold px-5 py-3 sm:py-2.5 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow ${
                      added
                        ? 'bg-emerald-600 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                    id="add-to-basket-modal-btn"
                  >
                    <Package className="w-4 h-4" />
                    {added ? 'Added to Enquiry Basket!' : 'Add to Enquiry Basket'}
                  </motion.button>
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenAiForProduct(product.name);
                }}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline py-1"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Ask AI about gauge & count compatibility</span>
              </button>

              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href={`https://wa.me/917986716117?text=Hello%20Ved%20Enterprises,%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}%20(${encodeURIComponent(product.countOrDenier)}).%20Please%20share%20current%20rates.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors w-full sm:w-auto"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Direct WhatsApp Rate Query</span>
              </motion.a>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

