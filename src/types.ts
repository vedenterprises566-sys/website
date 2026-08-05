export type YarnCategory = 'fancy' | 'china' | 'acrylic-blends' | 'fabrics' | 'garments';

export interface YarnShade {
  shadeNo: string;
  colorName: string;
  hex?: string;
  imageUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  category: YarnCategory;
  categoryLabel: string;
  countOrDenier: string;
  description: string;
  recommendedUses: string[];
  features: string[];
  sampleAvailable: boolean;
  origin: string; // e.g. "Imported / China", "Domestic Premium Mill", "Ved Exclusive", "Ved Garment Collection"
  popularFor: string;
  imageUrl?: string;
  shadeCardUrl?: string;
  shadePdfUrl?: string;
  shadePdfName?: string;
  shades?: YarnShade[];
  badge?: string;
  // Garment specific optional fields (for Sweaters)
  gauge?: string;
  yarnUsed?: string;
  availableSizes?: string[];
  garmentStyle?: 'Men Sweater' | 'Ladies Cardigan' | 'High-Neck Pullover' | 'Cable Knit' | 'Kids Winterwear' | 'Zip Sweater';
}

export interface MillPartner {
  id: string;
  name: string;
  shortName: string;
  specialty: string;
  location: string;
  description: string;
  keyProducts: string[];
}

export interface InquiryItem {
  product: Product;
  quantityKg: number;
  specNote?: string;
}

export interface InquiryFormData {
  fullName: string;
  companyName: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  yarnRequirement: string;
  quantityTonsOrKg: string;
  comments: string;
  requestSample: boolean;
  items: InquiryItem[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  quickActions?: { label: string; actionText: string }[];
}
