export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  brand: string;
  imageUrl: string;
  basePriceUsd: number;
  finalPriceUsd: number;
  finalPriceArs: number;
  // Backend sends flat fields, we normalize in service
  categoryName?: string;
  categorySlug?: string;
  category: {
    name: string;
    slug: string;
  };
  status: ProductStatus;
  availability: ProductAvailability;
}

export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  basePriceUsd: number;
  finalPriceUsd: number;
  finalPriceArs: number;
  markupPercentage: number | null;
  // Backend sends flat category fields
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  images: ProductImage[];
  specifications: Record<string, string>;
  availability: ProductAvailability;
  relatedProducts: ProductListItem[];
  exchangeRate: number;
  seo: ProductSeo;
  status: string;
}

export interface ProductImage {
  id: string;
  // Backend field names
  url?: string;
  thumbnailUrl?: string;
  mediumUrl?: string;
  sortOrder?: number;
  // Normalized field names (used in components)
  original: string;
  medium: string;
  thumbnail: string;
  altText: string | null;
  order: number;
}

export interface ProductSeo {
  title: string;
  description: string;
  ogImage: string;
}

export type ProductStatus = 'draft' | 'active' | 'inactive' | 'deleted' | 'Active' | 'Draft' | 'Inactive';
export type ProductAvailability = 'available' | 'unavailable' | 'on_order';
