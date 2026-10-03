import { Product, YarnCategory } from '../types';
import { resolveProductImageUrl } from '../utils/imageUtils';

let cachedCatalog: Product[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION_MS = 15 * 1000;

// Google Apps Script Web App URL — serves product list as JSON via ?action=list
const APPS_SCRIPT_URL = (import.meta as any)?.env?.VITE_APPS_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbzrggQItVkhV9fhT851L-rRYEvQ9BZG30ew2YXkuDojt5JJ0R09hXt-XaPs5bMV0TP3oQ/exec';

// Catalog spreadsheet CSV export URL — used as a fallback if Apps Script JSON is unreachable
const GOOGLE_SHEET_CSV_URL = (import.meta as any)?.env?.VITE_CATALOG_SHEET_CSV_URL ||
  'https://docs.google.com/spreadsheets/d/1YohPYHghKzQO2zMlJc3MsFpBrNEHtG3qqE7cXAr_I9o/export?format=csv';

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
 * Parses CSV from the catalog spreadsheet into Product objects.
 * Expected columns (row 1 = headers):
 * id | name | category | categoryLabel | countOrDenier | description |
 * recommendedUses | features | sampleAvailable | origin | popularFor |
 * imageUrl | shadeCardUrl | badge
 */
export function parseLiveGoogleSheetProducts(csvText: string): Product[] {
  const lines = parseCSV(csvText);
  if (lines.length <= 1) return [];

  const headerRow = lines[0].map(h => h.toLowerCase().trim());

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
      ProductService.getCategoryLabel(cat);

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
      imageUrl:       imageIdx  >= 0 ? resolveProductImageUrl(row[imageIdx]) : '',
      shadeCardUrl:   shadeIdx  >= 0 ? row[shadeIdx]  : '',
      badge:          badgeIdx  >= 0 ? row[badgeIdx]  : '',
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
   * Loads product catalog from Google Spreadsheet (single source of truth).
   * 
   * Priority:
   * 1. Apps Script JSON endpoint (?action=list) — fastest, structured JSON
   * 2. Google Sheet CSV export URL — fallback if Apps Script is unreachable
   */
  static async getCatalog(forceRefresh = false): Promise<Product[]> {
    const now = Date.now();
    if (forceRefresh) {
      this.clearCache();
    } else if (cachedCatalog && now - lastFetchTime < CACHE_DURATION_MS) {
      return cachedCatalog;
    }

    let products: Product[] = [];

    // ── 1. Try Apps Script JSON endpoint (preferred — returns structured JSON directly) ──
    const customUrl = typeof window !== 'undefined' ? localStorage.getItem('ved_apps_script_url') : null;
    const scriptUrl = (customUrl && customUrl.trim()) ? customUrl.trim() : APPS_SCRIPT_URL.trim();

    try {
      if (scriptUrl) {
        const listUrl = `${scriptUrl}${scriptUrl.includes('?') ? '&' : '?'}action=list&t=${now}`;
        const res = await fetch(listUrl, {
          headers: { 'Accept': 'application/json' },
        });
        if (res.ok) {
          const rawData = await res.json();
          if (Array.isArray(rawData) && rawData.length > 0) {
            products = rawData.map((item: any, index: number) => ({
              id: item.id ? String(item.id) : `prod-${index + 1}`,
              name: item.name || 'Yarn Product',
              category: (item.category === 'winter-wear' || item.category === 'sweaters'
                ? 'garments' : item.category || 'fancy') as YarnCategory,
              categoryLabel: item.categoryLabel || this.getCategoryLabel(item.category),
              countOrDenier: item.countOrDenier || item.count || '',
              description: item.description || '',
              recommendedUses: Array.isArray(item.recommendedUses)
                ? item.recommendedUses
                : (typeof item.recommendedUses === 'string' && item.recommendedUses
                  ? item.recommendedUses.split(',').map((s: string) => s.trim()).filter(Boolean)
                  : []),
              features: Array.isArray(item.features)
                ? item.features
                : (typeof item.features === 'string' && item.features
                  ? item.features.split(',').map((s: string) => s.trim()).filter(Boolean)
                  : []),
              sampleAvailable: item.sampleAvailable === true || String(item.sampleAvailable).toUpperCase() === 'TRUE',
              origin: item.origin || 'Ved Enterprises',
              popularFor: item.popularFor || '',
              imageUrl: resolveProductImageUrl(item.imageUrl || item.image || item.pictureUrl || ''),
              shadeCardUrl: item.shadeCardUrl || item.shadeUrl || '',
              badge: item.badge || '',
            }));
            console.log(`[ProductService] Loaded ${products.length} products from Apps Script`);
          }
        }
      }
    } catch (err) {
      console.warn('[ProductService] Apps Script fetch failed, trying proxy/CSV fallback:', err);
    }

    // ── 2. Fallback: Backend proxy route (fetches from Google Sheets server-side to avoid CORS) ──
    if (products.length === 0) {
      try {
        const proxyRes = await fetch(`/api/catalog?t=${now}`);
        if (proxyRes.ok) {
          const proxyData = await proxyRes.json();
          if (Array.isArray(proxyData) && proxyData.length > 0) {
            products = proxyData;
            console.log(`[ProductService] Loaded ${products.length} products from server proxy`);
          }
        }
      } catch (proxyErr) {}
    }

    // ── 2. Fallback: Google Sheet CSV export (if Apps Script failed or returned empty) ──
    if (products.length === 0) {
      try {
        const csvUrl = `${GOOGLE_SHEET_CSV_URL}${GOOGLE_SHEET_CSV_URL.includes('?') ? '&' : '?'}v=${now}`;
        const sheetResponse = await fetch(csvUrl, {
          headers: { 'Accept': 'text/csv' },
        });
        if (sheetResponse.ok) {
          const csvText = await sheetResponse.text();
          products = parseLiveGoogleSheetProducts(csvText);
          if (products.length > 0) {
            console.log(`[ProductService] Loaded ${products.length} products from Sheet CSV`);
          }
        }
      } catch (sheetErr) {
        console.warn('[ProductService] Sheet CSV fetch failed:', sheetErr);
      }
    }

    // ── 3. Safety: return cached data if both sources failed ──
    if (products.length === 0 && cachedCatalog && cachedCatalog.length > 0) {
      console.warn('[ProductService] Both sources failed, returning cached data');
      return cachedCatalog;
    }

    // Filter out any products without a valid name
    products = products.filter(p => p.name && p.name.trim() !== '');

    cachedCatalog = products;
    lastFetchTime = now;
    return products;
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
  static getCategoryLabel(category?: string): string {
    switch (category) {
      case 'china':
        return 'China / Imported Yarn';
      case 'acrylic-blends':
        return 'Acrylic & Blends';
      case 'fabrics':
        return 'Fabrics & Textile Rolls';
      case 'garments':
      case 'winter-wear':
        return 'Winter Wear';
      case 'fancy':
      default:
        return 'Fancy Yarn';
    }
  }
}
