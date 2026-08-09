import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, Upload, Download, Eye, Trash2, CheckCircle2, Sparkles, Image, Palette, Phone, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { useProducts } from '../hooks/useProducts';

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
  const productsCatalog = productsCatalogProp || hookProducts;
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(product);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedShadeFile[]>([]);
  const [activeTab, setActiveTab] = useState<'view' | 'upload'>('view');
  
  // Upload form state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadNotes, setUploadNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
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

  // Save to localStorage
  const saveToLocalStorage = (files: UploadedShadeFile[]) => {
    try {
      localStorage.setItem('ved_yarn_shade_cards_v1', JSON.stringify(files));
      setUploadedFiles(files);
    } catch (e) {
      console.error('Failed to save shade card:', e);
      alert('File size may be too large for local browser storage. Try uploading smaller image/PDF files.');
    }
  };

  if (!isOpen) return null;

  const currentProd = selectedProduct || productsCatalog[0];

  // Filter uploaded shade files for this product or all
  const productUploadedFiles = uploadedFiles.filter(f => !currentProd || f.productId === currentProd.id);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!uploadTitle) {
        setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !currentProd) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = reader.result as string;
      const fileType = selectedFile.type.includes('pdf') || selectedFile.name.endsWith('.pdf') ? 'pdf' : 'image';

      const newEntry: UploadedShadeFile = {
        id: 'shade_' + Date.now(),
        productId: currentProd.id,
        productName: currentProd.name,
        fileName: selectedFile.name,
        fileType,
        dataUrl,
        title: uploadTitle || `${currentProd.name} Shade Card`,
        notes: uploadNotes,
        uploadedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      const updated = [newEntry, ...uploadedFiles];
      saveToLocalStorage(updated);

      setIsUploading(false);
      setSelectedFile(null);
      setUploadTitle('');
      setUploadNotes('');
      setSuccessMsg('✅ Shade Card File (PDF/Image) saved successfully!');
      setActiveTab('view');
      setTimeout(() => setSuccessMsg(''), 4000);
    };

    reader.onerror = () => {
      setIsUploading(false);
      alert('Failed to read file. Please try again.');
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleDeleteUploadedFile = (id: string) => {
    if (confirm('Are you sure you want to remove this shade card file?')) {
      const filtered = uploadedFiles.filter(f => f.id !== id);
      saveToLocalStorage(filtered);
    }
  };

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
                  const p = productsCatalog.find(prod => prod.id === e.target.value);
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

            {/* Tab Toggle */}
            <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-900 p-1 rounded-xl shrink-0">
              <button
                onClick={() => setActiveTab('view')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'view'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Shades & PDFs</span>
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'upload'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload PDF / Image</span>
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="bg-emerald-500 text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Content Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200 flex-1">
            
            {activeTab === 'view' ? (
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

                {/* Section 1: Uploaded Custom Shade Cards & PDFs for this Product */}
                {productUploadedFiles.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      <span>Your Uploaded Shade Files & PDFs ({productUploadedFiles.length})</span>
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
                                {file.fileType === 'pdf' ? <FileText className="w-5 h-5" /> : <Image className="w-5 h-5" />}
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
                {currentProd && (
                  <div className="space-y-4">
                    {/* Catalog Shade Card Photo */}
                    {currentProd.shadeCardUrl ? (
                      <div className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                          Catalog Shade Card Image
                        </span>
                        <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-950/20 border border-slate-200 dark:border-slate-800 shadow-inner">
                          <img
                            src={currentProd.shadeCardUrl}
                            alt={`${currentProd.name} Shade Card`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    ) : (
                      currentProd.imageUrl && (
                        <div className="space-y-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                            Yarn Cone / Specimen Photo
                          </span>
                          <div className="relative h-56 sm:h-64 w-full rounded-2xl overflow-hidden bg-slate-950/20 border border-slate-200 dark:border-slate-800 shadow-inner">
                            <img
                              src={currentProd.imageUrl}
                              alt={currentProd.name}
                              className="w-full h-full object-cover"
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
                          <p className="font-bold">Have custom shade images or PDFs for {currentProd.name}?</p>
                          <p className="opacity-90">
                            Use the <b>"Upload PDF / Image"</b> tab above to attach your shade cards directly to this product!
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            ) : (
              /* Upload Form Tab */
              <form onSubmit={handleUploadSubmit} className="space-y-5 max-w-xl mx-auto py-2">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                    Upload Shade Card PDF or Image
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Store PDF shade cards or shade photos directly for <b>{currentProd.name}</b> in your browser.
                  </p>
                </div>

                {/* File Drop Area */}
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-400 rounded-3xl p-6 text-center bg-slate-50 dark:bg-slate-800/40 transition-colors relative cursor-pointer group">
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    id="shade-file-upload-input"
                  />
                  <div className="space-y-2 pointer-events-none">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    {selectedFile ? (
                      <div>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                          Selected File: {selectedFile.name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                          Click or drag to select PDF or Image file
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Supports PDF documents, JPG, PNG, WEBP (Max recommended ~5MB)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Shade Card Title / Description
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikasdeep Daffodil 2/28 Red & Green Shade Card"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Notes Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Contains Shade #101 to #150, ready stock in 2/28 count"
                    value={uploadNotes}
                    onChange={(e) => setUploadNotes(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!selectedFile || isUploading}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm py-3 px-6 rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isUploading ? 'Saving File...' : 'Save Shade Card to Library'}</span>
                </button>
              </form>
            )}

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
            <span>💡 All uploaded shade cards are saved locally in your browser.</span>
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
