import React from 'react';
import { motion } from 'motion/react';
import { Phone, MapPin, Copy, Check, Share2, Truck } from 'lucide-react';
import { LogoGraphic } from './LogoGraphic';
import { HangingYarnThreads } from './HangingYarnThreads';

export const VisitingCard: React.FC = () => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyCardInfo = () => {
    const cardText = `
VED ENTERPRISES
Deals In: All Types of Acrylic Cotton, Polyester & Blended Yarns, Jari/Zari, Fabrics & Imported Yarns.
Address: # 66/2, Near Shingar Cinema, Dharampura, Ludhiana - 141008 (Punjab, India)
Managing Directors: Moni Maurya (Mob: 7986716117), Sandeep Maurya (Mob: 8556949433)
Contacts: 85569-49433, 62803-70497, 80545-86030
    `.trim();

    navigator.clipboard.writeText(cardText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="card-section" className="py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 m-4 sm:m-[2.5rem] rounded-3xl shadow-sm relative overflow-hidden">
      {/* Decorative Hanging Threads */}
      <HangingYarnThreads variant="banner" className="top-0 opacity-70" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto space-y-2"
        >
          <div className="flex items-center justify-center">
            <span className="w-1 h-5 bg-slate-900 dark:bg-red-600 mr-2 rounded-full inline-block"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200">
              Official Trade Identity
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
            Digital Visiting Card
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
            Save or share company details, Ludhiana address, and executive contact numbers.
          </p>
        </motion.div>

        {/* Replica Digital Card Component */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="max-w-xl mx-auto bg-red-600 text-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-amber-400 relative"
        >
          
          {/* Top Bar: Phones & GSTIN */}
          <div className="bg-red-700 px-3 sm:px-6 py-2 sm:py-3 flex flex-col xs:flex-row items-center justify-between gap-1 sm:gap-2 text-xs sm:text-sm font-black border-b border-red-800">
            <div className="flex items-center gap-1.5 text-amber-200 text-[0.6875rem] sm:text-sm">
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
              <span>Contact: 85569-49433, 62803-70497</span>
            </div>
            <div className="text-amber-100 uppercase tracking-wider font-bold text-[0.625rem] sm:text-xs">
              GSTIN: Available
            </div>
          </div>

          {/* Main Name & Emblem Banner */}
          <div className="bg-red-600 p-3 sm:p-6 flex items-center justify-between gap-2.5 sm:gap-4">
            
            {/* Emblem Box */}
            <div className="bg-amber-50 p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl border-2 border-slate-900 flex-shrink-0 shadow-md">
              <div className="sm:hidden">
                <LogoGraphic size="sm" showText={false} />
              </div>
              <div className="hidden sm:block">
                <LogoGraphic size="lg" showText={false} />
              </div>
            </div>

            {/* VED ENTERPRISES Bold Yellow Display Title */}
            <div className="flex-1 text-center min-w-0">
              <h1 className="text-2xl sm:text-5xl font-black text-amber-300 tracking-wider font-serif drop-shadow-[0_0.125rem_0.125rem_rgba(0,0,0,0.8)] sm:drop-shadow-[0_0.1875rem_0.1875rem_rgba(0,0,0,0.8)] leading-tight">
                VED
              </h1>
              <div className="bg-blue-950 text-white text-[0.6875rem] sm:text-2xl font-black tracking-wider sm:tracking-widest py-0.5 sm:py-1 px-1.5 sm:px-3 mt-0.5 sm:mt-1 rounded-md sm:rounded-lg uppercase shadow-inner border border-blue-900 truncate">
                ENTERPRISES
              </div>
            </div>

          </div>

          {/* Deals In Bar 1 */}
          <div className="bg-red-700 text-white font-extrabold text-[0.625rem] sm:text-sm px-3 sm:px-6 py-2 sm:py-2.5 text-center border-t border-b border-red-800 leading-snug">
            Deals In: All Types of Acrylic Cotton, Polyester & their Blended Yarns, All Types of Jari / Zari etc.
          </div>

          {/* Deals In Bar 2 (Yellow Band) */}
          <div className="bg-amber-300 text-slate-950 font-black text-[0.625rem] sm:text-sm px-3 sm:px-6 py-2 sm:py-2.5 text-center border-b border-amber-400 leading-snug">
            Deals In: All Types of Fabrics & Imported Yarns
          </div>

          {/* Managing Director & Leadership Bar */}
          <div className="bg-slate-950 text-amber-300 px-3 sm:px-6 py-2.5 sm:py-3.5 border-b border-slate-800 space-y-2">
            <span className="text-amber-400 text-[0.5625rem] sm:text-[0.625rem] block uppercase font-black tracking-wider">
              Managing Directors
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold">
              <div className="flex items-center justify-between bg-slate-900 p-2 rounded-xl border border-slate-800">
                <div>
                  <span className="text-white text-xs sm:text-sm font-extrabold tracking-wide block">MONI MAURYA</span>
                  <span className="text-amber-300 text-[0.6875rem]">79867-16117</span>
                </div>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="tel:7986716117"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-2 sm:px-3 py-1 rounded-lg font-black text-[0.625rem] sm:text-xs transition-colors flex items-center gap-1 shrink-0 shadow-xs"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call</span>
                </motion.a>
              </div>

              <div className="flex items-center justify-between bg-slate-900 p-2 rounded-xl border border-slate-800">
                <div>
                  <span className="text-white text-xs sm:text-sm font-extrabold tracking-wide block">SANDEEP MAURYA</span>
                  <span className="text-amber-300 text-[0.6875rem]">85569-49433</span>
                </div>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="tel:8556949433"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-2 sm:px-3 py-1 rounded-lg font-black text-[0.625rem] sm:text-xs transition-colors flex items-center gap-1 shrink-0 shadow-xs"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call</span>
                </motion.a>
              </div>
            </div>
          </div>

          {/* Address Footer Bar */}
          <div className="bg-red-800 text-white text-[0.6875rem] sm:text-sm font-bold p-3 sm:p-4 text-center flex items-center justify-center gap-1.5 sm:gap-2 leading-snug">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
            <span># 66/2, Near Shingar Cinema, Dharampura Ludhiana-141008</span>
          </div>

        </motion.div>

        {/* Head Office Location Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-xl mx-auto mt-8"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            {/* Map Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Head Office Location</h3>
                  <p className="text-[0.625rem] text-slate-500 dark:text-slate-400 font-medium">Dharampura, Ludhiana — 141008, Punjab</p>
                </div>
              </div>
              <a
                href="https://maps.app.goo.gl/LKhc1zcfMGWREFB4A"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-xl text-[0.625rem] sm:text-xs transition-all shadow-xs"
              >
                <MapPin className="w-3 h-3" />
                <span>Directions</span>
              </a>
            </div>

            {/* Google Maps Embed */}
            <div className="w-full aspect-[16/9] sm:aspect-[2/1]">
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
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <p className="text-[0.625rem] text-slate-500 dark:text-slate-400 font-medium">
                # 66/2, Near Shingar Cinema, Dharampura, Ludhiana
              </p>
              <a
                href="https://maps.app.goo.gl/LKhc1zcfMGWREFB4A"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.625rem] text-red-600 dark:text-red-400 font-bold hover:underline"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>
        </motion.div>

        {/* Card Utility Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2.5 justify-center">
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="tel:7986716117"
            className="inline-flex items-center justify-center text-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm transition-all shadow-sm w-full sm:w-auto"
          >
            <Phone className="w-4 h-4 shrink-0" />
            <span className="text-center">Call MD Moni Maurya (79867-16117)</span>
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="tel:8556949433"
            className="inline-flex items-center justify-center text-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm transition-all shadow-sm w-full sm:w-auto"
          >
            <Phone className="w-4 h-4 shrink-0" />
            <span className="text-center">Call MD Sandeep Maurya (85569-49433)</span>
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="tel:6280370497"
            className="inline-flex items-center justify-center text-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm transition-all shadow-sm w-full sm:w-auto"
          >
            <Phone className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-center">Call Office (62803-70497)</span>
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="tel:8054586030"
            className="inline-flex items-center justify-center text-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm transition-all shadow-sm w-full sm:w-auto"
          >
            <Phone className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-center">Call Office (80545-86030)</span>
          </motion.a>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCopyCardInfo}
            className="inline-flex items-center justify-center text-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm transition-all shadow-sm w-full sm:w-auto"
            id="copy-vcard-info-btn"
          >
            {copied ? <Check className="w-4 h-4 text-white shrink-0" /> : <Copy className="w-4 h-4 text-white shrink-0" />}
            <span className="text-center">{copied ? 'Card Info Copied!' : 'Copy Card Info'}</span>
          </motion.button>

          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="https://wa.me/917986716117?text=Hello%20Ved%20Enterprises,%20I%20have%20an%20inquiry%20regarding%20yarns%20and%20fabrics."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm transition-all shadow-sm w-full sm:w-auto"
          >
            <Share2 className="w-4 h-4 shrink-0" />
            <span className="text-center">WhatsApp Us</span>
          </motion.a>
        </div>

        {/* Mobile & Tablet Header Contact & Supply Banner (Shifted downside Digital Visiting Card) */}
        <div className="lg:hidden mt-6 bg-gradient-to-r from-red-700 via-red-600 to-amber-600 text-white p-3.5 sm:p-5 rounded-2xl shadow-lg border border-red-500/30 text-xs font-medium space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[0.6875rem] sm:text-xs text-center">
            <span className="inline-flex items-center gap-1 bg-red-800/80 px-2 py-0.5 rounded text-[0.625rem] sm:text-[0.6875rem] font-bold uppercase tracking-wider shrink-0">
              <Truck className="w-3 h-3 text-amber-300" /> All India Supply
            </span>
            <span className="inline-flex items-center gap-1 text-[0.625rem] sm:text-[0.6875rem]">
              <MapPin className="w-3 h-3 text-red-200 shrink-0" /> # 66/2 Near Shingar Cinema, Dharampura, Ludhiana - 141008
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-amber-200 text-[0.625rem] sm:text-xs shrink-0">
              GSTIN: Available on Request
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 text-xs pt-2 border-t border-white/20">
            <a
              href="tel:7986716117"
              className="inline-flex items-center gap-1 hover:text-amber-200 transition-colors font-bold bg-amber-500/20 text-amber-200 px-2.5 py-1 rounded-lg text-[0.625rem] sm:text-xs border border-amber-400/30 shrink-0"
            >
              <Phone className="w-3 h-3 text-amber-300" />
              <span>Moni: 7986716117</span>
            </a>
            <a
              href="tel:8556949433"
              className="inline-flex items-center gap-1 hover:text-amber-200 transition-colors font-bold bg-amber-500/20 text-amber-200 px-2.5 py-1 rounded-lg text-[0.625rem] sm:text-xs border border-amber-400/30 shrink-0"
            >
              <Phone className="w-3 h-3 text-amber-300" />
              <span>Sandeep: 8556949433</span>
            </a>
            <a
              href="tel:6280370497"
              className="inline-flex items-center gap-1 hover:text-amber-200 transition-colors font-semibold bg-white/10 px-2.5 py-1 rounded-lg text-[0.625rem] sm:text-xs shrink-0"
            >
              <Phone className="w-3 h-3 text-red-200" />
              <span>Office 1: 6280370497</span>
            </a>
            <a
              href="tel:8054586030"
              className="inline-flex items-center gap-1 hover:text-amber-200 transition-colors font-semibold bg-white/10 px-2.5 py-1 rounded-lg text-[0.625rem] sm:text-xs shrink-0"
            >
              <Phone className="w-3 h-3 text-red-200" />
              <span>Office 2: 8054586030</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

