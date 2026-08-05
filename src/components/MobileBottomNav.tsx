import React from 'react';
import { motion } from 'motion/react';
import { Home, Layers, ShoppingBag, Sparkles, Shirt, CreditCard } from 'lucide-react';

interface MobileBottomNavProps {
  currentPage: 'home' | 'catalog' | 'basket' | 'garments';
  activeSection: string;
  basketCount: number;
  onNavigate: (sectionId: string) => void;
  onOpenAi: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  activeSection,
  basketCount,
  onNavigate,
  onOpenAi,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-1.5 px-2 md:hidden shadow-lg pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Home */}
        <button
          onClick={() => onNavigate('hero')}
          className={`flex flex-col items-center justify-center min-h-[2.75rem] px-2 rounded-xl transition-all ${
            currentPage === 'home' && (activeSection === 'hero' || !activeSection)
              ? 'text-red-600 dark:text-red-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          id="mobile-bottom-nav-home"
        >
          <Home className="w-5 h-5" />
          <span className="text-[0.625rem] mt-0.5 font-semibold tracking-tight">Home</span>
        </button>

        {/* Sweaters (Garments) */}
        <button
          onClick={() => onNavigate('garments')}
          className={`flex flex-col items-center justify-center min-h-[2.75rem] px-2 rounded-xl transition-all ${
            currentPage === 'garments' || activeSection === 'garments'
              ? 'text-red-600 dark:text-red-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          id="mobile-bottom-nav-sweaters"
        >
          <Shirt className="w-5 h-5 text-amber-500" />
          <span className="text-[0.625rem] mt-0.5 font-semibold tracking-tight">Sweaters</span>
        </button>

        {/* Catalog */}
        <button
          onClick={() => onNavigate('catalog')}
          className={`flex flex-col items-center justify-center min-h-[2.75rem] px-2 rounded-xl transition-all ${
            currentPage === 'catalog' || activeSection === 'catalog'
              ? 'text-red-600 dark:text-red-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          id="mobile-bottom-nav-catalog"
        >
          <Layers className="w-5 h-5" />
          <span className="text-[0.625rem] mt-0.5 font-semibold tracking-tight">Yarn Catalog</span>
        </button>

        {/* Inquiry Basket (Page) */}
        <button
          onClick={() => onNavigate('basket')}
          className={`relative flex flex-col items-center justify-center min-h-[2.75rem] px-2 rounded-xl transition-all ${
            currentPage === 'basket'
              ? 'text-red-600 dark:text-red-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          id="mobile-bottom-nav-basket"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {basketCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: [1.2, 1] }}
                className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[0.5625rem] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-slate-900 shadow-xs"
              >
                {basketCount}
              </motion.span>
            )}
          </div>
          <span className="text-[0.625rem] mt-0.5 font-semibold tracking-tight whitespace-nowrap">Basket</span>
        </button>

        {/* AI Assist */}
        <button
          onClick={onOpenAi}
          className="flex flex-col items-center justify-center min-h-[2.75rem] px-2 rounded-xl text-amber-600 dark:text-amber-400 font-medium hover:text-amber-500 transition-all"
          id="mobile-bottom-nav-ai"
        >
          <div className="p-0.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/80">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
          </div>
          <span className="text-[0.625rem] mt-0.5 font-extrabold tracking-tight">AI Assist</span>
        </button>

      </div>
    </div>
  );
};
