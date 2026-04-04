import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  LandingData,
  ExchangeRateInfo,
  ProductListItem,
  ProductDetail,
  ProductImage,
  Category,
  PaginatedResponse,
} from '../models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  // ── Landing ────────────────────────────────────────────────────────────

  getLanding(): Observable<LandingData> {
    return this.http.get<LandingData>('/api/landing');
  }

  // ── Products ───────────────────────────────────────────────────────────

  getProducts(params: {
    page?: number;
    pageSize?: number;
    category?: string;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
    currency?: string;
  } = {}): Observable<PaginatedResponse<ProductListItem>> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params.category) httpParams = httpParams.set('category', params.category);
    if (params.sort) httpParams = httpParams.set('sort', params.sort);
    if (params.minPrice) httpParams = httpParams.set('minPrice', params.minPrice);
    if (params.maxPrice) httpParams = httpParams.set('maxPrice', params.maxPrice);
    if (params.currency) httpParams = httpParams.set('currency', params.currency);

    return this.http.get<PaginatedResponse<ProductListItem>>('/api/products', { params: httpParams }).pipe(
      map(res => ({
        ...res,
        items: res.items.map(item => this.normalizeProductListItem(item)),
      })),
    );
  }

  getProductBySlug(slug: string): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`/api/products/${slug}`).pipe(
      map(product => this.normalizeProductDetail(product)),
    );
  }

  searchProducts(params: {
    q: string;
    page?: number;
    pageSize?: number;
  }): Observable<PaginatedResponse<ProductListItem>> {
    let httpParams = new HttpParams().set('q', params.q);
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);

    return this.http.get<PaginatedResponse<ProductListItem>>('/api/products/search', { params: httpParams }).pipe(
      map(res => ({
        ...res,
        items: res.items.map(item => this.normalizeProductListItem(item)),
      })),
    );
  }

  // ── Categories ─────────────────────────────────────────────────────────

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/categories');
  }

  // ── Exchange Rate ──────────────────────────────────────────────────────

  getExchangeRate(): Observable<ExchangeRateInfo> {
    return this.http.get<ExchangeRateInfo>('/api/exchange-rate');
  }

  // ── Normalizers (backend → frontend model) ─────────────────────────────

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private normalizeProductListItem(raw: any): ProductListItem {
    return {
      ...raw,
      category: raw.category ?? {
        name: raw.categoryName ?? '',
        slug: raw.categorySlug ?? '',
      },
      imageUrl: raw.imageUrl ?? raw.images?.[0]?.thumbnailUrl ?? raw.images?.[0]?.url ?? '',
      availability: raw.availability ?? 'available',
      finalPriceArs: raw.finalPriceArs ?? 0,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private normalizeProductDetail(raw: any): ProductDetail {
    const images: ProductImage[] = (raw.images ?? []).map(this.normalizeImage);
    return {
      ...raw,
      category: raw.category ?? {
        id: raw.categoryId ?? '',
        name: raw.categoryName ?? '',
        slug: raw.categorySlug ?? '',
      },
      images,
      availability: raw.availability ?? 'available',
      relatedProducts: (raw.relatedProducts ?? []).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (p: any) => this.normalizeProductListItem(p),
      ),
      exchangeRate: raw.exchangeRate ?? 0,
      finalPriceArs: raw.finalPriceArs ?? 0,
      seo: raw.seo ?? {
        title: `${raw.name} | SelectStoreAR`,
        description: raw.description ?? '',
        ogImage: images[0]?.original ?? '',
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private normalizeImage(raw: any): ProductImage {
    return {
      id: raw.id ?? '',
      original: raw.original ?? raw.url ?? '',
      medium: raw.medium ?? raw.mediumUrl ?? raw.url ?? '',
      thumbnail: raw.thumbnail ?? raw.thumbnailUrl ?? raw.url ?? '',
      altText: raw.altText ?? null,
      order: raw.order ?? raw.sortOrder ?? 0,
    };
  }
}
