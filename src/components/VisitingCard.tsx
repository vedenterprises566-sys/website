import React from 'react';
import { motion } from 'motion/react';
import { Phone, MapPin, Mail, Globe, MessageCircle, Building2, Users, Truck, Navigation, ExternalLink } from 'lucide-react';
import { LogoGraphic } from './LogoGraphic';

const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/QHHmjVPipA1LVwP48';
const MAP_EMBED_SRC = 'https://maps.google.com/maps?q=30.9138122,75.8714897&t=&z=17&ie=UTF8&iwloc=&output=embed';

export const VisitingCard: React.FC = () => {
  return (
    <section id="card-section" className="py-8 sm:py-16 md:py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}
      />

      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-10 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto space-y-2"
        >
          <div className="inline-flex items-center gap-1.5 bg-slate-900 dark:bg-white/10 text-white dark:text-slate-200 px-3 py-1 rounded-full text-[0.625rem] sm:text-[0.6875rem] font-bold uppercase tracking-widest">
            <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
            <span>Contact & Business Identity</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
            Get In Touch
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
            Connect with our managing directors for wholesale yarn inquiries, pricing, and bulk orders across India.
          </p>
        </motion.div>

        {/* Main Card — Executive Visiting Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto w-full"
        >
          <div className="bg-slate-900 dark:bg-slate-800/90 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl shadow-slate-900/25 dark:shadow-black/50 border border-slate-800 dark:border-slate-700/60">

            {/* Card Header — Brand Identity */}
            <div className="relative px-4 sm:px-8 pt-5 sm:pt-8 pb-4 sm:pb-6 border-b border-slate-800 dark:border-slate-700/60">
              {/* Accent line */}
              <div className="absolute top-0 left-4 right-4 sm:left-6 sm:right-6 h-[2px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

              <div className="flex items-center gap-3 sm:gap-5">
                <div className="shrink-0">
                  <div className="sm:hidden">
                    <LogoGraphic size="sm" showText={false} />
                  </div>
                  <div className="hidden sm:block">
                    <LogoGraphic size="lg" showText={false} />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black font-serif text-white tracking-tight leading-none truncate">
                    Ved <span className="text-amber-400">Enterprises</span>
                  </h3>
                  <p className="text-slate-300 dark:text-slate-400 text-[0.6875rem] sm:text-sm font-semibold mt-1 tracking-wide truncate">
                    Wholesale Yarn Stockist & Trader
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[0.5625rem] sm:text-[0.625rem] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active Pan-India
                    </span>
                    <span className="text-[0.625rem] text-slate-400 font-medium truncate">Ludhiana, Punjab — India</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Deals In Strip */}
            <div className="px-4 sm:px-8 py-2.5 sm:py-3 bg-slate-800/60 dark:bg-slate-700/40 border-b border-slate-800 dark:border-slate-700/60">
              <p className="text-[0.6875rem] sm:text-xs text-slate-200 font-medium leading-relaxed text-center">
                <span className="text-amber-400 font-bold">Deals In:</span> Acrylic, Cotton, Polyester & Blended Yarns • Jari / Zari • Fabrics & Imported Yarns
              </p>
            </div>

            {/* Quick 1-Tap Mobile Actions */}
            <div className="px-4 sm:px-8 pt-4 pb-1 grid grid-cols-2 gap-2 sm:hidden">
              <a
                href="tel:7986716117"
                className="flex items-center justify-center gap-1.5 bg-red-600 active:bg-red-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-sm active:scale-[0.98] transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call MD Moni</span>
              </a>
              <a
                href="https://wa.me/917986716117?text=Hello%20Ved%20Enterprises,%20I%20have%20an%20inquiry%20regarding%20yarns."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-emerald-600 active:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-sm active:scale-[0.98] transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Managing Directors */}
            <div className="px-4 sm:px-8 py-4 sm:py-6 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[0.625rem] sm:text-[0.6875rem] font-bold uppercase tracking-widest text-slate-400">Managing Directors</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {/* Director 1 */}
                <div className="bg-slate-800/80 dark:bg-slate-700/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-700/60 hover:border-amber-500/30 transition-colors">
                  <div className="flex items-center gap-3 mb-2.5 sm:mb-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 shrink-0">
                      MM
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-bold text-sm truncate">Moni Maurya</p>
                      <p className="text-slate-400 text-xs font-medium">Managing Director</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="tel:7986716117"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-700/90 active:bg-amber-500 hover:bg-amber-500 text-slate-200 hover:text-white font-bold py-2.5 sm:py-2 rounded-xl text-xs transition-all border border-slate-600/50 hover:border-amber-500 active:scale-[0.98]"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-400 hover:text-white" />
                      <span>79867-16117</span>
                    </a>
                    <a
                      href="https://wa.me/917986716117?text=Hello%20Ved%20Enterprises,%20I%20have%20an%20inquiry%20regarding%20yarns."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-emerald-600/20 active:bg-emerald-600 hover:bg-emerald-600 text-emerald-400 hover:text-white font-bold py-2.5 sm:py-2 px-3 rounded-xl text-xs transition-all border border-emerald-600/30 hover:border-emerald-600 active:scale-[0.98]"
                      aria-label="WhatsApp Moni Maurya"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Director 2 */}
                <div className="bg-slate-800/80 dark:bg-slate-700/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-700/60 hover:border-amber-500/30 transition-colors">
                  <div className="flex items-center gap-3 mb-2.5 sm:mb-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-md shadow-slate-500/20 shrink-0">
                      SM
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-bold text-sm truncate">Sandeep Maurya</p>
                      <p className="text-slate-400 text-xs font-medium">Managing Director</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="tel:8556949433"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-700/90 active:bg-amber-500 hover:bg-amber-500 text-slate-200 hover:text-white font-bold py-2.5 sm:py-2 rounded-xl text-xs transition-all border border-slate-600/50 hover:border-amber-500 active:scale-[0.98]"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-400 hover:text-white" />
                      <span>85569-49433</span>
                    </a>
                    <a
                      href="https://wa.me/918556949433?text=Hello%20Ved%20Enterprises,%20I%20have%20an%20inquiry%20regarding%20yarns."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-emerald-600/20 active:bg-emerald-600 hover:bg-emerald-600 text-emerald-400 hover:text-white font-bold py-2.5 sm:py-2 px-3 rounded-xl text-xs transition-all border border-emerald-600/30 hover:border-emerald-600 active:scale-[0.98]"
                      aria-label="WhatsApp Sandeep Maurya"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Contact Numbers */}
            <div className="px-4 sm:px-8 py-3 sm:py-4 border-t border-slate-800 dark:border-slate-700/60 bg-slate-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-3 h-3 text-slate-400" />
                <span className="text-[0.625rem] sm:text-[0.6875rem] font-bold uppercase tracking-widest text-slate-400">Direct Office Lines</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="tel:6280370497"
                  className="inline-flex items-center justify-center gap-1.5 bg-slate-800/70 active:bg-slate-700 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold py-2.5 sm:py-2 rounded-xl text-xs transition-all border border-slate-700/60 active:scale-[0.98]"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>62803-70497</span>
                </a>
                <a
                  href="tel:8054586030"
                  className="inline-flex items-center justify-center gap-1.5 bg-slate-800/70 active:bg-slate-700 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold py-2.5 sm:py-2 rounded-xl text-xs transition-all border border-slate-700/60 active:scale-[0.98]"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>80545-86030</span>
                </a>
              </div>
            </div>

            {/* Address & Info Footer — Interactive on Mobile */}
            <div className="px-4 sm:px-8 py-3 sm:py-4 border-t border-slate-800 dark:border-slate-700/60 space-y-2.5">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 group hover:text-amber-400 transition-colors"
              >
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 group-hover:text-amber-300 text-xs sm:text-sm font-medium leading-relaxed">
                    # 66/2, Near Shingar Cinema, Dharampura, Ludhiana — 141008 (Punjab, India)
                  </p>
                  <span className="text-[0.625rem] text-amber-400/80 font-bold inline-flex items-center gap-1 mt-0.5">
                    Tap to open in Google Maps <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>
              </a>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href="mailto:vedenterprises566@gmail.com"
                  className="text-slate-300 hover:text-amber-400 text-xs sm:text-sm font-medium transition-colors truncate"
                >
                  vedenterprises566@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href="https://www.ved.enterprises"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-amber-400 text-xs sm:text-sm font-medium transition-colors"
                >
                  www.ved.enterprises
                </a>
              </div>

              <div className="flex items-center gap-2.5 pt-0.5">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <p className="text-slate-400 text-[0.6875rem] sm:text-xs font-medium">All India Direct Dispatch & Bulk Supply</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Google Maps Card — Optimized for Mobile Touch & Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto w-full"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            {/* Map Header */}
            <div className="flex items-center justify-between px-3 sm:px-5 py-3 border-b border-slate-200 dark:border-slate-800 gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-white dark:text-amber-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">Head Office Location</h3>
                  <p className="text-[0.625rem] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate">Dharampura, Ludhiana — 141008</p>
                </div>
              </div>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-2 rounded-xl text-xs transition-all shadow-xs shrink-0 active:scale-95"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Directions</span>
              </a>
            </div>

            {/* Map Embed Container */}
            <div className="w-full h-56 sm:h-72 md:h-80 relative bg-slate-100 dark:bg-slate-800">
              <iframe
                title="Ved Enterprises Head Office — Ludhiana"
                src={MAP_EMBED_SRC}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Map Footer with 1-Tap Google Maps App Button */}
            <div className="px-3 sm:px-5 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-800/70 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-[0.6875rem] text-slate-600 dark:text-slate-300 font-medium text-center sm:text-left truncate w-full sm:w-auto">
                Near Shingar Cinema, Dharampura, Ludhiana
              </p>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-1 text-xs text-red-600 dark:text-amber-400 font-extrabold hover:underline py-1"
              >
                <span>Open in Google Maps App</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

