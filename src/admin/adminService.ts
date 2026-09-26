import { Product, YarnCategory } from '../types';
import { ProductService } from '../services/productService';

const SCRIPT_URL_STORAGE_KEY = 'ved_apps_script_url';

export interface AdminApiResponse {
  success: boolean;
  message: string;
  productId?: string;
  productCount?: number;
  error?: string;
}

export class AdminService {
  /**
   * Retrieves the configured Google Apps Script Web App URL from localStorage
   */
  static getScriptUrl(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(SCRIPT_URL_STORAGE_KEY) || (import.meta as any).env?.VITE_APPS_SCRIPT_URL || '';
  }

  /**
   * Saves the Google Apps Script Web App URL to localStorage
   */
  static setScriptUrl(url: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SCRIPT_URL_STORAGE_KEY, url.trim());
  }

  /**
   * Clears the configured URL
   */
  static clearScriptUrl(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SCRIPT_URL_STORAGE_KEY);
  }

  /**
   * Tests connection to the Google Apps Script Web App URL
   */
  static async testConnection(urlOverride?: string): Promise<{ success: boolean; message: string; count?: number }> {
    const url = (urlOverride || this.getScriptUrl()).trim();
    if (!url) {
      return { success: false, message: 'Apps Script Web App URL is not configured yet.' };
    }

    try {
      const testUrl = `${url}${url.includes('?') ? '&' : '?'}action=list&t=${Date.now()}`;
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) {
        return { success: false, message: `HTTP Error: ${response.status} ${response.statusText}` };
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        return {
          success: true,
          message: `Connected successfully! Found ${data.length} active products in Google Sheet catalog.`,
          count: data.length,
        };
      }

      return { success: true, message: 'Connected successfully to Google Apps Script.' };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Failed to reach Apps Script. Make sure the Web App is deployed with access: "Anyone".',
      };
    }
  }

  /**
   * Helper to retrieve locally deleted product IDs and names
   */
  static getDeletedKeys(): Set<string> {
    try {
      const stored = localStorage.getItem('ved_deleted_product_ids');
      if (stored) {
        return new Set(JSON.parse(stored).map((k: string) => String(k).toLowerCase().trim()));
      }
    } catch (e) {}
    return new Set();
  }

  static markDeletedKey(id: string, name?: string) {
    try {
      const set = this.getDeletedKeys();
      if (id) set.add(String(id).toLowerCase().trim());
      if (name) set.add(String(name).toLowerCase().trim());
      localStorage.setItem('ved_deleted_product_ids', JSON.stringify(Array.from(set)));
    } catch (e) {}
  }

  static unmarkDeletedKey(id: string, name?: string) {
    try {
      const set = this.getDeletedKeys();
      if (id) set.delete(String(id).toLowerCase().trim());
      if (name) set.delete(String(name).toLowerCase().trim());
      localStorage.setItem('ved_deleted_product_ids', JSON.stringify(Array.from(set)));
    } catch (e) {}
  }

  /**
   * Loads products from the live Apps Script (or falls back to the local catalog)
   */
  static async getProducts(): Promise<{ products: Product[]; source: 'app-script' | 'catalog' }> {
    const url = this.getScriptUrl().trim();
    const deletedKeys = this.getDeletedKeys();
    const filterOutDeleted = (items: Product[]) =>
      items.filter(
        (p) =>
          !deletedKeys.has(String(p.id).toLowerCase().trim()) &&
          !deletedKeys.has(String(p.name).toLowerCase().trim())
      );

    if (url) {
      try {
        const fetchUrl = `${url}${url.includes('?') ? '&' : '?'}action=list&t=${Date.now()}`;
        const res = await fetch(fetchUrl, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const normalized: Product[] = data.map((item: any, idx: number) => ({
              ...item,
              id: item.id ? String(item.id) : `prod-${idx + 1}`,
              name: item.name || 'Yarn Product',
              category: (item.category === 'winter-wear' ? 'garments' : item.category || 'fancy') as YarnCategory,
              categoryLabel: item.category === 'garments' || item.category === 'winter-wear' ? 'Winter Wear' : (item.categoryLabel || 'Fancy Yarn'),
              countOrDenier: item.countOrDenier || item.count || 'Standard Count',
              description: item.description || '',
              recommendedUses: Array.isArray(item.recommendedUses)
                ? item.recommendedUses
                : (item.recommendedUses ? String(item.recommendedUses).split(',').map((s: string) => s.trim()) : []),
              features: Array.isArray(item.features)
                ? item.features
                : (item.features ? String(item.features).split(',').map((s: string) => s.trim()) : []),
              sampleAvailable: item.sampleAvailable !== false,
              origin: item.origin || 'Ved Enterprises',
              popularFor: item.popularFor || '',
              imageUrl: item.image || item.imageUrl || item.pictureUrl || '',
              shadeCardUrl: item.shadeCardUrl || item.shadeUrl || '',
              badge: item.badge || '',
            }));

            return { products: filterOutDeleted(normalized), source: 'app-script' };
          }
        }
      } catch (err) {
        console.warn('[AdminService] Error loading from Apps Script, falling back to local catalog:', err);
      }
    }

    const fallbackProducts = await ProductService.getCatalog(true);
    return { products: filterOutDeleted(fallbackProducts), source: 'catalog' };
  }

  /**
   * Adds a new product via Google Apps Script (saving to Google Sheet, updating GitHub catalog.json, and triggering Vercel deploy)
   */
  static async addProduct(product: Partial<Product>): Promise<AdminApiResponse> {
    const url = this.getScriptUrl().trim();
    if (!url) {
      return {
        success: false,
        message: 'Apps Script Web App URL is required to save to Google Sheets & deploy to website. Click "Settings" to enter your URL.',
      };
    }

    const payload = {
      action: 'add',
      name: product.name,
      category: product.category || 'fancy',
      categoryLabel: product.category === 'garments' ? 'Winter Wear' : (product.categoryLabel || 'Fancy Yarn'),
      countOrDenier: product.countOrDenier || '',
      description: product.description || '',
      recommendedUses: Array.isArray(product.recommendedUses) ? product.recommendedUses.join(', ') : (product.recommendedUses || ''),
      features: Array.isArray(product.features) ? product.features.join(', ') : (product.features || ''),
      sampleAvailable: product.sampleAvailable !== false,
      origin: product.origin || 'Ved Enterprises',
      popularFor: product.popularFor || '',
      imageUrl: product.imageUrl || product.image || '',
      shadeCardUrl: product.shadeCardUrl || '',
      badge: product.badge || '',
    };

    // Unmark from deleted keys if previously deleted
    if (product.name) this.unmarkDeletedKey(product.id || '', product.name);

    // Save to local public/catalog.json on disk
    try {
      await fetch('/api/admin/save-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (localErr) {
      console.warn('[AdminService] Local disk save notice:', localErr);
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      return {
        success: result.success !== false,
        message: result.message || 'Product saved to sheet, catalog updated, and website deploy triggered.',
        productId: result.productId,
      };
    } catch (err: any) {
      // Fallback: try GET query format if POST had a redirection issue
      try {
        const queryParams = new URLSearchParams({
          action: 'add',
          name: payload.name || '',
          category: payload.category || 'fancy',
          countOrDenier: payload.countOrDenier || '',
          description: payload.description || '',
          imageUrl: payload.imageUrl || '',
          recommendedUses: payload.recommendedUses || '',
          features: payload.features || '',
          badge: payload.badge || '',
        });

        const fallbackUrl = `${url}${url.includes('?') ? '&' : '?'}${queryParams.toString()}`;
        const fallbackRes = await fetch(fallbackUrl, { method: 'GET' });
        const fallbackData = await fallbackRes.json();
        return {
          success: fallbackData.success !== false,
          message: fallbackData.message || 'Product added successfully!',
          productId: fallbackData.productId,
        };
      } catch (fallbackErr: any) {
        return {
          success: false,
          message: `Network error connecting to Apps Script: ${err.message || err}`,
        };
      }
    }
  }

  /**
   * Updates an existing product via Google Apps Script (updating the Google Sheet row, catalog.json, and deploying)
   */
  static async updateProduct(id: string, product: Partial<Product>): Promise<AdminApiResponse> {
    const url = this.getScriptUrl().trim();
    if (!url) {
      return {
        success: false,
        message: 'Apps Script Web App URL is required to update products in Google Sheets. Click "Settings" to enter your URL.',
      };
    }

    const payload = {
      action: 'edit',
      isEdit: true,
      id: id,
      originalId: id,
      originalName: product.name,
      name: product.name,
      category: product.category || 'fancy',
      categoryLabel: product.category === 'garments' ? 'Winter Wear' : (product.categoryLabel || 'Fancy Yarn'),
      countOrDenier: product.countOrDenier || '',
      description: product.description || '',
      recommendedUses: Array.isArray(product.recommendedUses) ? product.recommendedUses.join(', ') : (product.recommendedUses || ''),
      features: Array.isArray(product.features) ? product.features.join(', ') : (product.features || ''),
      sampleAvailable: product.sampleAvailable !== false,
      origin: product.origin || 'Ved Enterprises',
      popularFor: product.popularFor || '',
      imageUrl: product.imageUrl || product.image || '',
      shadeCardUrl: product.shadeCardUrl || '',
      badge: product.badge || '',
    };

    // Unmark from deleted keys
    if (product.name) this.unmarkDeletedKey(id, product.name);

    // Save to local public/catalog.json on disk
    try {
      await fetch('/api/admin/save-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (localErr) {
      console.warn('[AdminService] Local disk update notice:', localErr);
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      return {
        success: result.success !== false,
        message: result.message || 'Product updated in Google Sheet, catalog refreshed, and website rebuild triggered.',
        productId: id,
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Network error connecting to Apps Script: ${err.message || err}`,
      };
    }
  }

  /**
   * Deletes a product by ID or Name via Google Apps Script and local catalog.json
   */
  static async deleteProduct(id: string, name?: string): Promise<AdminApiResponse> {
    // 1. Mark as deleted in localStorage immediately (guarantees it never reappears on reload)
    this.markDeletedKey(id, name);

    // 2. Delete directly from local public/catalog.json on disk
    try {
      await fetch('/api/admin/delete-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name }),
      });
    } catch (localErr) {
      console.warn('[AdminService] Local disk delete notice:', localErr);
    }

    const url = this.getScriptUrl().trim();
    if (!url) {
      return {
        success: true,
        message: `Product "${name || id}" deleted successfully from catalog.`,
      };
    }

    const payload = {
      action: 'delete',
      id: id,
      name: name || '',
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      return {
        success: true,
        message: result.message || `Product "${name || id}" deleted successfully and website updated.`,
      };
    } catch (err: any) {
      // Fallback: Try GET query parameter
      try {
        const queryUrl = `${url}${url.includes('?') ? '&' : '?'}action=delete&id=${encodeURIComponent(id)}&name=${encodeURIComponent(name || '')}&t=${Date.now()}`;
        const fallbackRes = await fetch(queryUrl, { method: 'GET' });
        const fallbackData = await fallbackRes.json();
        return {
          success: true,
          message: fallbackData.message || `Product "${name || id}" deleted successfully.`,
        };
      } catch (fallbackErr: any) {
        return {
          success: true,
          message: `Product "${name || id}" deleted locally from catalog.`,
        };
      }
    }
  }

  /**
   * Manually triggers catalog regeneration and Vercel redeployment
   */
  static async syncWebsite(): Promise<AdminApiResponse> {
    const url = this.getScriptUrl().trim();
    if (!url) {
      return {
        success: false,
        message: 'Apps Script Web App URL is not set. Please set it in Settings first.',
      };
    }

    try {
      const syncUrl = `${url}${url.includes('?') ? '&' : '?'}action=regenerate&t=${Date.now()}`;
      const res = await fetch(syncUrl, { method: 'GET' });
      const data = await res.json();
      return {
        success: data.success !== false,
        message: data.message || `Website synced! Catalog committed and Vercel redeploy triggered.`,
        productCount: data.productCount,
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Sync failed: ${err.message || err}`,
      };
    }
  }
}
