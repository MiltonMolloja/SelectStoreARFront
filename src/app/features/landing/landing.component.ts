import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { PreferencesService } from '../../core/services/preferences.service';
import { SeoService } from '../../core/services/seo.service';
import { JsonLdService } from '../../core/services/jsonld.service';
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
    <section style="background: linear-gradient(135deg, #eff6ff 0%, #fafafa 100%)">
      <div class="mx-auto flex flex-col md:flex-row items-center justify-between h-[560px]"
           style="padding: 0 80px; max-width: 1440px">
        <div class="max-w-[560px] flex flex-col gap-6">
          <span class="inline-block w-fit px-3.5 py-1.5 rounded-full bg-[var(--color-accent-light)] text-[var(--color-accent)] text-[13px] font-semibold">
            Productos importados bajo pedido
          </span>
          <h1 class="text-[44px] font-extrabold leading-[1.1]" style="font-family: Inter, sans-serif">
            Tu tienda de productos importados premium
          </h1>
          <p class="text-[17px] text-[var(--color-text-secondary)] leading-[1.6]">
            Celulares, consolas, perfumes y tecnología de las mejores marcas del mundo.
            Elegís, coordinás y en ~1 semana lo tenés en tus manos.
          </p>
          <div class="flex items-center gap-4">
            <a routerLink="/catalogo"
               class="px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg text-sm font-semibold
                      hover:opacity-90 transition-opacity">
              Ver Catálogo
            </a>
            <a href="https://wa.me/5493881234567" target="_blank" rel="noopener"
               class="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-lg text-sm font-semibold
                      hover:opacity-90 transition-opacity">
              💬 Consultar por WhatsApp
            </a>
          </div>
        </div>
        <div class="w-[500px] h-[420px] rounded-[20px] overflow-hidden shrink-0 hidden md:block">
          <img src="https://images.unsplash.com/photo-1595392030002-dd3bcc0ca05a?w=1080&q=80"
               alt="Productos importados premium — celulares, consolas, tecnología"
               class="w-full h-full object-cover"
               loading="eager" />
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
    @defer (on viewport) {
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
    } @placeholder {
      <div class="py-16"></div>
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
    @defer (on viewport) {
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
    } @placeholder {
      <div class="py-16"></div>
    }
  `,
})
export class LandingComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly prefs = inject(PreferencesService);
  private readonly seo = inject(SeoService);
  private readonly jsonLd = inject(JsonLdService);

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
    this.jsonLd.setOrganization();
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
