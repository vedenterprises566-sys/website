import React from 'react';
import { motion } from 'motion/react';
import { Home, Layers, ShoppingBag, Sparkles } from 'lucide-react';

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
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/98 dark:bg-slate-900/98 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 md:hidden shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      {/* Amber accent line at top */}
      <div className="h-[2px] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />

      <div className="flex items-center justify-around max-w-sm mx-auto px-2 py-1 pb-[calc(0.25rem+env(safe-area-inset-bottom))]">
        
        {/* Home */}
        <button
          onClick={() => onNavigate('hero')}
          className={`flex flex-col items-center justify-center min-w-[3.5rem] min-h-[2.75rem] px-1.5 rounded-xl transition-all active:scale-95 ${
            currentPage === 'home' && (activeSection === 'hero' || !activeSection)
              ? 'text-red-600 dark:text-red-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
          id="mobile-bottom-nav-home"
        >
          <Home className="w-[1.2rem] h-[1.2rem]" />
          <span className="text-[0.6rem] mt-0.5 font-semibold tracking-tight leading-none">Home</span>
        </button>

        {/* Catalog */}
        <button
          onClick={() => onNavigate('catalog')}
          className={`flex flex-col items-center justify-center min-w-[3.5rem] min-h-[2.75rem] px-1.5 rounded-xl transition-all active:scale-95 ${
            currentPage === 'catalog' || activeSection === 'catalog'
              ? 'text-red-600 dark:text-red-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
          id="mobile-bottom-nav-catalog"
        >
          <Layers className="w-[1.2rem] h-[1.2rem]" />
          <span className="text-[0.6rem] mt-0.5 font-semibold tracking-tight leading-none">Catalog</span>
        </button>

        {/* Inquiry Basket — center elevated */}
        <button
          onClick={() => onNavigate('basket')}
          className={`relative flex flex-col items-center justify-center min-w-[3.5rem] min-h-[2.75rem] px-1.5 rounded-xl transition-all active:scale-95 ${
            currentPage === 'basket'
              ? 'text-red-600 dark:text-red-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
          id="mobile-bottom-nav-basket"
        >
          <div className="relative">
            <ShoppingBag className="w-[1.2rem] h-[1.2rem]" />
            {basketCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: [1.2, 1] }}
                className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[0.5rem] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border-[1.5px] border-white dark:border-slate-900 shadow-xs"
              >
                {basketCount}
              </motion.span>
            )}
          </div>
          <span className="text-[0.6rem] mt-0.5 font-semibold tracking-tight leading-none">Basket</span>
        </button>

        {/* AI Assist */}
        <button
          onClick={onOpenAi}
          className="flex flex-col items-center justify-center min-w-[3.5rem] min-h-[2.75rem] px-1.5 rounded-xl text-amber-600 dark:text-amber-400 font-medium transition-all active:scale-95"
          id="mobile-bottom-nav-ai"
        >
          <div className="p-[3px] rounded-md bg-gradient-to-br from-amber-400 to-amber-600">
            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
          </div>
          <span className="text-[0.6rem] mt-0.5 font-extrabold tracking-tight leading-none">AI Assist</span>
        </button>

      </div>
    </div>
  );
};
