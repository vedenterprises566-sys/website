import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, MapPin, Copy, Check, Share2, Download, Building2, Award, Sparkles, Navigation, QrCode } from 'lucide-react';
import { LogoGraphic } from './LogoGraphic';
import { HangingYarnThreads } from './HangingYarnThreads';

export const VisitingCard: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');

  // Copy card info to clipboard
  const handleCopyCardInfo = () => {
    const cardText = `
VED ENTERPRISES
Wholesale Stockist & Supplier of Yarns
Deals In: Acrylic, Cotton, Polyester & Blended Yarns, Vislon, Lurex, Wooly, Chenille, Zari/Jari & Fabrics.
Address: # 66/2, Near Shingar Cinema, Dharampura, Ludhiana - 141008 (Punjab, India)
Managing Directors:
- Moni Maurya (Mob: +91 7986716117)
- Sandeep Maurya (Mob: +91 8556949433)
Office Helpline: 62803-70497, 80545-86030
Email: vedenterprises566@gmail.com
Website: https://www.ved.enterprises
    `.trim();

    navigator.clipboard.writeText(cardText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Download official .vcf vCard file to phone contacts
  const handleDownloadVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:Ved Enterprises
ORG:Ved Enterprises (Wholesale Yarn Stockist)
TITLE:Managing Directors: Moni Maurya & Sandeep Maurya
TEL;TYPE=WORK,CELL:+917986716117
TEL;TYPE=WORK,CELL:+918556949433
TEL;TYPE=OFFICE:+916280370497
TEL;TYPE=OFFICE:+918054586030
EMAIL:vedenterprises566@gmail.com
URL:https://www.ved.enterprises
ADR;TYPE=WORK:;;# 66/2, Near Shingar Cinema, Dharampura;Ludhiana;Punjab;141008;India
NOTE:Deals in Acrylic, Cotton, Polyester, Vislon, Wooly, Chenille, Zari & Fabrics.
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Ved_Enterprises_Contact.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="card-section" className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 m-2.5 sm:m-6 md:m-[2.5rem] rounded-3xl shadow-sm relative overflow-hidden">
      {/* Decorative Hanging Yarn Threads */}
      <HangingYarnThreads variant="banner" className="top-0 opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto space-y-2"
        >
          <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-2xs">
            <Award className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            <span>Corporate Trade Credential</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
            Digital Business Card
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
            Official company credential, direct executive phone contacts, and Ludhiana head office location map.
          </p>

          {/* Flip Front / Back Toggle Buttons */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              onClick={() => setCardSide('front')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                cardSide === 'front'
                  ? 'bg-slate-900 text-white dark:bg-red-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              💳 Card Front (Executive)
            </button>
            <button
              onClick={() => setCardSide('back')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                cardSide === 'back'
                  ? 'bg-slate-900 text-white dark:bg-red-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              📍 Card Back (Office & Maps)
            </button>
          </div>
        </motion.div>

        {/* 3D LUXURY EXECUTIVE DIGITAL VISITING CARD */}
        <div className="max-w-xl mx-auto perspective-1000">
          <AnimatePresence mode="wait">
            {cardSide === 'front' ? (
              /* FRONT OF VISITING CARD */
              <motion.div
                key="card-front"
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-amber-400/60 shadow-2xl space-y-6 group"
              >
                {/* Metallic Sheen Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-400/5 to-white/10 pointer-events-none group-hover:opacity-80 transition-opacity" />
                
                {/* Gold Foil Accent Line Top */}
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 rounded-full shadow-sm" />

                {/* Top Header Row: Emblem & Brand Title */}
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2 bg-amber-400/10 border border-amber-400/30 rounded-2xl backdrop-blur-md shadow-md shrink-0">
                      <LogoGraphic size="md" showText={false} />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-3xl font-black font-serif tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 drop-shadow-sm">
                        VED ENTERPRISES
                      </h3>
                      <p className="text-[0.625rem] sm:text-xs font-bold text-red-400 tracking-widest uppercase">
                        Wholesale Stockist & Supplier of Yarns
                      </p>
                    </div>
                  </div>

                  <span className="hidden xs:inline-block bg-amber-400/20 text-amber-300 text-[0.625rem] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md border border-amber-400/30 shrink-0">
                    Ludhiana Hub
                  </span>
                </div>

                {/* Specialization Pills */}
                <div className="space-y-2 relative z-10">
                  <span className="text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest block">
                    Product Specializations:
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-[0.6875rem] font-semibold text-slate-200">
                    <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/15">Acrylic & Cotton Yarns</span>
                    <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/15">Polyester Blends</span>
                    <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/15">Vislon & Wooly Yarns</span>
                    <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/15">Chenille & Eyelash Fur</span>
                    <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/15">Jari / Zari & Fabrics</span>
                  </div>
                </div>

                {/* Managing Directors Grid */}
                <div className="space-y-2.5 pt-2 border-t border-white/10 relative z-10">
                  <span className="text-[0.625rem] font-bold text-amber-400 uppercase tracking-widest block">
                    Managing Directors:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white/5 hover:bg-white/10 p-3 rounded-2xl border border-white/10 transition-all flex items-center justify-between">
                      <div>
                        <p className="text-white font-black text-xs sm:text-sm font-serif">Moni Maurya</p>
                        <p className="text-amber-300 text-xs font-bold mt-0.5">Mob: 7986716117</p>
                      </div>
                      <a
                        href="tel:7986716117"
                        className="bg-amber-400 hover:bg-amber-300 text-slate-950 p-2 rounded-xl text-xs font-black transition-colors shrink-0 shadow-xs"
                        title="Call Moni Maurya"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="bg-white/5 hover:bg-white/10 p-3 rounded-2xl border border-white/10 transition-all flex items-center justify-between">
                      <div>
                        <p className="text-white font-black text-xs sm:text-sm font-serif">Sandeep Maurya</p>
                        <p className="text-amber-300 text-xs font-bold mt-0.5">Mob: 8556949433</p>
                      </div>
                      <a
                        href="tel:8556949433"
                        className="bg-amber-400 hover:bg-amber-300 text-slate-950 p-2 rounded-xl text-xs font-black transition-colors shrink-0 shadow-xs"
                        title="Call Sandeep Maurya"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Bottom Address Summary Bar */}
                <div className="pt-2 text-center text-[0.6875rem] text-slate-300 font-medium flex items-center justify-center gap-1.5 relative z-10 border-t border-white/10">
                  <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span># 66/2, Near Shingar Cinema, Dharampura, Ludhiana-141008</span>
                </div>
              </motion.div>
            ) : (
              /* BACK OF VISITING CARD */
              <motion.div
                key="card-back"
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border-2 border-red-500/60 shadow-2xl space-y-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-lg font-bold text-white font-serif">Head Office & Operations</h3>
                    <p className="text-xs text-red-400 font-semibold">Ludhiana Textile District • Punjab</p>
                  </div>
                  <Building2 className="w-6 h-6 text-amber-400" />
                </div>

                {/* Helpline Numbers */}
                <div className="space-y-2">
                  <span className="text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest block">
                    Office Landline & Support Lines:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <a
                      href="tel:6280370497"
                      className="bg-white/5 hover:bg-white/10 p-2.5 rounded-xl border border-white/10 flex items-center justify-between text-slate-200 transition-colors"
                    >
                      <span>62803-70497</span>
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                    </a>
                    <a
                      href="tel:8054586030"
                      className="bg-white/5 hover:bg-white/10 p-2.5 rounded-xl border border-white/10 flex items-center justify-between text-slate-200 transition-colors"
                    >
                      <span>80545-86030</span>
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                    </a>
                  </div>
                </div>

                {/* Full Registered Address */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-amber-300 font-bold">
                    <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Registered Business Address</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed pl-6">
                    # 66/2, Near Shingar Cinema, Dharampura, Ludhiana - 141008, Punjab, India
                  </p>
                </div>

                {/* Corporate Email & Web */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 truncate">
                    <span className="text-slate-400 text-[0.625rem] block font-semibold">EMAIL</span>
                    <span className="text-white font-bold text-xs truncate">vedenterprises566@gmail.com</span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 truncate">
                    <span className="text-slate-400 text-[0.625rem] block font-semibold">OFFICIAL DOMAIN</span>
                    <span className="text-amber-300 font-bold text-xs truncate">www.ved.enterprises</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* UTILITY ACTIONS ROW */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {/* Download vCard Contact */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleDownloadVCard}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>📥 Save Contact to Phone (.vcf)</span>
          </motion.button>

          {/* Copy Full Card Text */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCopyCardInfo}
            className="inline-flex items-center gap-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-all cursor-pointer border border-slate-800"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
            <span>{copied ? 'Card Info Copied!' : 'Copy Card Text'}</span>
          </motion.button>

          {/* WhatsApp Direct Link */}
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="https://wa.me/917986716117?text=Hello%20Ved%20Enterprises,%20I%20have%20an%20inquiry%20regarding%20yarns%20and%20fabrics."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp Moni Maurya</span>
          </motion.a>
        </div>

        {/* HEAD OFFICE GOOGLE MAPS LOCATION SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto pt-4"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            {/* Map Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                    Head Office & Warehouse Location
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    # 66/2, Near Shingar Cinema, Dharampura, Ludhiana - 141008
                  </p>
                </div>
              </div>
              <a
                href="https://maps.app.goo.gl/LKhc1zcfMGWREFB4A"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </a>
            </div>

            {/* Google Maps Embed */}
            <div className="w-full aspect-[16/9] sm:aspect-[21/9]">
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
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                📍 Dharampura, Ludhiana — Open Mon to Sat (9:00 AM to 8:00 PM IST)
              </p>
              <a
                href="https://maps.app.goo.gl/LKhc1zcfMGWREFB4A"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-red-600 dark:text-red-400 font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>Open in Google Maps</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
