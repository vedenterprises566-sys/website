import { Product } from '../types';
import imgLurexFancy from '../assets/images/lurex_fancy_yarn_1785307540278.jpg';
import imgVislonImported from '../assets/images/vislon_imported_yarn_1785307557035.jpg';
import imgChenillePlush from '../assets/images/chenille_plush_yarn_1785307573790.jpg';
import imgFabricRolls from '../assets/images/textile_fabric_rolls_1785307587188.jpg';
import imgDaffodil from '../assets/images/daffodil_acrylic_yarn_1785724012217.jpg';

// Real Product Photos Sourced from Desktop Setup (C:\Users\ddaya\OneDrive\Desktop\ved _enterprises)
import imgFancyJari from '../assets/products/our_fancy_yarns_fancy_jari_available_in_finest_count_4697aaee-b8f3-42e9-aaaf-85d1f0637969.jpg';
import imgGraceYarn from '../assets/products/our_fancy_yarns_grace_yarn_d6a6eb49-74c3-454e-af0f-7b0cca3b504a.jpg';
import imgSpacePoly from '../assets/products/our_fancy_yarns_space_polyster_yarn_300_denier_to_550_denier_ceefe0f8-9541-4e93-bef3-1e36bc1b794b.jpg';
import imgSuede09 from '../assets/products/our_china_yarn_0.9_swead_yarn_a72713db-f14a-42bf-b84a-87ef3e829fe5.jpg';
import imgSuede07 from '../assets/products/our_china_yarn_0.9_swead_yarn_a0c9e39c-57c4-4fba-9bb8-4a96b44481c9.jpg';
import imgHair13 from '../assets/products/our_china_yarn_1.3_cm_hair_yarn_e70baceb-e2fb-4271-8c3c-76ecdffa3ba8.jpg';
import imgSpaceHair13 from '../assets/products/our_china_yarn_1.3_cm_space_dyed_hair_yarn_c43b4b8c-28f4-43ac-9864-cb041184da31.jpg';
import imgChenille18 from '../assets/products/our_china_yarn_18_nm_chennile_yarn_4febbbe6-cc4a-43ca-af3a-c6d9ea2aa4cb.jpg';
import imgWooly218 from '../assets/products/our_china_yarn_2-18_wooly_yarn_352df72e-85ca-4f4b-a410-a9858b7676ca.jpg';
import imgVislon248Lurex from '../assets/products/our_china_yarn_2-48_vislon_lurex_yarn_352df72e-85ca-4f4b-a410-a9858b7676ca.jpg';
import imgVislon248 from '../assets/products/our_china_yarn_2-48_vislon_yarn_352df72e-85ca-4f4b-a410-a9858b7676ca.jpg';
import imgWooly248 from '../assets/products/our_china_yarn_2-48_wooly_yarn_435e14cd-d59a-4802-8b59-7ced20e6e3b2.jpg';
import imgRingYarns from '../assets/products/our_china_yarn_ring_yarns_035ae3aa-3e07-4277-8dda-d83578757a0a.jpg';

export const PRODUCTS_CATALOG: Product[] = [
  // FANCY YARNS
  {
    id: 'fy-1',
    name: 'MX Lurex 50/85 Fine Count',
    category: 'fancy',
    categoryLabel: 'Fancy Yarn',
    countOrDenier: '50/85 Fine Count',
    description: 'High-lustre metallic shimmer Lurex yarn engineered for high-end garment borders, luxury knitwear, sarees, shawls, and decorative embroidery.',
    recommendedUses: ['Knitwear Borders', 'Shawls & Sarees', 'Fancy Sweaters', 'Embroidery'],
    features: ['Metallic Shine', 'Tarnish Resistant', 'Smooth Runnability', 'Soft Hand Feel'],
    sampleAvailable: true,
    origin: 'Ved Exclusive Fancy',
    popularFor: 'Festive & Premium Fashion Apparel',
    imageUrl: imgLurexFancy,
    badge: 'Popular Fancy'
  },
  {
    id: 'fy-2',
    name: 'Space Polyester Yarn (300D - 550D)',
    category: 'fancy',
    categoryLabel: 'Fancy Yarn',
    countOrDenier: '300 Denier to 550 Denier',
    description: 'Multi-tone space-dyed polyester yarn delivering vibrant rainbow and ombre effects for designer sweaters, scarves, and woven textiles.',
    recommendedUses: ['Designer Sweaters', 'Scarves & Stoles', 'Jacquard Weaving', 'Upholstery'],
    features: ['Multi-Color Gradient', 'High Tenacity', 'Colorfastness', 'Uniform Dyeing'],
    sampleAvailable: true,
    origin: 'Ved Premium Selection',
    popularFor: 'Multi-color Winter Wear',
    imageUrl: imgSpacePoly
  },
  {
    id: 'fy-3',
    name: 'Poly Enigma Yarn 550 Denier',
    category: 'fancy',
    categoryLabel: 'Fancy Yarn',
    countOrDenier: '550 Denier',
    description: 'Heavy textured polyester yarn designed for structured winterwear, thick knits, jacket fabrics, and high-durability textiles.',
    recommendedUses: ['Heavy Sweaters', 'Jacket Fabrics', 'Furnishing Fabrics', 'Outerwear'],
    features: ['High Bulk', 'Rich Texture', 'Shape Retention', 'Pilling Resistant'],
    sampleAvailable: true,
    origin: 'Specialty Textured',
    popularFor: 'Heavy Winter Garments',
    imageUrl: imgVislonImported
  },
  {
    id: 'fy-4',
    name: 'Stretch Yarn (Polyester Vislon)',
    category: 'fancy',
    categoryLabel: 'Fancy Yarn',
    countOrDenier: 'Variable Stretch Counts',
    description: 'Engineered Vislon polyester stretch yarn providing elastic recovery, perfect for ribbing, body-hugging knits, activewear, and socks.',
    recommendedUses: ['Collar & Cuff Ribs', 'Fitted Knitwear', 'Socks & Legwear', 'Activewear'],
    features: ['High Stretch Recovery', 'Dimensional Stability', 'Soft Touch', 'Wrinkle Proof'],
    sampleAvailable: true,
    origin: 'Ved Specialty Stretch',
    popularFor: 'Knitwear Ribbing & Activewear',
    imageUrl: imgVislon248
  },
  {
    id: 'fy-5',
    name: 'Fancy Jari Available in Finest Count',
    category: 'fancy',
    categoryLabel: 'Fancy Yarn',
    countOrDenier: 'Finest Gauge Counts',
    description: 'Premium gold and silver fancy zari thread in ultra-fine gauges for luxury embroidery, bridalwear, border embellishments, and lace.',
    recommendedUses: ['Bridalwear', 'Zardozi Embroidery', 'Laces & Trims', 'Royal Borders'],
    features: ['Ultra-Fine Gauge', 'High Lustre Gold/Silver', 'Non-Oxidizing', 'High Speed Running'],
    sampleAvailable: true,
    origin: 'Ved Fancy Collection',
    popularFor: 'Embroidery & Zari Work',
    imageUrl: imgFancyJari,
    badge: 'Finest Count'
  },
  {
    id: 'fy-6',
    name: 'Grace Yarn',
    category: 'fancy',
    categoryLabel: 'Fancy Yarn',
    countOrDenier: 'Boutique Fine Gauge',
    description: 'Silky smooth boutique fancy yarn designed for ultra-soft ladies cardigans, shawls, and premium fashion knitwear.',
    recommendedUses: ['Ladies Cardigans', 'Soft Shawls', 'Fashion Tops', 'Boutique Wear'],
    features: ['Silky Feel', 'Feather Light', 'Elegant Drape', 'Vivid Color Range'],
    sampleAvailable: true,
    origin: 'Ved Luxury Line',
    popularFor: 'Ladies Boutique Knitwear',
    imageUrl: imgGraceYarn
  },

  // CHINA & IMPORTED YARNS
  {
    id: 'cy-1',
    name: '2/48 Vislon Yarn',
    category: 'china',
    categoryLabel: 'China / Imported Yarn',
    countOrDenier: '2/48 Nm',
    description: 'Ultra-fine imported China Vislon yarn featuring a silky sheen, smooth drape, and high color fastness. Essential for fine 12GG & 14GG flat knits.',
    recommendedUses: ['Fine Sweaters', 'Flat Knitting 12GG/14GG', 'High-end Tops', 'Stoles'],
    features: ['Silky Sheen', 'Pilling Resistant', 'Uniform Twist', 'Soft Hand Feel'],
    sampleAvailable: true,
    origin: 'Direct China Import',
    popularFor: '12GG & 14GG Sweater Production',
    imageUrl: imgVislon248,
    shadeCardUrl: '/shades/our_china_yarn_2-48_vislon_yarn_shade_card_235fd168-d6b3-40a5-ab79-7a0ef7b37111.jpg',
    badge: 'Top Seller'
  },
  {
    id: 'cy-2',
    name: '2/48 Vislon Lurex Yarn',
    category: 'china',
    categoryLabel: 'China / Imported Yarn',
    countOrDenier: '2/48 Nm + Lurex Metallic',
    description: 'Combination of fine 2/48 Vislon yarn with embedded metallic Lurex sparkle. Delivers subtle shimmer for partywear sweaters and festive apparel.',
    recommendedUses: ['Partywear Sweaters', 'Glitter Knitwear', 'Designer Tops', 'Fashion Trims'],
    features: ['Shimmer Effect', 'No Skin Irritation', 'High Tensile Strength', 'Vivid Shades'],
    sampleAvailable: true,
    origin: 'Direct China Import',
    popularFor: 'Shimmer Sweaters & Cardigans',
    imageUrl: imgVislon248Lurex,
    shadeCardUrl: '/shades/our_china_yarn_2-48_vislon_lurex_yarn_shade_card_235fd168-d6b3-40a5-ab79-7a0ef7b37111.jpg'
  },
  {
    id: 'cy-3',
    name: '2/18 Wooly Yarn',
    category: 'china',
    categoryLabel: 'China / Imported Yarn',
    countOrDenier: '2/18 Nm',
    description: 'High-bulk, fluffy wooly yarn offering cashmere-like warmth and ultra-soft texture. Ideal for heavy winter pullovers, caps, and mufflers.',
    recommendedUses: ['Heavy Winter Sweaters', 'Woolen Caps', 'Mufflers & Gloves', 'Jacquard Knits'],
    features: ['High Thermal Insulation', 'Cashmere Touch', 'Voluminous Feel', 'Vibrant Dyes'],
    sampleAvailable: true,
    origin: 'Direct China Import',
    popularFor: 'Heavy Winter Pullovers & Caps',
    imageUrl: imgWooly218,
    shadePdfUrl: '/shades/our_china_yarn_2-18_wooly_yarn_shade_card_color_book-28s-angora_yarn.pdf',
    shadePdfName: 'Color Book 28S Angora & Wooly Yarn.pdf'
  },
  {
    id: 'cy-4',
    name: '2/48 Wooly Yarn',
    category: 'china',
    categoryLabel: 'China / Imported Yarn',
    countOrDenier: '2/48 Nm',
    description: 'Fine-count wooly yarn blending lightweight comfort with warm insulation. Excellent for fine gauge 12GG sweaters and inner thermals.',
    recommendedUses: ['Lightweight Sweaters', 'Thermal Undergarments', 'Kids Sweaters', 'Shawls'],
    features: ['Featherweight Warmth', 'Super Soft', 'Zero Scratchiness', 'Durable Lock-twist'],
    sampleAvailable: true,
    origin: 'Direct China Import',
    popularFor: 'Lightweight Soft Winterwear',
    imageUrl: imgWooly248
  },
  {
    id: 'cy-5',
    name: '1.3 CM Hair Yarn (Eyelash Fur)',
    category: 'china',
    categoryLabel: 'China / Imported Yarn',
    countOrDenier: '1.3 CM Pile Height',
    description: 'Plush eyelash hair yarn with 1.3 cm fur length, creating luxurious fuzzy textures for trendy winter jackets, fashion sweaters, and plush toys.',
    recommendedUses: ['Fuzzy Sweaters', 'Plush Jackets', 'Kids Winterwear', 'Toys & Accessories'],
    features: ['1.3cm Plush Pile', 'Non-Shedding', 'Ultra Soft Fur Touch', 'High Visual Appeal'],
    sampleAvailable: true,
    origin: 'Direct China Import',
    popularFor: 'Fuzzy Fashion Sweaters & Jackets',
    imageUrl: imgHair13,
    badge: 'Trending Fur'
  },
  {
    id: 'cy-6',
    name: '1.3 CM Space Dyed Hair Yarn',
    category: 'china',
    categoryLabel: 'China / Imported Yarn',
    countOrDenier: '1.3 CM Pile Height Space-Dyed',
    description: 'Multi-colored space-dyed eyelash fur yarn combining 1.3 cm hair pile with variegated color patterns for eye-catching winter garments.',
    recommendedUses: ['Multi-color Fur Sweaters', 'Fashion Ponchos', 'Designer Collars', 'Plush Accessories'],
    features: ['Variegated Color Effect', '1.3cm Plush Fur', 'Colorlocked Dye', 'Unique Aesthetics'],
    sampleAvailable: true,
    origin: 'Direct China Import',
    popularFor: 'Multi-Color Fuzzy Outerwear',
    imageUrl: imgSpaceHair13
  },
  {
    id: 'cy-7',
    name: '0.9 Suede Yarn',
    category: 'china',
    categoryLabel: 'China / Imported Yarn',
    countOrDenier: '0.9 NM Suede',
    description: 'Peach-skin velvety suede yarn offering a matte, smooth leather-touch finish for high-end knitwear, hoodies, and luxury home textiles.',
    recommendedUses: ['Velvet Hoodies', 'Premium Sweaters', 'Cushion Covers', 'Blankets'],
    features: ['Velvety Peach Finish', 'Matte Sheen', 'Pilling Resistance', 'Dense Soft Pile'],
    sampleAvailable: true,
    origin: 'Direct China Import',
    popularFor: 'Velvety Smooth Knitwear',
    imageUrl: imgSuede09,
    shadeCardUrl: '/shades/our_china_yarn_0.9_swead_yarn_shade_card_ec1c5325-2cf8-4003-ad1e-a118384bf67c.jpg'
  },
  {
    id: 'cy-8',
    name: '0.7 Suede Yarn',
    category: 'china',
    categoryLabel: 'China / Imported Yarn',
    countOrDenier: '0.7 NM Suede',
    description: 'Fine gauge suede yarn delivering ultra-dense plush pile with smooth touch for fine luxury garments and plush accessories.',
    recommendedUses: ['Fine Suede Tops', 'Kids Plush Wear', 'Soft Gloves & Beanies', 'Crafts'],
    features: ['Dense Fine Pile', 'Super Soft Suede', 'Color Consistency', 'Anti-Static'],
    sampleAvailable: true,
    origin: 'Direct China Import',
    popularFor: 'Fine Suede Apparels',
    imageUrl: imgSuede07
  },
  {
    id: 'cy-9',
    name: '13 NM Chenille Yarn',
    category: 'china',
    categoryLabel: 'China / Imported Yarn',
    countOrDenier: '13 NM',
    description: 'Heavy plush chenille yarn with rich velvet pile, suitable for chunky knits, thick throw blankets, upholstery, and winter cardigans.',
    recommendedUses: ['Chunky Cardigans', 'Throw Blankets', 'Upholstery Fabric', 'Heavy Scarves'],
    features: ['Rich Velvet Pile', 'High Volume', 'Snug Warmth', 'Durable Core'],
    sampleAvailable: true,
    origin: 'Direct China Import',
    popularFor: 'Chunky Velvet Sweaters & Throws',
    imageUrl: imgChenillePlush
  },
  {
    id: 'cy-10',
    name: '18 NM Chenille Yarn',
    category: 'china',
    categoryLabel: 'China / Imported Yarn',
    countOrDenier: '18 NM',
    description: 'Fine velvet chenille yarn delivering smooth texture and light weight for standard sweater gauge production and fashion apparel.',
    recommendedUses: ['Standard Sweaters', 'Ladies Tops', 'Baby Blankets', 'Fashion Scarves'],
    features: ['Fine Velvet Feel', 'Lightweight Comfort', 'Vibrant Color Range', 'Uniform Core'],
    sampleAvailable: true,
    origin: 'Direct China Import',
    popularFor: 'Lightweight Velvet Sweaters',
    imageUrl: imgChenille18,
    shadeCardUrl: '/shades/our_china_yarn_18_nm_chennile_yarn_shade_card_657cb3f5-a499-4b91-baa1-15e8f0403548.jpg'
  },
  {
    id: 'cy-11',
    name: '1/9 NM Brush Yarn (Mohair Look)',
    category: 'china',
    categoryLabel: 'China / Imported Yarn',
    countOrDenier: '1/9 NM Brushed',
    description: 'Brushed mohair-style yarn providing fluffy volume and soft halo for oversized sweaters, cardigans, and winter shawls.',
    recommendedUses: ['Mohair Style Sweaters', 'Oversized Cardigans', 'Shawls & Wraps', 'Winter Hats'],
    features: ['Fluffy Mohair Halo', 'Warm & Airy', 'Lightweight Volume', 'Rich Color Depth'],
    sampleAvailable: true,
    origin: 'Direct China Import',
    popularFor: 'Mohair Look Oversized Sweaters',
    imageUrl: imgChenillePlush
  },
  {
    id: 'cy-12',
    name: 'Ring Spun Yarns',
    category: 'china',
    categoryLabel: 'China / Imported Yarn',
    countOrDenier: 'Various Spun Counts',
    description: 'High tensile strength ring spun yarn for heavy-duty weaving, circular knitting, warp threads, and industrial garment production.',
    recommendedUses: ['Circular Knitting', 'Warp Weaving', 'Industrial Garments', 'Heavy Canvas'],
    features: ['High Tensile Strength', 'Low Hairiness', 'Even Twist', 'Abrasion Resistant'],
    sampleAvailable: true,
    origin: 'Direct China Import',
    popularFor: 'High Strength Weaving & Knitting',
    imageUrl: imgRingYarns
  },
  {
    id: 'cy-13',
    name: 'Acrylic Raised Yarn',
    category: 'china',
    categoryLabel: 'China / Imported Yarn',
    countOrDenier: 'Raised Napped Counts',
    description: 'Napped acrylic yarn processed to create a fleece-like raised surface for maximum thermal insulation in winterwear.',
    recommendedUses: ['Fleece Sweaters', 'Thermal Linings', 'Winter Jackets', 'Socks'],
    features: ['Napped Fleece Surface', 'Extreme Warmth', 'Light Weight', 'Soft Touch'],
    sampleAvailable: true,
    origin: 'Direct China Import',
    popularFor: 'Thermal Fleece Garments',
    imageUrl: imgDaffodil
  },
  {
    id: 'cy-14',
    name: 'Slub Effect Yarns',
    category: 'china',
    categoryLabel: 'China / Imported Yarn',
    countOrDenier: 'Variable Slub Thickness',
    description: 'Decorative yarn with intentionally uneven slub intervals, adding rustic texture to fashion sweater knits and linen-look fabrics.',
    recommendedUses: ['Fashion Sweaters', 'Textured T-Shirts', 'Curtains', 'Home Furnishings'],
    features: ['Organic Slub Texture', 'Visual Depth', 'Soft Spun Feel', 'Unique Patterning'],
    sampleAvailable: true,
    origin: 'Direct China Import',
    popularFor: 'Textured Rustic Knitwear',
    imageUrl: imgRingYarns
  },
  {
    id: 'cy-15',
    name: 'Raw Grey Yarn (All Qualities)',
    category: 'china',
    categoryLabel: 'China / Imported Yarn',
    countOrDenier: 'All Counts Available',
    description: 'Undyed raw grey yarn in all qualities (Vislon, Wooly, Chenille, Acrylic, Cotton) ready for custom dye houses and garment dye programs.',
    recommendedUses: ['Custom Dyeing', 'Garment Dye Programs', 'Industrial Mills', 'Piece Dyeing'],
    features: ['Dye Ready', 'Consistent Absorption', 'Zero Contamination', 'Bulk Available'],
    sampleAvailable: true,
    origin: 'Direct Import / Raw Stock',
    popularFor: 'Custom Dye Houses & Mills',
    imageUrl: imgVislonImported
  },

  // ACRYLIC & BLENDS
  {
    id: 'ab-1',
    name: 'Daffodil 100% Acrylic Spun Yarn',
    category: 'acrylic-blends',
    categoryLabel: 'Acrylic & Blends',
    countOrDenier: '2/28, 2/32, 2/40 Nm',
    description: 'Famous Daffodil brand 100% acrylic spun yarn. Renowned for bright vibrant colors, high-bulk softness, and excellent pilling resistance for sweater knits.',
    recommendedUses: ['School Uniform Sweaters', 'Hosiery Knitwear', 'Shawls', 'Caps & Mufflers'],
    features: ['Daffodil Certified', 'Vibrant Color Brilliance', 'High Bulk Warmth', 'Pilling Resistant'],
    sampleAvailable: true,
    origin: 'Vikasdeep / Garg Acrylics',
    popularFor: 'Hosiery Sweaters & School Uniforms',
    imageUrl: imgDaffodil,
    badge: 'Mill Bestseller'
  },
  {
    id: 'ab-2',
    name: 'Acrylic Cotton Blended Yarns',
    category: 'acrylic-blends',
    categoryLabel: 'Acrylic & Blends',
    countOrDenier: '2/28, 2/32, 2/40 Nm',
    description: 'Perfect blend of natural breathable cotton and soft durable acrylic yarn, suitable for all-season knitwear, polos, and thermal wear.',
    recommendedUses: ['All-Season Sweaters', 'Knit Polos', 'Kids Apparel', 'Socks'],
    features: ['Breathable Softness', 'Low Shrinkage', 'Sweat Absorbent', 'Vivid Color Fastness'],
    sampleAvailable: true,
    origin: 'Leading Mill Sourced',
    popularFor: 'All-Season Apparel',
    imageUrl: imgFabricRolls
  },
  {
    id: 'ab-3',
    name: 'Polyester Blended Yarns',
    category: 'acrylic-blends',
    categoryLabel: 'Acrylic & Blends',
    countOrDenier: 'Various Blends',
    description: 'High durability polyester blends designed for high-stress weaving, warp knitting, suiting, and industrial garment production.',
    recommendedUses: ['Uniform Fabrics', 'Suitings', 'Heavy Weaving', 'Industrial Garments'],
    features: ['Wrinkle Resistant', 'High Tear Strength', 'Quick Dry', 'Color Stability'],
    sampleAvailable: true,
    origin: 'Leading Mill Sourced',
    popularFor: 'High Durability Fabrics',
    imageUrl: imgFabricRolls
  },
  {
    id: 'ab-4',
    name: 'All Types of Fabrics (Woven & Knitted)',
    category: 'fabrics',
    categoryLabel: 'Fabrics & Textile Rolls',
    countOrDenier: 'Custom Width & GSM',
    description: 'Wholesale rolls of woven and knitted fabrics including fleece, rib fabrics, single jersey, interlock, and heavy woollen fabrics for garment manufacturers.',
    recommendedUses: ['Garment Manufacturing', 'Tracksuits & Hoodies', 'Winter Jackets', 'Linings'],
    features: ['Bulk Rolls', 'Consistent GSM', 'Colorlocked Dyeing', 'High Stretch Recovery'],
    sampleAvailable: true,
    origin: 'Ved Textile Division',
    popularFor: 'Garment Factories & Exporters',
    imageUrl: imgFabricRolls
  }
];
