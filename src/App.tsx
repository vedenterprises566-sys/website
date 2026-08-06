import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Layers } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Catalog } from './components/Catalog';
import { GarmentsPage } from './components/GarmentsPage';
import { MillPartners } from './components/MillPartners';
import { InquiryPortal } from './components/InquiryPortal';
import { VisitingCard } from './components/VisitingCard';
import { AiAssistantModal } from './components/AiAssistantModal';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FlyToBasketAnimation, FlyingItem } from './components/FlyToBasketAnimation';
import { BasketToast } from './components/BasketToast';
import { ShadeCardModal } from './components/ShadeCardModal';
import { YarnBackgroundPattern } from './components/YarnBackgroundPattern';
import { LaunchCountdown } from './components/LaunchCountdown';
import { Product, InquiryItem, YarnCategory } from './types';
import { PRODUCTS_CATALOG } from './data/products';

export default function App() {
  // Launch countdown state active until August 7, 2026 00:00 IST
  const targetLaunch = new Date('2026-08-07T00:00:00+05:30').getTime();
  const [showCountdown, setShowCountdown] = useState<boolean>(() => Date.now() < targetLaunch);

  // Auto-remove countdown overlay the exact second timer hits August 7 00:00 IST
  useEffect(() => {
    if (!showCountdown) return;

    const checkLaunch = () => {
      if (Date.now() >= targetLaunch) {
        setShowCountdown(false);
      }
    };

    checkLaunch();
    const interval = setInterval(checkLaunch, 1000);
    return () => clearInterval(interval);
  }, [showCountdown, targetLaunch]);

  const [currentPage, setCurrentPage] = useState<'home' | 'catalog' | 'basket' | 'garments'>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<YarnCategory | 'all'>('all');
  const [basket, setBasket] = useState<InquiryItem[]>([]);
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);
  const [aiTopic, setAiTopic] = useState<string>('');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState<boolean>(false);

  // Shade Card Modal state
  const [isShadeModalOpen, setIsShadeModalOpen] = useState<boolean>(false);
  const [shadeModalProduct, setShadeModalProduct] = useState<Product | null>(null);

  const handleOpenShadesModal = (prod?: Product) => {
    setShadeModalProduct(prod || null);
    setIsShadeModalOpen(true);
  };

  // Animation & Toast states
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [activeToast, setActiveToast] = useState<{
    id: string;
    title: string;
    subtitle: string;
    imageUrl?: string;
  } | null>(null);

  // Handle adding items to inquiry basket with parabolic fly animation
  const handleAddToBasket = (product: Product, qtyKg: number = 100, e?: React.MouseEvent) => {
    // 1. Calculate launch coordinates
    let startX = window.innerWidth / 2;
    let startY = window.innerHeight / 2;

    if (e && e.clientX && e.clientY && e.clientX > 0) {
      startX = e.clientX;
      startY = e.clientY;
    } else if (e && e.currentTarget) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    }

    // 2. Calculate destination (header basket button or floating bar)
    let targetX = window.innerWidth - 80;
    let targetY = 40;
    const headerBtn = document.getElementById('inquiry-basket-header-button');
    if (headerBtn) {
      const rect = headerBtn.getBoundingClientRect();
      targetX = rect.left + rect.width / 2;
      targetY = rect.top + rect.height / 2;
    }

    // 3. Launch flying item animation
    const flyId = `fly-${product.id}-${Date.now()}`;
    setFlyingItems((prev) => [
      ...prev,
      {
        id: flyId,
        startX,
        startY,
        targetX,
        targetY,
        imageUrl: product.imageUrl,
        name: product.name,
      },
    ]);

    // 4. Trigger Toast Notification
    const toastId = `toast-${Date.now()}`;
    setActiveToast({
      id: toastId,
      title: `Added "${product.name}"`,
      subtitle: `${qtyKg} kg sample added to Inquiry Basket`,
      imageUrl: product.imageUrl,
    });

    // Auto dismiss toast after 3.5 seconds
    setTimeout(() => {
      setActiveToast((current) => (current?.id === toastId ? null : current));
    }, 3500);

    // 5. Update Basket state
    setBasket((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantityKg: item.quantityKg + qtyKg }
            : item
        );
      }
      return [...prev, { product, quantityKg: qtyKg }];
    });
  };

  const handleAnimationComplete = (id: string) => {
    setFlyingItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateQty = (productId: string, newQty: number) => {
    setBasket((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantityKg: newQty } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setBasket((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearBasket = () => {
    setBasket([]);
  };

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'catalog') {
      setCurrentPage('catalog');
      setActiveSection('catalog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'inquiry' || sectionId === 'basket') {
      setCurrentPage('basket');
      setActiveSection('inquiry');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'garments') {
      setCurrentPage('garments');
      setActiveSection('garments');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentPage('home');
    setActiveSection(sectionId);

    setTimeout(() => {
      if (sectionId === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const elem = document.getElementById(`${sectionId}-section`);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  const handleOpenAiForProduct = (productName: string) => {
    setAiTopic(productName);
    setIsAiOpen(true);
  };

  const handleSelectPartnerYarns = (partnerName: string) => {
    setSearchQuery(partnerName);
    handleNavigate('catalog');
  };

  const handleCategoryChange = (category: YarnCategory | 'all') => {
    setSelectedCategory(category);
    setCurrentPage('catalog');
    setActiveSection('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showCountdown) {
    return <LaunchCountdown />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-red-500 selection:text-white overflow-x-hidden relative">
      {/* Decorative Yarn & Textile Background Animation */}
      <YarnBackgroundPattern />

      {/* Header Navigation */}
      <Header
        basketCount={basket.length}
        onOpenBasket={() => handleNavigate('basket')}
        onOpenAi={() => {
          setAiTopic('');
          setIsAiOpen(true);
        }}
        onOpenShadesModal={() => handleOpenShadesModal()}
        onNavigate={handleNavigate}
        activeSection={currentPage === 'basket' ? 'inquiry' : currentPage === 'garments' ? 'garments' : currentPage === 'catalog' ? 'catalog' : activeSection}
        onMenuChange={setIsHeaderMenuOpen}
      />

      {/* Main Content Area with Smooth Page Transitions */}
      <main className={`pb-20 md:pb-0 transition-all duration-300 ${isHeaderMenuOpen ? 'filter blur-md pointer-events-none select-none opacity-80' : ''}`}>
        <AnimatePresence mode="wait">
          {currentPage === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {/* Hero Section */}
              <Hero
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onExploreCatalog={() => handleNavigate('catalog')}
                onOpenAi={() => {
                  setAiTopic('');
                  setIsAiOpen(true);
                }}
                onSelectCategory={(cat) => handleCategoryChange(cat as any)}
              />

              {/* Featured Yarn Catalog Banner on Home */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8 sm:my-12">
                <div className="bg-gradient-to-r from-red-900 via-slate-900 to-red-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-red-700/50 relative overflow-hidden">
                  <div className="absolute -right-12 -top-12 w-64 h-64 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="space-y-3 max-w-2xl relative z-10 text-center md:text-left">
                    <span className="inline-flex items-center gap-1.5 bg-red-600/80 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                      <Layers className="w-3.5 h-3.5 text-amber-300" /> Complete Catalog
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif leading-snug">
                      Fancy & China Yarn Catalog Page
                    </h2>
                    <p className="text-slate-200 text-xs sm:text-sm font-normal leading-relaxed">
                      Browse 100+ yarn varieties including Vislon, Lurex, Wooly, Chenille, Eyelash Hair Yarns, Stretch & Lycra Blends directly supplied to Ludhiana & All India garment manufacturers.
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavigate('catalog')}
                    className="shrink-0 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-lg hover:shadow-amber-500/20 transition-all flex items-center gap-2 group cursor-pointer"
                  >
                    <span>Browse Full Yarn Catalog</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Mill Partners Section */}
              <MillPartners onSelectPartnerYarns={handleSelectPartnerYarns} />

              {/* Digital Visiting Card Section */}
              <VisitingCard />
            </motion.div>
          ) : currentPage === 'catalog' ? (
            /* Dedicated Yarn Catalog Page */
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
                      <button onClick={() => handleNavigate('hero')} className="hover:text-amber-300 transition-colors">Home</button>
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
                  <button
                    onClick={() => handleNavigate('hero')}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 shrink-0"
                  >
                    ← Back to Home
                  </button>
                </div>
              </div>

              {/* Standalone Product Catalog Component */}
              <Catalog
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                onAddToBasket={handleAddToBasket}
                onOpenAiForProduct={handleOpenAiForProduct}
                onOpenShadesModal={handleOpenShadesModal}
                inquiryItemIds={basket.map((b) => b.product.id)}
                onGoToBasket={() => handleNavigate('basket')}
              />
            </motion.div>
          ) : currentPage === 'garments' ? (
            /* Dedicated Sweater Garment Directory Page */
            <motion.div
              key="garments"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <GarmentsPage
                onBackToHome={() => handleNavigate('catalog')}
                onOpenAi={() => {
                  setAiTopic('Garments & Sweater Manufacturing Inquiry');
                  setIsAiOpen(true);
                }}
              />
            </motion.div>
          ) : (
            /* Dedicated Basket & Inquiry Page */
            <motion.div
              key="basket"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <InquiryPortal
                basket={basket}
                onUpdateQty={handleUpdateQty}
                onRemoveItem={handleRemoveItem}
                onClearBasket={handleClearBasket}
                onOpenAi={() => {
                  setAiTopic('');
                  setIsAiOpen(true);
                }}
                onBackToCatalog={() => handleNavigate('catalog')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomNav
        currentPage={currentPage}
        activeSection={activeSection}
        basketCount={basket.length}
        onNavigate={handleNavigate}
        onOpenAi={() => {
          setAiTopic('');
          setIsAiOpen(true);
        }}
      />

      {/* AI Assistant Chat Modal */}
      <AiAssistantModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        initialTopic={aiTopic}
      />

      {/* Yarn Shade Cards & PDF Storage Modal */}
      <ShadeCardModal
        product={shadeModalProduct}
        productsCatalog={PRODUCTS_CATALOG}
        isOpen={isShadeModalOpen}
        onClose={() => setIsShadeModalOpen(false)}
        onSelectProduct={(p) => setShadeModalProduct(p)}
      />

      {/* Flying Item Arc Animation Layer */}
      <FlyToBasketAnimation
        flyingItems={flyingItems}
        onAnimationComplete={handleAnimationComplete}
      />

      {/* Floating Confirmation Toast */}
      <BasketToast
        toast={activeToast}
        onClose={() => setActiveToast(null)}
        onGoToBasket={() => handleNavigate('basket')}
      />

      {/* Footer */}
      <div className={`transition-all duration-300 ${isHeaderMenuOpen ? 'filter blur-md pointer-events-none select-none opacity-80' : ''}`}>
        <Footer
          onNavigate={handleNavigate}
          onSelectCategory={(cat) => setSelectedCategory(cat as any)}
        />
      </div>
    </div>
  );
}

