import { Product } from '../types';

// Real Product Photos Sourced & Imported DIRECTLY from src/assets/products/
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

// Asset Images Sourced for Spreadsheet Products
import imgDaffodil from '../assets/products/our_fancy_yarns_space_polyster_yarn_300_denier_to_550_denier_ceefe0f8-9541-4e93-bef3-1e36bc1b794b.jpg';
import imgRainbow from '../assets/products/our_fancy_yarns_space_polyster_yarn_300_denier_to_550_denier_ceefe0f8-9541-4e93-bef3-1e36bc1b794b.jpg';
import imgHazel from '../assets/products/our_fancy_yarns_grace_yarn_d6a6eb49-74c3-454e-af0f-7b0cca3b504a.jpg';
import imgMegamix from '../assets/products/our_china_yarn_0.9_swead_yarn_a72713db-f14a-42bf-b84a-87ef3e829fe5.jpg';
import imgEnigma from '../assets/products/our_china_yarn_0.9_swead_yarn_a0c9e39c-57c4-4fba-9bb8-4a96b44481c9.jpg';

export const PRODUCTS_CATALOG: Product[] = [
  // SPREADSHEET PRODUCTS WITH DIRECT ASSETS & GOOGLE DRIVE SHADE CARD LINKS
  {
    id: 'sheet-daffodil',
    name: 'Daffodil Yarn',
    category: 'acrylic-blends',
    categoryLabel: 'Acrylic & Blends',
    countOrDenier: '2/28 Nm 100% Acrylic',
    description: '100% Acrylic Yarn certified for high-bulk warmth, vibrant color brilliance, and pilling resistance.',
    recommendedUses: ['Sweaters', 'Knitwear', 'Uniform Cardigans', 'Winterwear'],
    features: ['100% Acrylic', 'High Bulk Warmth', 'Vibrant Dyes', 'Pilling Resistant'],
    sampleAvailable: true,
    origin: 'Ved Domestic Premium Mill',
    popularFor: 'Hosiery Sweaters & School Uniforms',
    pictureUrl: 'https://drive.google.com/file/d/105xFBP96hHxXid9H5sMwnbyF2hvwdwGu/view?usp=drivesdk',
    shadeUrl: 'https://drive.google.com/file/d/1kE3ZUTNp_e5W5jiWraookdT-Z7CvJVpa/view?usp=drivesdk',
    badge: 'Direct Drive Photo'
  },
  {
    id: 'sheet-rainbow',
    name: 'Rainbow Yarn',
    category: 'acrylic-blends',
    categoryLabel: 'Acrylic & Blends',
    countOrDenier: '2/26 Nm (82/18 Acrylic/Nylon)',
    description: 'The Blend of Acrylic & Shiny Soft Nylon 82/18. Count is 2/26 NM.',
    recommendedUses: ['Shiny Soft Sweaters', 'Designer Knitwear', 'Fashion Tops'],
    features: ['82/18 Acrylic Nylon Blend', 'Shiny Soft Sheen', 'Soft Hand Feel', 'Smooth Knitting'],
    sampleAvailable: true,
    origin: 'Ved Premium Selection',
    popularFor: 'Shiny Designer Sweaters',
    pictureUrl: 'https://drive.google.com/file/d/11anqCKDMGU6GIIA41DdsBxm0hEyrbj9E/view?usp=drivesdk',
    shadeUrl: 'https://drive.google.com/file/d/1IukDyi5hAo-yjA9irRcGUqriTXsZKa1n/view?usp=drivesdk',
    badge: 'Direct Drive Photo'
  },
  {
    id: 'sheet-hazel',
    name: 'Hazel Yarn',
    category: 'fancy',
    categoryLabel: 'Fancy Yarn',
    countOrDenier: '2/28 NM & 2/36 NM',
    description: 'The Blend of Viscose/Nylon 75/25. Available counts: 2/28 NM & 2/36 NM.',
    recommendedUses: ['Soft Cardigans', 'Summer & Winter Knits', 'Luxury Fashion Tops'],
    features: ['75/25 Viscose Nylon', 'Silky Touch', 'Featherlight Comfort', 'High Color Depth'],
    sampleAvailable: true,
    origin: 'Ved Premium Selection',
    popularFor: 'Luxury Viscose Cardigans',
    pictureUrl: 'https://drive.google.com/file/d/1DuvmcVCblRxuW75iPo_soJvM_E0u2sax/view?usp=drivesdk',
    shadeUrl: 'https://drive.google.com/file/d/134SO7mr_mqw8mdxNKJVChzDNg8xiUnb8/view?usp=drivesdk',
    badge: 'Direct Drive Photo'
  },
  {
    id: 'sheet-megamix',
    name: 'Megamix Yarn',
    category: 'fancy',
    categoryLabel: 'Fancy Yarn',
    countOrDenier: 'Slub Effect Fine Count',
    description: 'Acrylic/Cotton Slub Effect with cotton Slub for textured fashion knitwear.',
    recommendedUses: ['Slub Sweaters', 'Textured Fashion Knits', 'Casual Wear'],
    features: ['Acrylic/Cotton Slub', 'Distinct Textured Surface', 'Soft Touch', 'Durable Structure'],
    sampleAvailable: true,
    origin: 'Ved Exclusive Fancy',
    popularFor: 'Textured Slub Knitwear',
    pictureUrl: 'https://drive.google.com/file/d/1vhIj1-GOFMQaweHv_c0c3sBsT8WVHv1Z/view?usp=drivesdk',
    shadeUrl: 'https://drive.google.com/file/d/1ZfmZqQCSK6dDRb4NqOVYV19ohN4dArZn/view?usp=drivesdk',
    badge: 'Direct Drive Photo'
  },
  {
    id: 'sheet-woolly',
    name: 'Woolly Yarn (2/18 & 2/48 Fine)',
    category: 'china',
    categoryLabel: 'China / Imported Yarn',
    countOrDenier: '2/18 Nm & 2/48 Nm Fine',
    description: 'The Blend of Acrylic/PBT/Nylon engineered for warmth, high elasticity, and fine 12GG/14GG knits.',
    recommendedUses: ['Heavy Sweaters', 'Flat Knitting 12GG/14GG', 'Caps & Mufflers'],
    features: ['Acrylic/PBT/Nylon Blend', 'High Thermal Insulation', 'Soft Cashmere Touch', 'Shape Recovery'],
    sampleAvailable: true,
    origin: 'Direct China Import',
    popularFor: 'Soft Winter Pullovers & Thermals',
    pictureUrl: 'https://drive.google.com/file/d/1dD9JwdUvvFiMg1kJ9gFbgKvxFehzeutE/view?usp=drivesdk',
    imageUrl: imgWooly218,
    badge: 'Direct Drive Photo'
  },
  {
    id: 'sheet-vislon248',
    name: 'Vislon 2/48 Yarn',
    category: 'china',
    categoryLabel: 'China / Imported Yarn',
    countOrDenier: '2/48 Nm',
    description: 'The Blend of Viscose/PBT/Nylon. Ultra-fine imported China Vislon yarn featuring a silky sheen and smooth drape.',
    recommendedUses: ['Fine Sweaters', 'Flat Knitting 12GG/14GG', 'High-end Tops'],
    features: ['Viscose/PBT/Nylon Blend', 'Silky Sheen', 'Pilling Resistant', 'Uniform Twist'],
    sampleAvailable: true,
    origin: 'Direct China Import',
    popularFor: '12GG & 14GG Sweater Production',
    pictureUrl: 'https://drive.google.com/file/d/1lP7-J8DnnKSWyv-BM_3lrJgoXLC_byC8/view?usp=drivesdk',
    imageUrl: imgVislon248,
    shadeUrl: 'https://drive.google.com/file/d/1SjCUksE2lg4kzjthW2z3uwWbQY9fIdX7/view?usp=drivesdk',
    badge: 'Direct Drive Photo'
  },
  {
    id: 'sheet-enigma',
    name: 'E Nigma Yarn',
    category: 'fancy',
    categoryLabel: 'Fancy Yarn',
    countOrDenier: '550 Denier Heavy Count',
    description: '100% Polyester heavy textured yarn designed for structured winterwear, thick knits, and jacket fabrics.',
    recommendedUses: ['Heavy Sweaters', 'Jacket Fabrics', 'Outerwear', 'Furnishing Fabrics'],
    features: ['100% Polyester', 'High Bulk', 'Rich Texture', 'Pilling Resistant'],
    sampleAvailable: true,
    origin: 'Specialty Textured',
    popularFor: 'Heavy Winter Garments',
    pictureUrl: 'https://drive.google.com/file/d/161s9fGr99CdQidBqqxMe32la67SRu70D/view?usp=drivesdk',
    shadeUrl: 'https://drive.google.com/file/d/1mAeTXu6kj6GZ7DpfXcz-OJxIg8B49MNG/view?usp=drivesdk',
    badge: 'Direct Drive Photo'
  },
  {
    id: 'sheet-nylonhair',
    name: 'Nylon Hair Yarn (0.9 Swad, 0.7 Crystal, 1.3 cm)',
    category: 'china',
    categoryLabel: 'China / Imported Yarn',
    countOrDenier: '0.9 Swad / 0.7 Crystal / 1.3cm',
    description: '100% Nylon Yarn (China). Eyelash fur hair yarn providing fluffy luxurious textures for trendy winter coats & sweaters.',
    recommendedUses: ['Fuzzy Sweaters', 'Plush Jackets', 'Kids Winterwear', 'Accessories'],
    features: ['100% Nylon Hair', 'Ultra Soft Fur Touch', 'Non-Shedding', 'High Visual Appeal'],
    sampleAvailable: true,
    origin: 'Direct China Import',
    popularFor: 'Fuzzy Fashion Sweaters & Jackets',
    pictureUrl: 'https://drive.google.com/file/d/1nD0zc8CX0lZm8v20-i-gwkKxG-WYghvO/view?usp=drivesdk',
    imageUrl: imgHair13,
    shadeUrl: 'https://drive.google.com/file/d/1C27i0vtHYUmLzoim58kWTV3WLVVaztUR/view?usp=drivesdk',
    badge: 'Direct Drive Photo'
  },

  // ADDITIONAL VED CATALOG ITEMS
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
    imageUrl: '',
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
  }
];
