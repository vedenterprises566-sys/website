import { Product, YarnCategory } from '../types';
import { PRODUCTS_CATALOG } from '../data/products';

let cachedCatalog: Product[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION_MS = 60 * 1000; // 1 minute in-memory cache

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/13dYmzJoPkpLGCDt7gZ7znKJARPSknghUzcEmG2PKtFM/export?format=csv';

function getDeletedKeysFromStorage(): Set<string> {
  const set = new Set<string>();
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('ved_deleted_product_ids');
      if (stored) {
        JSON.parse(stored).forEach((k: string) => {
          const clean = String(k).toLowerCase().trim();
          set.add(clean);
          const withoutYarn = clean.replace(/\s+yarn$/i, '').trim();
          if (withoutYarn) set.add(withoutYarn);
          set.add(withoutYarn + ' yarn');
        });
      }
    }
  } catch (e) {}
  return set;
}

function isProductDeleted(p: { id?: string; name?: string }, deletedKeys: Set<string>): boolean {
  if (!p) return false;
  const id = String(p.id || '').toLowerCase().trim();
  const name = String(p.name || '').toLowerCase().trim();
  const nameWithoutYarn = name.replace(/\s+yarn$/i, '').trim();

  if (id && deletedKeys.has(id)) return true;
  if (name && deletedKeys.has(name)) return true;
  if (nameWithoutYarn && deletedKeys.has(nameWithoutYarn)) return true;
  if (nameWithoutYarn && deletedKeys.has(nameWithoutYarn + ' yarn')) return true;

  for (const k of deletedKeys) {
    if (k && id && (id === k || id.includes(k) || k.includes(id))) return true;
  }
  return false;
}

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

    if (!rawName || rawName.toLowerCase().includes('connection test')) return;

    const lowerDesc = (rawName + ' ' + description).toLowerCase();
    const isGarment =
      lowerDesc.includes('garment') ||
      lowerDesc.includes('sweater') ||
      lowerDesc.includes('cardigan') ||
      lowerDesc.includes('winter wear') ||
      lowerDesc.includes('winterwear') ||
      lowerDesc.includes('pullover') ||
      lowerDesc.includes('muffler') ||
      lowerDesc.includes('vest') ||
      lowerDesc.includes('knitwear') ||
      lowerDesc.includes('coat');

    let cleanName = rawName.replace(/_\d{8}_\d{6}$/g, '').trim();
    if (!isGarment && !cleanName.toLowerCase().includes('yarn')) {
      cleanName += ' Yarn';
    }

    let countOrDenier = isGarment ? 'Standard Size' : 'Standard Count';
    const countMatch = description.match(/(\d+\/\d+\s*NM|\d+\s*NM|\d+\s*Denier|\d+%\s*Acrylic|\d+\s*CM|\d+GG)/i);
    if (countMatch) {
      countOrDenier = countMatch[0];
    } else if (cleanName.includes('2_18') || cleanName.includes('2_48')) {
      countOrDenier = '2/18 & 2/48 Fine';
    }

    let category: YarnCategory = 'fancy';
    let categoryLabel = 'Fancy Yarn';
    if (isGarment) {
      category = 'garments';
      categoryLabel = 'Winter Wear';
    } else if (lowerDesc.includes('china') || lowerDesc.includes('vislon') || lowerDesc.includes('woolly') || lowerDesc.includes('suede') || lowerDesc.includes('chenille') || lowerDesc.includes('nylon hair')) {
      category = 'china';
      categoryLabel = 'China / Imported Yarn';
    } else if (lowerDesc.includes('acrylic') || lowerDesc.includes('daffodil') || lowerDesc.includes('rainbow')) {
      category = 'acrylic-blends';
      categoryLabel = 'Acrylic & Blends';
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
      categoryLabel,
      countOrDenier,
      description: description || (isGarment ? 'Premium finished winter wear manufactured by Ved Enterprises Ludhiana.' : 'High quality wholesale yarn from Ved Enterprises Ludhiana.'),
      recommendedUses: ['Winter Wear', 'Knitwear', 'Weaving', 'Fashion Garments'],
      features: ['Live Sheet Auto-Sync', 'Direct Mill Wholesale', 'Vibrant Dyes'],
      sampleAvailable: true,
      origin: category === 'china' ? 'Direct China Import' : 'Ved Premium Selection',
      popularFor: 'Wholesale Knitwear & Winter Wear Production',
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

    // 1. Gather deleted keys from localStorage and server
    const deletedKeys = getDeletedKeysFromStorage();
    try {
      const delRes = await fetch('/api/admin/deleted-products');
      if (delRes.ok) {
        const serverDeleted = await delRes.json();
        if (Array.isArray(serverDeleted)) {
          serverDeleted.forEach((k: string) => {
            const clean = String(k).toLowerCase().trim();
            deletedKeys.add(clean);
            const withoutYarn = clean.replace(/\s+yarn$/i, '').trim();
            if (withoutYarn) deletedKeys.add(withoutYarn);
            deletedKeys.add(withoutYarn + ' yarn');
          });
        }
      }
    } catch (e) {}

    // 2. Load disk/static catalog.json as primary baseline
    let baseProducts: Product[] = [];
    try {
      const response = await fetch(`/catalog.json?v=${now}`, {
        headers: { 'Accept': 'application/json', 'Cache-Control': 'no-cache' },
      });
      if (response.ok) {
        const rawData = await response.json();
        if (Array.isArray(rawData) && rawData.length > 0) {
          baseProducts = rawData.map((item: any, index: number) => ({
            ...item,
            id: item.id ? String(item.id) : `prod-${index + 1}`,
            name: item.name || 'Yarn Product',
            category: (item.category || 'fancy') as YarnCategory,
            categoryLabel: item.categoryLabel || this.getCategoryLabel(item.category),
            countOrDenier: item.countOrDenier || item.count || 'Standard Count',
            description: item.description || 'High quality wholesale yarn from Ved Enterprises Ludhiana.',
            recommendedUses: Array.isArray(item.recommendedUses)
              ? item.recommendedUses
              : (typeof item.recommendedUses === 'string' && item.recommendedUses ? item.recommendedUses.split(',').map((s: string) => s.trim()) : ['Knitwear', 'Winter Wear']),
            features: Array.isArray(item.features)
              ? item.features
              : (typeof item.features === 'string' && item.features ? item.features.split(',').map((s: string) => s.trim()) : ['High Quality', 'Soft Touch']),
            sampleAvailable: item.sampleAvailable !== false,
            origin: item.origin || 'Ved Enterprises Wholesale',
            popularFor: item.popularFor || 'Wholesale Knitwear',
            imageUrl: item.imageUrl || item.image || '',
            shadeCardUrl: item.shadeCardUrl || item.shadeUrl || '',
            pictureUrl: item.pictureUrl || item.imageUrl || item.image || '',
            badge: item.badge || '',
          }));
        }
      }
    } catch (err) {
      console.warn('[ProductService] Warning loading /catalog.json:', err);
    }

    if (baseProducts.length === 0) {
      baseProducts = [...PRODUCTS_CATALOG];
    }

    // 3. Try Live Auto-Sync directly from public Google Sheet CSV and merge any new items
    try {
      const sheetResponse = await fetch(`${GOOGLE_SHEET_CSV_URL}&v=${now}`, {
        headers: { 'Accept': 'text/csv' },
      });

      if (sheetResponse.ok) {
        const csvText = await sheetResponse.text();
        const liveSheetProducts = parseLiveGoogleSheetProducts(csvText);

        if (liveSheetProducts.length > 0) {
          const existingNames = new Set(
            baseProducts.map((p) => p.name.toLowerCase().trim().replace(/\s+yarn$/i, ''))
          );

          // Add any new products from Google Sheet that aren't already in catalog.json
          liveSheetProducts.forEach((p) => {
            const clean = p.name.toLowerCase().trim().replace(/\s+yarn$/i, '');
            if (!existingNames.has(clean) && !isProductDeleted(p, deletedKeys)) {
              baseProducts.push(p);
              existingNames.add(clean);
            }
          });
        }
      }
    } catch (sheetErr) {
      console.warn('[ProductService] Live Google Sheet fetch notice:', sheetErr);
    }

    // 4. Filter all products against deletedKeys
    const filteredProducts = baseProducts.filter((p) => !isProductDeleted(p, deletedKeys));

    cachedCatalog = filteredProducts;
    lastFetchTime = now;
    return filteredProducts;
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
        return 'Winter Wear';
      case 'fancy':
      default:
        return 'Fancy Yarn';
    }
  }
}
