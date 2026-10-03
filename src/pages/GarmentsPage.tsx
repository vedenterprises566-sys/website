import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shirt,
  ArrowLeft,
  Sparkles,
  Phone,
  MessageSquare,
  ShieldCheck,
  Layers,
  Award,
  Plus,
  PackageCheck,
  Check,
  ExternalLink,
  ChevronRight,
  Filter,
  Tag,
  Truck,
  Package,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useProducts } from '../hooks/useProducts';
import { HangingYarnThreads } from '../components/HangingYarnThreads';
import { SEOHead } from '../components/SEOHead';
import { getProductHierarchicalPath } from '../utils/productUtils';
import { getGoogleDriveThumbnail } from '../components/MediaPreviewModal';
import { resolveProductImageUrl, handleProductImageError } from '../utils/imageUtils';

interface GarmentsPageProps {
  onBackToHome: () => void;
  onOpenAi: () => void;
  onAddToBasket?: (product: Product, qtyKg?: number, e?: React.MouseEvent) => void;
  inquiryItemIds?: string[];
  onGoToBasket?: () => void;
}

export const GarmentsPage: React.FC<GarmentsPageProps> = ({
  onBackToHome,
  onOpenAi,
  onAddToBasket,
  inquiryItemIds = [],
  onGoToBasket,
}) => {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const [selectedStyleFilter, setSelectedStyleFilter] = useState<string>('all');
  const [addedItemIds, setAddedItemIds] = useState<{ [id: string]: boolean }>({});

  // Filter products belonging to garments / winter wear
  const garmentProducts = useMemo(() => {
    return products.filter((p) => {
      const cat = (p.category || '').toLowerCase();
      const catLabel = (p.categoryLabel || '').toLowerCase();
      const style = (p.garmentStyle || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();

      const isGarmentCategory =
        cat === 'garments' ||
        cat === 'garment' ||
        cat === 'winter-wear' ||
        cat === 'finished-garment' ||
        catLabel.includes('winter') ||
        catLabel.includes('garment') ||
        catLabel.includes('knitwear') ||
        style.length > 0;

      const isGarmentText =
        name.includes('sweater') ||
        name.includes('cardigan') ||
        name.includes('winter wear') ||
        name.includes('winterwear') ||
        name.includes('pullover') ||
        name.includes('turtleneck') ||
        name.includes('muffler') ||
        name.includes('vest') ||
        name.includes('coat') ||
        name.includes('jacket') ||
        name.includes('hoodie') ||
        name.includes('knitwear') ||
        name.includes('beanie') ||
        desc.includes('winter wear') ||
        desc.includes('sweater') ||
        desc.includes('cardigan') ||
        desc.includes('knitwear');

      return isGarmentCategory || isGarmentText;
    });
  }, [products]);

  // Secondary sub-style filtering
  const filteredGarments = useMemo(() => {
    if (selectedStyleFilter === 'all') return garmentProducts;
    return garmentProducts.filter((p) => {
      const lower = (p.name + ' ' + (p.garmentStyle || '') + ' ' + (p.description || '')).toLowerCase();
      if (selectedStyleFilter === 'men') {
        return lower.includes('men') && !lower.includes('women') && !lower.includes('ladies');
      }
      if (selectedStyleFilter === 'ladies') {
        return lower.includes('ladies') || lower.includes('women') || lower.includes('cardigan');
      }
      if (selectedStyleFilter === 'turtleneck') {
        return lower.includes('turtleneck') || lower.includes('high-neck') || lower.includes('ribbed');
      }
      if (selectedStyleFilter === 'accessories') {
        return lower.includes('muffler') || lower.includes('cap') || lower.includes('beanie') || lower.includes('set');
      }
      return true;
    });
  }, [garmentProducts, selectedStyleFilter]);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToBasket) {
      onAddToBasket(product, 50, e);
      setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
      }, 1500);
    }
  };

  return (
    <div className="py-6 sm:py-10 bg-slate-50 dark:bg-slate-950 min-h-screen relative overflow-hidden">
      <SEOHead
        title="Wholesale Winter Wear & Finished Knitwear | VED Enterprises Ludhiana"
        description="Explore live wholesale winter wear collections from VED Enterprises Ludhiana: Men's Crewnecks, Ladies Vislon Cardigans, Cable Pullovers, and Turtlenecks in 5GG-14GG knits."
        canonicalUrl="https://www.ved.enterprises/garments"
      />

      {/* Decorative Hanging Yarn Threads */}
      <HangingYarnThreads variant="banner" className="top-0 opacity-70" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {/* Navigation Back Bar */}
        <div className="flex items-center justify-between gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 bg-white dark:bg-slate-900 px-3.5 sm:px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </motion.button>

          <button
            onClick={() => navigate('/catalog/yarns')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Switch to Yarn Catalog</span>
          </button>
        </div>

        {/* Hero Showcase Banner */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-red-800/40 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-4 max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
              <Shirt className="w-3.5 h-3.5 text-amber-300" />
              <span>LIVE WHOLESALE SHOWCASE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight leading-tight">
              Finished Winter Wear & Knitwear Directory
            </h1>

            <p className="text-slate-200 text-xs sm:text-base leading-relaxed font-normal">
              Direct wholesale supply of <b>Men's Sweaters, Ladies Luxury Cardigans, Turtlenecks, Cable Pullovers, and Winter Accessories</b>. Knitted in Ludhiana, Punjab using Ved Enterprises' imported premium mill yarns: Chinese Vislon, Wooly, Chenille, and High-Bulk Acrylic.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://wa.me/917986716117?text=Hello%20Ved%20Enterprises,%20I%20am%20interested%20in%20placing%20a%20bulk%20winter%20wear%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-3 rounded-2xl text-xs shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Garment Desk (+91 7986716117)</span>
              </a>

              <button
                onClick={onOpenAi}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-4 py-3 rounded-2xl text-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Ask AI Garment Specialist</span>
              </button>
            </div>
          </div>
        </div>

        {/* Manufacturing & Wholesale Value Props */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="w-9 h-9 bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Yarn-to-Garment Integration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Knitted directly using our imported Vislon, Wooly, and Daffodil yarn stocks for uncompromised quality and competitive factory-direct pricing.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="w-9 h-9 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              5GG to 14GG Flat Knits
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              From heavy winter chunky cable sweaters to featherlight 14GG buttoned cardigans with anti-pilling and color-fast guarantees.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              All-India Bulk Bale Dispatch
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Standardized master bale packaging with swift dispatch from Ludhiana to Delhi-NCR, Surat, Ahmedabad, Kolkata, Bangalore, and all hubs.
            </p>
          </div>
        </div>

        {/* Style Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
          {[
            { id: 'all', label: `All Winter Wear (${garmentProducts.length})` },
            { id: 'men', label: "Men's Sweaters & Pullovers" },
            { id: 'ladies', label: 'Ladies Cardigans & Knits' },
            { id: 'turtleneck', label: 'Turtlenecks & Thermals' },
            { id: 'accessories', label: 'Mufflers & Sets' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStyleFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedStyleFilter === tab.id
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-4 animate-pulse">
                <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        ) : filteredGarments.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No garments in this sub-style</h3>
            <p className="text-xs text-slate-500">Try selecting "All Winter Wear" to view all available collections.</p>
            <button
              onClick={() => setSelectedStyleFilter('all')}
              className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Show All
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGarments.map((prod) => {
              const isInBasket = inquiryItemIds.includes(prod.id);
              const isAdded = !!addedItemIds[prod.id];
              const rawPhoto = prod.imageUrl || prod.image || prod.pictureUrl || '';
              const thumb = resolveProductImageUrl(rawPhoto);

              const whatsappUrl = `https://wa.me/917986716117?text=${encodeURIComponent(
                `Hello Ved Enterprises, I am inquiring about wholesale bulk supply of "${prod.name}" (${prod.countOrDenier || 'Winter Wear'}). Please share bulk lot rate and available colors.`
              )}`;

              return (
                <motion.div
                  key={prod.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Image Area */}
                    <div
                      onClick={() => navigate(getProductHierarchicalPath(prod))}
                      className="relative h-52 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer group"
                    >
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => handleProductImageError(e, rawPhoto)}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 flex flex-col items-center justify-center p-6 text-center text-white">
                          <Shirt className="w-14 h-14 text-amber-400 mb-2 opacity-90" />
                          <span className="font-bold text-sm font-serif line-clamp-2">{prod.name}</span>
                        </div>
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="bg-red-600 text-white font-extrabold text-[0.625rem] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                          {prod.garmentStyle || 'Winter Wear'}
                        </span>
                        {prod.gauge && (
                          <span className="bg-slate-900/80 backdrop-blur-md text-amber-300 font-extrabold text-[0.625rem] px-2 py-1 rounded-full border border-amber-300/30">
                            {prod.gauge}
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 text-[0.625rem] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        Ludhiana Made
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3
                          onClick={() => navigate(getProductHierarchicalPath(prod))}
                          className="text-base font-bold text-slate-900 dark:text-white hover:text-red-600 cursor-pointer transition-colors line-clamp-1"
                        >
                          {prod.name}
                        </h3>
                        <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                          {prod.countOrDenier || 'Standard Size'} • {prod.yarnUsed || 'Premium Ved Mill Yarn'}
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>

                      {/* Sizes Chips */}
                      {prod.availableSizes && prod.availableSizes.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          <span className="text-[0.625rem] text-slate-400 font-semibold uppercase">Sizes:</span>
                          {prod.availableSizes.map((sz, idx) => (
                            <span
                              key={idx}
                              className="text-[0.625rem] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-mono font-bold"
                            >
                              {sz}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 mt-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-200 dark:border-emerald-800 transition-colors shrink-0"
                      title="WhatsApp Inquiry"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>

                    <button
                      onClick={(e) => handleQuickAdd(prod, e)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                        isInBasket || isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-red-600 dark:hover:bg-red-700'
                      }`}
                    >
                      {isInBasket || isAdded ? (
                        <>
                          <PackageCheck className="w-3.5 h-3.5" />
                          <span>In Enquiry Basket</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Inquire Garment</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Contact Leadership Desk */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[0.6875rem] text-amber-400 font-bold uppercase tracking-widest">
              CUSTOM BULK KNITWEAR ORDERS
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-serif">
              Need custom private-label winter wear or bulk uniform lots?
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              We manufacture customized corporate vests, school uniform sweaters, and boutique knitwear in bulk with custom labels, colors, and flat-knit gauges.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="tel:7986716117"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-3 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call Moni: 7986716117</span>
            </a>
            <a
              href="tel:8556949433"
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-3 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 border border-slate-700"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Call Sandeep: 8556949433</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
