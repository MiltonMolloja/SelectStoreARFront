import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  imageUrl: string;
  priceUsd: number;
  quantity: number;
}

const STORAGE_KEY = 'ssa-cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly items = signal<CartItem[]>(this.loadCart());

  readonly itemCount = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0),
  );

  readonly totalUsd = computed(() =>
    this.items().reduce((sum, item) => sum + item.priceUsd * item.quantity, 0),
  );

  readonly isEmpty = computed(() => this.items().length === 0);

  addItem(product: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string;
    finalPriceUsd: number;
  }): void {
    this.items.update(items => {
      const existing = items.find(i => i.productId === product.id);
      if (existing) {
        return items.map(i =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [
        ...items,
        {
          productId: product.id,
          name: product.name,
          slug: product.slug,
          imageUrl: product.imageUrl,
          priceUsd: product.finalPriceUsd,
          quantity: 1,
        },
      ];
    });
    this.saveCart();
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    this.items.update(items =>
      items.map(i => (i.productId === productId ? { ...i, quantity } : i)),
    );
    this.saveCart();
  }

  removeItem(productId: string): void {
    this.items.update(items => items.filter(i => i.productId !== productId));
    this.saveCart();
  }

  clear(): void {
    this.items.set([]);
    this.saveCart();
  }

  private saveCart(): void {
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items()));
    }
  }

  private loadCart(): CartItem[] {
    if (!this.isBrowser) {
      return [];
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  }
}
