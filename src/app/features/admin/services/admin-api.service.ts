import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AdminProductListResponse,
  AdminProductDetail,
  AdminProductCreateRequest,
  AdminProductCreateResponse,
  AdminProductUpdateRequest,
  AdminProductUpdateResponse,
  AdminStatusChangeResponse,
  AdminFeaturedResponse,
  AdminCategory,
  AdminCategoryCreateRequest,
  AdminCategoryUpdateRequest,
  AdminImagesUploadResponse,
  AdminDashboardData,
  AdminOrderListItem,
  AdminOrderDetail,
} from '../models/admin.models';
import { PaginatedResponse } from '../../../core/models';

const BASE_URL = '/api/admin';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);

  // ── Products ───────────────────────────────────────────────────────────

  getProducts(params: {
    page?: number;
    pageSize?: number;
    status?: string;
    category?: string;
    search?: string;
  } = {}): Observable<AdminProductListResponse> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.category) httpParams = httpParams.set('category', params.category);
    if (params.search) httpParams = httpParams.set('search', params.search);

    return this.http.get<AdminProductListResponse>(`${BASE_URL}/products`, { params: httpParams });
  }

  getProduct(id: string): Observable<AdminProductDetail> {
    return this.http.get<AdminProductDetail>(`${BASE_URL}/products/${id}`);
  }

  createProduct(data: AdminProductCreateRequest, images: File[]): Observable<AdminProductCreateResponse> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('brand', data.brand);
    formData.append('basePriceUsd', data.basePriceUsd.toString());
    if (data.markupPercentage !== null) {
      formData.append('markupPercentage', data.markupPercentage.toString());
    }
    formData.append('categoryId', data.categoryId);
    formData.append('status', data.status);
    formData.append('specifications', JSON.stringify(data.specifications));
    images.forEach((file, index) => formData.append(`images[${index}]`, file));

    return this.http.post<AdminProductCreateResponse>(`${BASE_URL}/products`, formData);
  }

  updateProduct(id: string, data: AdminProductUpdateRequest): Observable<AdminProductUpdateResponse> {
    return this.http.put<AdminProductUpdateResponse>(`${BASE_URL}/products/${id}`, data);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/products/${id}`);
  }

  changeProductStatus(id: string, status: string): Observable<AdminStatusChangeResponse> {
    return this.http.patch<AdminStatusChangeResponse>(`${BASE_URL}/products/${id}/status`, { status });
  }

  toggleFeatured(id: string, isFeatured: boolean): Observable<AdminFeaturedResponse> {
    return this.http.patch<AdminFeaturedResponse>(`${BASE_URL}/products/${id}/featured`, { isFeatured });
  }

  // ── Product Images ─────────────────────────────────────────────────────

  uploadImages(productId: string, files: File[]): Observable<AdminImagesUploadResponse> {
    const formData = new FormData();
    files.forEach((file, index) => formData.append(`images[${index}]`, file));
    return this.http.post<AdminImagesUploadResponse>(`${BASE_URL}/products/${productId}/images`, formData);
  }

  deleteImage(productId: string, imageId: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/products/${productId}/images/${imageId}`);
  }

  reorderImages(productId: string, imageIds: string[]): Observable<void> {
    return this.http.patch<void>(`${BASE_URL}/products/${productId}/images/reorder`, { imageIds });
  }

  // ── Categories ─────────────────────────────────────────────────────────

  getCategories(): Observable<AdminCategory[]> {
    return this.http.get<AdminCategory[]>(`${BASE_URL}/categories`);
  }

  createCategory(data: AdminCategoryCreateRequest): Observable<AdminCategory> {
    return this.http.post<AdminCategory>(`${BASE_URL}/categories`, data);
  }

  updateCategory(id: string, data: AdminCategoryUpdateRequest): Observable<AdminCategory> {
    return this.http.put<AdminCategory>(`${BASE_URL}/categories/${id}`, data);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/categories/${id}`);
  }

  // ── Dashboard ──────────────────────────────────────────────────────────

  getDashboard(): Observable<AdminDashboardData> {
    return this.http.get<AdminDashboardData>(`${BASE_URL}/dashboard`);
  }

  // ── Orders ─────────────────────────────────────────────────────────────

  getOrders(params: {
    page?: number;
    pageSize?: number;
    status?: string;
  } = {}): Observable<PaginatedResponse<AdminOrderListItem>> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params.status) httpParams = httpParams.set('status', params.status);

    return this.http.get<PaginatedResponse<AdminOrderListItem>>(`${BASE_URL}/orders`, { params: httpParams });
  }

  getOrder(id: string): Observable<AdminOrderDetail> {
    return this.http.get<AdminOrderDetail>(`${BASE_URL}/orders/${id}`);
  }

  changeOrderStatus(id: string, data: {
    status: string;
    depositType?: string;
    notes?: string;
  }): Observable<AdminOrderDetail> {
    return this.http.patch<AdminOrderDetail>(`${BASE_URL}/orders/${id}/status`, data);
  }

  // ── Config ─────────────────────────────────────────────────────────────

  updateExchangeRate(rate: number, type: string = 'blue'): Observable<{ rate: number; updatedAt: string }> {
    return this.http.put<{ rate: number; updatedAt: string }>(`${BASE_URL}/config/exchange-rate`, { rate, type });
  }

  updateWhatsappPhone(phone: string): Observable<{ phone: string; updatedAt: string }> {
    return this.http.put<{ phone: string; updatedAt: string }>(`${BASE_URL}/config/whatsapp`, { phone });
  }
}
