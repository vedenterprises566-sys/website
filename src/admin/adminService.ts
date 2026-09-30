import { Product, YarnCategory } from '../types';
import { ProductService } from '../services/productService';

const SCRIPT_URL_STORAGE_KEY = 'ved_apps_script_url';

export const DEFAULT_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzrggQItVkhV9fhT851L-rRYEvQ9BZG30ew2YXkuDojt5JJ0R09hXt-XaPs5bMV0TP3oQ/exec';

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
   * Helper to retrieve locally added/custom products from localStorage
   */
  static getCustomProducts(): Product[] {
    try {
      if (typeof window === 'undefined') return [];
      const stored = localStorage.getItem('ved_custom_products');
      if (stored) {
        const list = JSON.parse(stored);
        if (Array.isArray(list)) return list;
      }
    } catch (e) {}
    return [];
  }

  static saveCustomProduct(product: Partial<Product>): void {
    try {
      if (typeof window === 'undefined') return;
      const list = this.getCustomProducts();
      const targetId = String(product.id || '').toLowerCase().trim();
      const targetName = String(product.name || '').toLowerCase().trim();

      const filtered = list.filter((p) => {
        const pId = String(p.id || '').toLowerCase().trim();
        const pName = String(p.name || '').toLowerCase().trim();
        const matchId = targetId && (pId === targetId);
        const matchName = targetName && (pName === targetName);
        return !matchId && !matchName;
      });

      filtered.unshift(product as Product);
      localStorage.setItem('ved_custom_products', JSON.stringify(filtered));

      // Ensure un-deleted
      if (product.id || product.name) {
        this.unmarkDeletedKey(product.id || '', product.name);
      }
    } catch (e) {}
  }

  static removeCustomProduct(id: string, name?: string): void {
    try {
      if (typeof window === 'undefined') return;
      const list = this.getCustomProducts();
      const targetId = String(id || '').toLowerCase().trim();
      const targetName = String(name || '').toLowerCase().trim();

      const filtered = list.filter((p) => {
        const pId = String(p.id || '').toLowerCase().trim();
        const pName = String(p.name || '').toLowerCase().trim();
        const matchId = targetId && (pId === targetId || pId.includes(targetId) || targetId.includes(pId));
        const matchName = targetName && (pName === targetName);
        return !matchId && !matchName;
      });

      localStorage.setItem('ved_custom_products', JSON.stringify(filtered));
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

    // 1. Save to server catalog.json FIRST (source of truth for all devices)
    let serverSaved = false;
    try {
      const serverRes = await fetch('/api/admin/save-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (serverRes.ok) {
        serverSaved = true;
        // Server save succeeded — no need to keep in localStorage
        this.removeCustomProduct(generatedId, cleanName);
        console.log(`[AdminService] Server catalog saved for "${payload.name}"`);
      }
    } catch (e) {
      console.warn('[AdminService] Local server save failed, falling back to localStorage:', e);
    }

    // 2. Fall back to localStorage ONLY if server save failed (offline / no Express)
    if (!serverSaved) {
      this.saveCustomProduct(payload as Product);
    }

    ProductService.clearCache();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('catalog-updated', { detail: { action: 'add', product: payload } }));
    }

    // 3. Dispatch pushed product data to Web3Forms (Google Sheet log & email notification)
    try {
      await this.sendToWeb3Forms('add', payload);
    } catch (w3err) {
      console.warn('[AdminService] Web3Forms push warning:', w3err);
    }

    // 4. Forward to Apps Script (awaited so we can log errors properly)
    const url = this.getScriptUrl().trim();
    if (url) {
      try {
        // Strip base64 images from payload — Apps Script handles image upload to Drive itself
        const scriptPayload = {
          ...payload,
          imageUrl: payload.imageUrl?.startsWith('data:') ? '' : (payload.imageUrl || ''),
          image:    payload.imageUrl?.startsWith('data:') ? '' : (payload.imageUrl || ''),
          pictureUrl: payload.imageUrl?.startsWith('data:') ? '' : (payload.imageUrl || ''),
        };
        const scriptRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(scriptPayload),
        });
        const scriptText = await scriptRes.text();
        console.log('[AdminService] Apps Script response:', scriptText);
      } catch (e) {
        console.warn('[AdminService] Apps script notice:', e);
      }
    }

    return {
      success: true,
      message: `Product "${payload.name}" saved to Web3Forms and catalog successfully!`,
      productId: generatedId,
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

    // 1. Save to server catalog.json FIRST (source of truth for all devices)
    let serverSaved = false;
    try {
      const serverRes = await fetch('/api/admin/save-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (serverRes.ok) {
        serverSaved = true;
        // Server save succeeded — remove from localStorage custom products
        // so it doesn't override server data on THIS or OTHER devices
        this.removeCustomProduct(id, product.name);
        console.log(`[AdminService] Server catalog updated for "${payload.name}"`);
      }
    } catch (e) {
      console.warn('[AdminService] Local server update failed, falling back to localStorage:', e);
    }

    // 2. Fall back to localStorage ONLY if server save failed (offline / no Express)
    if (!serverSaved) {
      this.saveCustomProduct(payload as Product);
    }

    ProductService.clearCache();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('catalog-updated', { detail: { action: 'edit', product: payload } }));
    }

    // 3. Dispatch pushed update to Web3Forms
    try {
      await this.sendToWeb3Forms('edit', payload);
    } catch (w3err) {
      console.warn('[AdminService] Web3Forms edit warning:', w3err);
    }

    // 4. Forward to Apps Script in background
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
    // 1. Remove from custom products and mark as deleted in localStorage immediately (guarantees it never reappears on reload)
    this.removeCustomProduct(id, name);
    this.markDeletedKey(id, name);
    ProductService.clearCache();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('catalog-updated', { detail: { action: 'delete', id, name } }));
    }

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

    // 4. Notify Web3Forms of deletion
    this.sendToWeb3Forms('delete', { id, name }).catch(() => {});

    return {
      success: true,
      message: `Product "${name || id}" deleted successfully from catalog.`,
    };
  }

  /**
   * Dispatches pushed product event (Add / Edit / Delete) directly to Web3Forms
   */
  static async sendToWeb3Forms(action: 'add' | 'edit' | 'delete', data: any): Promise<void> {
    try {
      const accessKey =
        (import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY ||
        '60b1da23-19c5-4576-b47c-7fa27d972f52';
      if (!accessKey) return;

      const isDelete = action === 'delete';
      const actionLabel = action === 'add' ? 'Added' : action === 'edit' ? 'Updated' : 'Deleted';
      const prodName = data.name || data.id || 'Product';
      const subject = `[CATALOG ${action.toUpperCase()}] Product ${actionLabel}: ${prodName}`;

      const uses = Array.isArray(data.recommendedUses)
        ? data.recommendedUses.join(', ')
        : (data.recommendedUses || 'N/A');
      const feats = Array.isArray(data.features)
        ? data.features.join(', ')
        : (data.features || 'N/A');

      const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      const messageBody = isDelete
        ? `VED ENTERPRISES - CATALOG PRODUCT REMOVAL\n\n` +
          `Action: Product Deleted\n` +
          `Product ID: ${data.id || 'N/A'}\n` +
          `Product Name: ${data.name || 'N/A'}\n` +
          `Timestamp: ${timestamp}`
        : `VED ENTERPRISES - CATALOG PRODUCT PUSH\n\n` +
          `Action: Product ${actionLabel}\n` +
          `Product ID: ${data.id || 'N/A'}\n` +
          `Product Name: ${data.name || 'N/A'}\n` +
          `Category: ${data.categoryLabel || data.category || 'N/A'}\n` +
          `Count / Denier: ${data.countOrDenier || 'Standard'}\n` +
          `Badge: ${data.badge || 'N/A'}\n` +
          `Origin: ${data.origin || 'Ved Enterprises Ludhiana'}\n` +
          `Popular For: ${data.popularFor || 'Wholesale Supply'}\n` +
          `Recommended Uses: ${uses}\n` +
          `Key Features: ${feats}\n` +
          `Image URL: ${data.imageUrl || 'None'}\n` +
          `Shade Card URL: ${data.shadeCardUrl || 'None'}\n` +
          `Description: ${data.description || 'N/A'}\n\n` +
          `Timestamp: ${timestamp}`;

      const now = new Date();
      const dateTag = now.toISOString().slice(0, 10).replace(/-/g, '');
      const timeTag = now.toTimeString().slice(0, 8).replace(/:/g, '');
      const formattedName = isDelete ? `DELETE_${prodName}` : `${prodName}_${dateTag}_${timeTag}`;

      const payload: Record<string, any> = {
        access_key: accessKey,
        subject,
        from_name: 'Ved Enterprises Admin Portal',
        name: formattedName,
        Name: formattedName,
        email: 'vedenterprises566@gmail.com',
        Description: data.description || `${prodName} - Wholesale supply from Ved Enterprises Ludhiana.`,
        message: data.description || `${prodName} - Wholesale supply from Ved Enterprises Ludhiana.`,
        'Shade URL': data.shadeCardUrl?.startsWith('data:image') ? 'Local Image Attached' : (data.shadeCardUrl || data.shadeUrl || ''),
        'Picture URL': data.imageUrl?.startsWith('data:image') ? 'Local Image Attached' : (data.imageUrl || data.pictureUrl || data.image || ''),
        'Catalog Action': action.toUpperCase(),
        'Product ID': data.id || 'N/A',
        'Product Name': prodName,
        'Category': data.categoryLabel || data.category || 'N/A',
        'Count or Denier': data.countOrDenier || 'N/A',
        'Timestamp': timestamp,
      };

      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log(`[AdminService] Web3Forms push dispatched for "${prodName}" (${action})`);
    } catch (e: any) {
      console.warn('[AdminService] Web3Forms push notice:', e.message);
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
