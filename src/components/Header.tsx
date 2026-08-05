import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, MapPin, Sparkles, ShoppingBag, Truck, MessageCircle, Menu, X, Layers, Building2, FileText, CreditCard, ChevronRight, Shirt } from 'lucide-react';
import { LogoGraphic } from './LogoGraphic';
import { HangingYarnThreads } from './HangingYarnThreads';

interface HeaderProps {
  basketCount: number;
  onOpenBasket: () => void;
  onOpenAi: () => void;
  onOpenShadesModal?: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onMenuChange?: (isOpen: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  basketCount,
  onOpenBasket,
  onOpenAi,
  onOpenShadesModal,
  onNavigate,
  activeSection,
  onMenuChange,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);

  const toggleMenu = (open?: boolean) => {
    const nextState = open !== undefined ? open : !isMenuOpen;
    setIsMenuOpen(nextState);
    onMenuChange?.(nextState);
  };

  React.useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  React.useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        toggleMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  const navLinks = [
    { id: 'catalog', label: 'Yarn Catalog', icon: Layers, desc: 'Browse all cotton, fancy & china yarns' },
    { id: 'garments', label: 'Sweater Directory', icon: Shirt, desc: 'Finished sweater garments showcase' },
    { id: 'partners', label: 'Mill Partners', icon: Building2, desc: 'Direct mill associations & certifications' },
    { id: 'inquiry', label: 'Nationwide Inquiry', icon: FileText, desc: 'Request bulk rates & sample hanks' },
    { id: 'card', label: 'Visiting Card', icon: CreditCard, desc: 'Contact numbers & distribution hub' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    toggleMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm relative">
      {/* Decorative Hanging Yarn Threads along header bottom */}
      <HangingYarnThreads variant="header" className="top-11 opacity-40 hover:opacity-100 transition-opacity" />

      {/* Top Banner Bar (Desktop view - shifted downside digital visiting card on mobile & tablet) */}
      <div className="hidden lg:block bg-gradient-to-r from-red-700 via-red-600 to-amber-600 text-white text-xs py-1.5 sm:py-2 px-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-2 font-medium">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 text-[0.6875rem] sm:text-xs">
            <span className="inline-flex items-center gap-1 bg-red-800/60 px-2 py-0.5 rounded text-[0.625rem] sm:text-[0.6875rem] font-bold uppercase tracking-wider shrink-0">
              <Truck className="w-3 h-3 text-amber-300" /> All India Supply
            </span>
            <span className="inline-flex items-center gap-1 text-[0.625rem] sm:text-[0.6875rem]">
              <MapPin className="w-3 h-3 text-red-200 shrink-0" /> # 66/2 Near Shingar Cinema, Dharampura, Ludhiana - 141008
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-amber-200 text-[0.625rem] sm:text-xs shrink-0">
              GSTIN: Available on Request
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-1.5 sm:gap-2.5 text-xs">
            <a
              href="tel:7986716117"
              className="inline-flex items-center gap-1 hover:text-amber-200 transition-colors font-bold bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded text-[0.625rem] sm:text-xs border border-amber-400/30 shrink-0"
            >
              <Phone className="w-3 h-3 text-amber-300" />
              <span>Moni: 7986716117</span>
            </a>
            <a
              href="tel:8556949433"
              className="inline-flex items-center gap-1 hover:text-amber-200 transition-colors font-bold bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded text-[0.625rem] sm:text-xs border border-amber-400/30 shrink-0"
            >
              <Phone className="w-3 h-3 text-amber-300" />
              <span>Sandeep: 8556949433</span>
            </a>
            <a
              href="tel:6280370497"
              className="inline-flex items-center gap-1 hover:text-amber-200 transition-colors font-semibold bg-white/10 px-2 py-0.5 rounded text-[0.625rem] sm:text-xs shrink-0"
            >
              <Phone className="w-3 h-3 text-red-200" />
              <span>Office 1: 6280370497</span>
            </a>
            <a
              href="tel:8054586030"
              className="inline-flex items-center gap-1 hover:text-amber-200 transition-colors font-semibold bg-white/10 px-2 py-0.5 rounded text-[0.625rem] sm:text-xs shrink-0"
            >
              <Phone className="w-3 h-3 text-red-200" />
              <span>Office 2: 8054586030</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Company Brand Logo */}
          <button
            onClick={() => handleLinkClick('hero')}
            className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none group min-w-0"
            id="brand-logo-button"
          >
            <div className="shrink-0">
              <LogoGraphic size="sm" showText={false} />
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm sm:text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-serif group-hover:text-red-600 transition-colors whitespace-nowrap">
                  VED <span className="text-red-600 dark:text-red-500">ENTERPRISES</span>
                </span>
              </div>
              <p className="text-[0.5625rem] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide line-clamp-1">
                Fancy & China Yarn • Ludhiana
              </p>
            </div>
          </button>



          {/* Right-side Action Buttons & 3-Line Hamburger Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* AI Assistant Button */}
            <button
              onClick={onOpenAi}
              id="ai-assistant-header-button"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[0.6875rem] sm:text-xs md:text-sm shadow-xs hover:shadow transition-all group"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
              <span className="hidden xs:inline">AI Assist</span>
            </button>

            {/* Inquiry Basket Button */}
            <motion.button
              onClick={onOpenBasket}
              id="inquiry-basket-header-button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              animate={basketCount > 0 ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 0.3 }}
              className="relative inline-flex items-center gap-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[0.6875rem] sm:text-xs md:text-sm font-semibold transition-all shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden md:inline">Enquiry Basket</span>
              <AnimatePresence mode="wait">
                {basketCount > 0 && (
                  <motion.span
                    key={basketCount}
                    initial={{ scale: 0.2, y: -5 }}
                    animate={{ scale: [1.4, 1], y: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[0.625rem] sm:text-[0.6875rem] font-extrabold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs"
                  >
                    {basketCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Direct WhatsApp CTA */}
            <a
              href="https://wa.me/916280370497?text=Hello%20Ved%20Enterprises,%20I%20have%20an%20inquiry%20regarding%20yarn%20catalog"
              target="_blank"
              rel="noopener noreferrer"
              id="whatsapp-header-button"
              className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Three Lines Menu Button (Top Right) */}
            <button
              ref={menuButtonRef}
              onClick={() => toggleMenu()}
              id="top-right-three-lines-menu-btn"
              aria-label="Toggle navigation menu"
              className="inline-flex items-center justify-center p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-all border border-slate-200 dark:border-slate-700 shadow-xs"
            >
              {isMenuOpen ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
              ) : (
                <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-slate-800 dark:text-slate-100" />
              )}
            </button>
          </div>
        </div>

        {/* Professional Dropdown Menu Drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => toggleMenu(false)}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
              />

              {/* Sleek Mobile & Desktop Side Drawer */}
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, x: 20, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.96 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="fixed top-3 right-3 sm:right-6 w-84 max-w-[calc(100vw-1.5rem)] max-h-[calc(100vh-2rem)] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-5 z-50 flex flex-col justify-between"
              >
                <div>
                  {/* Menu Drawer Header */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <LogoGraphic size="sm" showText={false} />
                      <div>
                        <h4 className="text-sm font-extrabold font-serif tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                          Ved Enterprises
                        </h4>
                        <p className="text-[0.625rem] text-red-600 dark:text-red-400 font-semibold tracking-wider uppercase mt-0.5">
                          Textile Directory
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleMenu(false)}
                      className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                      aria-label="Close menu"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Main Navigation Items */}
                  <div className="space-y-1">
                    <span className="text-[0.625rem] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-2 px-1">
                      Navigation
                    </span>
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = activeSection === link.id;
                      return (
                        <button
                          key={link.id}
                          onClick={() => handleLinkClick(link.id)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-left transition-all group ${
                            isActive
                              ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/20'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors'}`} />
                            <span className="text-xs sm:text-sm tracking-tight truncate">{link.label}</span>
                          </div>
                          <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-1 ${isActive ? 'text-white/80' : 'text-slate-400'}`} />
                        </button>
                      );
                    })}
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <span className="text-[0.625rem] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block px-1">
                      Quick Services
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          onOpenAi();
                          toggleMenu(false);
                        }}
                        className="flex items-center justify-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-900 dark:text-amber-300 font-bold p-2.5 rounded-xl text-xs transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>AI Assistant</span>
                      </button>

                      <a
                        href="https://wa.me/916280370497?text=Hello%20Ved%20Enterprises,%20I%20have%20an%20inquiry%20regarding%20yarn%20catalog"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-bold p-2.5 rounded-xl text-xs transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Consolidated Direct Contact Footer */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 -mx-5 -mb-5 p-4 rounded-b-3xl">
                  <span className="text-[0.625rem] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block mb-2">
                    Direct Managing Contact
                  </span>
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-extrabold text-slate-900 dark:text-white">Moni Maurya (MD)</div>
                      <div className="text-[0.6875rem] text-slate-500 dark:text-slate-400">Ludhiana Hub</div>
                    </div>
                    <a
                      href="tel:7986716117"
                      className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-xs transition-all"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call Now</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
