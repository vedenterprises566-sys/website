import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Trash2,
  Search,
  RefreshCw,
  ExternalLink,
  Settings,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Shirt,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Tag,
  Eye,
  X,
  Link2,
  FileSpreadsheet,
  Globe,
  SlidersHorizontal,
  ChevronDown,
  UploadCloud,
  FileText,
  Check,
  Paperclip,
  Pencil,
  ArrowUpDown,
  FolderTree,
  List,
} from 'lucide-react';
import { Product, YarnCategory } from '../types';
import { AdminService } from './adminService';
import {
  isAdminSubdomain,
  getMainWebsiteUrl,
  compressImageFile,
  readShadeCardFile,
} from './adminUtils';

export const AdminPanel: React.FC = () => {
  // State for products & filtering
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<YarnCategory | 'all'>('all');
  const [dataSource, setDataSource] = useState<'app-script' | 'catalog'>('catalog');

  // Apps Script configuration state
  const [scriptUrl, setScriptUrl] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
  }>({ tested: false, success: false, message: '' });

  // Add Product form state
  const [isAddFormOpen, setIsAddFormOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    name: string;
    category: YarnCategory;
    countOrDenier: string;
    description: string;
    imageUrl: string;
    imageFileName?: string;
    imageFileSize?: string;
    shadeCardUrl: string;
    shadeCardFileName?: string;
    shadeCardFileType?: 'pdf' | 'image' | null;
    shadeCardFileSize?: string;
  }>({
    name: '',
    category: 'garments', // Default to Winter Wear
    countOrDenier: '',
    description: '',
    imageUrl: '',
    shadeCardUrl: '',
  });

  const [showManualImageUrl, setShowManualImageUrl] = useState<boolean>(false);
  const [showManualShadeUrl, setShowManualShadeUrl] = useState<boolean>(false);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [isUploadingShade, setIsUploadingShade] = useState<boolean>(false);

  // Edit Product state (null = add mode, Product = edit mode)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Sorting state: 'category' | 'name-asc' | 'name-desc' | 'count'
  const [sortBy, setSortBy] = useState<'category' | 'name-asc' | 'name-desc' | 'count'>('category');

  // View mode: 'grouped' (category-wise cards) | 'list' (flat table)
  const [viewMode, setViewMode] = useState<'grouped' | 'list'>('grouped');

  // Delete Confirmation state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Sync state
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Toast notifications
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'info';
    message: string;
  }>({ show: false, type: 'info', message: '' });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4500);
  };

  // Load configuration & products on mount
  useEffect(() => {
    const savedUrl = AdminService.getScriptUrl();
    setScriptUrl(savedUrl);
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const { products: fetchedProducts, source } = await AdminService.getProducts();
      setProducts(fetchedProducts);
      setDataSource(source);
      if (source === 'app-script') {
        setConnectionStatus({
          tested: true,
          success: true,
          message: `Connected: Loaded ${fetchedProducts.length} live products from Google Sheets catalog.`,
        });
      }
    } catch (err: any) {
      showToast('Error loading products: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Save Apps Script URL
  const handleSaveSettings = async () => {
    AdminService.setScriptUrl(scriptUrl);
    setIsSyncing(true);
    const testResult = await AdminService.testConnection(scriptUrl);
    setConnectionStatus({
      tested: true,
      success: testResult.success,
      message: testResult.message,
    });
    setIsSyncing(false);

    if (testResult.success) {
      showToast('Apps Script URL saved & connected successfully!', 'success');
      setIsSettingsOpen(false);
      loadProducts();
    } else {
      showToast(testResult.message, 'error');
    }
  };

  // Check if current category is a Yarn
  const isYarnCategory = ['fancy', 'china', 'acrylic-blends'].includes(formData.category);

  // Handle Product Image File Upload (drag/drop or file picker)
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const res = await compressImageFile(file);
      setFormData((prev) => ({
        ...prev,
        imageUrl: res.dataUrl,
        imageFileName: res.fileName,
        imageFileSize: res.sizeFormatted,
      }));
      showToast(`📸 Image processed (${res.sizeFormatted})`);
    } catch (err: any) {
      showToast(`Failed to process image: ${err.message}`, 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle Shade Card File Upload (PDF or Image - Only for Yarns)
  const handleShadeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingShade(true);
    try {
      const res = await readShadeCardFile(file);
      setFormData((prev) => ({
        ...prev,
        shadeCardUrl: res.dataUrl,
        shadeCardFileName: res.fileName,
        shadeCardFileType: res.fileType,
        shadeCardFileSize: res.sizeFormatted,
      }));
      showToast(
        res.fileType === 'pdf'
          ? `📄 PDF Shade Card attached (${res.sizeFormatted})`
          : `🎨 Shade Card Image attached (${res.sizeFormatted})`
      );
    } catch (err: any) {
      showToast(`Failed to process shade card: ${err.message}`, 'error');
    } finally {
      setIsUploadingShade(false);
    }
  };

  // Handle category change in form (clearing shade card if switched away from yarns)
  const handleCategoryChangeInForm = (newCategory: YarnCategory) => {
    const isYarn = ['fancy', 'china', 'acrylic-blends'].includes(newCategory);
    setFormData((prev) => ({
      ...prev,
      category: newCategory,
      ...(!isYarn
        ? {
            shadeCardUrl: '',
            shadeCardFileName: undefined,
            shadeCardFileType: null,
            shadeCardFileSize: undefined,
          }
        : {}),
    }));
  };

  // Open Modal for Adding a New Product
  const handleOpenAddModal = (initialCategory?: YarnCategory) => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: initialCategory || (selectedCategoryTab !== 'all' ? selectedCategoryTab : 'garments'),
      countOrDenier: '',
      description: '',
      imageUrl: '',
      shadeCardUrl: '',
      imageFileName: undefined,
      imageFileSize: undefined,
      shadeCardFileName: undefined,
      shadeCardFileType: null,
      shadeCardFileSize: undefined,
    });
    setShowManualImageUrl(false);
    setShowManualShadeUrl(false);
    setIsAddFormOpen(true);
  };

  // Open Modal for Editing an Existing Product
  const handleEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    const cat = prod.category === ('winter-wear' as any) ? 'garments' : prod.category || 'garments';
    setFormData({
      name: prod.name || '',
      category: cat,
      countOrDenier: prod.countOrDenier || '',
      description: prod.description || '',
      imageUrl: prod.imageUrl || prod.image || '',
      shadeCardUrl: prod.shadeCardUrl || '',
      imageFileName: prod.imageUrl || prod.image ? 'Current Image' : undefined,
      shadeCardFileName: prod.shadeCardUrl
        ? prod.shadeCardUrl.toLowerCase().endsWith('.pdf') || prod.shadeCardUrl.includes('.pdf')
          ? 'Current PDF Shade Card'
          : 'Current Shade Card Image'
        : undefined,
      shadeCardFileType:
        prod.shadeCardUrl?.toLowerCase().endsWith('.pdf') || prod.shadeCardUrl?.includes('.pdf')
          ? 'pdf'
          : prod.shadeCardUrl
          ? 'image'
          : null,
    });
    setShowManualImageUrl(false);
    setShowManualShadeUrl(false);
    setIsAddFormOpen(true);
  };

  // Handle Add or Edit Product Submit
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter a product name', 'error');
      return;
    }

    setIsSubmitting(true);

    const isWinterWear = formData.category === 'garments';
    const isYarn = ['fancy', 'china', 'acrylic-blends'].includes(formData.category);

    // Smart automated defaults for background catalog fields
    const defaultUses = isWinterWear
      ? ['Winter Wear', 'Finished Knitwear', 'Corporate & Retail Apparel']
      : formData.category === 'fabrics'
      ? ['Garment Manufacturing', 'Textile Processing', 'Lining & Suiting']
      : ['Knitting & Hosiery', 'Weaving', 'Winter Knitwear'];

    const defaultFeatures = isWinterWear
      ? ['High Bulk Warmth', 'Pill Resistant', 'Soft Hand Feel']
      : formData.category === 'fabrics'
      ? ['Superior Drape', 'Color Fastness', 'High GSM Density']
      : ['Consistent Count', 'Even Dyeing', 'High Tensile Strength'];

    const defaultOrigin = isWinterWear
      ? 'Ved Garment Collection (Ludhiana)'
      : 'Ved Enterprises Ludhiana';

    const defaultBadge = isWinterWear
      ? 'Winter Collection'
      : formData.category === 'china'
      ? 'Imported'
      : 'In Stock';

    const newProductPayload: Partial<Product> = {
      name: formData.name.trim(),
      category: formData.category,
      categoryLabel: isWinterWear ? 'Winter Wear' : getCategoryLabel(formData.category),
      countOrDenier: formData.countOrDenier.trim() || (isWinterWear ? 'Standard Size' : 'Standard Count'),
      description: formData.description.trim() || `${formData.name.trim()} - Premium quality wholesale textile item supplied by Ved Enterprises, Ludhiana.`,
      recommendedUses: defaultUses,
      features: defaultFeatures,
      imageUrl: formData.imageUrl.trim(),
      // Shade card only saved for yarn categories
      shadeCardUrl: isYarn ? formData.shadeCardUrl.trim() : '',
      badge: defaultBadge,
      origin: defaultOrigin,
      popularFor: isWinterWear ? 'Winter Wear Collections' : 'Bulk Wholesale Dispatch',
      sampleAvailable: true,
    };

    let res;
    if (editingProduct) {
      res = await AdminService.updateProduct(editingProduct.id, newProductPayload);
    } else {
      res = await AdminService.addProduct(newProductPayload);
    }
    setIsSubmitting(false);

    if (res.success) {
      if (editingProduct) {
        showToast(`✅ "${formData.name}" updated successfully!`);
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id
              ? {
                  ...p,
                  ...(newProductPayload as any),
                }
              : p
          )
        );
      } else {
        showToast(`✅ "${formData.name}" added to sheet! Website rebuild triggered.`);
        const optimisticProduct: Product = {
          id: res.productId || `prod-${Date.now()}`,
          ...(newProductPayload as any),
        };
        setProducts((prev) => [optimisticProduct, ...prev]);
      }

      setEditingProduct(null);
      // Reset form
      setFormData({
        name: '',
        category: 'garments',
        countOrDenier: '',
        description: '',
        imageUrl: '',
        shadeCardUrl: '',
        imageFileName: undefined,
        imageFileSize: undefined,
        shadeCardFileName: undefined,
        shadeCardFileType: null,
        shadeCardFileSize: undefined,
      });
      setShowManualImageUrl(false);
      setShowManualShadeUrl(false);
      setIsAddFormOpen(false);
    } else {
      showToast(res.message, 'error');
    }
  };

  // Handle Delete Confirmation
  const confirmDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    const res = await AdminService.deleteProduct(productToDelete.id, productToDelete.name);
    setIsDeleting(false);

    const isSuccess = res.success || (res.message && res.message.toLowerCase().includes('not found'));

    if (isSuccess) {
      showToast(`🗑️ "${productToDelete.name}" deleted and website updated.`);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setProductToDelete(null);
    } else {
      showToast(res.message, 'error');
    }
  };

  // Trigger manual website redeploy
  const handleSyncWebsite = async () => {
    setIsSyncing(true);
    const res = await AdminService.syncWebsite();
    setIsSyncing(false);

    if (res.success) {
      showToast(res.message || '🚀 Website rebuild triggered successfully!');
      loadProducts();
    } else {
      showToast(res.message, 'error');
    }
  };

  // Category labels helper
  function getCategoryLabel(category: YarnCategory): string {
    switch (category) {
      case 'garments':
        return 'Winter Wear';
      case 'fancy':
        return 'Fancy Yarn';
      case 'china':
        return 'China / Imported Yarn';
      case 'acrylic-blends':
        return 'Acrylic & Blends';
      case 'fabrics':
        return 'Fabrics & Textile Rolls';
      default:
        return 'Fancy Yarn';
    }
  }

  // Priority order for category-wise display
  const CATEGORY_ORDER: YarnCategory[] = ['garments', 'fancy', 'china', 'acrylic-blends', 'fabrics'];

  const CATEGORY_METADATA: Record<
    YarnCategory,
    { title: string; subtitle: string; icon: any; color: string; badgeBg: string }
  > = {
    garments: {
      title: 'Winter Wear (Finished Garments)',
      subtitle: 'Premium knitwear, sweaters, cardigans & winter apparels',
      icon: Shirt,
      color: 'text-red-600',
      badgeBg: 'bg-red-50 text-red-700 border-red-200',
    },
    fancy: {
      title: 'Fancy Yarns',
      subtitle: 'Feather, lurex, slub, snarl, loop & novelty effect yarns',
      icon: Sparkles,
      color: 'text-amber-600',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    china: {
      title: 'China & Imported Yarns',
      subtitle: 'High-speed Chenille, Vislon, Air-textured & specialty yarns',
      icon: Globe,
      color: 'text-blue-600',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    'acrylic-blends': {
      title: 'Acrylic & Blended Yarns',
      subtitle: 'High bulk wooly, cotton blends & durable industrial yarns',
      icon: Layers,
      color: 'text-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    fabrics: {
      title: 'Fabrics & Textile Rolls',
      subtitle: 'Specialty knit fabrics, ribbing, collars & roll goods',
      icon: SlidersHorizontal,
      color: 'text-purple-600',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  };

  // Filtered & Sorted products
  const sortedAndFilteredProducts = [...products]
    .filter((p) => {
      const matchesCat =
        selectedCategoryTab === 'all' ||
        p.category === selectedCategoryTab ||
        (selectedCategoryTab === 'garments' && (p.category === ('winter-wear' as any) || p.category === 'garments'));

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCat;

      const matchesSearch =
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.countOrDenier?.toLowerCase().includes(q) ||
        p.categoryLabel?.toLowerCase().includes(q) ||
        p.id?.toLowerCase().includes(q);

      return matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'name-asc') {
        return (a.name || '').localeCompare(b.name || '');
      }
      if (sortBy === 'name-desc') {
        return (b.name || '').localeCompare(a.name || '');
      }
      if (sortBy === 'count') {
        return (a.countOrDenier || '').localeCompare(b.countOrDenier || '');
      }
      // 'category' order:
      const catA = a.category === ('winter-wear' as any) ? 'garments' : a.category;
      const catB = b.category === ('winter-wear' as any) ? 'garments' : b.category;
      const orderA = CATEGORY_ORDER.indexOf(catA as YarnCategory);
      const orderB = CATEGORY_ORDER.indexOf(catB as YarnCategory);
      if (orderA !== orderB) {
        return (orderA === -1 ? 99 : orderA) - (orderB === -1 ? 99 : orderB);
      }
      return (a.name || '').localeCompare(b.name || '');
    });

  // Grouped products by category for category-wise display
  const groupedProducts = CATEGORY_ORDER.map((cat) => {
    const items = sortedAndFilteredProducts.filter(
      (p) => p.category === cat || (cat === 'garments' && (p.category as any) === 'winter-wear')
    );
    return {
      category: cat,
      meta: CATEGORY_METADATA[cat],
      items,
    };
  }).filter((group) => group.items.length > 0 || (!searchQuery && selectedCategoryTab === 'all'));

  // Category counts
  const categoryCounts = {
    all: products.length,
    garments: products.filter((p) => p.category === 'garments' || (p.category as any) === 'winter-wear').length,
    fancy: products.filter((p) => p.category === 'fancy').length,
    china: products.filter((p) => p.category === 'china').length,
    'acrylic-blends': products.filter((p) => p.category === 'acrylic-blends').length,
    fabrics: products.filter((p) => p.category === 'fabrics').length,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-red-500 selection:text-white">
      {/* ============================================================== */}
      {/* 1. TOP WHITE HEADER BAR */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <a
              href={getMainWebsiteUrl()}
              className="w-10 h-10 bg-gradient-to-tr from-red-600 to-amber-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-xs hover:scale-105 transition-transform"
              title="Return to Live Website"
            >
              V
            </a>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  Ved Enterprises Admin
                </h1>
                <span className="bg-red-50 text-red-700 border border-red-200 text-[0.625rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Product Manager
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 text-[0.6875rem] font-mono font-medium px-2 py-0.5 rounded-lg">
                  <Globe className="w-3 h-3 text-blue-600" />
                  admin.ved.enterprises
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Add, delete and synchronize wholesale products with Google Sheets & website
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Apps Script Status Pill */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                scriptUrl
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
              title="Configure Google Apps Script Webhook"
            >
              <span className={`w-2 h-2 rounded-full ${scriptUrl ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{scriptUrl ? 'Apps Script Connected' : 'Connect Apps Script'}</span>
            </button>

            {/* Sync Website Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSyncWebsite}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 shadow-xs transition-colors disabled:opacity-50"
              title="Trigger catalog regeneration and Vercel rebuild"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-red-600' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync Website'}</span>
            </motion.button>

            {/* Add Product Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleOpenAddModal()}
              className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-extrabold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </motion.button>

            {/* Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              title="Settings & Apps Script Webhook"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Back to Live Website */}
            <a
              href={getMainWebsiteUrl()}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-red-600 px-2 py-1 rounded-lg transition-colors"
              title="Open public website"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Live Store</span>
            </a>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. STATS & METRICS BAR (WHITE CARDS) */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Total */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[0.6875rem] font-bold text-slate-400 uppercase tracking-wider block">Total Items</span>
            <div className="text-xl font-black text-slate-900 mt-0.5">{categoryCounts.all}</div>
          </div>

          {/* Winter Wear */}
          <div className="bg-white p-3.5 rounded-2xl border border-red-200/80 shadow-xs bg-gradient-to-br from-white via-white to-red-50/40">
            <span className="text-[0.6875rem] font-bold text-red-600 uppercase tracking-wider block flex items-center gap-1">
              <Shirt className="w-3 h-3" /> Winter Wear
            </span>
            <div className="text-xl font-black text-red-600 mt-0.5">{categoryCounts.garments}</div>
          </div>

          {/* Fancy Yarn */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[0.6875rem] font-bold text-amber-600 uppercase tracking-wider block">Fancy Yarns</span>
            <div className="text-xl font-black text-slate-800 mt-0.5">{categoryCounts.fancy}</div>
          </div>

          {/* China Yarn */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[0.6875rem] font-bold text-blue-600 uppercase tracking-wider block">China / Imported</span>
            <div className="text-xl font-black text-slate-800 mt-0.5">{categoryCounts.china}</div>
          </div>

          {/* Acrylic */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[0.6875rem] font-bold text-emerald-600 uppercase tracking-wider block">Acrylic & Blends</span>
            <div className="text-xl font-black text-slate-800 mt-0.5">{categoryCounts['acrylic-blends']}</div>
          </div>

          {/* Fabrics */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[0.6875rem] font-bold text-purple-600 uppercase tracking-wider block">Fabrics & Rolls</span>
            <div className="text-xl font-black text-slate-800 mt-0.5">{categoryCounts.fabrics}</div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. MAIN PRODUCT DIRECTORY CONTAINER */}
      {/* ============================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name, count, description or ID..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Action buttons: Sort, View Mode, Count, Refresh */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-500 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-bold text-slate-800 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="category">Category-Wise</option>
                  <option value="name-asc">Name (A → Z)</option>
                  <option value="name-desc">Name (Z → A)</option>
                  <option value="count">Count / Denier</option>
                </select>
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('grouped')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                    viewMode === 'grouped'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Grouped by Category"
                >
                  <FolderTree className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Category View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Compact Table View"
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">List View</span>
                </button>
              </div>

              <span className="text-xs text-slate-500 whitespace-nowrap pl-1">
                <strong className="text-slate-900">{sortedAndFilteredProducts.length}</strong> items
              </span>

              <button
                onClick={loadProducts}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                title="Reload from source"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-3">
            {[
              { id: 'all', label: 'All Products', count: categoryCounts.all },
              { id: 'garments', label: '🧥 Winter Wear', count: categoryCounts.garments },
              { id: 'fancy', label: '✨ Fancy Yarn', count: categoryCounts.fancy },
              { id: 'china', label: '🌏 China / Imported', count: categoryCounts.china },
              { id: 'acrylic-blends', label: '🧶 Acrylic & Blends', count: categoryCounts['acrylic-blends'] },
              { id: 'fabrics', label: '🧵 Fabrics', count: categoryCounts.fabrics },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategoryTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategoryTab === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[0.625rem] px-1.5 py-0.5 rounded-full ${
                    selectedCategoryTab === tab.id ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-3 shadow-xs">
            <RefreshCw className="w-8 h-8 text-red-600 animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Loading catalog items...</p>
          </div>
        ) : sortedAndFilteredProducts.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No products match your filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try searching with a different keyword or select another category above.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryTab('all');
              }}
              className="mt-2 text-xs font-bold text-red-600 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : viewMode === 'grouped' && selectedCategoryTab === 'all' ? (
          /* 1. CATEGORY-WISE GROUPED VIEW */
          <div className="space-y-6">
            {groupedProducts.map((group) => {
              const IconComponent = group.meta.icon;
              return (
                <div
                  key={group.category}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden"
                >
                  {/* Category Header Banner */}
                  <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-slate-50/70 via-white to-white">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${group.meta.badgeBg}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                            {group.meta.title}
                          </h2>
                          <span className="text-[0.6875rem] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                            {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                        <p className="text-[0.6875rem] text-slate-400 hidden sm:block">
                          {group.meta.subtitle}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenAddModal(group.category)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-red-600 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-red-600" />
                      <span>Add to {getCategoryLabel(group.category)}</span>
                    </button>
                  </div>

                  {/* Compact Shortened Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100 text-[0.625rem] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="py-2.5 px-4 sm:px-5">Product Details</th>
                          <th className="py-2.5 px-3">Count / Denier</th>
                          <th className="py-2.5 px-3">Category</th>
                          <th className="py-2.5 px-3">Shade Card</th>
                          <th className="py-2.5 px-4 sm:px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {group.items.map((p) => {
                          const isGarment = p.category === 'garments' || (p.category as any) === 'winter-wear';
                          const detailUrl = isGarment
                            ? `/catalog/garments/winter-wear/${p.id}`
                            : `/catalog/yarns/${p.category}-yarns/${p.id}`;
                          const hasShadeCard = Boolean(p.shadeCardUrl);
                          const isPdfShade =
                            hasShadeCard &&
                            (p.shadeCardUrl!.toLowerCase().endsWith('.pdf') || p.shadeCardUrl!.includes('.pdf'));

                          return (
                            <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                              {/* 1. Name & Thumbnail */}
                              <td className="py-2.5 px-4 sm:px-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex-shrink-0 overflow-hidden flex items-center justify-center relative">
                                    {p.imageUrl || p.image || p.pictureUrl ? (
                                      <img
                                        src={p.imageUrl || p.image || p.pictureUrl}
                                        alt={p.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          (e.target as HTMLElement).style.display = 'none';
                                        }}
                                      />
                                    ) : (
                                      <ImageIcon className="w-4 h-4 text-slate-300" />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-bold text-slate-900 group-hover:text-red-600 transition-colors flex items-center gap-1.5">
                                      <span className="truncate">{p.name}</span>
                                      {p.badge && (
                                        <span className="text-[0.5625rem] font-extrabold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200">
                                          {p.badge}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[0.6875rem] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                                      <span>{p.id}</span>
                                      {p.description && (
                                        <span className="text-slate-400 truncate max-w-xs hidden sm:inline">
                                          • {p.description}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* 2. Count / Denier */}
                              <td className="py-2.5 px-3 whitespace-nowrap">
                                <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-lg border border-slate-200/80">
                                  {p.countOrDenier || '-'}
                                </span>
                              </td>

                              {/* 3. Category Badge */}
                              <td className="py-2.5 px-3 whitespace-nowrap">
                                {isGarment ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6875rem] font-extrabold bg-red-50 text-red-700 border border-red-200">
                                    <Shirt className="w-2.5 h-2.5 text-red-500" />
                                    Winter Wear
                                  </span>
                                ) : p.category === 'china' ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6875rem] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                    China / Imported
                                  </span>
                                ) : p.category === 'acrylic-blends' ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6875rem] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    Acrylic & Blends
                                  </span>
                                ) : p.category === 'fabrics' ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6875rem] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                    Fabrics
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6875rem] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                    Fancy Yarn
                                  </span>
                                )}
                              </td>

                              {/* 4. Shade Card */}
                              <td className="py-2.5 px-3 whitespace-nowrap">
                                {hasShadeCard ? (
                                  <a
                                    href={p.shadeCardUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-1 text-[0.6875rem] font-bold px-2 py-0.5 rounded-md border transition-all hover:scale-105 ${
                                      isPdfShade
                                        ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                        : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                                    }`}
                                    title="Open Shade Card document"
                                  >
                                    {isPdfShade ? (
                                      <FileText className="w-3 h-3 text-red-600" />
                                    ) : (
                                      <ImageIcon className="w-3 h-3 text-amber-600" />
                                    )}
                                    <span>{isPdfShade ? 'PDF Card' : 'Image Card'}</span>
                                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                                  </a>
                                ) : (
                                  <span className="text-slate-300 text-xs">-</span>
                                )}
                              </td>

                              {/* 5. Actions: Edit, Preview, Delete */}
                              <td className="py-2.5 px-4 sm:px-5 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Edit Button */}
                                  <button
                                    onClick={() => handleEditProduct(p)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-500 text-amber-800 hover:text-white rounded-lg text-xs font-bold border border-amber-200 hover:border-amber-500 transition-all shadow-2xs"
                                    title="Edit product details, count, image or shade card"
                                  >
                                    <Pencil className="w-3 h-3" />
                                    <span>Edit</span>
                                  </button>

                                  {/* Preview Button */}
                                  <a
                                    href={detailUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                                    title="Preview on website"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>

                                  {/* Delete Button */}
                                  <button
                                    onClick={() => setProductToDelete(p)}
                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete product from Google Sheet and website"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* 2. FLAT COMPACT TABLE VIEW */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">
                  {selectedCategoryTab === 'all'
                    ? 'All Products'
                    : getCategoryLabel(selectedCategoryTab as YarnCategory)}
                </h2>
                <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200">
                  {sortedAndFilteredProducts.length} products
                </span>
              </div>

              <button
                onClick={() =>
                  handleOpenAddModal(
                    selectedCategoryTab !== 'all' ? (selectedCategoryTab as YarnCategory) : undefined
                  )
                }
                className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[0.625rem] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-4 sm:px-5">Product Details</th>
                    <th className="py-2.5 px-3">Count / Denier</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Shade Card</th>
                    <th className="py-2.5 px-4 sm:px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {sortedAndFilteredProducts.map((p) => {
                    const isGarment = p.category === 'garments' || (p.category as any) === 'winter-wear';
                    const detailUrl = isGarment
                      ? `/catalog/garments/winter-wear/${p.id}`
                      : `/catalog/yarns/${p.category}-yarns/${p.id}`;
                    const hasShadeCard = Boolean(p.shadeCardUrl);
                    const isPdfShade =
                      hasShadeCard &&
                      (p.shadeCardUrl!.toLowerCase().endsWith('.pdf') || p.shadeCardUrl!.includes('.pdf'));

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                        {/* 1. Name & Thumbnail */}
                        <td className="py-2.5 px-4 sm:px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex-shrink-0 overflow-hidden flex items-center justify-center relative">
                              {p.imageUrl || p.image || p.pictureUrl ? (
                                <img
                                  src={p.imageUrl || p.image || p.pictureUrl}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <ImageIcon className="w-4 h-4 text-slate-300" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 group-hover:text-red-600 transition-colors flex items-center gap-1.5">
                                <span className="truncate">{p.name}</span>
                                {p.badge && (
                                  <span className="text-[0.5625rem] font-extrabold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200">
                                    {p.badge}
                                  </span>
                                )}
                              </div>
                              <div className="text-[0.6875rem] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                                <span>{p.id}</span>
                                {p.description && (
                                  <span className="text-slate-400 truncate max-w-xs hidden sm:inline">
                                    • {p.description}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Count / Denier */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-lg border border-slate-200/80">
                            {p.countOrDenier || '-'}
                          </span>
                        </td>

                        {/* 3. Category Badge */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          {isGarment ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6875rem] font-extrabold bg-red-50 text-red-700 border border-red-200">
                              <Shirt className="w-2.5 h-2.5 text-red-500" />
                              Winter Wear
                            </span>
                          ) : p.category === 'china' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6875rem] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              China / Imported
                            </span>
                          ) : p.category === 'acrylic-blends' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6875rem] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Acrylic & Blends
                            </span>
                          ) : p.category === 'fabrics' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6875rem] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                              Fabrics
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6875rem] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              Fancy Yarn
                            </span>
                          )}
                        </td>

                        {/* 4. Shade Card */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          {hasShadeCard ? (
                            <a
                              href={p.shadeCardUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-1 text-[0.6875rem] font-bold px-2 py-0.5 rounded-md border transition-all hover:scale-105 ${
                                isPdfShade
                                  ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                              }`}
                              title="Open Shade Card document"
                            >
                              {isPdfShade ? (
                                <FileText className="w-3 h-3 text-red-600" />
                              ) : (
                                <ImageIcon className="w-3 h-3 text-amber-600" />
                              )}
                              <span>{isPdfShade ? 'PDF Card' : 'Image Card'}</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </a>
                          ) : (
                            <span className="text-slate-300 text-xs">-</span>
                          )}
                        </td>

                        {/* 5. Actions: Edit, Preview, Delete */}
                        <td className="py-2.5 px-4 sm:px-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Edit Button */}
                            <button
                              onClick={() => handleEditProduct(p)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-500 text-amber-800 hover:text-white rounded-lg text-xs font-bold border border-amber-200 hover:border-amber-500 transition-all shadow-2xs"
                              title="Edit product details, count, image or shade card"
                            >
                              <Pencil className="w-3 h-3" />
                              <span>Edit</span>
                            </button>

                            {/* Preview Button */}
                            <a
                              href={detailUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Preview on website"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>

                            {/* Delete Button */}
                            <button
                              onClick={() => setProductToDelete(p)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete product from Google Sheet and website"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* 4. ADD PRODUCT MODAL / DRAWER (WHITE CARD) */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isAddFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto relative"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                      editingProduct ? 'bg-amber-100 text-amber-800' : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {editingProduct ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product'}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {editingProduct
                        ? `ID: ${editingProduct.id} • Updates Google Sheet & catalog`
                        : 'Saves to Google Sheet, commits to catalog.json & rebuilds website'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddFormOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleAddSubmit} className="space-y-4">
                {/* Category & Count Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleCategoryChangeInForm(e.target.value as YarnCategory)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all cursor-pointer"
                    >
                      <option value="garments">🧥 Winter Wear (Finished Garments)</option>
                      <option value="fancy">✨ Fancy Yarn</option>
                      <option value="china">🌏 China / Imported Yarn</option>
                      <option value="acrylic-blends">🧶 Acrylic & Blends</option>
                      <option value="fabrics">🧵 Fabrics & Textile Rolls</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Count / Denier / Gauge
                    </label>
                    <input
                      type="text"
                      value={formData.countOrDenier}
                      onChange={(e) => setFormData({ ...formData, countOrDenier: e.target.value })}
                      placeholder={
                        formData.category === 'garments'
                          ? 'e.g. 7GG (2/18 Wooly) or Free Size'
                          : 'e.g. 2/28 Nm, 18 Nm, 300D Space'
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    />
                  </div>
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={
                      formData.category === 'garments'
                        ? "e.g. Men's Classic Wooly Crewneck Winter Wear"
                        : "e.g. 2/28 Nm High Bulk Acrylic Dyed Yarn"
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Wholesale specifications, warmth characteristics, hand feel, and dispatch packaging details..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-y"
                  />
                </div>

                {/* 1. PRODUCT IMAGE UPLOAD SECTION */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-red-600" />
                      <span>Product Image</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowManualImageUrl(!showManualImageUrl)}
                      className="text-[0.6875rem] text-slate-500 hover:text-red-600 font-semibold underline transition-colors"
                    >
                      {showManualImageUrl ? 'Upload from device' : 'Or paste image link'}
                    </button>
                  </div>

                  {showManualImageUrl ? (
                    <div>
                      <input
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            imageUrl: e.target.value,
                            imageFileName: undefined,
                            imageFileSize: undefined,
                          })
                        }
                        placeholder="https://drive.google.com/... or image URL"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                      />
                    </div>
                  ) : formData.imageUrl ? (
                    /* Uploaded Image Preview Card */
                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={formData.imageUrl}
                          alt="Product preview"
                          className="w-14 h-14 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {formData.imageFileName || 'Selected Product Image'}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {formData.imageFileSize && (
                              <span className="text-[0.625rem] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                                {formData.imageFileSize}
                              </span>
                            )}
                            <span className="text-[0.625rem] text-emerald-600 font-bold flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> Ready
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <label className="cursor-pointer px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors">
                          Change
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              imageUrl: '',
                              imageFileName: undefined,
                              imageFileSize: undefined,
                            }))
                          }
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Drag & Drop / File Picker Area */
                    <label className="relative border-2 border-dashed border-slate-300 hover:border-red-500/80 bg-white hover:bg-red-50/20 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                      <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-800">
                        {isUploadingImage ? 'Processing image...' : 'Click to upload product image or drag & drop'}
                      </p>
                      <p className="text-[0.6875rem] text-slate-400 mt-0.5">
                        Supports PNG, JPG, WEBP • Automatically optimized
                      </p>
                    </label>
                  )}
                </div>

                {/* 2. SHADE CARD UPLOAD SECTION (PDF or Image - ONLY in Yarn Categories) */}
                {isYarnCategory && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/90 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-amber-600" />
                        <span>Shade Card (PDF Catalog or Image)</span>
                        <span className="text-[0.5625rem] bg-amber-200/70 text-amber-900 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                          Yarns Only
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowManualShadeUrl(!showManualShadeUrl)}
                        className="text-[0.6875rem] text-slate-500 hover:text-amber-800 font-semibold underline transition-colors"
                      >
                        {showManualShadeUrl ? 'Upload file' : 'Or enter link'}
                      </button>
                    </div>

                    {showManualShadeUrl ? (
                      <div>
                        <input
                          type="url"
                          value={formData.shadeCardUrl}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              shadeCardUrl: e.target.value,
                              shadeCardFileName: undefined,
                              shadeCardFileType: null,
                              shadeCardFileSize: undefined,
                            })
                          }
                          placeholder="https://drive.google.com/... or direct PDF / Image link"
                          className="w-full px-3.5 py-2.5 bg-white border border-amber-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        />
                      </div>
                    ) : formData.shadeCardUrl ? (
                      /* Uploaded Shade Card Preview Card (PDF or Image) */
                      <div className="bg-white p-3 rounded-xl border border-amber-200 flex items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-3 min-w-0">
                          {formData.shadeCardFileType === 'pdf' ? (
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs border border-red-200">
                              <FileText className="w-6 h-6 text-red-600" />
                            </div>
                          ) : (
                            <img
                              src={formData.shadeCardUrl}
                              alt="Shade Card preview"
                              className="w-12 h-12 rounded-lg object-cover border border-amber-200 flex-shrink-0"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">
                              {formData.shadeCardFileName ||
                                (formData.shadeCardFileType === 'pdf' ? 'Shade Card PDF Document' : 'Shade Card Image')}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {formData.shadeCardFileSize && (
                                <span className="text-[0.625rem] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                                  {formData.shadeCardFileSize}
                                </span>
                              )}
                              <span className="text-[0.625rem] text-amber-800 bg-amber-100 font-bold px-1.5 py-0.5 rounded">
                                {formData.shadeCardFileType === 'pdf' ? 'PDF Ready' : 'Image Ready'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <label className="cursor-pointer px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors">
                            Change
                            <input
                              type="file"
                              accept="application/pdf,image/*"
                              onChange={handleShadeFileChange}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                shadeCardUrl: '',
                                shadeCardFileName: undefined,
                                shadeCardFileType: null,
                                shadeCardFileSize: undefined,
                              }))
                            }
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove shade card"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Drag & Drop / File Picker Area for Shade Card */
                      <label className="relative border-2 border-dashed border-amber-300 hover:border-amber-500 bg-white hover:bg-amber-50/30 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all group">
                        <input
                          type="file"
                          accept="application/pdf,image/*"
                          onChange={handleShadeFileChange}
                          className="hidden"
                        />
                        <div className="w-9 h-9 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform mb-1.5">
                          <Paperclip className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-bold text-slate-800">
                          {isUploadingShade ? 'Reading file...' : 'Upload Shade Card (PDF catalog or Image)'}
                        </p>
                        <p className="text-[0.6875rem] text-slate-400 mt-0.5">
                          Accepts PDF, JPG, PNG, WEBP • Max 15MB
                        </p>
                      </label>
                    )}
                  </motion.div>
                )}

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddFormOpen(false)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex items-center gap-2 font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all disabled:opacity-50 text-white ${
                      editingProduct
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{editingProduct ? 'Saving Updates...' : 'Saving & Deploying...'}</span>
                      </>
                    ) : (
                      <>
                        {editingProduct ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        <span>{editingProduct ? 'Save Changes' : 'Save & Sync to Website'}</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 5. DELETE CONFIRMATION DIALOG (WHITE THEME) */}
      {/* ============================================================== */}
      <AnimatePresence>
        {productToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4"
            >
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  Delete "{productToDelete.name}"?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  This will remove the product row from the Google Sheet, update the live website catalog, and trigger a Vercel rebuild.
                </p>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-left text-xs font-mono text-slate-600 space-y-1">
                  <div><strong>ID:</strong> {productToDelete.id}</div>
                  <div><strong>Category:</strong> {productToDelete.categoryLabel || productToDelete.category}</div>
                  {productToDelete.countOrDenier && (
                    <div><strong>Count:</strong> {productToDelete.countOrDenier}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProductToDelete(null)}
                  disabled={isDeleting}
                  className="w-1/2 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="w-1/2 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Confirm Delete</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 6. SETTINGS MODAL (APPS SCRIPT WEBHOOK CONFIGURATION) */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-slate-700" />
                  <h3 className="text-base font-extrabold text-slate-900">Apps Script Connection</h3>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Google Apps Script Web App URL
                </label>
                <div className="relative">
                  <Link2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    value={scriptUrl}
                    onChange={(e) => setScriptUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
                <p className="text-[0.6875rem] text-slate-500 leading-relaxed">
                  Enter your Web App URL from Google Apps Script (Deploy → Manage Deployments → Web App URL).
                  This URL executes product add, delete, and redeploy actions.
                </p>

                {connectionStatus.tested && (
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                      connectionStatus.success
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-red-50 text-red-800 border-red-200'
                    }`}
                  >
                    {connectionStatus.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <span>{connectionStatus.message}</span>
                  </div>
                )}
              </div>

              {/* Instructions Guide */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>How to get this Web App URL:</span>
                </div>
                <ol className="list-decimal pl-4 space-y-1 text-[0.6875rem] text-slate-500">
                  <li>Open your Google Sheet → <strong>Extensions</strong> → <strong>Apps Script</strong>.</li>
                  <li>Paste the code from <code>scripts/google-apps-script.js</code> into <code>Code.gs</code>.</li>
                  <li>Click <strong>Deploy</strong> → <strong>New deployment</strong> (Web app, Who has access: Anyone).</li>
                  <li>Copy the Web App URL ending in <code>/exec</code> and paste it above!</li>
                </ol>
              </div>

              {/* Subdomain Setup Guide */}
              <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200/80 text-xs text-blue-900 space-y-1.5">
                <div className="font-bold text-blue-950 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span>Subdomain: admin.ved.enterprises</span>
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono font-bold">Vercel DNS</span>
                </div>
                <p className="text-[0.6875rem] text-blue-800 leading-relaxed">
                  To connect <strong>admin.ved.enterprises</strong>, add this DNS CNAME record in your domain registrar:
                </p>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-white p-2 rounded-xl border border-blue-200">
                  <div><span className="text-slate-400 block font-sans">Type:</span> CNAME</div>
                  <div><span className="text-slate-400 block font-sans">Name:</span> admin</div>
                  <div className="col-span-2"><span className="text-slate-400 block font-sans">Value:</span> cname.vercel-dns.com</div>
                </div>
                <p className="text-[0.625rem] text-blue-700">
                  And in Vercel: Project Settings → Domains → Add <code>admin.ved.enterprises</code>.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={isSyncing}
                  className="px-5 py-2 text-xs font-extrabold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                >
                  {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Test & Save</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 7. TOAST NOTIFICATION */}
      {/* ============================================================== */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-bold ${
              toast.type === 'error'
                ? 'bg-red-600 text-white border-red-700 shadow-red-500/20'
                : toast.type === 'success'
                ? 'bg-slate-900 text-white border-slate-800 shadow-slate-900/20'
                : 'bg-white text-slate-800 border-slate-200'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-white" />
            ) : toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-500" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
