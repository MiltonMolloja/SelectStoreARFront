import { Component, ChangeDetectionStrategy, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { isPlatformBrowser, KeyValuePipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { PreferencesService } from '../../core/services/preferences.service';
import { CartService } from '../../core/services/cart.service';
import { SeoService } from '../../core/services/seo.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { ToastService } from '../../core/services/toast.service';
import { JsonLdService } from '../../core/services/jsonld.service';
import { ProductDetail } from '../../core/models';
import { ImageGalleryComponent } from '../../shared/components/image-gallery/image-gallery.component';
import { ShareButtonsComponent } from '../../shared/components/share-buttons/share-buttons.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { LucideMessageCircle } from '@lucide/angular';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, KeyValuePipe, LucideMessageCircle, ImageGalleryComponent, ShareButtonsComponent, ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <div style="padding: 24px 80px" class="animate-pulse">
        <div class="h-4 bg-[var(--color-divider)] rounded w-64 mb-6"></div>
        <div class="flex gap-12">
          <div class="w-[560px] h-[420px] bg-[var(--color-divider)] rounded-xl shrink-0"></div>
          <div class="flex-1 space-y-4">
            <div class="h-4 bg-[var(--color-divider)] rounded w-24"></div>
            <div class="h-8 bg-[var(--color-divider)] rounded w-3/4"></div>
            <div class="h-6 bg-[var(--color-divider)] rounded w-40"></div>
            <div class="h-12 bg-[var(--color-divider)] rounded w-full"></div>
          </div>
        </div>
      </div>
    } @else if (product()) {
      <div style="padding: 24px 80px">
        <!-- Breadcrumb -->
        <nav class="text-[13px] text-[var(--color-text-secondary)] mb-6 flex items-center gap-2">
          <a routerLink="/" class="hover:text-[var(--color-accent)]">Home</a>
          <span>›</span>
          <a routerLink="/catalogo" class="hover:text-[var(--color-accent)]">Catalogo</a>
          <span>›</span>
          <a [routerLink]="['/categoria', product()!.category.slug]" class="hover:text-[var(--color-accent)]">
            {{ product()!.category.name }}
          </a>
          <span>›</span>
          <span class="text-[var(--color-text-primary)] font-medium">{{ product()!.name }}</span>
        </nav>

        <!-- Product Main -->
        <div class="flex flex-col md:flex-row gap-12 mb-10">
          <!-- Gallery -->
          <div class="w-full md:w-[560px] shrink-0">
            <app-image-gallery [images]="product()!.images" />
          </div>

          <!-- Info -->
          <div class="flex-1 flex flex-col gap-5">
            <a [routerLink]="['/catalogo']" [queryParams]="{ brand: product()!.brand }"
               class="text-[14px] text-[var(--color-accent)] font-medium hover:underline">
              {{ product()!.brand }}
            </a>

            <h1 class="text-[32px] font-bold leading-tight">
              {{ product()!.name }}
            </h1>

            <!-- Price -->
            <div>
              <p class="text-[28px] font-extrabold text-[var(--color-accent)]">
                US$ {{ product()!.finalPriceUsd.toFixed(2) }}
              </p>
              <p class="text-[14px] text-[var(--color-text-secondary)] mt-1">
                {{ '$' }} {{ (product()!.finalPriceUsd * (product()!.exchangeRate || 1250)).toLocaleString('es-AR') }}
                (cotización: {{ '$' }}{{ (product()!.exchangeRate || 1250).toLocaleString('es-AR') }})
              </p>
            </div>

            <!-- Availability -->
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[var(--color-success)]"></span>
              <span class="text-[14px] text-[var(--color-text-secondary)]">
                Bajo pedido · Entrega en ~1 semana
              </span>
            </div>

            <div class="h-px bg-[var(--color-border)]"></div>

            <!-- Actions -->
            <div class="flex flex-col gap-3">
              <button (click)="onAddToCart()"
                      class="w-full py-3 bg-[var(--color-accent)] text-white rounded-lg font-semibold
                             hover:opacity-90 transition-opacity text-[16px]">
                Agregar al carrito
              </button>
              <a [href]="getWhatsAppLink()" target="_blank" rel="noopener"
                 class="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white rounded-lg font-semibold
                        hover:opacity-90 transition-opacity text-[14px]">
                <svg lucideMessageCircle [size]="18"></svg>
                Consultar por WhatsApp
              </a>
            </div>

            <div class="h-px bg-[var(--color-border)]"></div>

            <!-- Share -->
            <app-share-buttons
              [productId]="product()!.id"
              [productName]="product()!.name"
              [productUrl]="currentUrl" />
          </div>
        </div>

        <!-- Description -->
        @if (product()!.description) {
          <section class="mb-10 pt-8 border-t border-[var(--color-border)]">
            <h2 class="text-[20px] font-bold mb-4">Descripcion</h2>
            <p class="text-[14px] text-[var(--color-text-secondary)] leading-[1.7] max-w-3xl">
              {{ product()!.description }}
            </p>
          </section>
        }

        <!-- Specifications -->
        @if (hasSpecs()) {
          <section class="mb-10">
            <h2 class="text-[20px] font-bold mb-4">Especificaciones</h2>
            <div class="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden max-w-2xl">
              @for (spec of product()!.specifications | keyvalue; track spec.key) {
                <div class="flex border-b border-[var(--color-divider)] last:border-b-0">
                  <div class="w-1/3 px-4 py-3 text-[13px] font-medium bg-[var(--color-surface-hover)]">
                    {{ spec.key }}
                  </div>
                  <div class="w-2/3 px-4 py-3 text-[13px] text-[var(--color-text-secondary)]">
                    {{ spec.value }}
                  </div>
                </div>
              }
            </div>
          </section>
        }

        <!-- Related Products -->
        @defer (on viewport) {
          @if (product()!.relatedProducts.length) {
            <section class="mb-10">
              <h2 class="text-[20px] font-bold mb-6">Productos Relacionados</h2>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-5">
                @for (related of product()!.relatedProducts; track related.id) {
                  <app-product-card [product]="related" />
                }
              </div>
            </section>
          }
        } @placeholder {
          <div class="mb-10"></div>
        }
      </div>
    } @else {
      <div class="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
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
  private readonly toast = inject(ToastService);
  private readonly jsonLd = inject(JsonLdService);
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
    this.toast.success(`${p.name} agregado al carrito`);
  }

  private loadProduct(slug: string): void {
    this.api.getProductBySlug(slug).subscribe({
      next: (product) => {
        this.product.set(product);
        if (product.exchangeRate > 0) {
          this.prefs.setExchangeRate(product.exchangeRate);
        }
        this.loading.set(false);

        // SEO
        this.seo.updateProduct(product.seo, this.currentUrl);
        this.jsonLd.setProduct(product);

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
