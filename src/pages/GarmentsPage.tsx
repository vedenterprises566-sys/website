import React from 'react';
import { motion } from 'motion/react';
import { Shirt, Clock, ArrowLeft, Sparkles, Phone, MessageSquare, ShieldCheck, Layers, Award } from 'lucide-react';
import { HangingYarnThreads } from '../components/HangingYarnThreads';

interface GarmentsPageProps {
  onBackToHome: () => void;
  onOpenAi: () => void;
}

export const GarmentsPage: React.FC<GarmentsPageProps> = ({
  onBackToHome,
  onOpenAi,
}) => {
  return (
    <div className="py-8 sm:py-16 bg-slate-50 dark:bg-slate-950 min-h-screen relative overflow-hidden flex flex-col justify-center items-center">
      {/* Decorative Hanging Yarn Threads */}
      <HangingYarnThreads variant="banner" className="top-0 opacity-70" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10 text-center w-full">
        {/* Navigation Back Button */}
        <div className="flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Main Yarn Catalog</span>
          </motion.button>
        </div>

        {/* Coming Soon Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-14 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 relative overflow-hidden"
        >
          {/* Background Decorative Icon */}
          <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none">
            <Shirt className="w-80 h-80 text-slate-900 dark:text-white" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-xs">
            <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>Finished Sweater Collection • Launching Soon</span>
          </div>

          {/* Title */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black font-serif text-slate-900 dark:text-white tracking-tight leading-tight">
              Garments & Sweater Showcase <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-amber-500 to-red-700">
                Coming Soon
              </span>
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              We are currently preparing our exclusive wholesale showcase of finished sweaters, cardigans, turtlenecks, and knitted winterwear—crafted from Ved Enterprises' premium imported mill yarns.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2">
              <div className="w-9 h-9 bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center font-bold">
                <Shirt className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Full Sweater Range
              </h4>
              <p className="text-[0.6875rem] text-slate-500 dark:text-slate-400 leading-relaxed">
                Men's pullovers, ladies cardigans, cable knits, and kidswear in 3GG to 14GG flat knits.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2">
              <div className="w-9 h-9 bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                 Ved Quality Yarns
              </h4>
              <p className="text-[0.6875rem] text-slate-500 dark:text-slate-400 leading-relaxed">
                Knitted directly using our imported Vislon, Wooly, Chenille, and Daffodil acrylic yarns.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2">
              <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Direct Mill Wholesale
              </h4>
              <p className="text-[0.6875rem] text-slate-500 dark:text-slate-400 leading-relaxed">
                Bulk lot supply directly from Ludhiana knitwear manufacturing hubs for distributors.
              </p>
            </div>
          </div>

          {/* Direct WhatsApp / Phone Contact Action */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Have an urgent finished sweater order requirement?
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://wa.me/917986716117?text=Hello%20Ved%20Enterprises,%20I%20have%20an%20inquiry%20regarding%20finished%20sweaters%20and%20knitted%20garments."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Moni Maurya (7986716117)</span>
              </a>

              <a
                href="https://wa.me/918556949433?text=Hello%20Ved%20Enterprises,%20I%20have%20an%20inquiry%20regarding%20finished%20sweaters%20and%20knitted%20garments."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-900 hover:bg-slate-800 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Contact Sandeep Maurya (8556949433)</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
