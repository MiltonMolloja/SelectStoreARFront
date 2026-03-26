import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { PreferencesService } from '../../core/services/preferences.service';
import { SeoService } from '../../core/services/seo.service';
import { LandingData } from '../../core/models';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { SkeletonCardComponent } from '../../shared/components/skeleton-card/skeleton-card.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, ProductCardComponent, SkeletonCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Hero -->
    <section class="bg-[var(--color-surface)]">
      <div class="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
        <div class="flex-1 text-center md:text-left">
          <p class="text-sm text-[var(--color-accent)] font-medium mb-3 tracking-wide uppercase">
            Productos importados bajo pedido
          </p>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              style="font-family: 'Cormorant Garamond', serif">
            Tu tienda de productos importados premium
          </h1>
          <p class="text-lg text-[var(--color-text-secondary)] mb-8 max-w-lg">
            Celulares, consolas, perfumes y tecnología. Todos los productos son bajo pedido —
            señás y coordinás directamente por WhatsApp.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a routerLink="/catalogo"
               class="px-8 py-3.5 bg-[var(--color-accent)] text-white rounded-lg font-medium
                      hover:opacity-90 transition-opacity text-center">
              Ver Catálogo
            </a>
            <a href="https://wa.me/5493881234567" target="_blank" rel="noopener"
               class="px-8 py-3.5 border border-green-500 text-green-600 rounded-lg font-medium
                      hover:bg-green-50 transition-colors text-center">
              💬 Consultar por WhatsApp
            </a>
          </div>
        </div>
        <div class="flex-1 max-w-md">
          <div class="aspect-square rounded-2xl bg-[var(--color-accent)] p-8 flex items-center justify-center">
            <span class="text-8xl">📱</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Cómo funciona -->
    <section class="py-16 md:py-20">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-4" style="font-family: 'Cormorant Garamond', serif">
          Cómo funciona
        </h2>
        <p class="text-center text-[var(--color-text-secondary)] mb-12 max-w-xl mx-auto">
          En 5 simples pasos tenés tu producto importado en tus manos
        </p>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
          @for (step of steps; track step.number) {
            <div class="text-center">
              <div class="w-14 h-14 mx-auto mb-3 rounded-full bg-[var(--color-accent-light)]
                          flex items-center justify-center text-2xl">
                {{ step.icon }}
              </div>
              <p class="font-semibold text-sm mb-1">{{ step.title }}</p>
              <p class="text-xs text-[var(--color-text-secondary)]">{{ step.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Categorías -->
    @if (data()?.categories?.length) {
      <section class="py-16 bg-[var(--color-surface)]">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold mb-4" style="font-family: 'Cormorant Garamond', serif">
            Categorías
          </h2>
          <p class="text-[var(--color-text-secondary)] mb-8">
            Explorá nuestro catálogo por categoría
          </p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            @for (cat of data()!.categories; track cat.id) {
              <a [routerLink]="['/categoria', cat.slug]"
                 class="group relative aspect-[3/2] rounded-xl overflow-hidden bg-[var(--color-divider)]">
                @if (cat.imageUrl) {
                  <img [src]="cat.imageUrl" [alt]="cat.name" loading="lazy"
                       class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                }
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div class="absolute bottom-0 left-0 p-4">
                  <p class="text-white font-semibold">{{ cat.name }}</p>
                  <p class="text-white/70 text-xs">{{ cat.productCount }} productos</p>
                </div>
              </a>
            }
          </div>
        </div>
      </section>
    }

    <!-- Productos Destacados -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold" style="font-family: 'Cormorant Garamond', serif">
            Productos Destacados
          </h2>
          <a routerLink="/catalogo"
             class="text-sm text-[var(--color-accent)] hover:underline font-medium">
            Ver todos →
          </a>
        </div>

        @if (loading()) {
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            @for (i of [1,2,3,4]; track i) {
              <app-skeleton-card />
            }
          </div>
        } @else if (data()?.featuredProducts?.length) {
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            @for (product of data()!.featuredProducts; track product.id) {
              <app-product-card [product]="product" />
            }
          </div>
        }
      </div>
    </section>

    <!-- Por qué elegirnos -->
    <section class="py-16 bg-[var(--color-surface)]">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12" style="font-family: 'Cormorant Garamond', serif">
          Por qué elegirnos
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          @for (trust of trustItems; track trust.title) {
            <div class="text-center">
              <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-accent-light)]
                          flex items-center justify-center text-3xl">
                {{ trust.icon }}
              </div>
              <h3 class="font-semibold mb-2">{{ trust.title }}</h3>
              <p class="text-sm text-[var(--color-text-secondary)]">{{ trust.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class LandingComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly prefs = inject(PreferencesService);
  private readonly seo = inject(SeoService);

  protected readonly data = signal<LandingData | null>(null);
  protected readonly loading = signal(true);

  protected readonly steps = [
    { number: 1, icon: '🔍', title: 'Elegí', description: 'Navegá el catálogo' },
    { number: 2, icon: '💬', title: 'Contactá', description: 'Escribinos por WhatsApp' },
    { number: 3, icon: '💰', title: 'Señá', description: 'Reservá con una seña' },
    { number: 4, icon: '📦', title: 'Esperá', description: '7-15 días hábiles' },
    { number: 5, icon: '🎉', title: 'Recibí', description: 'Tu producto en mano' },
  ];

  protected readonly trustItems = [
    { icon: '🛡️', title: 'Trato seguro', description: 'Coordinás todo por WhatsApp con atención personalizada' },
    { icon: '✅', title: 'Productos originales', description: 'Todos los productos son originales, sellados y con garantía' },
    { icon: '🚀', title: 'Pedido al mejor precio', description: 'Al ser bajo pedido, conseguimos los mejores precios del mercado' },
  ];

  ngOnInit(): void {
    this.seo.updatePage(
      'SelectStoreAR — Productos importados bajo pedido',
      'Productos importados premium bajo pedido. Celulares, consolas, perfumes y tecnología con precios en USD y ARS. Jujuy, Argentina.',
    );
    this.loadLanding();
  }

  private loadLanding(): void {
    this.api.getLanding().subscribe({
      next: (data) => {
        this.data.set(data);
        this.prefs.setExchangeRate(data.exchangeRate.rate);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
