import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare const umami: {
  track: (event: string, data?: Record<string, unknown>) => void;
};

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  trackProductView(product: { id: string; name: string; category: string }): void {
    this.track('product_view', {
      product_id: product.id,
      product_name: product.name,
      category: product.category,
    });
  }

  trackCategoryView(category: string): void {
    this.track('category_view', { category });
  }

  trackAddToCart(product: { id: string; name: string; price: number }): void {
    this.track('add_to_cart', {
      product_id: product.id,
      product_name: product.name,
      price: product.price,
    });
  }

  trackRemoveFromCart(productId: string): void {
    this.track('remove_from_cart', { product_id: productId });
  }

  trackCheckout(totalUsd: number, itemCount: number): void {
    this.track('whatsapp_checkout', {
      total_usd: totalUsd,
      items: itemCount,
    });
  }

  trackSearch(query: string, resultCount: number): void {
    this.track('search', { query, results: resultCount });
  }

  trackCurrencyToggle(from: string, to: string): void {
    this.track('currency_toggle', { from, to });
  }

  trackThemeToggle(from: string, to: string): void {
    this.track('theme_toggle', { from, to });
  }

  trackShareProduct(productId: string, method: 'whatsapp' | 'facebook' | 'link'): void {
    this.track('share_product', { product_id: productId, method });
  }

  private track(event: string, data?: Record<string, unknown>): void {
    if (this.isBrowser && typeof umami !== 'undefined') {
      umami.track(event, data);
    }
  }
}
