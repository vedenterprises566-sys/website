import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle, Package, MessageSquare, Phone, Sparkles, MapPin, Layers, Eye, Plus, ShieldCheck, Tag, Palette, AlertTriangle, ExternalLink, FileText } from 'lucide-react';
import { Product, YarnCategory } from '../types';
import { useProducts } from '../hooks/useProducts';
import { getProductBySlug, getProductSlug, getCanonicalProductUrl, getProductBreadcrumbs } from '../utils/productUtils';
import { SEOHead } from '../components/SEOHead';
import { generateProductSchema, generateBreadcrumbSchema, generateOrganizationSchema } from '../utils/seoUtils';
import { MediaPreviewModal, getGoogleDriveThumbnail } from '../components/MediaPreviewModal';
import { ShadeCardModal } from '../components/ShadeCardModal';

interface ProductDetailPageProps {
  onAddToBasket: (product: Product, qtyKg?: number, event?: React.MouseEvent) => void;
  onOpenAiForProduct: (productName: string) => void;
  onOpenShadesModal?: (product?: Product) => void;
  inquiryItemIds: string[];
  onGoToBasket?: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  onAddToBasket,
  onOpenAiForProduct,
  onOpenShadesModal: onOpenShadesModalProp,
  inquiryItemIds,
  onGoToBasket,
}) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();

  // Local state for modals when viewing on product detail page directly
  const [isShadeModalOpen, setIsShadeModalOpen] = useState<boolean>(false);
  const [previewMedia, setPreviewMedia] = useState<{
    isOpen: boolean;
    title: string;
    url: string;
    type: 'shade' | 'picture';
    productName?: string;
  }>({
    isOpen: false,
    title: '',
    url: '',
    type: 'shade',
  });

  const product = useMemo(() => {
    if (!slug) return undefined;
    return getProductBySlug(slug, products);
  }, [slug, products]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 3);
  }, [product, products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-8 max-w-7xl mx-auto space-y-6">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-48 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3 animate-pulse" />
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 flex flex-col items-center justify-center text-center">
        <SEOHead
          title="Product Not Found | VED Enterprises"
          description="The requested product could not be found in the VED Enterprises catalog."
        />
        <div className="max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h1 className="text-2xl font-extrabold font-serif text-slate-900 dark:text-white">Product Not Found</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            The requested product slug <span className="font-mono text-red-500 font-bold">"{slug}"</span> does not exist in our active catalog.
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center justify-center gap-2 bg-red-600 text-white font-bold text-xs px-5 py-3 rounded-xl hover:bg-red-700 transition-colors shadow-md w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  const pageTitle = `${product.name} | VED Enterprises`;
  const pageDescription = `${product.name} (${product.countOrDenier}) wholesale supply from VED Enterprises Ludhiana. ${product.description || ''}`;
  const canonicalUrl = getCanonicalProductUrl(product);

  const breadcrumbs = getProductBreadcrumbs(product);
  const productSchema = generateProductSchema(product);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs.map((b) => ({ name: b.name, url: b.path })));
  const orgSchema = generateOrganizationSchema();

  const resolvedPhoto = product.pictureUrl
    ? (getGoogleDriveThumbnail(product.pictureUrl) || product.pictureUrl)
    : (product.imageUrl || product.image || '');

  const rawShadeLink = product.shadeUrl || product.shadeCardUrl || product.shadePdfUrl || '';
  const resolvedShadePhoto = rawShadeLink
    ? (getGoogleDriveThumbnail(rawShadeLink) || (rawShadeLink.startsWith('http') ? rawShadeLink : ''))
    : '';

  const isInBasket = inquiryItemIds.includes(product.id);
  const whatsappMsg = `Hello Ved Enterprises, I would like to request a bulk price quote for ${product.name} (${product.countOrDenier}). Please share current wholesale rates and availability.`;
  const whatsappUrl = `https://wa.me/917986716117?text=${encodeURIComponent(whatsappMsg)}`;

  const handleTriggerShadesModal = () => {
    if (onOpenShadesModalProp) {
      onOpenShadesModalProp(product);
    } else {
      setIsShadeModalOpen(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8"
    >
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        canonicalUrl={canonicalUrl}
        jsonLd={[productSchema, breadcrumbSchema, orgSchema]}
      />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Breadcrumb Navigation & Top Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            {breadcrumbs.map((b, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={b.path}>
                  {idx > 0 && <span>/</span>}
                  {isLast ? (
                    <span className="text-slate-900 dark:text-white font-bold truncate max-w-[200px] sm:max-w-none">{b.name}</span>
                  ) : (
                    <Link to={b.path} className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
                      {b.name}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Full Catalog</span>
          </Link>
        </div>

        {/* Main Product Details Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Product Image & Shade Card */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Main Product Specimen Photo */}
            <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md group">
              {resolvedPhoto ? (
                <img
                  src={resolvedPhoto}
                  alt={`${product.name} - ${product.countOrDenier} supplied by VED Enterprises`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
                  <Package className="w-16 h-16 text-red-500 mb-3" />
                  <span className="font-serif text-xl font-bold">{product.name}</span>
                  <span className="text-xs text-slate-400 mt-1">VED Enterprises Wholesale Yarn</span>
                </div>
              )}

              <div className="absolute top-4 left-4 bg-slate-900/90 text-white font-extrabold text-xs uppercase tracking-widest px-3 py-1 rounded-full border border-white/20 backdrop-blur-md shadow-sm">
                {product.categoryLabel}
              </div>

              {product.origin && (
                <div className="absolute bottom-4 left-4 bg-red-600/90 text-white font-bold text-xs px-3 py-1 rounded-full backdrop-blur-md shadow-sm">
                  {product.origin}
                </div>
              )}
            </div>

            {/* Dedicated Shade Card & Color Spectrum Block */}
            {product.category !== 'garments' && (
              <div className="bg-gradient-to-br from-amber-500/10 via-slate-900/5 to-amber-500/15 dark:from-slate-900 dark:to-slate-900 p-5 rounded-3xl border border-amber-500/30 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
                      🎨
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                        Official Yarn Shade Card & PDF Library
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        View color spectrum, shade codes & custom uploaded PDFs
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleTriggerShadesModal}
                      className="flex-1 sm:flex-initial bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Palette className="w-4 h-4" />
                      <span>Interactive Shade Library</span>
                    </button>
                  </div>
                </div>

                {/* Inline Shade Card Image Preview */}
                {resolvedShadePhoto ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Shade Card Photo Preview
                      </span>
                      {rawShadeLink && (
                        <button
                          onClick={() => {
                            setPreviewMedia({
                              isOpen: true,
                              title: `${product.name} Shade Card`,
                              url: rawShadeLink,
                              type: 'shade',
                              productName: product.name,
                            });
                          }}
                          className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Click to Enlarge Lightbox</span>
                        </button>
                      )}
                    </div>

                    <div
                      onClick={() => {
                        if (rawShadeLink) {
                          setPreviewMedia({
                            isOpen: true,
                            title: `${product.name} Shade Card`,
                            url: rawShadeLink,
                            type: 'shade',
                            productName: product.name,
                          });
                        }
                      }}
                      className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-950/30 border border-slate-200 dark:border-slate-800 cursor-pointer group"
                    >
                      <img
                        src={resolvedShadePhoto}
                        alt={`${product.name} Shade Card Spectrum`}
                        className="w-full h-full object-contain bg-slate-900/40 group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                        <span className="text-white text-xs font-bold bg-amber-500 text-slate-950 px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5">
                          <Eye className="w-4 h-4" /> Enlarge Full Shade Card
                        </span>
                      </div>
                    </div>
                  </div>
                ) : rawShadeLink ? (
                  <div className="p-5 bg-amber-500/10 border border-amber-500/25 rounded-2xl text-center space-y-2">
                    <FileText className="w-8 h-8 text-amber-500 mx-auto" />
                    <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                      Shade Card PDF / Document available on Google Drive
                    </p>
                    <a
                      href={rawShadeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Shade PDF Document</span>
                    </a>
                  </div>
                ) : null}

                {/* Individual Yarn Color Swatches */}
                {product.shades && product.shades.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      Color Spectrum ({product.shades.length} Available Mill Shades)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {product.shades.map((shade, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800"
                        >
                          {shade.imageUrl ? (
                            <img
                              src={shade.imageUrl}
                              alt={shade.colorName}
                              className="w-8 h-8 rounded-lg object-cover border border-slate-300 dark:border-slate-700 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          ) : shade.hex ? (
                            <span
                              className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 shrink-0 shadow-xs"
                              style={{ backgroundColor: shade.hex }}
                            />
                          ) : (
                            <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                              #{shade.shadeNo}
                            </span>
                          )}
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                              {shade.colorName}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                              Shade #{shade.shadeNo}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Right Column: Crawlable Product Specifications & Ordering CTA */}
          <div className="lg:col-span-6 space-y-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
            
            {/* Title & Count Badge */}
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 block mb-1">
                B2B Bulk Yarn Supply • VED Enterprises
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-serif tracking-tight">
                {product.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 text-red-700 dark:text-red-300 font-extrabold text-xs px-3 py-1 rounded-full">
                  Count / Gauge: {product.countOrDenier}
                </span>
                {product.sampleAvailable && (
                  <span className="bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Sample Hank Dispatch
                  </span>
                )}
              </div>
            </div>

            {/* Description Text */}
            <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Product Description & Overview
              </h2>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-normal">
                {product.description}
              </p>
            </div>

            {/* Specifications Summary Grid */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block font-medium">Yarn Category</span>
                <span className="font-bold text-slate-900 dark:text-white">{product.categoryLabel}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block font-medium">Count / Spec</span>
                <span className="font-bold text-red-600 dark:text-red-400">{product.countOrDenier}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block font-medium">Supplier & Trader</span>
                <span className="font-bold text-slate-900 dark:text-white">VED Enterprises (Ludhiana)</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block font-medium">Popular Application</span>
                <span className="font-bold text-slate-900 dark:text-white">{product.popularFor || 'Wholesale Apparel'}</span>
              </div>
            </div>

            {/* Recommended Applications */}
            {product.recommendedUses && product.recommendedUses.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Recommended Garment & Textile Applications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.recommendedUses.map((use, idx) => (
                    <span
                      key={idx}
                      className="bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 text-xs font-semibold px-3 py-1 rounded-xl border border-amber-200 dark:border-amber-800/60"
                    >
                      • {use}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Highlights / Features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Technical & Quality Highlights
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All India Shipping & Mill Assurance Box */}
            <div className="bg-slate-100 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-start gap-3 text-xs">
              <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">All India Wholesale Dispatch from Ludhiana</p>
                <p className="text-slate-600 dark:text-slate-400 text-[0.6875rem] mt-0.5">
                  Direct dispatch to Punjab, Haryana, Delhi NCR, UP, Rajasthan, Gujarat, Maharashtra, Tamil Nadu, and West Bengal.
                </p>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Main Bulk Quote CTA */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={(e) => {
                    onAddToBasket(product, 100, e);
                    if (onGoToBasket) {
                      setTimeout(() => onGoToBasket(), 600);
                    } else {
                      navigate('/inquiry');
                    }
                  }}
                  className={`flex-1 w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
                    isInBasket
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                  id={`pd-add-quote-btn-${product.id}`}
                >
                  <Package className="w-5 h-5" />
                  <span>{isInBasket ? 'In Basket — Request Bulk Quote' : 'Request Bulk Quote'}</span>
                </motion.button>

                {/* Direct WhatsApp Rate CTA */}
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors shrink-0"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>WhatsApp Quote</span>
                </motion.a>
              </div>

              {/* Ask AI Assistant button */}
              <button
                onClick={() => onOpenAiForProduct(product.name)}
                className="w-full py-2.5 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Ask AI Assistant about yarn counts, sweater gauge & specs</span>
              </button>
            </div>

          </div>

        </div>

        {/* Crawlable Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
            <div>
              <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                Related {product.categoryLabel} Qualities
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Explore similar yarn qualities supplied in bulk by VED Enterprises.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedProducts.map((rel) => {
                const relSlug = getProductSlug(rel);
                return (
                  <Link
                    key={rel.id}
                    to={`/catalog/${relSlug}`}
                    className="group bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[0.625rem] font-bold text-slate-400 uppercase">{rel.categoryLabel}</span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {rel.name}
                      </h3>
                      <span className="inline-block mt-1 bg-red-500/10 text-red-700 dark:text-red-300 font-extrabold text-[0.625rem] px-2 py-0.5 rounded-full">
                        {rel.countOrDenier}
                      </span>
                      <p className="text-slate-600 dark:text-slate-400 text-xs mt-2 line-clamp-2">
                        {rel.description}
                      </p>
                    </div>
                    <span className="mt-3 text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View Specifications & Rates →
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Interactive Shade Card & PDF Storage Modal */}
      <ShadeCardModal
        product={product}
        isOpen={isShadeModalOpen}
        onClose={() => setIsShadeModalOpen(false)}
        onSelectProduct={() => {}}
      />

      {/* High Resolution Media / Shade Lightbox Modal */}
      <MediaPreviewModal
        isOpen={previewMedia.isOpen}
        onClose={() => setPreviewMedia({ ...previewMedia, isOpen: false })}
        title={previewMedia.title}
        url={previewMedia.url}
        type={previewMedia.type}
        productName={previewMedia.productName}
      />
    </motion.div>
  );
};
