import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LandingData,
  ExchangeRateInfo,
  ProductListItem,
  ProductDetail,
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

    return this.http.get<PaginatedResponse<ProductListItem>>('/api/products', { params: httpParams });
  }

  getProductBySlug(slug: string): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`/api/products/${slug}`);
  }

  searchProducts(params: {
    q: string;
    page?: number;
    pageSize?: number;
  }): Observable<PaginatedResponse<ProductListItem>> {
    let httpParams = new HttpParams().set('q', params.q);
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);

    return this.http.get<PaginatedResponse<ProductListItem>>('/api/products/search', { params: httpParams });
  }

  // ── Categories ─────────────────────────────────────────────────────────

  getCategories(): Observable<{ categories: Category[] }> {
    return this.http.get<{ categories: Category[] }>('/api/categories');
  }

  // ── Exchange Rate ──────────────────────────────────────────────────────

  getExchangeRate(): Observable<ExchangeRateInfo> {
    return this.http.get<ExchangeRateInfo>('/api/exchange-rate');
  }
}
