import { Product, YarnCategory } from '../types';
import { PRODUCTS_CATALOG } from '../data/products';

let cachedCatalog: Product[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION_MS = 15 * 1000;

// New catalog spreadsheet — exported as CSV so the website can read it without auth
const GOOGLE_SHEET_CSV_URL = (import.meta as any)?.env?.VITE_CATALOG_SHEET_CSV_URL ||
  'https://docs.google.com/spreadsheets/d/13dYmzJoPkpLGCDt7gZ7znKJARPSknghUzcEmG2PKtFM/export?format=csv';

export function getDeletedKeysFromStorage(): Set<string> {
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

export function getCustomProductsFromStorage(): Product[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('ved_custom_products');
      if (stored) {
        const list = JSON.parse(stored);
        if (Array.isArray(list)) return list;
      }
    }
  } catch (e) {}
  return [];
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
      if (char === '\r' && nextChar === '\n') i++;
      row.push(cell.trim());
      if (row.some(c => c.length > 0)) lines.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }
  if (cell || row.length > 0) {
    row.push(cell.trim());
    if (row.some(c => c.length > 0)) lines.push(row);
  }
  return lines;
}

/**
 * Parses CSV from the NEW catalog spreadsheet.
 * Expected columns (row 1 = headers):
 * id | name | category | categoryLabel | countOrDenier | description |
 * recommendedUses | features | sampleAvailable | origin | popularFor |
 * imageUrl | shadeCardUrl | badge
 */
export function parseLiveGoogleSheetProducts(csvText: string): Product[] {
  const lines = parseCSV(csvText);
  if (lines.length <= 1) return [];

  // Detect if this is the NEW structured sheet (first column = 'id') or legacy Web3Forms sheet
  const headerRow = lines[0].map(h => h.toLowerCase().trim());
  const isNewStructuredSheet = headerRow[0] === 'id' || headerRow.includes('categoryLabel'.toLowerCase()) || headerRow.includes('countordenier');

  if (isNewStructuredSheet) {
    // --- NEW CATALOG SHEET: columns match Apps Script schema ---
    const idIdx            = headerRow.indexOf('id');
    const nameIdx          = headerRow.indexOf('name');
    const categoryIdx      = headerRow.indexOf('category');
    const categoryLabelIdx = headerRow.findIndex(h => h === 'categorylabel');
    const countIdx         = headerRow.findIndex(h => h === 'countordenier' || h === 'count');
    const descIdx          = headerRow.indexOf('description');
    const usesIdx          = headerRow.findIndex(h => h === 'recommendeduses');
    const featsIdx         = headerRow.indexOf('features');
    const sampleIdx        = headerRow.findIndex(h => h === 'sampleavailable');
    const originIdx        = headerRow.indexOf('origin');
    const popIdx           = headerRow.findIndex(h => h === 'popularfor');
    const imageIdx         = headerRow.findIndex(h => h === 'imageurl' || h === 'image');
    const shadeIdx         = headerRow.findIndex(h => h === 'shadecardurl' || h === 'shadeurl');
    const badgeIdx         = headerRow.indexOf('badge');

    const products: Product[] = [];
    lines.slice(1).forEach((row, idx) => {
      const name = nameIdx >= 0 ? row[nameIdx] : '';
      if (!name || name.trim() === '') return;

      let cat = (categoryIdx >= 0 ? row[categoryIdx] : 'fancy') as YarnCategory;
      if (['winter-wear','sweaters','sweater'].includes(cat as string)) cat = 'garments';

      const catLabel = (categoryLabelIdx >= 0 && row[categoryLabelIdx]) ? row[categoryLabelIdx] :
        (cat === 'garments' ? 'Winter Wear' :
         cat === 'china' ? 'China / Imported Yarn' :
         cat === 'acrylic-blends' ? 'Acrylic & Blends' :
         cat === 'fabrics' ? 'Fabrics & Textile Rolls' : 'Fancy Yarn');

      const rawUses  = usesIdx  >= 0 ? row[usesIdx]  : '';
      const rawFeats = featsIdx >= 0 ? row[featsIdx]  : '';

      products.push({
        id:             idIdx >= 0 && row[idIdx] ? row[idIdx] : `sheet-${idx + 1}`,
        name:           name.trim(),
        category:       cat,
        categoryLabel:  catLabel,
        countOrDenier:  countIdx  >= 0 ? row[countIdx]  : '',
        description:    descIdx   >= 0 ? row[descIdx]   : '',
        recommendedUses: rawUses  ? rawUses.split(',').map(s => s.trim()).filter(Boolean)  : [],
        features:        rawFeats ? rawFeats.split(',').map(s => s.trim()).filter(Boolean) : [],
        sampleAvailable: sampleIdx >= 0 ? String(row[sampleIdx]).toUpperCase() === 'TRUE' : true,
        origin:         originIdx >= 0 ? row[originIdx] : 'Ved Enterprises',
        popularFor:     popIdx    >= 0 ? row[popIdx]    : '',
        imageUrl:       imageIdx  >= 0 ? row[imageIdx]  : '',
        shadeCardUrl:   shadeIdx  >= 0 ? row[shadeIdx]  : '',
        badge:          badgeIdx  >= 0 ? row[badgeIdx]  : '',
      });
    });
    return products;
  }

  // --- LEGACY Web3Forms sheet fallback (old format: Timestamp | Name | Description | ShadeURL | PictureURL) ---
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
      lowerDesc.includes('garment') || lowerDesc.includes('sweater') ||
      lowerDesc.includes('cardigan') || lowerDesc.includes('winter wear') ||
      lowerDesc.includes('pullover') || lowerDesc.includes('muffler') ||
      lowerDesc.includes('vest') || lowerDesc.includes('coat');

    let cleanName = rawName.replace(/_\d{8}_\d{6}$/g, '').trim();
    cleanName = cleanName.replace(/(\d+)_(\d+)/g, '$1/$2');
    if (!isGarment && !cleanName.toLowerCase().includes('yarn')) cleanName += ' Yarn';

    let category: YarnCategory = 'fancy';
    let categoryLabel = 'Fancy Yarn';
    if (isGarment) { category = 'garments'; categoryLabel = 'Winter Wear'; }
    else if (lowerDesc.includes('china') || lowerDesc.includes('vislon') || lowerDesc.includes('suede') || lowerDesc.includes('chenille') || lowerDesc.includes('nylon hair')) {
      category = 'china'; categoryLabel = 'China / Imported Yarn';
    } else if (lowerDesc.includes('acrylic') || lowerDesc.includes('daffodil') || lowerDesc.includes('rainbow')) {
      category = 'acrylic-blends'; categoryLabel = 'Acrylic & Blends';
    }

    products.push({
      id: `live-sheet-${idx + 1}-${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      name: cleanName,
      category, categoryLabel,
      countOrDenier: 'Standard Count',
      description: description || 'High quality wholesale yarn from Ved Enterprises Ludhiana.',
      recommendedUses: ['Winter Wear', 'Knitwear'],
      features: ['High Quality', 'Direct Mill Supply'],
      sampleAvailable: true,
      origin: 'Ved Enterprises',
      popularFor: 'Wholesale Supply',
      imageUrl: pictureUrl,
      shadeCardUrl: shadeUrl,
      badge: '',
    });
  });

  return products;
}


export class ProductService {
  /**
   * Invalidates in-memory catalog cache
   */
  static clearCache(): void {
    cachedCatalog = null;
    lastFetchTime = 0;
  }

  /**
   * Loads product catalog from live Google Sheet CSV or static catalog with fallback
   */
  static async getCatalog(forceRefresh = false): Promise<Product[]> {
    const now = Date.now();
    if (forceRefresh) {
      this.clearCache();
    } else if (cachedCatalog && now - lastFetchTime < CACHE_DURATION_MS) {
      return cachedCatalog;
    }

    // ── 1. Build deleted keys: SERVER first (shared across ALL devices), localStorage as supplement ──
    // Server's deleted-products.json is the authoritative cross-device source of truth
    const deletedKeys = new Set<string>();

    try {
      const delRes = await fetch('/api/admin/deleted-products', {
        headers: { 'Cache-Control': 'no-cache' },
      });
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

    // Also add current device's localStorage deleted keys as same-session supplement
    try {
      const localDeleted = getDeletedKeysFromStorage();
      localDeleted.forEach(k => deletedKeys.add(k));
    } catch (e) {}

    // 2. Load disk/static catalog.json as primary baseline
    let baseProducts: Product[] = [];
    try {
      // Try /api/admin/catalog first (served fresh from disk by Express, bypasses Vite static cache)
      // Fall back to /catalog.json with cache-busting
      let response: Response | null = null;
      try {
        response = await fetch('/api/admin/catalog', {
          headers: { 'Accept': 'application/json', 'Cache-Control': 'no-cache' },
        });
        if (!response.ok) response = null;
      } catch (_) {}
      if (!response) {
        response = await fetch(`/catalog.json?v=${now}`, {
          headers: { 'Accept': 'application/json', 'Cache-Control': 'no-cache' },
        });
      }
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
    } else {
      // Merge any default items from PRODUCTS_CATALOG that are missing from catalog.json
      const existingIds = new Set(baseProducts.map((p) => String(p.id).toLowerCase().trim()));
      const existingNames = new Set(baseProducts.map((p) => p.name.toLowerCase().trim().replace(/\s+yarn$/i, '')));
      PRODUCTS_CATALOG.forEach((p) => {
        const pId = String(p.id).toLowerCase().trim();
        const cleanName = p.name.toLowerCase().trim().replace(/\s+yarn$/i, '');
        if (!existingIds.has(pId) && !existingNames.has(cleanName) && !isProductDeleted(p, deletedKeys)) {
          baseProducts.push(p);
          existingIds.add(pId);
          existingNames.add(cleanName);
        }
      });
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
          // Add any new products or enrich existing products with Drive URLs from sheet
          liveSheetProducts.forEach((sp) => {
            const clean = sp.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
            const existingIdx = baseProducts.findIndex(
              (p) => p.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '') === clean
            );
            if (existingIdx >= 0) {
              if (!baseProducts[existingIdx].pictureUrl && sp.pictureUrl) {
                baseProducts[existingIdx].pictureUrl = sp.pictureUrl;
              }
              if (!baseProducts[existingIdx].shadeUrl && sp.shadeUrl) {
                baseProducts[existingIdx].shadeUrl = sp.shadeUrl;
              }
            } else if (!isProductDeleted(sp, deletedKeys)) {
              baseProducts.push(sp);
            }
          });
        }
      }
    } catch (sheetErr) {
      console.warn('[ProductService] Live Google Sheet fetch notice:', sheetErr);
    }

    // ── 4. Merge custom products added via Admin Panel (localStorage) ──
    // IMPORTANT: localStorage custom products are ADDITIVE ONLY — they fill in products
    // that don't exist in server catalog.json. If a product already exists on the server,
    // the server version is authoritative (prevents mobile/PC desync where stale
    // localStorage data on one device overrides edits made on another device).
    const customProducts = getCustomProductsFromStorage();
    if (customProducts.length > 0) {
      customProducts.forEach((cp) => {
        const cpId = String(cp.id || '').toLowerCase().trim();
        const cpClean = (cp.name || '').toLowerCase().trim().replace(/\s+yarn$/i, '');
        if (!isProductDeleted(cp, deletedKeys)) {
          const existsInCatalog = baseProducts.some(
            (p) =>
              (cpId && String(p.id || '').toLowerCase().trim() === cpId) ||
              (cpClean && (p.name || '').toLowerCase().trim().replace(/\s+yarn$/i, '') === cpClean)
          );
          // Only add if this product doesn't already exist in server catalog
          if (!existsInCatalog) {
            baseProducts.unshift(cp);
          }
        }
      });
    }

    // ── 5. Filter all products against deletedKeys (server + device) ──
    const filteredProducts = baseProducts.filter((p) => !isProductDeleted(p, deletedKeys));

    if (cachedCatalog && cachedCatalog.length > 0 && filteredProducts.length < cachedCatalog.length && !forceRefresh) {
      return cachedCatalog;
    }

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
