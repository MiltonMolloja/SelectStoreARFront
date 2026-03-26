export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  brand: string;
  imageUrl: string;
  basePriceUsd: number;
  finalPriceUsd: number;
  finalPriceArs: number;
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
  markupPercentage: number;
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
}

export interface ProductImage {
  id: string;
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

export type ProductStatus = 'draft' | 'active' | 'inactive' | 'deleted';
export type ProductAvailability = 'available' | 'unavailable' | 'on_order';
