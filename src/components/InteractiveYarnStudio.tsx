import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Palette,
  Calculator,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  MessageCircle,
  Check,
  RotateCcw,
  Layers,
  Scale,
  Shirt,
  Info,
  ExternalLink,
  Sliders,
} from 'lucide-react';
import { Product } from '../types';

interface InteractiveYarnStudioProps {
  onAddToBasket?: (product: Product, qtyKg?: number, e?: React.MouseEvent) => void;
  onExploreCatalog?: () => void;
}

interface YarnPreset {
  id: string;
  name: string;
  count: string;
  composition: string;
  category: string;
  description: string;
  gauge: string;
  softnessRating: number;
  warmthRating: number;
  blend: { fiber: string; pct: number; color: string }[];
  baseColor: string;
}

const YARN_PRESETS: YarnPreset[] = [
  {
    id: 'daffodil-2-28',
    name: 'Daffodil 2/28 High-Bulk Acrylic',
    count: '2/28 Nm (16.5 Ne / 320 Denier)',
    composition: '100% High-Bulk Acrylic Dyed',
    category: 'fancy',
    description: 'Crisp, voluminous hand-feel engineered for winter knitwear, crewneck sweaters, and jacquard mufflers with zero pilling.',
    gauge: '10GG & 12GG Flat Knitting',
    softnessRating: 4.8,
    warmthRating: 4.9,
    blend: [{ fiber: 'Acrylic High-Bulk', pct: 100, color: '#dc2626' }],
    baseColor: '#dc2626',
  },
  {
    id: 'vislon-2-48',
    name: 'Vislon 2/48 Luxury Viscose PBT',
    count: '2/48 Nm (28.3 Ne / 188 Denier)',
    composition: 'Viscose / PBT / Core-Spun Nylon',
    category: 'china',
    description: 'Silky smooth Chinese-imported blend with exceptional elastic rebound. Used by top export brands for lightweight fall cardigans.',
    gauge: '14GG & 16GG Fine Knitting',
    softnessRating: 5.0,
    warmthRating: 4.3,
    blend: [
      { fiber: 'Viscose Rayon', pct: 52, color: '#2563eb' },
      { fiber: 'PBT Elastic', pct: 28, color: '#60a5fa' },
      { fiber: 'Nylon Core', pct: 20, color: '#93c5fd' },
    ],
    baseColor: '#2563eb',
  },
  {
    id: 'rainbow-tweed',
    name: 'Rainbow Multi-Nep Tweed Yarn',
    count: '2/26 Nm (15.3 Ne / 346 Denier)',
    composition: '82% Acrylic / 18% Nylon with Neps',
    category: 'fancy',
    description: 'Artistic multi-colored fiber flecks embedded in high-twist yarn body. Creates authentic European heritage speckled knitwear.',
    gauge: '7GG & 10GG Textured Knits',
    softnessRating: 4.6,
    warmthRating: 4.8,
    blend: [
      { fiber: 'Acrylic Base', pct: 82, color: '#f59e0b' },
      { fiber: 'Colored Nylon Neps', pct: 18, color: '#ec4899' },
    ],
    baseColor: '#f59e0b',
  },
  {
    id: 'e-nigma-feather',
    name: 'E-Nigma 550D Soft Feather Yarn',
    count: '550 Denier (16.2 Nm)',
    composition: '100% Polyester Plush Feather',
    category: 'china',
    description: 'Ultra-delicate furry hair finish with cloud-like touch. Highly sought after for ladies designer sweaters and cozy winter coats.',
    gauge: '7GG & 9GG Plush Fabric',
    softnessRating: 5.0,
    warmthRating: 4.7,
    blend: [{ fiber: 'Plush Micro-Polyester', pct: 100, color: '#7c3aed' }],
    baseColor: '#7c3aed',
  },
  {
    id: 'megamix-slub',
    name: 'Megamix Vintage Slub Yarn',
    count: '18 Nm Heavy Slub Effect',
    composition: 'Cotton / Acrylic Textured Slub',
    category: 'fancy',
    description: 'Irregular variable-thickness slub texture that creates artisanal hand-loomed optical patterns in sweaters and upholstery.',
    gauge: '5GG & 7GG Heavy Knits',
    softnessRating: 4.5,
    warmthRating: 4.6,
    blend: [
      { fiber: 'Acrylic', pct: 60, color: '#059669' },
      { fiber: 'Cotton Slub', pct: 40, color: '#34d399' },
    ],
    baseColor: '#059669',
  },
  {
    id: 'mx-lurex',
    name: 'MX 50/85 Metallic Lurex Thread',
    count: '50/85 Fine Count Filament',
    composition: 'Metallic Polyester / Nylon Carrier',
    category: 'fancy',
    description: 'High-tensile brilliant metallic filament for borders, jacquard highlights, fancy borders, and festive winter garment trims.',
    gauge: 'Interlaced with All Gauges',
    softnessRating: 4.2,
    warmthRating: 3.8,
    blend: [
      { fiber: 'Metallic Foil', pct: 65, color: '#eab308' },
      { fiber: 'Nylon Core', pct: 35, color: '#fef08a' },
    ],
    baseColor: '#eab308',
  },
];

const SHADE_SWATCHES = [
  { name: 'Ruby Crimson', hex: '#DC2626', contrast: 'white', tone: 'warm' },
  { name: 'Saffron Amber', hex: '#F59E0B', contrast: 'slate-950', tone: 'warm' },
  { name: 'Royal Sapphire', hex: '#2563EB', contrast: 'white', tone: 'cool' },
  { name: 'Emerald Forest', hex: '#059669', contrast: 'white', tone: 'cool' },
  { name: 'Imperial Violet', hex: '#7C3AED', contrast: 'white', tone: 'rich' },
  { name: 'Charcoal Slate', hex: '#334155', contrast: 'white', tone: 'neutral' },
  { name: 'Ivory Raw Pearl', hex: '#F8FAFC', contrast: 'slate-900', tone: 'neutral' },
  { name: 'Rose Champagne', hex: '#E11D48', contrast: 'white', tone: 'warm' },
];

export const InteractiveYarnStudio: React.FC<InteractiveYarnStudioProps> = ({
  onAddToBasket,
  onExploreCatalog,
}) => {
  const [activeTab, setActiveTab] = useState<'studio' | 'calculator'>('studio');

  // Listen for custom event to switch tabs from Hero or other components
  useEffect(() => {
    const handleSwitchTab = (e: any) => {
      if (e.detail?.tab) {
        setActiveTab(e.detail.tab);
      }
    };
    window.addEventListener('switch-yarn-studio-tab', handleSwitchTab);
    return () => window.removeEventListener('switch-yarn-studio-tab', handleSwitchTab);
  }, []);

  // Studio State
  const [selectedYarnIndex, setSelectedYarnIndex] = useState<number>(0);
  const [selectedShadeIndex, setSelectedShadeIndex] = useState<number>(0);
  const [inquiryQty, setInquiryQty] = useState<number>(150);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  const activeYarn = YARN_PRESETS[selectedYarnIndex];
  const activeShade = SHADE_SWATCHES[selectedShadeIndex];

  // Calculator State
  const [calcMode, setCalcMode] = useState<'convert' | 'fabric'>('convert');
  const [inputNm, setInputNm] = useState<string>('28');
  const [numPlies, setNumPlies] = useState<number>(2);

  // Fabric Yield Calculator State
  const [garmentType, setGarmentType] = useState<'sweater' | 'shawl' | 'muffler' | 'fabric'>('sweater');
  const [targetPieces, setTargetPieces] = useState<number>(500);
  const [pieceWeightGrams, setPieceWeightGrams] = useState<number>(380);

  // Conversion calculations
  const conversions = useMemo(() => {
    const singleNm = parseFloat(inputNm) || 28;
    const effectiveNm = singleNm / Math.max(1, numPlies);

    // Formulas:
    // Ne = Nm * 0.59054
    // Denier = 9000 / Nm
    // Tex = 1000 / Nm
    const ne = effectiveNm * 0.59054;
    const denier = 9000 / effectiveNm;
    const tex = 1000 / effectiveNm;

    let recommendedGauges = '10GG - 12GG';
    if (effectiveNm >= 24) recommendedGauges = '14GG - 16GG (Fine)';
    else if (effectiveNm >= 14) recommendedGauges = '10GG - 12GG (Standard)';
    else if (effectiveNm >= 8) recommendedGauges = '7GG - 8GG (Chunky)';
    else recommendedGauges = '3GG - 5GG (Heavy Knit)';

    return {
      effectiveNm: effectiveNm.toFixed(1),
      countLabel: `${numPlies}/${singleNm} Nm`,
      ne: ne.toFixed(1),
      denier: Math.round(denier),
      tex: tex.toFixed(1),
      gauge: recommendedGauges,
    };
  }, [inputNm, numPlies]);

  // Yield calculations
  const yieldResult = useMemo(() => {
    const totalGramsNet = targetPieces * pieceWeightGrams;
    const wasteFactor = 1.04; // 4% knitting waste / winding margin
    const totalKgGross = (totalGramsNet * wasteFactor) / 1000;
    const conesRequired = Math.ceil(totalKgGross / 1.5); // standard 1.5kg cones

    return {
      netKg: (totalGramsNet / 1000).toFixed(1),
      grossKg: Math.ceil(totalKgGross),
      cones: conesRequired,
      wasteKg: ((totalGramsNet * (wasteFactor - 1)) / 1000).toFixed(1),
    };
  }, [targetPieces, pieceWeightGrams]);

  // Handle adding current interactive configuration to Inquiry Basket
  const handleAddConfigToBasket = (e: React.MouseEvent) => {
    if (!onAddToBasket) return;

    const customProduct: Product = {
      id: `${activeYarn.id}-${activeShade.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: `${activeYarn.name} (${activeShade.name})`,
      category: activeYarn.category as any,
      categoryLabel: activeYarn.composition,
      countOrDenier: activeYarn.count,
      description: `${activeYarn.description} Selected Shade: ${activeShade.name}. Configured via Interactive Yarn Studio.`,
      badge: activeShade.name,
      recommendedUses: [activeYarn.gauge, 'Custom Shade Studio Order'],
      specifications: {
        'Shade Color': activeShade.name,
        'Fiber Blend': activeYarn.composition,
        'Knitting Gauge': activeYarn.gauge,
        'Count / Denier': activeYarn.count,
      },
    };

    onAddToBasket(customProduct, inquiryQty, e);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2800);
  };

  // WhatsApp Quick Quote link with dynamic message
  const whatsappUrl = useMemo(() => {
    const text = encodeURIComponent(
      `Hello Ved Enterprises,\n\nI am inquiring from your website Interactive Yarn Studio:\n- Quality: ${activeYarn.name}\n- Selected Shade: ${activeShade.name} (${activeShade.hex})\n- Count / Gauge: ${activeYarn.count} (${activeYarn.gauge})\n- Required Quantity: ${inquiryQty} KG\n\nPlease share current wholesale rates, lot availability, and dispatch timeline to our unit.`
    );
    return `https://wa.me/917986716117?text=${text}`;
  }, [activeYarn, activeShade, inquiryQty]);

  return (
    <section
      id="yarn-studio-section"
      className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 my-8 sm:my-14 scroll-mt-24"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
        {/* Ambient background accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-500/10 via-amber-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        {/* Studio Navigation Header */}
        <div className="p-5 sm:p-8 border-b border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-amber-500 text-white text-[0.625rem] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                <Sparkles className="w-3 h-3" /> Interactive Tool
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Ved Enterprises Digital Lab
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Interactive Yarn & Shade Studio
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Test colors live on realistic yarn cones, convert counts, and calculate required bulk yarn weight
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700/80 self-start md:self-auto shadow-2xs">
            <button
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'studio'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-red-500" />
              <span>Shade & Fiber Studio</span>
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'calculator'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-amber-500" />
              <span>Count & Yield Estimator</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Interactive Shade & Fiber Studio */}
        {activeTab === 'studio' && (
          <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            {/* Left Column: Interactive 3D Visualizer & Swatches */}
            <div className="lg:col-span-5 space-y-6">
              {/* Yarn Spool Visualizer Card */}
              <div className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800/60 dark:to-slate-900/60 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 text-center relative overflow-hidden shadow-inner">
                {/* Visual Yarn Spool Display */}
                <div className="relative w-48 h-56 mx-auto my-2 flex items-center justify-center">
                  {/* Top Spool Ring */}
                  <div
                    className="absolute top-2 w-28 h-6 rounded-full border-2 border-white/60 shadow-md transition-colors duration-500"
                    style={{ backgroundColor: activeShade.hex }}
                  />

                  {/* Yarn Cone Body with Woven Thread Lines */}
                  <motion.div
                    key={`${activeYarn.id}-${activeShade.name}`}
                    initial={{ scale: 0.95, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-36 h-44 rounded-3xl relative overflow-hidden shadow-2xl border-4 border-white/40 transition-colors duration-500 flex flex-col justify-between p-3"
                    style={{ backgroundColor: activeShade.hex }}
                  >
                    {/* Realistic Texture Stripes */}
                    <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(45deg,#000_0px,#000_2px,transparent_2px,transparent_6px)] pointer-events-none" />
                    <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(-45deg,#fff_0px,#fff_2px,transparent_2px,transparent_6px)] pointer-events-none" />

                    {/* Spec Pill Over Cone */}
                    <div className="relative z-10 self-center bg-black/60 backdrop-blur-md text-white text-[0.625rem] font-mono font-bold px-2 py-0.5 rounded-full border border-white/20">
                      {activeYarn.count.split(' ')[0]}
                    </div>

                    <div className="relative z-10 text-center">
                      <span className="text-[0.6875rem] font-black text-white drop-shadow-md block">
                        {activeShade.name}
                      </span>
                      <span className="text-[0.5625rem] text-white/80 font-mono">
                        {activeShade.hex}
                      </span>
                    </div>
                  </motion.div>

                  {/* Bottom Base Ring */}
                  <div
                    className="absolute bottom-2 w-38 h-8 rounded-full border-2 border-white/40 shadow-lg transition-colors duration-500"
                    style={{ backgroundColor: activeShade.hex }}
                  />
                </div>

                {/* Selected Color & Tone Tag */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs"
                    style={{ backgroundColor: activeShade.hex }}
                  />
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                    {activeShade.name}
                  </span>
                  <span className="text-[0.625rem] font-bold text-slate-500 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 uppercase">
                    {activeShade.tone} Palette
                  </span>
                </div>
              </div>

              {/* Color Swatches Grid */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Select Shade Card Color:
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {SHADE_SWATCHES.map((shade, idx) => (
                    <button
                      key={shade.name}
                      onClick={() => setSelectedShadeIndex(idx)}
                      className={`group p-2 rounded-2xl border transition-all text-left flex flex-col items-center gap-1.5 cursor-pointer ${
                        selectedShadeIndex === idx
                          ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/50 dark:bg-red-950/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <span
                        className="w-8 h-8 rounded-xl shadow-xs border border-black/10 transition-transform group-hover:scale-110 flex items-center justify-center"
                        style={{ backgroundColor: shade.hex }}
                      >
                        {selectedShadeIndex === idx && (
                          <Check
                            className={`w-4 h-4 ${
                              shade.contrast === 'white' ? 'text-white' : 'text-slate-950'
                            }`}
                          />
                        )}
                      </span>
                      <span className="text-[0.625rem] font-semibold text-slate-700 dark:text-slate-300 truncate w-full text-center">
                        {shade.name.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Yarn Quality Selector & Interactive Specs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Yarn Quality Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2.5">
                  Select Yarn Quality / Structure:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {YARN_PRESETS.map((yarn, idx) => (
                    <button
                      key={yarn.id}
                      onClick={() => setSelectedYarnIndex(idx)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedYarnIndex === idx
                          ? 'border-red-600 bg-red-50/60 dark:bg-red-950/30 ring-2 ring-red-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                        {yarn.name.split(' ')[0]} {yarn.name.split(' ')[1]}
                      </div>
                      <div className="text-[0.6875rem] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        {yarn.count.split(' ')[0]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Quality Details Card */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      {activeYarn.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {activeYarn.composition}
                    </p>
                  </div>
                  <span className="text-xs font-bold bg-white dark:bg-slate-800 text-red-600 border border-red-200 dark:border-red-900 px-3 py-1 rounded-full shadow-2xs">
                    {activeYarn.gauge}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeYarn.description}
                </p>

                {/* Fiber Blend Breakdown Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Fiber Composition:</span>
                    <span className="font-mono text-slate-500">
                      {activeYarn.blend.map((b) => `${b.pct}% ${b.fiber}`).join(' • ')}
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                    {activeYarn.blend.map((b, i) => (
                      <div
                        key={i}
                        style={{ width: `${b.pct}%`, backgroundColor: b.color }}
                        title={`${b.fiber}: ${b.pct}%`}
                      />
                    ))}
                  </div>
                </div>

                {/* Rating meters */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[0.625rem] uppercase font-bold text-slate-400 block">
                      Softness & Hand Feel
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="font-black text-base text-slate-900 dark:text-white">
                        {activeYarn.softnessRating}
                      </span>
                      <div className="flex gap-0.5 text-amber-500 text-xs">★★★★★</div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[0.625rem] uppercase font-bold text-slate-400 block">
                      Thermal Warmth Grade
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="font-black text-base text-slate-900 dark:text-white">
                        {activeYarn.warmthRating}
                      </span>
                      <div className="flex gap-0.5 text-red-500 text-xs">★★★★★</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Quantity Stepper & Actions */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                      Desired Order Batch (KG):
                    </label>
                    <p className="text-[0.6875rem] text-slate-500">
                      Minimum trial batch 50 KG • Wholesale bulk 100+ KG
                    </p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setInquiryQty(Math.max(50, inquiryQty - 50))}
                      className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white font-bold text-sm shadow-2xs hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={inquiryQty}
                      onChange={(e) => setInquiryQty(Math.max(10, parseInt(e.target.value) || 10))}
                      className="w-16 text-center font-bold text-sm bg-transparent text-slate-900 dark:text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setInquiryQty(inquiryQty + 50)}
                      className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white font-bold text-sm shadow-2xs hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      +
                    </button>
                    <span className="text-xs font-bold text-slate-500 pr-2">KG</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddConfigToBasket}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-extrabold py-3.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-red-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px]"
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Added to Inquiry Basket!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add This Shade to Basket ({inquiryQty} KG)</span>
                      </>
                    )}
                  </motion.button>

                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-5 rounded-2xl text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer min-h-[44px]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Quote</span>
                  </motion.a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Count & Fabric Estimator */}
        {activeTab === 'calculator' && (
          <div className="p-5 sm:p-8 space-y-8 relative z-10">
            {/* Sub-mode selector */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCalcMode('convert')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  calcMode === 'convert'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                1. Yarn Count Converter (Nm ↔ Ne ↔ Denier)
              </button>
              <button
                onClick={() => setCalcMode('fabric')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  calcMode === 'fabric'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                2. Bulk Production Weight & Cone Estimator
              </button>
            </div>

            {/* Mode 1: Yarn Count Converter */}
            {calcMode === 'convert' && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                        Single Yarn Count (Nm):
                      </label>
                      <input
                        type="number"
                        value={inputNm}
                        onChange={(e) => setInputNm(e.target.value)}
                        placeholder="e.g. 28, 36, 48"
                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-base font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                      <span className="text-[0.625rem] text-slate-400 mt-1 block">
                        Common: 28 Nm (Acrylic/Viscose), 48 Nm (Vislon/Modal), 18 Nm (Wooly)
                      </span>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                        Number of Plies:
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4].map((ply) => (
                          <button
                            key={ply}
                            onClick={() => setNumPlies(ply)}
                            className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                              numPlies === ply
                                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {ply}-Ply
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instant Conversion Results Display */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <span className="text-[0.625rem] uppercase font-bold text-slate-400 block">
                      Effective Metric (Nm)
                    </span>
                    <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                      {conversions.effectiveNm} <span className="text-xs text-slate-400 font-normal">Nm</span>
                    </div>
                    <span className="text-[0.625rem] text-slate-500 font-mono">{conversions.countLabel}</span>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <span className="text-[0.625rem] uppercase font-bold text-slate-400 block">
                      English Cotton (Ne)
                    </span>
                    <div className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1">
                      {conversions.ne} <span className="text-xs text-slate-400 font-normal">Ne</span>
                    </div>
                    <span className="text-[0.625rem] text-slate-500">Cotton Count</span>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <span className="text-[0.625rem] uppercase font-bold text-slate-400 block">
                      Denier Equivalent
                    </span>
                    <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1">
                      {conversions.denier} <span className="text-xs text-slate-400 font-normal">D</span>
                    </div>
                    <span className="text-[0.625rem] text-slate-500">Filament Weight</span>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <span className="text-[0.625rem] uppercase font-bold text-slate-400 block">
                      Knitting Gauge
                    </span>
                    <div className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-1">
                      {conversions.gauge.split(' ')[0]}
                    </div>
                    <span className="text-[0.625rem] text-slate-500 truncate block">
                      {conversions.gauge}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Mode 2: Bulk Production Weight & Cones Estimator */}
            {calcMode === 'fabric' && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                        Garment / End Product:
                      </label>
                      <select
                        value={garmentType}
                        onChange={(e) => {
                          const type = e.target.value as any;
                          setGarmentType(type);
                          if (type === 'sweater') setPieceWeightGrams(380);
                          else if (type === 'shawl') setPieceWeightGrams(240);
                          else if (type === 'muffler') setPieceWeightGrams(130);
                          else setPieceWeightGrams(500);
                        }}
                        className="w-full px-3.5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      >
                        <option value="sweater">🧥 Winter Sweater / Pullover</option>
                        <option value="shawl">🧣 Ladies Shawl / Stole</option>
                        <option value="muffler">🧤 Muffler / Woolen Cap</option>
                        <option value="fabric">🧵 Weaving / Circular Knit Rolls</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                        Order Quantity (Pieces):
                      </label>
                      <input
                        type="number"
                        value={targetPieces}
                        onChange={(e) => setTargetPieces(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3.5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-base font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                        Avg Weight Per Piece (g):
                      </label>
                      <input
                        type="number"
                        value={pieceWeightGrams}
                        onChange={(e) => setPieceWeightGrams(Math.max(10, parseInt(e.target.value) || 10))}
                        className="w-full px-3.5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-base font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Calculation Yield Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-2xl border border-red-200 dark:border-red-900">
                    <span className="text-[0.625rem] uppercase font-bold text-red-600 block">
                      Total Yarn Required
                    </span>
                    <div className="text-2xl font-black text-red-600 mt-1">
                      {yieldResult.grossKg} <span className="text-xs font-bold">KG</span>
                    </div>
                    <span className="text-[0.625rem] text-slate-500 block mt-0.5">
                      Includes 4% knitting waste
                    </span>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[0.625rem] uppercase font-bold text-slate-400 block">
                      Approx. Cones Needed
                    </span>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {yieldResult.cones} <span className="text-xs font-bold text-slate-400">Cones</span>
                    </div>
                    <span className="text-[0.625rem] text-slate-500 block mt-0.5">
                      Standard 1.5kg cone basis
                    </span>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[0.625rem] uppercase font-bold text-slate-400 block">
                      Net Garment Weight
                    </span>
                    <div className="text-xl font-black text-slate-800 dark:text-slate-200 mt-1">
                      {yieldResult.netKg} <span className="text-xs font-bold text-slate-400">KG</span>
                    </div>
                    <span className="text-[0.625rem] text-slate-500 block mt-0.5">
                      For {targetPieces} pieces
                    </span>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[0.625rem] uppercase font-bold text-slate-400 block">
                      Dispatch Packing
                    </span>
                    <div className="text-base font-black text-slate-800 dark:text-slate-200 mt-1">
                      {Math.ceil(yieldResult.grossKg / 40)} Bags
                    </div>
                    <span className="text-[0.625rem] text-slate-500 block mt-0.5">
                      ~40 KG HDPE bulk sacks
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
