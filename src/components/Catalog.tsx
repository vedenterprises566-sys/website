import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Sparkles, Check, Plus, Eye, PackageCheck, Layers, Tag, ArrowRight, Palette, FileText, Package, RefreshCw, AlertTriangle, Image as ImageIcon, MessageSquare, ExternalLink, Shirt, Clock } from 'lucide-react';
import { Product, YarnCategory } from '../types';
import { useProducts } from '../hooks/useProducts';
import { ProductModal } from './ProductModal';
import { MediaPreviewModal, getGoogleDriveThumbnail } from './MediaPreviewModal';
import { HangingYarnThreads } from './HangingYarnThreads';
import { getProductSlug, getProductHierarchicalPath } from '../utils/productUtils';

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
  productsProp?: Product[];
  loadingProp?: boolean;
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
  productsProp,
  loadingProp,
}) => {
  const navigate = useNavigate();
  const { products: hookProducts, loading: hookLoading, error, refreshProducts } = useProducts();
  const products = productsProp || hookProducts;
  const isLoading = loadingProp !== undefined ? loadingProp : hookLoading;

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [previewMedia, setPreviewMedia] = useState<{
    isOpen: boolean;
    title: string;
    url: string;
    type: 'shade' | 'picture';
    productName?: string;
  }>({
    isOpen: false,
    title: '',
    url: '',
    type: 'picture',
  });

  // Extract unique recommended uses tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (Array.isArray(p.recommendedUses)) {
        p.recommendedUses.forEach((use) => set.add(use));
      }
    });
    return Array.from(set).slice(0, 10);
  }, [products]);

  // Main top-level section: Yarns vs Garments
  const mainSection = selectedCategory === 'garments' ? 'garments' : 'yarns';

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Top-level section filtering
      if (mainSection === 'yarns' && p.category === 'garments') {
        return false;
      }
      if (mainSection === 'garments' && p.category !== 'garments') {
        return false;
      }

      // Sub-category filter
      if (selectedCategory !== 'all' && selectedCategory !== 'garments' && p.category !== selectedCategory) {
        return false;
      }

      // Tag filter
      if (selectedTag && Array.isArray(p.recommendedUses) && !p.recommendedUses.includes(selectedTag)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (p.name || '').toLowerCase().includes(q);
        const matchesCount = (p.countOrDenier || '').toLowerCase().includes(q);
        const matchesDesc = (p.description || '').toLowerCase().includes(q);
        const matchesUses = Array.isArray(p.recommendedUses) && p.recommendedUses.some((u) => u.toLowerCase().includes(q));
        if (!matchesName && !matchesCount && !matchesDesc && !matchesUses) {
          return false;
        }
      }

      return true;
    });
  }, [products, mainSection, selectedCategory, selectedTag, searchQuery]);

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
              Yarn & Garment Catalog
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
              Explore wholesale Yarns (Fancy Yarns & China Yarns) and Finished Garments (Sweaters).
            </p>
          </div>

          {/* Quick Stats Pill */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold shadow-xs"
          >
            <span className="text-slate-500">Showing:</span>
            <span className="text-slate-900 dark:text-white font-black text-sm">{filteredProducts.length}</span>
            <span className="text-slate-500">Products</span>
          </motion.div>
        </div>

        {/* Level 1: Main Section Selector Switcher (YARNS vs GARMENTS) */}
        <div className="bg-slate-200/80 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-300 dark:border-slate-700 max-w-xl mx-auto grid grid-cols-2 gap-2 shadow-inner">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onCategoryChange('all');
              navigate('/catalog/yarns');
            }}
            id="section-tab-yarns"
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mainSection === 'yarns'
                ? 'bg-slate-900 text-white dark:bg-red-600 shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
            }`}
          >
            <Layers className="w-4 h-4 text-red-500 dark:text-amber-300" />
            <span>1. YARNS SECTION</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onCategoryChange('garments');
              navigate('/catalog/garments');
            }}
            id="section-tab-garments"
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mainSection === 'garments'
                ? 'bg-slate-900 text-white dark:bg-red-600 shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
            }`}
          >
            <Shirt className="w-4 h-4 text-amber-500 dark:text-amber-300" />
            <span>2. GARMENTS SECTION</span>
          </motion.button>
        </div>

        {/* Level 2: Sub-Category Filter Bar */}
        <div className="flex overflow-x-auto gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 scrollbar-none justify-center -mx-4 px-4 sm:mx-0 sm:px-0">
          {mainSection === 'yarns' ? (
            [
              { id: 'all', label: 'ALL YARNS', route: '/catalog/yarns' },
              { id: 'fancy', label: 'FANCY YARNS', route: '/catalog/yarns/fancy-yarns' },
              { id: 'china', label: 'CHINA YARNS', route: '/catalog/yarns/china-yarns' },
              { id: 'acrylic-blends', label: 'ACRYLIC & BLENDS', route: '/catalog/yarns/acrylic-blends' },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  onCategoryChange(tab.id as any);
                  navigate(tab.route);
                }}
                id={`cat-tab-${tab.id}`}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {tab.label}
              </motion.button>
            ))
          ) : (
            [
              { id: 'garments', label: 'SWEATERS (FINISHED SWEATERS)', route: '/catalog/garments/sweaters' },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  onCategoryChange(tab.id as any);
                  navigate(tab.route);
                }}
                id={`cat-tab-${tab.id}`}
                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all bg-red-600 text-white shadow-xs`}
              >
                {tab.label}
              </motion.button>
            ))
          )}
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
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 py-4">
            {[1, 2, 3, 4, 5, 6].map((sk) => (
              <div key={sk} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4 animate-pulse">
                <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-amber-50 dark:bg-amber-950/30 rounded-3xl border border-amber-200 dark:border-amber-900/50 p-8 space-y-3">
            <AlertTriangle className="w-10 h-10 text-amber-600 dark:text-amber-400 mx-auto" />
            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200">Catalog Refresh Notice</h3>
            <p className="text-xs text-amber-700 dark:text-amber-400 max-w-md mx-auto">{error}</p>
            <button
              onClick={() => refreshProducts(true)}
              className="inline-flex items-center gap-2 bg-amber-600 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-amber-700 transition-colors shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Try Reloading Catalog
            </button>
          </div>
        ) : mainSection === 'garments' ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 text-center max-w-3xl mx-auto my-4 relative overflow-hidden"
          >
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-xs">
              <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>Finished Sweater Collection • Coming Soon</span>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl sm:text-4xl font-extrabold font-serif text-slate-900 dark:text-white tracking-tight">
                Garment & Sweater Collection <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-amber-500 to-red-700">
                  Coming Soon
                </span>
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                We are currently preparing our exclusive wholesale showcase of finished sweaters, cardigans, turtlenecks, and knitted winterwear—crafted from Ved Enterprises' premium imported mill yarns (Vislon, Wooly, Chenille & Daffodil).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center font-bold text-xs">
                  🧥
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">Men & Ladies Sweaters</h4>
                <p className="text-[0.6875rem] text-slate-500 dark:text-slate-400 leading-relaxed">Pullovers, cardigans, cable knits, and turtlenecks in 3GG to 14GG flat knits.</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center font-bold text-xs">
                  ✨
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">Ved Quality Yarns</h4>
                <p className="text-[0.6875rem] text-slate-500 dark:text-slate-400 leading-relaxed">Knitted directly using our imported Vislon, Wooly, Chenille, and Daffodil yarns.</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center font-bold text-xs">
                  🚛
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">Ludhiana Dispatch</h4>
                <p className="text-[0.6875rem] text-slate-500 dark:text-slate-400 leading-relaxed">Direct bulk lot supply from Ludhiana knitwear manufacturing hubs across India.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://wa.me/917986716117?text=Hello%20Ved%20Enterprises,%20I%20have%20an%20inquiry%20regarding%20finished%20sweaters%20and%20knitted%20garments."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-2xl text-xs shadow-md transition-all inline-flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Direct WhatsApp Sweater Inquiry (+91 7986716117)</span>
              </a>
            </div>
          </motion.div>
        ) : filteredProducts.length === 0 ? (
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, idx) => {
                const isInBasket = inquiryItemIds.includes(product.id);
                const resolvedPhoto = product.pictureUrl
                  ? (getGoogleDriveThumbnail(product.pictureUrl) || product.pictureUrl)
                  : (product.imageUrl || product.image || '');
                const shadeTargetUrl = product.shadeUrl || product.shadeCardUrl || product.shadePdfUrl || '';
                const pictureTargetUrl = product.pictureUrl || product.imageUrl || product.image || '';

                const whatsappMsg = `Hello Ved Enterprises, I am interested in inquiring about ${product.name} (${product.countOrDenier}). Please share available bulk lots and pricing.`;
                const whatsappUrl = `https://wa.me/917986716117?text=${encodeURIComponent(whatsappMsg)}`;

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.2) }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden"
                  >
                    {/* Clean Image Container with Crawlable Link */}
                    <Link
                      to={getProductHierarchicalPath(product)}
                      className="relative h-44 w-full bg-slate-100 dark:bg-slate-800/60 overflow-hidden cursor-pointer group/img block"
                    >
                      {resolvedPhoto ? (
                        <img
                          src={resolvedPhoto}
                          alt={`${product.name} - ${product.countOrDenier} supplied by VED Enterprises`}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center justify-center p-4 text-center">
                          <Package className="w-8 h-8 text-red-500/80 mb-1" />
                          <span className="text-white font-bold text-xs font-serif truncate max-w-full px-2">{product.name}</span>
                        </div>
                      )}

                      {/* Gentle Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20" />

                      {/* Top Left Category Pill */}
                      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white font-extrabold text-[0.625rem] uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10 shadow-xs">
                        {product.categoryLabel}
                      </div>

                      {/* Top Right Shade Badge (if available) */}
                      {shadeTargetUrl ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setPreviewMedia({
                              isOpen: true,
                              title: 'Shade Card / Color Spectrum',
                              url: shadeTargetUrl,
                              type: 'shade',
                              productName: product.name,
                            });
                          }}
                          className="absolute top-3 right-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[0.625rem] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 transition-transform active:scale-95 z-10"
                          title="Click to view Shade Card"
                        >
                          🎨 Shade Card
                        </button>
                      ) : null}
                    </Link>

                    {/* Card Content Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        {/* Title & Origin */}
                        <div className="flex items-baseline justify-between gap-2">
                          <Link
                            to={getProductHierarchicalPath(product)}
                            className="text-base font-bold text-slate-900 dark:text-white font-serif group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors cursor-pointer line-clamp-1"
                          >
                            {product.name}
                          </Link>
                        </div>

                        {/* Count / Denier Pill */}
                        <div className="mt-1.5 inline-block bg-red-500/10 dark:bg-red-500/15 border border-red-500/20 text-red-700 dark:text-red-300 font-extrabold text-[0.6875rem] px-2.5 py-0.5 rounded-full">
                          {product.countOrDenier}
                        </div>

                        {/* Description */}
                        <p className="text-slate-600 dark:text-slate-300 text-xs mt-2 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Streamlined Minimalist Footer */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                        {/* Secondary Button: Details (Navigates to product detail URL) */}
                        <Link
                          to={`/catalog/${getProductSlug(product)}`}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                          id={`view-specs-${product.id}`}
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                          <span>Details</span>
                        </Link>

                        {/* Quick WhatsApp Chat Icon Button */}
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 transition-colors shrink-0"
                          title="Direct WhatsApp Inquiry"
                          id={`whatsapp-btn-${product.id}`}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </motion.a>

                        {/* Primary Button: Inquire */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.94 }}
                          onClick={(e) => onAddToBasket(product, 100, e)}
                          className={`flex-1 font-extrabold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs ${
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

      {/* Google Drive Media & Shade Card Preview Lightbox */}
      <MediaPreviewModal
        isOpen={previewMedia.isOpen}
        onClose={() => setPreviewMedia({ ...previewMedia, isOpen: false })}
        title={previewMedia.title}
        url={previewMedia.url}
        type={previewMedia.type}
        productName={previewMedia.productName}
      />
    </section>
  );
};

