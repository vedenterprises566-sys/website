import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shirt,
  Search,
  Filter,
  Sparkles,
  ShoppingBag,
  Check,
  Plus,
  ArrowLeft,
  ChevronRight,
  Layers,
  Tag,
  ShieldCheck,
  Flame,
  Info,
  SlidersHorizontal,
  Clock,
  Award
} from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS_CATALOG } from '../data/products';
import { ProductModal } from './ProductModal';
import { HangingYarnThreads } from './HangingYarnThreads';

interface GarmentsPageProps {
  onAddToBasket: (product: Product, qtyKg?: number, event?: React.MouseEvent) => void;
  onOpenAiForProduct: (productName: string) => void;
  onOpenShadesModal?: (product?: Product) => void;
  inquiryItemIds: string[];
  onGoToBasket: () => void;
  onBackToHome: () => void;
  onOpenAi: () => void;
}

export const GarmentsPage: React.FC<GarmentsPageProps> = ({
  onAddToBasket,
  onOpenAiForProduct,
  onOpenShadesModal,
  inquiryItemIds,
  onGoToBasket,
  onBackToHome,
  onOpenAi,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [selectedGauge, setSelectedGauge] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // All garment products (sweaters)
  const allGarmentProducts = useMemo(() => {
    return PRODUCTS_CATALOG.filter((p) => p.category === 'garments');
  }, []);

  // Filtered garment products
  const filteredGarments = useMemo(() => {
    return allGarmentProducts.filter((p) => {
      // Style filter
      if (selectedStyle !== 'all') {
        if (p.garmentStyle !== selectedStyle) return false;
      }

      // Gauge filter
      if (selectedGauge !== 'all') {
        if (!p.gauge?.toLowerCase().includes(selectedGauge.toLowerCase())) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesYarn = p.yarnUsed?.toLowerCase().includes(q) || false;
        const matchesUses = p.recommendedUses.some((u) => u.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesYarn && !matchesUses) {
          return false;
        }
      }

      return true;
    });
  }, [allGarmentProducts, selectedStyle, selectedGauge, searchQuery]);

  const styleOptions = [
    { id: 'all', label: 'All Sweater Styles' },
    { id: 'Men Sweater', label: "Men's Sweaters" },
    { id: 'Ladies Cardigan', label: 'Ladies Cardigans' },
    { id: 'High-Neck Pullover', label: 'High-Neck Turtlenecks' },
    { id: 'Cable Knit', label: 'Cable Knits' },
    { id: 'Zip Sweater', label: 'Full-Zip Sweaters' },
    { id: 'Kids Winterwear', label: 'Kids Sweaters' },
  ];

  const gaugeOptions = [
    { id: 'all', label: 'All Gauges' },
    { id: '3GG', label: '3GG Heavy Chunky' },
    { id: '7GG', label: '7GG Medium Winter' },
    { id: '12GG', label: '12GG Fine Gauge' },
  ];

  return (
    <div className="py-8 bg-slate-50 dark:bg-slate-950/80 min-h-screen relative overflow-hidden">
      {/* Decorative Hanging Yarn Threads */}
      <HangingYarnThreads variant="banner" className="top-0 opacity-70" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">

        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            id="garments-back-home-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Main Catalog</span>
          </motion.button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Product Directory &gt;</span>
            <span className="inline-flex items-center gap-1.5 bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-400 font-extrabold text-xs px-3 py-1 rounded-xl border border-red-200 dark:border-red-900/50">
              <Shirt className="w-3.5 h-3.5" />
              Sweater Garment Directory
            </span>
          </div>
        </div>

        {/* Hero Banner for Sweater Directory */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl"
        >
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Shirt className="w-96 h-96 text-white" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Direct Knitted Sweaters Directory • Ludhiana Hub
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-serif tracking-tight text-white leading-tight">
              Finished Sweater Garments <span className="text-amber-400">Directory</span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
              Explore finished knitwear and sweater collections produced with Ved Enterprises’ premium 2/48 Vislon, Lurex, Chenille, and Acrylic Cotton yarns. Available for bulk supply, private labeling, and sample orders across India.
            </p>

            {/* Value Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10 text-center">
                <span className="block text-amber-300 font-black text-sm sm:text-lg">3GG to 12GG</span>
                <span className="text-[0.625rem] sm:text-xs text-slate-300 font-medium">All Knitted Gauges</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10 text-center">
                <span className="block text-amber-300 font-black text-sm sm:text-lg">100% Traceable</span>
                <span className="text-[0.625rem] sm:text-xs text-slate-300 font-medium">Ved Yarn Quality</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10 text-center">
                <span className="block text-amber-300 font-black text-sm sm:text-lg">Samples Ready</span>
                <span className="text-[0.625rem] sm:text-xs text-slate-300 font-medium">Fast All-India Dispatch</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10 text-center">
                <span className="block text-amber-300 font-black text-sm sm:text-lg">Custom Orders</span>
                <span className="text-[0.625rem] sm:text-xs text-slate-300 font-medium">Bulk Rates & Sizes</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter Controls & Search */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          
          {/* Top Row: Search & AI Quick Button */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sweater styles, yarns, or features..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                id="garments-search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>

            {/* AI Assistant Quick Callout */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenAi}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />
              <span>Ask AI About Custom Sweater Manufacturing</span>
            </motion.button>
          </div>

          {/* Style Filter Pills */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-red-500" /> Filter by Sweater Type:
            </span>
            <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
              {styleOptions.map((opt) => (
                <motion.button
                  key={opt.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedStyle(opt.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedStyle === opt.id
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {opt.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Gauge Filter Pills */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" /> Knitting Gauge:
            </span>
            <div className="flex flex-wrap gap-2">
              {gaugeOptions.map((opt) => (
                <motion.button
                  key={opt.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedGauge(opt.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedGauge === opt.id
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {opt.label}
                </motion.button>
              ))}
            </div>
          </div>

        </div>

        {/* Product Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Sweater Garments Showcase ({filteredGarments.length} Items)
            </h3>
            {searchQuery || selectedStyle !== 'all' || selectedGauge !== 'all' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStyle('all');
                  setSelectedGauge('all');
                }}
                className="text-xs text-red-600 dark:text-red-400 font-bold hover:underline"
              >
                Reset All Filters
              </button>
            ) : null}
          </div>

          {filteredGarments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4"
            >
              <Shirt className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                No Sweater Garments match your filters
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try clearing your search query or selecting "All Sweater Styles" to view all sweater garments.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStyle('all');
                  setSelectedGauge('all');
                }}
                className="bg-slate-900 dark:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Show All Sweaters
              </button>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredGarments.map((product, idx) => {
                  const isInBasket = inquiryItemIds.includes(product.id);

                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.3) }}
                      whileHover={{ y: -6, transition: { duration: 0.2 } }}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-lg transition-shadow flex flex-col justify-between group"
                    >
                      {/* Top Image Box */}
                      <div>
                        <div className="relative aspect-4/3 bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(product)}>
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Shirt className="w-12 h-12" />
                            </div>
                          )}

                          {/* Top Badges */}
                          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                            {product.badge && (
                              <span className="bg-red-600 text-white text-[0.625rem] font-extrabold px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
                                {product.badge}
                              </span>
                            )}
                            <span className="bg-slate-950/80 backdrop-blur-xs text-amber-300 text-[0.625rem] font-bold px-2 py-0.5 rounded-md border border-slate-700">
                              {product.gauge || product.countOrDenier}
                            </span>
                          </div>

                          {/* Right Quick AI Button */}
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenAiForProduct(product.name);
                            }}
                            className="absolute top-2.5 right-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 p-1.5 rounded-xl shadow-md transition-transform z-10"
                            title="Ask AI about yarn specifications for this sweater"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>

                        {/* Content Section */}
                        <div className="p-4 space-y-3">
                          <div>
                            <div className="text-[0.625rem] font-bold uppercase tracking-widest text-red-600 dark:text-red-400">
                              {product.categoryLabel}
                            </div>
                            <h4
                              onClick={() => setSelectedProduct(product)}
                              className="text-base font-bold text-slate-900 dark:text-white font-serif leading-snug line-clamp-2 mt-0.5 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                            >
                              {product.name}
                            </h4>
                          </div>

                          {/* Yarn Traceability Tag */}
                          {product.yarnUsed && (
                            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 p-2 rounded-xl text-[0.6875rem]">
                              <span className="text-slate-500 dark:text-slate-400 font-medium block text-[0.5625rem] uppercase">
                                Knitted With Ved Yarn:
                              </span>
                              <span className="text-amber-900 dark:text-amber-300 font-bold block">
                                {product.yarnUsed}
                              </span>
                            </div>
                          )}

                          {/* Description */}
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>

                          {/* Available Sizes Pills */}
                          {product.availableSizes && (
                            <div className="flex items-center gap-1.5 pt-1">
                              <span className="text-[0.625rem] font-bold text-slate-400 uppercase">Sizes:</span>
                              <div className="flex gap-1">
                                {product.availableSizes.map((sz) => (
                                  <span
                                    key={sz}
                                    className="text-[0.625rem] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700"
                                  >
                                    {sz}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Features Chips */}
                          <div className="flex flex-wrap gap-1 pt-1">
                            {product.features.slice(0, 3).map((feat, idx) => (
                              <span
                                key={idx}
                                className="text-[0.625rem] font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md"
                              >
                                • {feat}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action Bar */}
                      <div className="p-4 pt-0 space-y-2 border-t border-slate-100 dark:border-slate-800/80 mt-2">
                        <div className="flex items-center justify-between gap-2 pt-2">
                          <button
                            onClick={() => setSelectedProduct(product)}
                            className="text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white underline decoration-slate-300"
                          >
                            View Specs
                          </button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.93 }}
                            onClick={(e) => onAddToBasket(product, 50, e)}
                            id={`add-garment-basket-${product.id}`}
                            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                              isInBasket
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-red-600 dark:hover:bg-red-700'
                            }`}
                          >
                            {isInBasket ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-200" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Sample Inquiry</span>
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>

                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}

        </div>

      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToBasket={(p, qty, e) => onAddToBasket(p, qty, e)}
          onOpenAiForProduct={onOpenAiForProduct}
        />
      )}
    </div>
  );
};

