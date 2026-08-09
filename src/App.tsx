import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FlyToBasketAnimation, FlyingItem } from './components/FlyToBasketAnimation';
import { BasketToast } from './components/BasketToast';
import { ShadeCardModal } from './components/ShadeCardModal';
import { YarnBackgroundPattern } from './components/YarnBackgroundPattern';
import { LaunchCountdown } from './components/LaunchCountdown';
import { AiAssistantModal } from './components/AiAssistantModal';
import { Product, InquiryItem, YarnCategory } from './types';

// Page Imports from src/pages
import { Home } from './pages/Home';
import { CatalogPage } from './pages/CatalogPage';
import { GarmentsPage } from './pages/GarmentsPage';
import { InquiryPage } from './pages/InquiryPage';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Website is 100% LIVE
  const [showCountdown, setShowCountdown] = useState<boolean>(false);

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

  // Derive current page name from URL pathname
  const getCurrentPageFromPath = (path: string): 'home' | 'catalog' | 'basket' | 'garments' => {
    const cleanPath = path.toLowerCase().replace(/\/$/, '');
    if (cleanPath === '/catalog') return 'catalog';
    if (cleanPath === '/garments') return 'garments';
    if (cleanPath === '/inquiry' || cleanPath === '/basket') return 'basket';
    return 'home';
  };

  const currentPage = getCurrentPageFromPath(location.pathname);

  const handleNavigate = (sectionId: string) => {
    let targetPath = '/';

    if (sectionId === 'catalog') {
      targetPath = '/catalog';
    } else if (sectionId === 'inquiry' || sectionId === 'basket') {
      targetPath = '/inquiry';
    } else if (sectionId === 'garments') {
      targetPath = '/garments';
    } else if (sectionId === 'card') {
      targetPath = '/card';
    } else if (sectionId === 'mills') {
      targetPath = '/mills';
    } else if (sectionId === 'hero' || sectionId === 'home') {
      targetPath = '/';
    }

    setActiveSection(sectionId);
    navigate(targetPath);
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
    navigate('/catalog');
    setActiveSection('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence mode="wait">
      {showCountdown ? (
        <LaunchCountdown key="countdown" onPreviewLaunch={() => setShowCountdown(false)} />
      ) : (
        <motion.div
          key="main-website"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-red-500 selection:text-white overflow-x-hidden relative"
        >
          {/* Decorative Yarn & Textile Background Animation */}
          <YarnBackgroundPattern />

          {/* Header Navigation */}
          <Header
            basketCount={basket.length}
            onOpenBasket={() => handleNavigate('inquiry')}
            onOpenAi={() => {
              setAiTopic('');
              setIsAiOpen(true);
            }}
            onOpenShadesModal={() => handleOpenShadesModal()}
            onNavigate={handleNavigate}
            activeSection={
              currentPage === 'basket'
                ? 'inquiry'
                : currentPage === 'garments'
                ? 'garments'
                : currentPage === 'catalog'
                ? 'catalog'
                : activeSection
            }
            onMenuChange={setIsHeaderMenuOpen}
          />

          {/* Main Content Area with Smooth Page Transitions & React Router */}
          <main className={`pb-20 md:pb-0 transition-all duration-300 ${isHeaderMenuOpen ? 'filter blur-md pointer-events-none select-none opacity-80' : ''}`}>
            <AnimatePresence mode="wait">
              <Routes location={location}>
                <Route
                  path="/"
                  element={
                    <Home
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      onExploreCatalog={() => handleNavigate('catalog')}
                      onOpenAi={() => {
                        setAiTopic('');
                        setIsAiOpen(true);
                      }}
                      onSelectCategory={(cat) => handleCategoryChange(cat as any)}
                      onSelectPartnerYarns={handleSelectPartnerYarns}
                      scrollSection={activeSection}
                    />
                  }
                />
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route
                  path="/mills"
                  element={
                    <Home
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      onExploreCatalog={() => handleNavigate('catalog')}
                      onOpenAi={() => {
                        setAiTopic('');
                        setIsAiOpen(true);
                      }}
                      onSelectCategory={(cat) => handleCategoryChange(cat as any)}
                      onSelectPartnerYarns={handleSelectPartnerYarns}
                      scrollSection="mills"
                    />
                  }
                />
                <Route
                  path="/card"
                  element={
                    <Home
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      onExploreCatalog={() => handleNavigate('catalog')}
                      onOpenAi={() => {
                        setAiTopic('');
                        setIsAiOpen(true);
                      }}
                      onSelectCategory={(cat) => handleCategoryChange(cat as any)}
                      onSelectPartnerYarns={handleSelectPartnerYarns}
                      scrollSection="card"
                    />
                  }
                />
                <Route
                  path="/catalog"
                  element={
                    <CatalogPage
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      selectedCategory={selectedCategory}
                      onCategoryChange={handleCategoryChange}
                      onAddToBasket={handleAddToBasket}
                      onOpenAiForProduct={handleOpenAiForProduct}
                      onOpenShadesModal={handleOpenShadesModal}
                      inquiryItemIds={basket.map((b) => b.product.id)}
                      onGoToBasket={() => handleNavigate('inquiry')}
                    />
                  }
                />
                <Route
                  path="/garments"
                  element={
                    <GarmentsPage
                      onBackToHome={() => handleNavigate('hero')}
                      onOpenAi={() => {
                        setAiTopic('Garments & Sweater Manufacturing Inquiry');
                        setIsAiOpen(true);
                      }}
                    />
                  }
                />
                <Route
                  path="/inquiry"
                  element={
                    <InquiryPage
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
                  }
                />
                <Route path="/basket" element={<Navigate to="/inquiry" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
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
            onGoToBasket={() => handleNavigate('inquiry')}
          />

          {/* Footer */}
          <div className={`transition-all duration-300 ${isHeaderMenuOpen ? 'filter blur-md pointer-events-none select-none opacity-80' : ''}`}>
            <Footer
              onNavigate={handleNavigate}
              onSelectCategory={(cat) => handleCategoryChange(cat as any)}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
