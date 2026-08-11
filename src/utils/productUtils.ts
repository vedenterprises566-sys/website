import { Product } from '../types';
import { PRODUCTS_CATALOG } from '../data/products';

const SITE_URL = 'https://www.ved.enterprises';

/**
 * Converts any string into a clean, lowercased, hyphen-separated slug.
 */
export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generates a stable, unique slug for a product based on its name.
 */
export function getProductSlug(product: Product): string {
  if (!product || !product.name) return 'yarn-product';
  const baseSlug = slugify(product.name);
  if (baseSlug) return baseSlug;
  return `product-${slugify(product.id || 'yarn')}`;
}

/**
 * Returns the top-level section ('yarns' | 'garments') for a product.
 */
export function getProductSection(product: Product): 'garments' | 'yarns' {
  if (!product) return 'yarns';
  if (product.category === 'garments') return 'garments';
  return 'yarns';
}

/**
 * Returns the subcategory slug ('fancy-yarns' | 'china-yarns' | 'sweaters') for a product.
 */
export function getProductSubcategorySlug(product: Product): string {
  if (!product) return 'fancy-yarns';
  if (product.category === 'garments') return 'sweaters';
  if (product.category === 'china') return 'china-yarns';
  if (product.category === 'fancy') return 'fancy-yarns';
  if (product.category === 'acrylic-blends') return 'acrylic-blends';
  return slugify(product.category) || 'fancy-yarns';
}

/**
 * Returns human-readable label for the subcategory.
 */
export function getProductSubcategoryLabel(product: Product): string {
  if (!product) return 'Fancy Yarns';
  if (product.category === 'garments') return 'Sweaters';
  if (product.category === 'china') return 'China Yarns';
  if (product.category === 'fancy') return 'Fancy Yarns';
  if (product.category === 'acrylic-blends') return 'Acrylic & Blends';
  return product.categoryLabel || 'Fancy Yarns';
}

/**
 * Returns the hierarchical relative path for a product.
 * Example: /catalog/yarns/fancy-yarns/mx-lurex-50-85-fine-count/
 */
export function getProductHierarchicalPath(product: Product): string {
  const section = getProductSection(product);
  const subcategory = getProductSubcategorySlug(product);
  const slug = getProductSlug(product);
  return `/catalog/${section}/${subcategory}/${slug}`;
}

/**
 * Returns the full canonical HTTPS URL for a product detail page.
 */
export function getCanonicalProductUrl(product: Product): string {
  const relPath = getProductHierarchicalPath(product);
  return `${SITE_URL}${relPath}`;
}

/**
 * Returns the structured 5-tier breadcrumb items for a product.
 */
export function getProductBreadcrumbs(product: Product): Array<{ name: string; path: string }> {
  const section = getProductSection(product);
  const sectionLabel = section === 'garments' ? 'Garments' : 'Yarns';
  const subcategorySlug = getProductSubcategorySlug(product);
  const subcategoryLabel = getProductSubcategoryLabel(product);
  const productPath = getProductHierarchicalPath(product);

  return [
    { name: 'Home', path: '/' },
    { name: 'Catalog', path: '/catalog' },
    { name: sectionLabel, path: `/catalog/${section}` },
    { name: subcategoryLabel, path: `/catalog/${section}/${subcategorySlug}` },
    { name: product.name, path: productPath },
  ];
}

/**
 * Finds a product in the catalog matching the given slug.
 */
export function getProductBySlug(slug: string, catalog: Product[] = PRODUCTS_CATALOG): Product | undefined {
  if (!slug) return undefined;
  const targetSlug = slug.toLowerCase().trim();

  // 1. Match exact slug derived from product name
  const exactMatch = catalog.find((p) => getProductSlug(p) === targetSlug);
  if (exactMatch) return exactMatch;

  // 2. Fallback match by ID
  const idMatch = catalog.find((p) => p.id.toLowerCase() === targetSlug);
  if (idMatch) return idMatch;

  // 3. Fallback match if slug is substring or partial match
  return catalog.find((p) => {
    const pSlug = getProductSlug(p);
    return pSlug.includes(targetSlug) || targetSlug.includes(pSlug);
  });
}
