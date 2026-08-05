import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Sparkles, Check, Plus, Eye, PackageCheck, Layers, Tag, ArrowRight, Palette, FileText } from 'lucide-react';
import { Product, YarnCategory } from '../types';
import { PRODUCTS_CATALOG } from '../data/products';
import { ProductModal } from './ProductModal';
import { HangingYarnThreads } from './HangingYarnThreads';

interface CatalogProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: YarnCategory | 'all';
  onCategoryChange: (cat: YarnCategory | 'all') => void;
  onAddToBasket: (product: Product, qtyKg?: number, event?: React.MouseEvent) => void;
  onOpenAiForProduct: (productName: string) => void;
  onOpenShadesModal?: (product?: Product) => void;
  inquiryItemIds: string[];
  onGoToBasket?: () => void;
}

export const Catalog: React.FC<CatalogProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onAddToBasket,
  onOpenAiForProduct,
  onOpenShadesModal,
  inquiryItemIds,
  onGoToBasket,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract unique recommended uses tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    PRODUCTS_CATALOG.forEach((p) => {
      p.recommendedUses.forEach((use) => set.add(use));
    });
    return Array.from(set).slice(0, 10);
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    return PRODUCTS_CATALOG.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Tag filter
      if (selectedTag && !p.recommendedUses.includes(selectedTag)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCount = p.countOrDenier.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesUses = p.recommendedUses.some((u) => u.toLowerCase().includes(q));
        if (!matchesName && !matchesCount && !matchesDesc && !matchesUses) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, selectedTag, searchQuery]);

  return (
    <section id="catalog-section" className="py-8 sm:py-12 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 m-2.5 sm:m-6 md:m-[2.5rem] rounded-2xl sm:rounded-3xl shadow-sm min-h-screen relative overflow-hidden">
      {/* Decorative Hanging Yarn Threads along section top */}
      <HangingYarnThreads variant="banner" className="top-0 opacity-80" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center mb-1">
              <span className="w-1 h-5 bg-slate-900 dark:bg-red-600 mr-2 rounded-full inline-block"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200">
                Product Directory
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
              Yarn & Textile Catalog
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
              Direct supply of Fancy Yarns, China Imported Yarns, Acrylic Blends, Fabrics, and Finished Sweater Garments.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold shadow-xs"
          >
            <span className="text-slate-500">Showing:</span>
            <span className="text-slate-900 dark:text-white font-black text-sm">{filteredProducts.length}</span>
            <span className="text-slate-500">Qualities</span>
          </motion.div>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
            { id: 'all', label: 'ALL PRODUCTS (25+)' },
            { id: 'garments', label: '👕 GARMENTS (SWEATERS)' },
            { id: 'fancy', label: 'FANCY YARNS' },
            { id: 'china', label: 'CHINA YARNS' },
            { id: 'acrylic-blends', label: 'ACRYLIC BLENDS' },
            { id: 'fabrics', label: 'FABRICS & TEXTILES' },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onCategoryChange(tab.id as any)}
              id={`cat-tab-${tab.id}`}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === tab.id
                  ? 'bg-slate-900 text-white dark:bg-red-600 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Tag Filters & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Tag Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 pl-1">
              <Tag className="w-3.5 h-3.5" /> Filter:
            </span>
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedTag === null
                  ? 'bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All Application Uses
            </button>
            {allTags.map((tag) => (
              <motion.button
                key={tag}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedTag === tag
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {tag}
              </motion.button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search catalog..."
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-red-500 outline-none transition-shadow duration-200"
              id="catalog-search-input"
            />
          </div>
        </div>

        {/* Product Cards Grid with Motion */}
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8"
          >
            <p className="text-slate-500 dark:text-slate-400 text-base font-medium">
              No yarns matched your filter criteria.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onSearchChange('');
                onCategoryChange('all');
                setSelectedTag(null);
              }}
              className="mt-4 bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
            >
              Reset All Filters
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, idx) => {
                const isInBasket = inquiryItemIds.includes(product.id);

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.3) }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-lg transition-shadow flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Product Image Header Container */}
                    <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(product)}>
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium text-xs">
                          Product Sample Image
                        </div>
                      )}
                      
                      {/* Dark gradient overlay for badge legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20" />

                      {/* Top Overlay Category Tag */}
                      <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-white font-bold text-[0.625rem] uppercase tracking-wider px-2.5 py-1 rounded-md border border-white/20">
                        {product.categoryLabel}
                      </div>

                      {/* Top Right Badges */}
                      <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1">
                        {product.badge && (
                          <div className="bg-red-600 text-white font-black text-[0.625rem] uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                            {product.badge}
                          </div>
                        )}
                        {product.category !== 'garments' && (product.shades?.length || product.shadeCardUrl) ? (
                          <div className="bg-amber-400 text-slate-950 font-black text-[0.625rem] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                            🎨 {product.shades?.length ? `${product.shades.length} Shades` : 'Shade Card'}
                          </div>
                        ) : null}
                      </div>

                      {/* Bottom overlay: Origin */}
                      <div className="absolute bottom-2.5 left-2.5 text-slate-200 text-[0.6875rem] font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>{product.origin}</span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Product Name */}
                        <h3 
                          onClick={() => setSelectedProduct(product)}
                          className="text-base font-bold text-slate-900 dark:text-white font-serif group-hover:text-red-600 transition-colors cursor-pointer line-clamp-1"
                        >
                          {product.name}
                        </h3>

                        {/* Count / Denier Pill */}
                        <div className="mt-2 inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs px-2.5 py-1 rounded-md">
                          <span className="text-slate-500 font-medium">Count:</span>
                          <span className="text-red-600 dark:text-red-400 font-extrabold">
                            {product.countOrDenier}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-slate-600 dark:text-slate-300 text-xs mt-2.5 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>

                        {/* Recommended Uses Tags */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {product.recommendedUses.slice(0, 3).map((use, i) => (
                            <span
                              key={i}
                              className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 text-[0.625rem] font-medium px-2 py-0.5 rounded-md"
                            >
                              {use}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions Footer */}
                      <div className="pt-3.5 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2">
                        {onOpenShadesModal && product.category !== 'garments' && (
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onOpenShadesModal(product)}
                            className="w-full bg-amber-500/15 hover:bg-amber-500/25 text-slate-900 dark:text-amber-300 border border-amber-400/40 font-bold text-xs py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5"
                            id={`shades-pdf-${product.id}`}
                          >
                            <Palette className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            <span>🎨 Shades & PDF Card</span>
                          </motion.button>
                        )}

                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedProduct(product)}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                            id={`view-specs-${product.id}`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Specs</span>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.93 }}
                            onClick={(e) => onAddToBasket(product, 100, e)}
                            className={`flex-1 font-bold text-xs py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                              isInBasket
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-red-600 dark:hover:bg-red-700'
                            }`}
                            id={`add-basket-${product.id}`}
                          >
                            {isInBasket ? (
                              <>
                                <PackageCheck className="w-3.5 h-3.5" />
                                <span>In Basket</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Inquire</span>
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>

                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

      </div>

      {/* Floating Inquiry Basket Banner */}
      <AnimatePresence>
        {inquiryItemIds.length > 0 && onGoToBasket && (
          <motion.div
            initial={{ opacity: 0, y: 30, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 30, x: '-50%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-20 md:bottom-6 left-1/2 z-30 bg-slate-900/95 dark:bg-slate-800/95 text-white backdrop-blur-md px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-xl border border-slate-700/80 flex items-center gap-3 sm:gap-4 max-w-[calc(100vw-2rem)]"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-bold whitespace-nowrap">
                {inquiryItemIds.length} {inquiryItemIds.length === 1 ? 'item' : 'items'} in Enquiry Basket
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGoToBasket}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-xs whitespace-nowrap"
              id="floating-basket-page-btn"
            >
              <span>View Enquiry Basket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToBasket={onAddToBasket}
        onOpenAiForProduct={onOpenAiForProduct}
      />
    </section>
  );
};

