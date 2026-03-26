import { Component, ChangeDetectionStrategy, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { isPlatformBrowser, KeyValuePipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { PreferencesService } from '../../core/services/preferences.service';
import { CartService } from '../../core/services/cart.service';
import { SeoService } from '../../core/services/seo.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { ProductDetail } from '../../core/models';
import { ImageGalleryComponent } from '../../shared/components/image-gallery/image-gallery.component';
import { ShareButtonsComponent } from '../../shared/components/share-buttons/share-buttons.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, KeyValuePipe, ImageGalleryComponent, ShareButtonsComponent, ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <!-- Skeleton -->
      <div class="container mx-auto px-4 py-8 animate-pulse">
        <div class="h-4 bg-[var(--color-divider)] rounded w-64 mb-6"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="aspect-[4/3] bg-[var(--color-divider)] rounded-xl"></div>
          <div class="space-y-4">
            <div class="h-3 bg-[var(--color-divider)] rounded w-24"></div>
            <div class="h-8 bg-[var(--color-divider)] rounded w-3/4"></div>
            <div class="h-6 bg-[var(--color-divider)] rounded w-40"></div>
            <div class="h-12 bg-[var(--color-divider)] rounded w-full"></div>
          </div>
        </div>
      </div>
    } @else if (product()) {
      <div class="container mx-auto px-4 py-8">
        <!-- Breadcrumb -->
        <nav class="text-sm text-[var(--color-text-secondary)] mb-6">
          <a routerLink="/" class="hover:text-[var(--color-accent)]">Home</a>
          <span class="mx-2">›</span>
          <a routerLink="/catalogo" class="hover:text-[var(--color-accent)]">Catálogo</a>
          <span class="mx-2">›</span>
          <a [routerLink]="['/categoria', product()!.category.slug]" class="hover:text-[var(--color-accent)]">
            {{ product()!.category.name }}
          </a>
          <span class="mx-2">›</span>
          <span class="text-[var(--color-text-primary)]">{{ product()!.name }}</span>
        </nav>

        <!-- Product Main -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <!-- Gallery -->
          <app-image-gallery [images]="product()!.images" />

          <!-- Info -->
          <div>
            <a [routerLink]="['/categoria', product()!.category.slug]"
               class="text-sm text-[var(--color-accent)] font-medium hover:underline">
              {{ product()!.category.name }}
            </a>

            <h1 class="text-2xl md:text-3xl font-bold mt-2 mb-4"
                style="font-family: 'Cormorant Garamond', serif">
              {{ product()!.name }}
            </h1>

            <!-- Price -->
            <div class="mb-4">
              <p class="text-2xl font-bold text-[var(--color-accent)]">
                {{ prefs.formatPrice()(product()!.finalPriceUsd) }}
              </p>
              @if (prefs.currency() === 'ARS') {
                <p class="text-sm text-[var(--color-text-secondary)]">
                  US$ {{ product()!.finalPriceUsd.toFixed(2) }} · Cotización: $ {{ product()!.exchangeRate.toLocaleString('es-AR') }}
                </p>
              }
            </div>

            <!-- Availability -->
            <div class="flex items-center gap-2 mb-6 text-sm">
              <span class="w-2 h-2 rounded-full"
                    [class.bg-[var(--color-success)]]="product()!.availability === 'available'"
                    [class.bg-[var(--color-warning)]]="product()!.availability === 'on_order'"
                    [class.bg-[var(--color-error)]]="product()!.availability === 'unavailable'">
              </span>
              <span class="text-[var(--color-text-secondary)]">
                {{ getAvailabilityLabel(product()!.availability) }}
              </span>
            </div>

            <!-- Actions -->
            <div class="space-y-3 mb-6">
              <button (click)="onAddToCart()"
                      class="w-full py-3.5 bg-[var(--color-accent)] text-white rounded-lg font-medium
                             hover:opacity-90 transition-opacity text-sm">
                Agregar al carrito
              </button>
              <a [href]="getWhatsAppLink()" target="_blank" rel="noopener"
                 class="block w-full py-3.5 bg-green-500 text-white rounded-lg font-medium
                        hover:opacity-90 transition-opacity text-sm text-center">
                💬 Consultar por WhatsApp
              </a>
            </div>

            <!-- Share -->
            <app-share-buttons
              [productId]="product()!.id"
              [productName]="product()!.name"
              [productUrl]="currentUrl" />
          </div>
        </div>

        <!-- Description -->
        @if (product()!.description) {
          <section class="mb-10">
            <h2 class="text-xl font-bold mb-4" style="font-family: 'Cormorant Garamond', serif">
              Descripción
            </h2>
            <div class="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line max-w-3xl">
              {{ product()!.description }}
            </div>
          </section>
        }

        <!-- Specifications -->
        @if (hasSpecs()) {
          <section class="mb-10">
            <h2 class="text-xl font-bold mb-4" style="font-family: 'Cormorant Garamond', serif">
              Especificaciones
            </h2>
            <div class="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden max-w-2xl">
              @for (spec of product()!.specifications | keyvalue; track spec.key) {
                <div class="flex border-b border-[var(--color-divider)] last:border-b-0">
                  <div class="w-1/3 px-4 py-3 text-sm font-medium bg-[var(--color-surface-hover)]">
                    {{ spec.key }}
                  </div>
                  <div class="w-2/3 px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                    {{ spec.value }}
                  </div>
                </div>
              }
            </div>
          </section>
        }

        <!-- Related Products -->
        @if (product()!.relatedProducts.length) {
          <section class="mb-10">
            <h2 class="text-xl font-bold mb-6" style="font-family: 'Cormorant Garamond', serif">
              Productos Relacionados
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              @for (related of product()!.relatedProducts; track related.id) {
                <app-product-card [product]="related" />
              }
            </div>
          </section>
        }
      </div>
    } @else {
      <!-- Not found -->
      <div class="container mx-auto px-4 py-16 text-center">
        <p class="text-4xl mb-4">😕</p>
        <h2 class="text-2xl font-bold mb-2">Producto no encontrado</h2>
        <p class="text-[var(--color-text-secondary)] mb-6">El producto que buscás no existe o fue removido</p>
        <a routerLink="/catalogo"
           class="px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg font-medium hover:opacity-90">
          Ver catálogo
        </a>
      </div>
    }
  `,
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);
  private readonly analytics = inject(AnalyticsService);
  private readonly cart = inject(CartService);
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly prefs = inject(PreferencesService);

  protected readonly product = signal<ProductDetail | null>(null);
  protected readonly loading = signal(true);
  protected currentUrl = '';

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUrl = window.location.href;
    }

    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadProduct(slug);
    } else {
      this.loading.set(false);
    }
  }

  protected hasSpecs(): boolean {
    const specs = this.product()?.specifications;
    return specs !== undefined && specs !== null && Object.keys(specs).length > 0;
  }

  protected getAvailabilityLabel(availability: string): string {
    const labels: Record<string, string> = {
      available: 'Bajo pedido · 7-15 días hábiles',
      on_order: 'En camino · consultar disponibilidad',
      unavailable: 'No disponible',
    };
    return labels[availability] ?? availability;
  }

  protected getWhatsAppLink(): string {
    const p = this.product();
    if (!p) return '#';
    const msg = encodeURIComponent(
      `Hola! Me interesa el producto: ${p.name} (US$ ${p.finalPriceUsd.toFixed(2)}). ¿Está disponible?`,
    );
    return `https://wa.me/5493881234567?text=${msg}`;
  }

  protected onAddToCart(): void {
    const p = this.product();
    if (!p) return;
    this.cart.addItem({
      id: p.id,
      name: p.name,
      slug: p.slug,
      imageUrl: p.images[0]?.thumbnail ?? '',
      finalPriceUsd: p.finalPriceUsd,
    });
    this.analytics.trackAddToCart({ id: p.id, name: p.name, price: p.finalPriceUsd });
  }

  private loadProduct(slug: string): void {
    this.api.getProductBySlug(slug).subscribe({
      next: (product) => {
        this.product.set(product);
        this.prefs.setExchangeRate(product.exchangeRate);
        this.loading.set(false);

        // SEO
        this.seo.updateProduct(product.seo, this.currentUrl);

        // Analytics
        this.analytics.trackProductView({
          id: product.id,
          name: product.name,
          category: product.category.name,
        });
      },
      error: () => {
        this.product.set(null);
        this.loading.set(false);
      },
    });
  }
}
