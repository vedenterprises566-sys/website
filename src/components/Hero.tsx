import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, ArrowRight, X, Plus, Palette, Calculator, Package, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LogoGraphic } from './LogoGraphic';
import { Product } from '../types';
import { useProducts } from '../hooks/useProducts';
import { getProductHierarchicalPath } from '../utils/productUtils';
import { getGoogleDriveThumbnail } from './MediaPreviewModal';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onExploreCatalog: () => void;
  onOpenAi: () => void;
  onSelectCategory: (cat: string) => void;
  onAddToBasket?: (product: Product, qtyKg?: number, e?: React.MouseEvent) => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  onExploreCatalog,
  onOpenAi,
  onSelectCategory,
  onAddToBasket,
}) => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState<{ [id: string]: boolean }>({});
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close typeahead dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products for instant typeahead
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || q.length < 2) return [];
    return products
      .filter((p) => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.count && p.count.toLowerCase().includes(q)) ||
          (p.composition && p.composition.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
        );
      })
      .slice(0, 5);
  }, [products, searchQuery]);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToBasket) {
      onAddToBasket(product, 50, e);
      setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
      }, 1500);
    }
  };

  const scrollToStudio = (tab?: 'studio' | 'calculator') => {
    const studioElem = document.getElementById('yarn-studio-section');
    if (studioElem) {
      studioElem.scrollIntoView({ behavior: 'smooth' });
      if (tab) {
        window.dispatchEvent(new CustomEvent('switch-yarn-studio-tab', { detail: { tab } }));
      }
    }
  };

  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 sm:py-12 md:py-16 border border-slate-200 dark:border-slate-800 m-2.5 sm:m-6 md:m-[2.5rem] rounded-2xl sm:rounded-3xl shadow-xs">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-500/10 dark:bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          
          {/* Main Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-4 sm:space-y-6"
          >
            
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-start sm:items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-full px-3 sm:px-4 py-1.5 sm:py-1 text-slate-700 dark:text-slate-300 font-semibold shadow-xs max-w-full"
            >
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0 mt-1 sm:mt-0" />
              <span className="uppercase tracking-wider font-bold text-[0.625rem] sm:text-[0.6875rem] text-slate-800 dark:text-slate-200 leading-normal">
                Wholesale Yarn, Winter Garment & Unstitched Fabrics Retailers
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
              <span className="text-slate-600 dark:text-slate-400 text-[0.6875rem] hidden sm:inline whitespace-nowrap">
                Ludhiana, Punjab, India
              </span>
            </motion.div>

            {/* Main Title with Clean Accent */}
            <div className="space-y-4">
              {/* Sub-headline badge */}
              <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-slate-200 dark:border-slate-700 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-red-500 animate-pulse"></span>
                <span>Retailer of Knitting & Weaving Yarns</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                Retailer of Knitting & Weaving Yarns <br />
                <span className="text-slate-900 dark:text-red-600 font-extrabold italic">
                  Across India
                </span>
              </h1>
              <p className="text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm tracking-wide uppercase">
                VED Enterprises — B2B Wholesale Trading & Nationwide Supply from Ludhiana, Punjab
              </p>
            </div>

            {/* Description */}
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:base max-w-2xl font-normal leading-relaxed">
              VED Enterprises is a premier <b>yarn trader and bulk yarn supplier serving textile businesses and garment manufacturers across India</b>. We supply Fancy Yarns, China Imported Yarns, Cotton Yarns, Acrylic Blends, and Fabrics with fast dispatch to Ludhiana, Surat, Tirupur, Ahmedabad, Kolkata, and nationwide hubs.
            </p>

            {/* Interactive Typeahead Search Input Bar */}
            <div className="pt-2 max-w-xl relative" ref={searchContainerRef}>
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 sm:left-4 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search e.g. '2/48 Vislon', 'Chenille', 'Tweed'..."
                  className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 pl-10 sm:pl-11 pr-24 sm:pr-28 py-3 sm:py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/50 text-base sm:text-sm shadow-xs transition-shadow duration-200"
                  id="hero-search-input"
                  autoComplete="off"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-24 sm:right-28 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onExploreCatalog}
                  className="absolute right-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-red-600 dark:hover:bg-red-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Explore
                </motion.button>
              </div>

              {/* Live Instant Typeahead Dropdown */}
              <AnimatePresence>
                {isSearchFocused && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-50 divide-y divide-slate-100 dark:divide-slate-800"
                  >
                    <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-[0.6875rem] font-bold text-slate-500 uppercase tracking-wider">
                      <span>Matching Products ({searchResults.length})</span>
                      <button
                        onClick={onExploreCatalog}
                        className="text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                      >
                        View in Catalog <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    {searchResults.map((item) => {
                      const thumb = getGoogleDriveThumbnail(item.pictureUrl);
                      const isAdded = !!addedItemIds[item.id];
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            navigate(getProductHierarchicalPath(item));
                            setIsSearchFocused(false);
                          }}
                          className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                              {thumb ? (
                                <img
                                  src={thumb}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <Package className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                {item.count && (
                                  <span className="text-[0.625rem] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-mono font-bold">
                                    {item.count}
                                  </span>
                                )}
                                <span className="text-[0.625rem] text-slate-500 truncate">
                                  {item.composition || item.category}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleQuickAdd(item, e)}
                            className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                              isAdded
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-red-50 dark:bg-red-950/40 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 dark:border-red-900/50'
                            }`}
                            title="Add to Inquiry Basket"
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Interactive Tool Pills */}
            <div className="flex items-center gap-1.5 pt-1 text-xs text-slate-600 dark:text-slate-400 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
              <span className="font-semibold py-1 text-slate-400 whitespace-nowrap text-[0.6875rem]">Tools & Popular:</span>

              {/* Interactive 3D Studio Quick Link */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToStudio('studio')}
                className="bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold px-3 py-1 rounded-lg text-[0.6875rem] sm:text-xs whitespace-nowrap shadow-xs hover:shadow-red-500/20 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Palette className="w-3 h-3 text-amber-300" />
                <span>3D Yarn Studio</span>
              </motion.button>

              {/* Count & Yield Estimator Quick Link */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToStudio('calculator')}
                className="bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-lg text-[0.6875rem] sm:text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Calculator className="w-3 h-3 text-red-500" />
                <span>Count Calculator</span>
              </motion.button>

              {[
                { label: '👕 Winter Wear', cat: 'garments' },
                { label: 'Fancy Yarns', cat: 'fancy' },
                { label: 'China Vislon & Wooly', cat: 'china' },
                { label: 'Chenille & Hair', cat: 'china' },
                { label: 'Acrylic Blends', cat: 'acrylic-blends' },
              ].map((item, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onSelectCategory(item.cat);
                    onExploreCatalog();
                  }}
                  className="bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg text-[0.6875rem] sm:text-xs font-medium whitespace-nowrap transition-colors cursor-pointer"
                >
                  {item.label}
                </motion.button>
              ))}
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onExploreCatalog}
                id="hero-explore-catalog-btn"
                className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3.5 sm:py-3 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-sm w-full sm:w-auto"
              >
                <span>Browse Yarn Catalog</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenAi}
                id="hero-ai-assist-btn"
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 font-bold px-6 py-3.5 sm:py-3 rounded-xl text-xs sm:text-sm transition-all w-full sm:w-auto"
              >
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
                <span>Ask AI Specialist</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Right Showcase Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 flex flex-col items-center justify-center"
          >
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5"
            >
              
              {/* Card Header */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <LogoGraphic size="lg" showText={false} />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
                    VED ENTERPRISES
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    National Yarn Trading House
                  </p>
                  <p className="text-[0.6875rem] text-red-600 font-bold mt-0.5">
                    Ludhiana • Punjab • All India Supply
                  </p>
                </div>
              </div>

              {/* Quick Feature Stats Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { value: '20+ Qualities', label: 'Yarns & Deniers' },
                  { value: '6 Major Mills', label: 'Quality Yarns Stocked' },
                  { value: 'Pan India', label: 'Direct Dispatch' },
                  { value: 'Sample Hanks', label: 'Delivered to Hubs' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 transition-all"
                  >
                    <div className="text-slate-900 dark:text-white font-bold text-base">{stat.value}</div>
                    <div className="text-slate-500 dark:text-slate-400 text-[0.6875rem]">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Direct Leadership Contact Bar */}
              <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-amber-400 text-[0.625rem] uppercase font-bold tracking-wider">Managing Directors</p>
                  <span className="text-[0.625rem] text-slate-400 font-semibold">Ved Enterprises Leadership</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60 flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold text-xs">Moni Maurya</p>
                      <p className="text-amber-300 font-medium text-[0.6875rem]">Mob: +91 7986716117</p>
                    </div>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="tel:7986716117"
                      className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded-md font-bold text-[0.625rem] uppercase tracking-wider transition-colors shadow-xs"
                    >
                      Call
                    </motion.a>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60 flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold text-xs">Sandeep Maurya</p>
                      <p className="text-amber-300 font-medium text-[0.6875rem]">Mob: +91 8556949433</p>
                    </div>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="tel:8556949433"
                      className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded-md font-bold text-[0.625rem] uppercase tracking-wider transition-colors shadow-xs"
                    >
                      Call
                    </motion.a>
                  </div>
                </div>
              </div>

            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};


