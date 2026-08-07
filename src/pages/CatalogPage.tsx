import React from 'react';
import { motion } from 'motion/react';
import { Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Catalog } from '../components/Catalog';
import { Product, YarnCategory } from '../types';

interface CatalogPageProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: YarnCategory | 'all';
  onCategoryChange: (cat: YarnCategory | 'all') => void;
  onAddToBasket: (product: Product, qtyKg?: number, event?: React.MouseEvent) => void;
  onOpenAiForProduct: (productName: string) => void;
  onOpenShadesModal: (product?: Product) => void;
  inquiryItemIds: string[];
  onGoToBasket: () => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
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
  return (
    <motion.div
      key="catalog"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Top Page Header Banner for Catalog */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white py-8 sm:py-10 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5 font-medium">
              <Link to="/" className="hover:text-amber-300 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-amber-400 font-bold">Yarn Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-serif text-white flex items-center gap-3">
              <Layers className="w-7 h-7 sm:w-8 sm:h-8 text-red-500 shrink-0" />
              Yarn Catalog & Swatch Directory
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl font-normal leading-relaxed">
              Explore our complete inventory of Cotton, Fancy & China Yarns. Filter by count, category, or tag and add sample requests directly to your Inquiry Basket.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 shrink-0"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Standalone Product Catalog Component */}
      <Catalog
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        onAddToBasket={onAddToBasket}
        onOpenAiForProduct={onOpenAiForProduct}
        onOpenShadesModal={onOpenShadesModal}
        inquiryItemIds={inquiryItemIds}
        onGoToBasket={onGoToBasket}
      />
    </motion.div>
  );
};
