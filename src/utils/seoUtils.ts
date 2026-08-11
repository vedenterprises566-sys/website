import { Product } from '../types';
import { getCanonicalProductUrl, getProductHierarchicalPath } from './productUtils';

const SITE_URL = 'https://www.ved.enterprises';
const COMPANY_NAME = 'VED Enterprises';
const COMPANY_ADDRESS = '# 66/2, Near Shingar Cinema, Dharampura, Ludhiana - 141008 (Punjab, India)';

/**
 * Generates Schema.org Product JSON-LD for a single product.
 */
export function generateProductSchema(product: Product) {
  const canonicalUrl = getCanonicalProductUrl(product);
  const imageUrls: string[] = [];

  if (product.imageUrl) imageUrls.push(product.imageUrl.startsWith('http') ? product.imageUrl : `${SITE_URL}${product.imageUrl}`);
  if (product.pictureUrl && product.pictureUrl.startsWith('http')) imageUrls.push(product.pictureUrl);
  if (product.shadeCardUrl) imageUrls.push(product.shadeCardUrl.startsWith('http') ? product.shadeCardUrl : `${SITE_URL}${product.shadeCardUrl}`);

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.name,
    'description': product.description || `${product.name} wholesale supply from VED Enterprises Ludhiana.`,
    'url': canonicalUrl,
    'sku': product.id,
    'category': product.categoryLabel || 'Yarn',
    'brand': {
      '@type': 'Brand',
      'name': COMPANY_NAME,
    },
    'seller': {
      '@type': 'Organization',
      'name': COMPANY_NAME,
      'url': SITE_URL,
    },
  };

  if (imageUrls.length > 0) {
    schema['image'] = imageUrls;
  }

  return schema;
}

/**
 * Generates site-wide Organization JSON-LD schema.
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': COMPANY_NAME,
    'url': SITE_URL,
    'logo': `${SITE_URL}/products/daffodil.jpg`,
    'description': 'B2B yarn trader and bulk yarn supplier serving textile businesses and garment manufacturers across India.',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '# 66/2, Near Shingar Cinema, Dharampura',
      'addressLocality': 'Ludhiana',
      'addressRegion': 'Punjab',
      'postalCode': '141008',
      'addressCountry': 'IN',
    },
    'contactPoint': [
      {
        '@type': 'ContactPoint',
        'telephone': '+91-7986716117',
        'contactType': 'sales',
        'areaServed': 'IN',
        'availableLanguage': ['English', 'Hindi', 'Punjabi'],
      },
      {
        '@type': 'ContactPoint',
        'telephone': '+91-8556949433',
        'contactType': 'customer support',
        'areaServed': 'IN',
        'availableLanguage': ['English', 'Hindi', 'Punjabi'],
      },
    ],
  };
}

/**
 * Generates BreadcrumbList JSON-LD schema.
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url.startsWith('/') ? '' : '/'}${item.url}`,
    })),
  };
}

/**
 * Generates CollectionPage / ItemList JSON-LD schema for category listing pages.
 */
export function generateCollectionPageSchema(title: string, description: string, url: string, products: Product[] = []) {
  const pageUrl = url.startsWith('http') ? url : `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': title,
    'description': description,
    'url': pageUrl,
    'mainEntity': {
      '@type': 'ItemList',
      'numberOfItems': products.length,
      'itemListElement': products.map((p, idx) => ({
        '@type': 'ListItem',
        'position': idx + 1,
        'url': getCanonicalProductUrl(p),
        'name': p.name,
      })),
    },
  };
}

/**
 * Generates FAQPage JSON-LD schema.
 */
export function generateFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'What type of yarn products does VED Enterprises supply?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'VED Enterprises supplies a wide spectrum of wholesale yarns including Fancy Yarns (slub, Lurex, space dyed, stretch), China Imported Yarns (Vislon 2/48, 2/18 Wooly, Chenille, Suede, Eyelash hair yarns), 100% Acrylic Blends (Daffodil, Rainbow), and finished sweater garments.',
        },
      },
      {
        '@type': 'Question',
        'name': 'Does VED Enterprises ship yarn orders across India?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, VED Enterprises is based in Ludhiana, Punjab and dispatches bulk yarn orders across all Indian states including Punjab, Haryana, Delhi NCR, UP, Rajasthan, Gujarat, Maharashtra, Tamil Nadu, and West Bengal.',
        },
      },
      {
        '@type': 'Question',
        'name': 'How can buyers request bulk prices or sample hanks from VED Enterprises?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Buyers can request bulk price quotes directly via our online catalog inquiry basket or by contacting our managing directors directly on WhatsApp at +91 7986716117 or +91 8556949433.',
        },
      },
    ],
  };
}

/**
 * Dynamically updates the document <head> metadata for SPA page transitions.
 * Called by SEOHead component on every route change.
 */
export function updateHeadMetadata(opts: {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  jsonLd?: object | object[];
}) {
  // Update <title>
  if (opts.title) {
    document.title = opts.title;
  }

  // Update <meta name="description">
  if (opts.description) {
    let descMeta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.name = 'description';
      document.head.appendChild(descMeta);
    }
    descMeta.content = opts.description;
  }

  // Update <link rel="canonical">
  if (opts.canonicalUrl) {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = opts.canonicalUrl;
  }

  // Update JSON-LD structured data
  if (opts.jsonLd) {
    // Remove existing JSON-LD scripts
    document.querySelectorAll('script[type="application/ld+json"][data-seo-head]').forEach((el) => el.remove());

    const schemas = Array.isArray(opts.jsonLd) ? opts.jsonLd : [opts.jsonLd];
    schemas.forEach((schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-head', 'true');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });
  }
}
