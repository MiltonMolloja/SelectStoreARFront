import { PaginationInfo } from '../../../core/models';

// ── Admin Product ──────────────────────────────────────────────────────────

export interface AdminProductListItem {
  id: string;
  name: string;
  slug: string;
  brand: string;
  imageUrl: string | null;
  basePriceUsd: number;
  markupPercentage: number | null;
  finalPriceUsd: number;
  category: string;
  status: AdminProductStatus;
  isFeatured: boolean;
  imageCount: number;
  telegramMessageId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProductListResponse {
  items: AdminProductListItem[];
  pagination: PaginationInfo;
  counts: AdminProductCounts;
}

export interface AdminProductCounts {
  draft: number;
  active: number;
  inactive: number;
  total: number;
}

export interface AdminProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  basePriceUsd: number;
  markupPercentage: number | null;
  finalPriceUsd: number;
  categoryId: string;
  category: string;
  status: AdminProductStatus;
  isFeatured: boolean;
  specifications: Record<string, string>;
  images: AdminImageResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminProductCreateRequest {
  name: string;
  description: string;
  brand: string;
  basePriceUsd: number;
  markupPercentage: number | null;
  categoryId: string;
  status: AdminProductStatus;
  specifications: Record<string, string>;
}

export interface AdminProductUpdateRequest {
  name: string;
  description: string;
  brand: string;
  basePriceUsd: number;
  markupPercentage: number | null;
  categoryId: string;
  specifications: Record<string, string>;
}

export interface AdminProductCreateResponse {
  id: string;
  name: string;
  slug: string;
  status: AdminProductStatus;
  createdAt: string;
}

export interface AdminProductUpdateResponse {
  id: string;
  name: string;
  slug: string;
  updatedAt: string;
}

export interface AdminStatusChangeResponse {
  id: string;
  status: AdminProductStatus;
  updatedAt: string;
}

export interface AdminFeaturedResponse {
  id: string;
  isFeatured: boolean;
}

export type AdminProductStatus = 'draft' | 'active' | 'inactive' | 'deleted';

// ── Admin Category ─────────────────────────────────────────────────────────

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  parentName: string | null;
  defaultMarkup: number | null;
  sortOrder: number;
  imageUrl: string | null;
  productCount: number;
}

export interface AdminCategoryCreateRequest {
  name: string;
  parentId: string | null;
  defaultMarkup: number | null;
  sortOrder: number;
}

export interface AdminCategoryUpdateRequest {
  name: string;
  parentId: string | null;
  defaultMarkup: number | null;
  sortOrder: number;
}

// ── Admin Images ───────────────────────────────────────────────────────────

export interface AdminImageResponse {
  id: string;
  original: string;
  thumbnail: string;
  medium: string;
  order: number;
}

export interface AdminImagesUploadResponse {
  images: AdminImageResponse[];
}

// ── Admin Dashboard ────────────────────────────────────────────────────────

export interface AdminDashboardData {
  products: {
    total: number;
    active: number;
    draft: number;
    inactive: number;
  };
  orders: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    byStatus: Record<string, number>;
    averageDeliveryDays: number;
    delayed: number;
  };
  exchangeRate: {
    rate: number;
    updatedAt: string;
    isStale: boolean;
  };
  recentOrders: AdminRecentOrder[];
}

export interface AdminRecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  totalUsd: number;
  status: string;
  createdAt: string;
}

// ── Admin Order ────────────────────────────────────────────────────────────

export interface AdminOrderListItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  totalUsd: number;
  totalArs: number;
  status: string;
  createdAt: string;
}

export interface AdminOrderDetail {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: AdminOrderItem[];
  totalUsd: number;
  totalArs: number;
  exchangeRateUsed: number;
  status: string;
  depositType: string | null;
  notes: string | null;
  statusHistory: AdminStatusHistoryEntry[];
  daysSinceLastChange: number;
  isDelayed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrderItem {
  productId: string;
  productName: string;
  productSlug: string;
  priceUsd: number;
  quantity: number;
  subtotalUsd: number;
}

export interface AdminStatusHistoryEntry {
  status: string;
  changedAt: string;
  notes: string | null;
}
