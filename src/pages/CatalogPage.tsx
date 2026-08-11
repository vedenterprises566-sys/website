import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Layers } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Catalog } from '../components/Catalog';
import { Product, YarnCategory } from '../types';
import { SEOHead } from '../components/SEOHead';
import { generateBreadcrumbSchema, generateOrganizationSchema, generateCollectionPageSchema } from '../utils/seoUtils';
import { useProducts } from '../hooks/useProducts';

interface CatalogPageProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: YarnCategory | 'all';
  onCategoryChange: (cat: YarnCategory | 'all') => void;
  onAddToBasket: (product: Product, qtyKg?: number, event?: React.MouseEvent) => void;
  onOpenAiForProduct: (productName: string) => void;
  onOpenShadesModal: (product?: Product) => void;
  inquiryItemIds: string[];
  onGoToBasket: () => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onAddToBasket,
  onOpenAiForProduct,
  onOpenShadesModal,
  inquiryItemIds,
  onGoToBasket,
}) => {
  const location = useLocation();
  const { products } = useProducts();

  const currentPath = useMemo(() => {
    return location.pathname.toLowerCase().replace(/\/$/, '') || '/catalog';
  }, [location.pathname]);

  const pageMeta = useMemo(() => {
    if (currentPath === '/catalog/yarns/fancy-yarns') {
      return {
        title: 'Fancy Yarns | Yarn Supplier India | VED Enterprises',
        description: 'Explore Fancy Yarns supplied by VED Enterprises Ludhiana including Lurex, space dyed, slub yarns, and metallic zari.',
        canonicalUrl: 'https://www.ved.enterprises/catalog/yarns/fancy-yarns/',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Catalog', path: '/catalog/' },
          { name: 'Yarns', path: '/catalog/yarns/' },
          { name: 'Fancy Yarns', path: '/catalog/yarns/fancy-yarns/' },
        ],
        h1Title: 'Fancy Yarns Catalog',
        category: 'fancy' as const,
      };
    }

    if (currentPath === '/catalog/yarns/china-yarns') {
      return {
        title: 'China Yarns | Yarn Supplier India | VED Enterprises',
        description: 'Explore Imported China Yarns supplied by VED Enterprises Ludhiana including Vislon 2/48, 2/18 Wooly, Chenille, Suede, and Nylon Hair yarns.',
        canonicalUrl: 'https://www.ved.enterprises/catalog/yarns/china-yarns/',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Catalog', path: '/catalog/' },
          { name: 'Yarns', path: '/catalog/yarns/' },
          { name: 'China Yarns', path: '/catalog/yarns/china-yarns/' },
        ],
        h1Title: 'China Yarns Catalog',
        category: 'china' as const,
      };
    }

    if (currentPath === '/catalog/yarns/acrylic-blends') {
      return {
        title: 'Acrylic & Blends Yarn | Yarn Supplier India | VED Enterprises',
        description: 'Explore 100% Acrylic & Blended Yarns from VED Enterprises Ludhiana including Daffodil, Rainbow, and high-bulk acrylic yarns for sweaters and knitwear.',
        canonicalUrl: 'https://www.ved.enterprises/catalog/yarns/acrylic-blends/',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Catalog', path: '/catalog/' },
          { name: 'Yarns', path: '/catalog/yarns/' },
          { name: 'Acrylic & Blends', path: '/catalog/yarns/acrylic-blends/' },
        ],
        h1Title: 'Acrylic & Blends Yarn Catalog',
        category: 'acrylic-blends' as const,
      };
    }

    if (currentPath === '/catalog/yarns') {
      return {
        title: 'Yarns | Yarn Supplier India | VED Enterprises',
        description: 'Complete wholesale yarn directory from VED Enterprises Ludhiana featuring Fancy Yarns, China Imported Yarns, and 100% Acrylic Blends.',
        canonicalUrl: 'https://www.ved.enterprises/catalog/yarns/',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Catalog', path: '/catalog/' },
          { name: 'Yarns', path: '/catalog/yarns/' },
        ],
        h1Title: 'Yarns Catalog',
        category: 'all' as const,
      };
    }

    if (currentPath === '/catalog/garments/sweaters') {
      return {
        title: 'Sweaters | VED Enterprises',
        description: 'Finished Sweater Garments Collection from VED Enterprises Ludhiana crafted from premium Vislon, Wooly, and Daffodil yarns.',
        canonicalUrl: 'https://www.ved.enterprises/catalog/garments/sweaters/',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Catalog', path: '/catalog/' },
          { name: 'Garments', path: '/catalog/garments/' },
          { name: 'Sweaters', path: '/catalog/garments/sweaters/' },
        ],
        h1Title: 'Finished Sweaters Catalog',
        category: 'garments' as const,
      };
    }

    if (currentPath === '/catalog/garments') {
      return {
        title: 'Garments | VED Enterprises',
        description: 'Wholesale Finished Garments and Knitted Sweaters directory from VED Enterprises Ludhiana.',
        canonicalUrl: 'https://www.ved.enterprises/catalog/garments/',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Catalog', path: '/catalog/' },
          { name: 'Garments', path: '/catalog/garments/' },
        ],
        h1Title: 'Garments Catalog',
        category: 'garments' as const,
      };
    }

    // Default /catalog
    return {
      title: 'Catalog | VED Enterprises',
      description: 'Explore the complete wholesale Yarn and Garments product catalog from VED Enterprises, B2B yarn supplier in Ludhiana, India.',
      canonicalUrl: 'https://www.ved.enterprises/catalog/',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Catalog', path: '/catalog/' },
      ],
      h1Title: 'Yarn & Garment Catalog',
      category: selectedCategory,
    };
  }, [currentPath, selectedCategory]);

  const breadcrumbSchema = generateBreadcrumbSchema(
    pageMeta.breadcrumbs.map((b) => ({ name: b.name, url: b.path }))
  );
  const collectionSchema = generateCollectionPageSchema(
    pageMeta.title,
    pageMeta.description,
    pageMeta.canonicalUrl,
    products
  );
  const orgSchema = generateOrganizationSchema();

  return (
    <motion.div
      key={currentPath}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <SEOHead
        title={pageMeta.title}
        description={pageMeta.description}
        canonicalUrl={pageMeta.canonicalUrl}
        jsonLd={[breadcrumbSchema, collectionSchema, orgSchema]}
      />

      {/* Top Page Header Banner for Catalog */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white py-8 sm:py-10 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            {/* Clickable Breadcrumbs matching URL hierarchy */}
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-1.5 font-medium">
              {pageMeta.breadcrumbs.map((b, idx) => {
                const isLast = idx === pageMeta.breadcrumbs.length - 1;
                return (
                  <React.Fragment key={b.path}>
                    {idx > 0 && <span className="text-slate-600">/</span>}
                    {isLast ? (
                      <span className="text-amber-400 font-bold">{b.name}</span>
                    ) : (
                      <Link to={b.path} className="hover:text-amber-300 transition-colors">
                        {b.name}
                      </Link>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-serif text-white flex items-center gap-3">
              <Layers className="w-7 h-7 sm:w-8 sm:h-8 text-red-500 shrink-0" />
              {pageMeta.h1Title}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl font-normal leading-relaxed">
              {pageMeta.description}
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 shrink-0"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Standalone Product Catalog Component */}
      <Catalog
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        selectedCategory={pageMeta.category === 'all' ? selectedCategory : pageMeta.category}
        onCategoryChange={onCategoryChange}
        onAddToBasket={onAddToBasket}
        onOpenAiForProduct={onOpenAiForProduct}
        onOpenShadesModal={onOpenShadesModal}
        inquiryItemIds={inquiryItemIds}
        onGoToBasket={onGoToBasket}
      />
    </motion.div>
  );
};
