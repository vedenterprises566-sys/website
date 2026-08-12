import React from 'react';
import { motion } from 'motion/react';
import { Phone, MapPin, Mail, Globe, MessageCircle, Building2, Users, Truck } from 'lucide-react';
import { LogoGraphic } from './LogoGraphic';

export const VisitingCard: React.FC = () => {
  return (
    <section id="card-section" className="py-10 sm:py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-slate-900 dark:bg-white/10 text-white dark:text-slate-200 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[0.625rem] sm:text-[0.6875rem] font-bold uppercase tracking-widest">
            <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Contact & Business Identity</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
            Get In Touch
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto px-2">
            Connect with our managing directors for wholesale yarn inquiries, pricing, and bulk orders across India.
          </p>
        </motion.div>

        {/* Main Card — Dark Executive Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-slate-900 dark:bg-slate-800/80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/30 dark:shadow-black/40 border border-slate-800 dark:border-slate-700/60">

            {/* Card Header — Brand Identity */}
            <div className="relative px-4 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 border-b border-slate-800 dark:border-slate-700/60">
              {/* Decorative accent line */}
              <div className="absolute top-0 left-4 right-4 sm:left-6 sm:right-6 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

              <div className="flex items-center gap-3 sm:gap-5">
                <div className="bg-white/10 p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-white/10 backdrop-blur-sm shrink-0">
                  <div className="sm:hidden">
                    <LogoGraphic size="sm" showText={false} />
                  </div>
                  <div className="hidden sm:block">
                    <LogoGraphic size="lg" showText={false} />
                  </div>
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl sm:text-3xl font-black font-serif text-white tracking-tight leading-none">
                    Ved <span className="text-amber-400">Enterprises</span>
                  </h3>
                  <p className="text-slate-400 text-[0.6875rem] sm:text-sm font-semibold mt-0.5 sm:mt-1 tracking-wide">
                    Wholesale Yarn Stockist & Trader
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[0.5625rem] sm:text-[0.625rem] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 sm:px-2 py-0.5 rounded-md border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active
                    </span>
                    <span className="text-[0.5625rem] sm:text-[0.625rem] text-slate-500 font-medium">Ludhiana, Punjab — India</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Deals In Strip */}
            <div className="px-4 sm:px-8 py-2.5 sm:py-3.5 bg-slate-800/50 dark:bg-slate-700/30 border-b border-slate-800 dark:border-slate-700/60">
              <p className="text-[0.625rem] sm:text-xs text-slate-300 font-medium leading-relaxed text-center">
                <span className="text-amber-400 font-bold">Deals In:</span> Acrylic, Cotton, Polyester & Blended Yarns • Jari / Zari • Fabrics & Imported Yarns
              </p>
            </div>

            {/* Managing Directors */}
            <div className="px-4 sm:px-8 py-4 sm:py-6 space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                <span className="text-[0.625rem] sm:text-[0.6875rem] font-bold uppercase tracking-widest text-slate-400">Managing Directors</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {/* Director 1 */}
                <div className="bg-slate-800/80 dark:bg-slate-700/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-700/60 hover:border-amber-500/30 transition-colors">
                  <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 shrink-0">
                      MM
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-[0.8125rem] sm:text-sm truncate">Moni Maurya</p>
                      <p className="text-slate-400 text-[0.625rem] sm:text-[0.6875rem] font-medium">Managing Director</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="tel:7986716117"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-700/80 hover:bg-amber-500 text-slate-300 hover:text-white font-bold py-2 rounded-lg sm:rounded-xl text-[0.6875rem] sm:text-xs transition-all border border-slate-600/50 hover:border-amber-500"
                    >
                      <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>79867-16117</span>
                    </a>
                    <a
                      href="https://wa.me/917986716117?text=Hello%20Ved%20Enterprises,%20I%20have%20an%20inquiry%20regarding%20yarns."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white font-bold py-2 px-2.5 sm:px-3 rounded-lg sm:rounded-xl text-xs transition-all border border-emerald-600/30 hover:border-emerald-600"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Director 2 */}
                <div className="bg-slate-800/80 dark:bg-slate-700/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-700/60 hover:border-amber-500/30 transition-colors">
                  <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-lg shadow-slate-500/20 shrink-0">
                      SM
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-[0.8125rem] sm:text-sm truncate">Sandeep Maurya</p>
                      <p className="text-slate-400 text-[0.625rem] sm:text-[0.6875rem] font-medium">Managing Director</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="tel:8556949433"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-700/80 hover:bg-amber-500 text-slate-300 hover:text-white font-bold py-2 rounded-lg sm:rounded-xl text-[0.6875rem] sm:text-xs transition-all border border-slate-600/50 hover:border-amber-500"
                    >
                      <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>85569-49433</span>
                    </a>
                    <a
                      href="https://wa.me/918556949433?text=Hello%20Ved%20Enterprises,%20I%20have%20an%20inquiry%20regarding%20yarns."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white font-bold py-2 px-2.5 sm:px-3 rounded-lg sm:rounded-xl text-xs transition-all border border-emerald-600/30 hover:border-emerald-600"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Contact Numbers */}
            <div className="px-4 sm:px-8 py-3 sm:py-4 border-t border-slate-800 dark:border-slate-700/60 bg-slate-800/30">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                <span className="text-[0.625rem] sm:text-[0.6875rem] font-bold uppercase tracking-widest text-slate-500">Office Lines</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a href="tel:6280370497" className="inline-flex items-center justify-center gap-1.5 bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[0.6875rem] sm:text-xs transition-all border border-slate-700/50">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>62803-70497</span>
                </a>
                <a href="tel:8054586030" className="inline-flex items-center justify-center gap-1.5 bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[0.6875rem] sm:text-xs transition-all border border-slate-700/50">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>80545-86030</span>
                </a>
              </div>
            </div>

            {/* Address & Info Footer */}
            <div className="px-4 sm:px-8 py-3 sm:py-4 border-t border-slate-800 dark:border-slate-700/60 space-y-2">
              <div className="flex items-start gap-2 sm:gap-2.5">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-slate-300 text-[0.6875rem] sm:text-sm font-medium leading-relaxed">
                  # 66/2, Near Shingar Cinema, Dharampura, Ludhiana — 141008 (Punjab, India)
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-2.5">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                <a href="mailto:vedenterprises566@gmail.com" className="text-slate-300 hover:text-amber-400 text-[0.6875rem] sm:text-sm font-medium transition-colors truncate">
                  vedenterprises566@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2 sm:gap-2.5">
                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                <a href="https://www.ved.enterprises" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-amber-400 text-[0.6875rem] sm:text-sm font-medium transition-colors">
                  www.ved.enterprises
                </a>
              </div>
              <div className="flex items-center gap-2 sm:gap-2.5">
                <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                <p className="text-slate-400 text-[0.6875rem] sm:text-xs font-medium">All India Direct Dispatch & Supply</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Google Maps Embed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm">
            {/* Map Header */}
            <div className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3 border-b border-slate-200 dark:border-slate-800 gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-900 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white dark:text-amber-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">Head Office Location</h3>
                  <p className="text-[0.625rem] sm:text-[0.6875rem] text-slate-500 dark:text-slate-400 font-medium truncate">Dharampura, Ludhiana — 141008</p>
                </div>
              </div>
              <a
                href="https://maps.app.goo.gl/LKhc1zcfMGWREFB4A"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 sm:gap-1.5 bg-slate-900 dark:bg-amber-500/20 hover:bg-slate-800 dark:hover:bg-amber-500/30 text-white dark:text-amber-400 font-bold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[0.625rem] sm:text-[0.6875rem] transition-all shadow-xs shrink-0"
              >
                <MapPin className="w-3 h-3" />
                <span>Directions</span>
              </a>
            </div>

            {/* Map Embed */}
            <div className="w-full aspect-[4/3] sm:aspect-[2/1]">
              <iframe
                title="Ved Enterprises Head Office — Ludhiana"
                src="https://maps.google.com/maps?q=30.9138165,75.871582&t=&z=17&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Map Footer */}
            <div className="px-3 sm:px-5 py-2 sm:py-2.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <p className="text-[0.625rem] sm:text-[0.6875rem] text-slate-500 dark:text-slate-400 font-medium truncate">
                Near Shingar Cinema, Dharampura, Ludhiana
              </p>
              <a
                href="https://maps.app.goo.gl/LKhc1zcfMGWREFB4A"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.625rem] sm:text-[0.6875rem] text-slate-900 dark:text-amber-400 font-bold hover:underline whitespace-nowrap shrink-0"
              >
                Open in Maps →
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
