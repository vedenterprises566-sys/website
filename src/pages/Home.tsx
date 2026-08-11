import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Layers } from 'lucide-react';
import { Hero } from '../components/Hero';
import { MillPartners } from '../components/MillPartners';
import { VisitingCard } from '../components/VisitingCard';
import { FAQSection } from '../components/FAQSection';
import { SEOHead } from '../components/SEOHead';
import { generateOrganizationSchema } from '../utils/seoUtils';
import { YarnCategory } from '../types';

interface HomeProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onExploreCatalog: () => void;
  onOpenAi: () => void;
  onSelectCategory: (cat: YarnCategory | 'all') => void;
  onSelectPartnerYarns: (partnerName: string) => void;
  scrollSection?: string;
}

export const Home: React.FC<HomeProps> = ({
  searchQuery,
  onSearchChange,
  onExploreCatalog,
  onOpenAi,
  onSelectCategory,
  onSelectPartnerYarns,
  scrollSection,
}) => {
  useEffect(() => {
    if (scrollSection && scrollSection !== 'hero' && scrollSection !== 'home') {
      setTimeout(() => {
        const elem = document.getElementById(`${scrollSection}-section`);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else if (scrollSection === 'hero' || scrollSection === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [scrollSection]);

  const orgSchema = generateOrganizationSchema();

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <SEOHead
        title="Yarn Trader & Bulk Yarn Supplier in India | VED Enterprises"
        description="VED Enterprises is a B2B yarn trader and bulk yarn supplier serving customers across India. Wholesale Cotton Yarns, Fancy Yarns, and China Yarns from Ludhiana."
        canonicalUrl="https://www.ved.enterprises/"
        jsonLd={orgSchema}
      />

      {/* Hero Section */}
      <Hero
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onExploreCatalog={onExploreCatalog}
        onOpenAi={onOpenAi}
        onSelectCategory={onSelectCategory}
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
              Explore yarn products supplied by VED Enterprises. We are a B2B yarn trader and bulk yarn supplier serving textile businesses and buyers across India.
            </p>
          </div>
          <button
            onClick={onExploreCatalog}
            className="shrink-0 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-lg hover:shadow-amber-500/20 transition-all flex items-center gap-2 group cursor-pointer"
          >
            <span>Browse Full Yarn Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Mill Partners Section */}
      <MillPartners onSelectPartnerYarns={onSelectPartnerYarns} />

      {/* FAQ Section with FAQPage Schema */}
      <FAQSection />

      {/* Digital Visiting Card Section */}
      <VisitingCard />
    </motion.div>
  );
};
