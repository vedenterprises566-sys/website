import { Product, YarnCategory } from '../types';
import { PRODUCTS_CATALOG } from '../data/products';

let cachedCatalog: Product[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION_MS = 60 * 1000; // 1 minute in-memory cache

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/13dYmzJoPkpLGCDt7gZ7znKJARPSknghUzcEmG2PKtFM/export?format=csv';

function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        cell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(cell.trim());
      cell = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(cell.trim());
      if (row.some(c => c.length > 0)) {
        lines.push(row);
      }
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }
  if (cell || row.length > 0) {
    row.push(cell.trim());
    if (row.some(c => c.length > 0)) {
      lines.push(row);
    }
  }
  return lines;
}

export function parseLiveGoogleSheetProducts(csvText: string): Product[] {
  const lines = parseCSV(csvText);
  if (lines.length <= 1) return [];

  const dataRows = lines.slice(1);
  const products: Product[] = [];

  dataRows.forEach((r, idx) => {
    const rawName = r[1] || '';
    const description = r[2] || '';
    const shadeUrl = r[3] || '';
    const pictureUrl = r[4] || '';

    if (!rawName || rawName.toLowerCase().includes('connection test') || rawName.toLowerCase().includes('woolly')) return;

    let cleanName = rawName.replace(/_\d{8}_\d{6}$/g, '').trim();
    if (!cleanName.toLowerCase().includes('yarn')) {
      cleanName += ' Yarn';
    }

    let countOrDenier = 'Standard Count';
    const countMatch = description.match(/(\d+\/\d+\s*NM|\d+\s*NM|\d+\s*Denier|\d+%\s*Acrylic|\d+\s*CM)/i);
    if (countMatch) {
      countOrDenier = countMatch[0];
    } else if (cleanName.includes('2_18') || cleanName.includes('2_48')) {
      countOrDenier = '2/18 & 2/48 Fine';
    }

    const lowerDesc = (cleanName + ' ' + description).toLowerCase();
    let category: YarnCategory = 'fancy';
    if (lowerDesc.includes('china') || lowerDesc.includes('vislon') || lowerDesc.includes('woolly') || lowerDesc.includes('suede') || lowerDesc.includes('chenille') || lowerDesc.includes('nylon hair')) {
      category = 'china';
    } else if (lowerDesc.includes('acrylic') || lowerDesc.includes('daffodil') || lowerDesc.includes('rainbow')) {
      category = 'acrylic-blends';
    }

    let localAssetPath = '';
    const nameLower = cleanName.toLowerCase();
    if (nameLower.includes('daffodil')) localAssetPath = '/products/daffodil.jpg';
    else if (nameLower.includes('rainbow')) localAssetPath = '/products/rainbow.jpg';
    else if (nameLower.includes('hazel')) localAssetPath = '/products/hazel.jpg';
    else if (nameLower.includes('megamix')) localAssetPath = '/products/megamix.jpg';
    else if (nameLower.includes('woolly')) localAssetPath = '/products/woolly.jpg';
    else if (nameLower.includes('vislon')) localAssetPath = '/products/vislon.jpg';
    else if (nameLower.includes('enigma')) localAssetPath = '/products/enigma.jpg';
    else if (nameLower.includes('nylon hair') || nameLower.includes('hair yarn')) localAssetPath = '/products/nylonhair.jpg';

    products.push({
      id: `live-sheet-${idx + 1}-${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      name: cleanName,
      category,
      categoryLabel: category === 'china' ? 'China / Imported Yarn' : category === 'acrylic-blends' ? 'Acrylic & Blends' : 'Fancy Yarn',
      countOrDenier,
      description: description || 'High quality wholesale yarn from Ved Enterprises Ludhiana.',
      recommendedUses: ['Sweaters', 'Knitwear', 'Weaving', 'Fashion Garments'],
      features: ['Live Sheet Auto-Sync', 'Direct Mill Wholesale', 'Vibrant Dyes'],
      sampleAvailable: true,
      origin: category === 'china' ? 'Direct China Import' : 'Ved Premium Selection',
      popularFor: 'Wholesale Knitwear & Sweater Production',
      imageUrl: localAssetPath,
      pictureUrl: pictureUrl,
      shadeUrl: shadeUrl,
      badge: 'Sheet Item'
    });
  });

  return products;
}

export class ProductService {
  /**
   * Loads product catalog from live Google Sheet CSV or static catalog with fallback
   */
  static async getCatalog(forceRefresh = false): Promise<Product[]> {
    const now = Date.now();
    if (!forceRefresh && cachedCatalog && now - lastFetchTime < CACHE_DURATION_MS) {
      return cachedCatalog;
    }

    try {
      // 1. Try Live Auto-Sync directly from public Google Sheet CSV
      const sheetResponse = await fetch(`${GOOGLE_SHEET_CSV_URL}&v=${now}`, {
        headers: { 'Accept': 'text/csv' }
      });

      if (sheetResponse.ok) {
        const csvText = await sheetResponse.text();
        const liveSheetProducts = parseLiveGoogleSheetProducts(csvText);

        if (liveSheetProducts.length > 0) {
          const liveIds = new Set(liveSheetProducts.map(p => p.name.toLowerCase().trim()));
          const extraStaticProducts = PRODUCTS_CATALOG.filter(p => !liveIds.has(p.name.toLowerCase().trim()));

          const mergedCatalog = [...liveSheetProducts, ...extraStaticProducts];
          cachedCatalog = mergedCatalog;
          lastFetchTime = now;
          return mergedCatalog;
        }
      }
    } catch (sheetErr) {
      console.warn('[ProductService] Live Google Sheet fetch notice, loading fallback catalog:', sheetErr);
    }

    try {
      // 2. Secondary fallback to /catalog.json static file
      const response = await fetch(`/catalog.json?v=${now}`, {
        headers: { 'Accept': 'application/json', 'Cache-Control': 'no-cache' },
      });

      if (response.ok) {
        const rawData = await response.json();
        if (Array.isArray(rawData)) {
          const normalizedProducts: Product[] = rawData.map((item: any, index: number) => ({
            ...item,
            id: item.id ? String(item.id) : `prod-${index + 1}`,
            name: item.name || 'Yarn Product',
            category: (item.category || 'fancy') as YarnCategory,
            categoryLabel: item.categoryLabel || this.getCategoryLabel(item.category),
            countOrDenier: item.countOrDenier || item.count || 'Standard Count',
            description: item.description || 'High quality wholesale yarn from Ved Enterprises Ludhiana.',
            recommendedUses: Array.isArray(item.recommendedUses) ? item.recommendedUses : ['Knitwear', 'Sweaters'],
            features: Array.isArray(item.features) ? item.features : ['High Quality', 'Soft Touch'],
            sampleAvailable: item.sampleAvailable !== false,
            origin: item.origin || 'Ved Enterprises Wholesale',
            popularFor: item.popularFor || 'Wholesale Knitwear',
            shade: item.shade || 'Standard Mill Shade',
            image: item.image || item.imageUrl || '',
            imageUrl: item.image || item.imageUrl || '',
            shadeUrl: item.shadeUrl || item.shadeCardUrl || '',
            pictureUrl: item.pictureUrl || item.imageUrl || '',
          }));

          cachedCatalog = normalizedProducts;
          lastFetchTime = now;
          return normalizedProducts;
        }
      }
    } catch (err) {
      console.warn('[ProductService] Warning loading /catalog.json, falling back to bundled catalog:', err);
    }

    cachedCatalog = PRODUCTS_CATALOG;
    lastFetchTime = now;
    return PRODUCTS_CATALOG;
  }

  /**
   * Fetches a single product by ID
   */
  static async getProductById(id: string): Promise<Product | undefined> {
    const catalog = await this.getCatalog();
    return catalog.find((p) => String(p.id).toLowerCase() === String(id).toLowerCase());
  }

  /**
   * Helper to derive readable category labels
   */
  private static getCategoryLabel(category?: string): string {
    switch (category) {
      case 'china':
        return 'China / Imported Yarn';
      case 'acrylic-blends':
        return 'Acrylic & Blends';
      case 'fabrics':
        return 'Fabrics & Textile Rolls';
      case 'garments':
        return 'Finished Sweaters';
      case 'fancy':
      default:
        return 'Fancy Yarn';
    }
  }
}
