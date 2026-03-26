import { Category } from './category.model';
import { ProductListItem } from './product.model';

export interface LandingData {
  categories: Category[];
  featuredProducts: ProductListItem[];
  exchangeRate: ExchangeRateInfo;
  whatsappPhone: string;
}

export interface ExchangeRateInfo {
  rate: number;
  type: string;
  updatedAt: string;
  isStale?: boolean;
}
