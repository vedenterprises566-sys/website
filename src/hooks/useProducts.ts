import { useState, useEffect, useCallback } from 'react';
import { Product, YarnCategory } from '../types';
import { ProductService } from '../services/productService';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshProducts: (force?: boolean) => Promise<void>;
  categories: (YarnCategory | 'all')[];
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await ProductService.getCatalog(force);
      setProducts(data);
    } catch (err: any) {
      console.error('[useProducts] Error loading products:', err);
      setError(err?.message || 'Failed to load product catalog.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();

    // Auto-poll Google Sheet for new products every 30 seconds
    const interval = setInterval(() => {
      fetchProducts(true);
    }, 30000);

    // Sync when user re-focuses tab
    const handleFocus = () => {
      fetchProducts(true);
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchProducts]);

  const categories: (YarnCategory | 'all')[] = ['all', 'fancy', 'china', 'acrylic-blends', 'fabrics', 'garments'];

  return {
    products,
    loading,
    error,
    refreshProducts: fetchProducts,
    categories,
  };
}
