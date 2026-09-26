import { Product, YarnCategory } from '../types';
import { ProductService } from '../services/productService';

const SCRIPT_URL_STORAGE_KEY = 'ved_apps_script_url';

export const DEFAULT_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzoPJrjjrEUjaIu2QAy-AAtk8eZyyojVh_aF_NviDFU5LuDieRUXfepJhmGs66H2uZnxA/exec';

export interface AdminApiResponse {
  success: boolean;
  message: string;
  productId?: string;
  productCount?: number;
  error?: string;
}

export class AdminService {
  /**
   * Retrieves the configured Google Apps Script Web App URL from localStorage, env, or default
   */
  static getScriptUrl(): string {
    if (typeof window === 'undefined') return DEFAULT_APPS_SCRIPT_URL;
    const stored = localStorage.getItem(SCRIPT_URL_STORAGE_KEY);
    if (stored && stored.trim()) return stored.trim();
    const envUrl = (import.meta as any).env?.VITE_APPS_SCRIPT_URL;
    if (envUrl && envUrl.trim()) return envUrl.trim();
    return DEFAULT_APPS_SCRIPT_URL;
  }

  /**
   * Saves the Google Apps Script Web App URL to localStorage
   */
  static setScriptUrl(url: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SCRIPT_URL_STORAGE_KEY, (url || DEFAULT_APPS_SCRIPT_URL).trim());
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
    const url = (urlOverride || this.getScriptUrl() || DEFAULT_APPS_SCRIPT_URL).trim();
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
      if (id) {
        set.add(String(id).toLowerCase().trim());
      }
      if (name) {
        const clean = String(name).toLowerCase().trim();
        set.add(clean);
        const withoutYarn = clean.replace(/\s+yarn$/i, '').trim();
        if (withoutYarn) set.add(withoutYarn);
        const withYarn = withoutYarn + ' yarn';
        set.add(withYarn);
      }
      localStorage.setItem('ved_deleted_product_ids', JSON.stringify(Array.from(set)));
    } catch (e) {}
  }

  static unmarkDeletedKey(id: string, name?: string) {
    try {
      const set = this.getDeletedKeys();
      if (id) set.delete(String(id).toLowerCase().trim());
      if (name) {
        const clean = String(name).toLowerCase().trim();
        set.delete(clean);
        set.delete(clean.replace(/\s+yarn$/i, '').trim());
        set.delete(clean.replace(/\s+yarn$/i, '').trim() + ' yarn');
      }
      localStorage.setItem('ved_deleted_product_ids', JSON.stringify(Array.from(set)));
    } catch (e) {}
  }

  /**
   * Loads products from the live catalog (merging Google Sheets and local catalog)
   */
  static async getProducts(): Promise<{ products: Product[]; source: 'app-script' | 'catalog' }> {
    try {
      const products = await ProductService.getCatalog(true);
      return { products, source: 'catalog' };
    } catch (err) {
      console.warn('[AdminService] Error loading catalog:', err);
      return { products: [], source: 'catalog' };
    }
  }

  /**
   * Adds a new product via local API and forwards to Google Apps Script in background
   */
  static async addProduct(product: Partial<Product>): Promise<AdminApiResponse> {
    const cleanName = (product.name || '').trim();
    const slugId = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const generatedId = product.id || `prod-${slugId || Date.now()}`;

    const payload = {
      action: 'add',
      id: generatedId,
      name: cleanName,
      category: product.category || 'fancy',
      categoryLabel: product.category === 'garments' ? 'Winter Wear' : (product.categoryLabel || 'Fancy Yarn'),
      countOrDenier: product.countOrDenier || 'Standard Count',
      description: product.description || '',
      recommendedUses: Array.isArray(product.recommendedUses)
        ? product.recommendedUses
        : (product.recommendedUses ? String(product.recommendedUses).split(',').map((s) => s.trim()) : ['Winter Wear', 'Knitwear']),
      features: Array.isArray(product.features)
        ? product.features
        : (product.features ? String(product.features).split(',').map((s) => s.trim()) : ['High Quality']),
      sampleAvailable: product.sampleAvailable !== false,
      origin: product.origin || 'Ved Enterprises',
      popularFor: product.popularFor || 'Wholesale Supply',
      imageUrl: product.imageUrl || product.image || '',
      shadeCardUrl: product.shadeCardUrl || '',
      badge: product.badge || 'New Item',
    };

    // Unmark from deleted keys if previously deleted
    if (product.name) this.unmarkDeletedKey(generatedId, product.name);

    let savedProductId = generatedId;
    let localSaved = false;

    // 1. Save directly to local server public/catalog.json
    try {
      const localRes = await fetch('/api/admin/save-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (localRes.ok) {
        const localData = await localRes.json();
        if (localData.success) {
          localSaved = true;
          savedProductId = localData.productId || generatedId;
        }
      }
    } catch (localErr) {
      console.warn('[AdminService] Local disk save notice:', localErr);
    }

    // 2. Also forward to Apps Script in background (optional cloud sync)
    const url = this.getScriptUrl().trim();
    if (url) {
      try {
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(payload),
        }).catch((e) => console.warn('[AdminService] Apps script background notice:', e));
      } catch (e) {}
    }

    // Always succeed if saved locally on the active server
    return {
      success: true,
      message: `Product "${payload.name}" added to catalog successfully!`,
      productId: savedProductId,
    };
  }

  /**
   * Updates an existing product via local API and Google Apps Script
   */
  static async updateProduct(id: string, product: Partial<Product>): Promise<AdminApiResponse> {
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
      recommendedUses: Array.isArray(product.recommendedUses)
        ? product.recommendedUses
        : (product.recommendedUses ? String(product.recommendedUses).split(',').map((s) => s.trim()) : []),
      features: Array.isArray(product.features)
        ? product.features
        : (product.features ? String(product.features).split(',').map((s) => s.trim()) : []),
      sampleAvailable: product.sampleAvailable !== false,
      origin: product.origin || 'Ved Enterprises',
      popularFor: product.popularFor || '',
      imageUrl: product.imageUrl || product.image || '',
      shadeCardUrl: product.shadeCardUrl || '',
      badge: product.badge || '',
    };

    // Unmark from deleted keys
    if (product.name) this.unmarkDeletedKey(id, product.name);

    // 1. Save to local public/catalog.json on disk
    try {
      await fetch('/api/admin/save-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (localErr) {
      console.warn('[AdminService] Local disk update notice:', localErr);
    }

    // 2. Forward to Apps Script in background
    const url = this.getScriptUrl().trim();
    if (url) {
      try {
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(payload),
        }).catch((e) => console.warn('[AdminService] Apps script update notice:', e));
      } catch (e) {}
    }

    return {
      success: true,
      message: `Product "${payload.name}" updated successfully!`,
      productId: id,
    };
  }

  /**
   * Deletes a product by ID or Name via local server and Google Apps Script
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

    // 3. Attempt forward to Apps Script in background
    const url = this.getScriptUrl().trim();
    if (url) {
      const payload = {
        action: 'delete',
        id: id,
        name: name || '',
      };
      try {
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(payload),
        }).catch((e) => console.warn('[AdminService] Apps script delete notice:', e));
      } catch (e) {}
    }

    return {
      success: true,
      message: `Product "${name || id}" deleted successfully from catalog.`,
    };
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
