import React from 'react';
import { motion } from 'motion/react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { LogoGraphic } from './LogoGraphic';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onExploreCatalog: () => void;
  onOpenAi: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  onExploreCatalog,
  onOpenAi,
  onSelectCategory,
}) => {
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
              className="inline-flex flex-wrap items-center gap-1.5 sm:gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-3 sm:px-4 py-1 text-[0.6875rem] text-slate-700 dark:text-slate-300 font-semibold shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0" />
              <span className="uppercase tracking-wider font-bold text-[0.625rem] sm:text-[0.6875rem] text-slate-800 dark:text-slate-200">Wholesale Yarn & Fabric Trader</span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
              <span className="text-slate-600 dark:text-slate-400 hidden sm:inline">Ludhiana, Punjab</span>
            </motion.div>

            {/* Main Title with Clean Accent */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center">
                <motion.span
                  initial={{ height: 0 }}
                  animate={{ height: 40 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="w-1.5 bg-slate-900 dark:bg-red-600 mr-2.5 rounded-full hidden sm:block"
                />
                <h1 className="text-2xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white font-serif leading-tight">
                  VED <span className="text-red-600">ENTERPRISES</span>
                </h1>
              </div>
              <p className="text-base sm:text-2xl font-bold text-slate-700 dark:text-slate-300 font-sans tracking-tight leading-snug">
                Fancy & China Yarn Distributors for All India Textile Industry
              </p>
            </div>

            {/* Description */}
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-base max-w-2xl font-normal leading-relaxed">
              Authorised trade partner for India's premier spinning mills. Direct supply of <b>Vislon, Lurex, Wooly, Chenille, Eyelash Hair Yarns, Stretch, and Blended Yarns</b> directly to garment manufacturers and weavers nationwide.
            </p>

            {/* Search Input Bar */}
            <div className="pt-2 max-w-xl">
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 sm:left-4 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search e.g. '2/48 Vislon', 'Chenille'..."
                  className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 pl-10 sm:pl-11 pr-24 sm:pr-28 py-3 sm:py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-red-500 text-xs sm:text-sm shadow-xs transition-shadow duration-200"
                  id="hero-search-input"
                />
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onExploreCatalog}
                  className="absolute right-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-red-600 dark:hover:bg-red-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Explore
                </motion.button>
              </div>
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex items-center gap-1.5 pt-1 text-xs text-slate-600 dark:text-slate-400 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
              <span className="font-semibold py-1 text-slate-400 whitespace-nowrap text-[0.6875rem]">Popular:</span>
              {[
                { label: '👕 Sweaters (Garments)', cat: 'garments' },
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
                  className="bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg text-[0.6875rem] sm:text-xs font-medium whitespace-nowrap transition-colors"
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
                  { value: '6 Major Mills', label: 'Authorised Partner' },
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


