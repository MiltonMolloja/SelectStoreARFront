import { Component, ChangeDetectionStrategy, inject, OnInit, signal, viewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideSearch, LucideMessageCircle, LucideCreditCard, LucideTimer, LucidePackage, LucideShield, LucideMapPin, LucideChevronLeft, LucideChevronRight } from '@lucide/angular';
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
  imports: [RouterLink, LucideSearch, LucideMessageCircle, LucideCreditCard, LucideTimer, LucidePackage, LucideShield, LucideMapPin, LucideChevronLeft, LucideChevronRight, ProductCardComponent, SkeletonCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Hero -->
    <section style="background: linear-gradient(135deg, var(--hero-from) 0%, var(--hero-to) 100%)">
      <div class="mx-auto flex flex-col md:flex-row items-center justify-between min-h-[560px] px-5 md:px-20"
           style="max-width: 1440px">
        <div class="max-w-[560px] flex flex-col gap-6">
          <span class="inline-block w-fit px-3.5 py-1.5 rounded-full bg-[var(--color-accent-light)] text-[var(--color-accent)] text-[13px] font-semibold">
            Productos importados bajo pedido
          </span>
          <h1 class="text-[44px] font-extrabold leading-[1.1] text-[var(--color-text-primary)]" style="font-family: Inter, sans-serif">
            Tu tienda de productos importados premium
          </h1>
          <p class="text-[17px] text-[var(--color-text-secondary)] leading-[1.6]">
            Celulares, consolas, perfumes y tecnología de las mejores marcas del mundo.
            Elegís, coordinás y en ~1 semana lo tenés en tus manos.
          </p>
          <div class="flex items-center gap-4 flex-wrap">
            <a routerLink="/catalogo"
               class="px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg text-sm font-semibold
                      hover:opacity-90 transition-opacity whitespace-nowrap">
              Ver Catálogo
            </a>
            <a href="https://wa.me/5493881234567" target="_blank" rel="noopener"
               class="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-lg text-sm font-semibold
                      hover:opacity-90 transition-opacity whitespace-nowrap">
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
    <section style="padding: 60px 80px">
      <div class="flex flex-col items-center gap-10">
        <div class="text-center">
          <h2 class="text-[32px] font-bold mb-2" style="font-family: Inter, sans-serif">Como funciona</h2>
          <p class="text-[16px] text-[var(--color-text-secondary)]">En 5 simples pasos tenes tu producto importado</p>
        </div>
        <div class="flex justify-center gap-6 w-full flex-wrap">
          <!-- Step 1 -->
          <div class="flex flex-col items-center gap-3 w-[220px]">
            <div class="w-14 h-14 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center">
              <svg lucideSearch class="text-[var(--color-accent)]" [size]="24"></svg>
            </div>
            <p class="text-[16px] font-semibold">1. Elegí</p>
            <p class="text-[13px] text-[var(--color-text-secondary)] leading-[1.5] text-center">Navegá el catálogo y encontrá lo que buscás</p>
          </div>
          <!-- Step 2 -->
          <div class="flex flex-col items-center gap-3 w-[220px]">
            <div class="w-14 h-14 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center">
              <svg lucideMessageCircle class="text-[var(--color-accent)]" [size]="24"></svg>
            </div>
            <p class="text-[16px] font-semibold">2. Contactá</p>
            <p class="text-[13px] text-[var(--color-text-secondary)] leading-[1.5] text-center">Escribinos por WhatsApp para coordinar</p>
          </div>
          <!-- Step 3 -->
          <div class="flex flex-col items-center gap-3 w-[220px]">
            <div class="w-14 h-14 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center">
              <svg lucideCreditCard class="text-[var(--color-accent)]" [size]="24"></svg>
            </div>
            <p class="text-[16px] font-semibold">3. Señá</p>
            <p class="text-[13px] text-[var(--color-text-secondary)] leading-[1.5] text-center">Abonás una seña para confirmar tu pedido</p>
          </div>
          <!-- Step 4 -->
          <div class="flex flex-col items-center gap-3 w-[220px]">
            <div class="w-14 h-14 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center">
              <svg lucideTimer class="text-[var(--color-accent)]" [size]="24"></svg>
            </div>
            <p class="text-[16px] font-semibold">4. Esperá</p>
            <p class="text-[13px] text-[var(--color-text-secondary)] leading-[1.5] text-center">Tu producto llega en aproximadamente 1 semana</p>
          </div>
          <!-- Step 5 -->
          <div class="flex flex-col items-center gap-3 w-[220px]">
            <div class="w-14 h-14 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center">
              <svg lucidePackage class="text-[var(--color-accent)]" [size]="24"></svg>
            </div>
            <p class="text-[16px] font-semibold">5. Recibí</p>
            <p class="text-[13px] text-[var(--color-text-secondary)] leading-[1.5] text-center">Retirás tu producto o te lo enviamos</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Categorías -->
     @defer (on viewport) {
      @if (data()?.categories?.length) {
        <section class="bg-[var(--color-surface)]" style="padding: 60px 80px">
          <div class="flex items-end justify-between mb-8">
            <div>
              <h2 class="text-[32px] font-bold mb-2">Categorias</h2>
              <p class="text-[16px] text-[var(--color-text-secondary)]">
                Explorá nuestras categorías de productos importados
              </p>
            </div>
            <div class="flex gap-2">
              <button (click)="scrollCategories('left')"
                      class="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center
                             hover:bg-[var(--color-surface-hover)] transition-colors"
                      aria-label="Anterior">
                <svg lucideChevronLeft [size]="20" class="text-[var(--color-text-secondary)]"></svg>
              </button>
              <button (click)="scrollCategories('right')"
                      class="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center
                             hover:bg-[var(--color-surface-hover)] transition-colors"
                      aria-label="Siguiente">
                <svg lucideChevronRight [size]="20" class="text-[var(--color-text-secondary)]"></svg>
              </button>
            </div>
          </div>
          <div #categoryCarousel
               class="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
               style="scrollbar-width: none; -ms-overflow-style: none">
            @for (cat of data()!.categories; track cat.id) {
              <a [routerLink]="['/categoria', cat.slug]"
                 class="group relative shrink-0 w-[280px] aspect-[3/2] rounded-xl overflow-hidden bg-[var(--color-divider)] snap-start">
                @if (cat.imageUrl) {
                  <img [src]="cat.imageUrl" [alt]="cat.name" loading="lazy"
                       class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                }
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div class="absolute bottom-0 left-0 p-4">
                  <p class="text-white font-semibold text-[15px]">{{ cat.name }}</p>
                  <p class="text-white/70 text-[12px]">{{ cat.productCount }} productos</p>
                </div>
              </a>
            }
          </div>
        </section>
      }
    } @placeholder {
      <div class="py-16"></div>
    }

    <!-- Productos Destacados -->
    <section style="padding: 60px 80px">
      <div>
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-[32px] font-bold" style="font-family: Inter, sans-serif">
            Productos Destacados
          </h2>
          <a routerLink="/catalogo"
             class="text-[14px] text-[var(--color-accent)] hover:underline font-semibold">
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
      <section class="bg-[var(--color-surface)]" style="padding: 60px 80px">
        <div class="flex flex-col items-center gap-10">
          <h2 class="text-[32px] font-bold" style="font-family: Inter, sans-serif">Por que elegirnos</h2>
          <div class="flex justify-center gap-8 flex-wrap">
            <!-- Trust 1: Jujuy -->
            <div class="flex flex-col items-center gap-3 w-[280px] p-6 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)]">
              <div class="w-12 h-12 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center">
                <svg lucideMapPin class="text-[var(--color-accent)]" [size]="22"></svg>
              </div>
              <h3 class="text-[16px] font-semibold">Jujuy, Argentina</h3>
              <p class="text-[13px] text-[var(--color-text-secondary)] leading-[1.5] text-center">
                Operamos desde San Salvador de Jujuy con envíos a todo el país
              </p>
            </div>
            <!-- Trust 2: WhatsApp -->
            <div class="flex flex-col items-center gap-3 w-[280px] p-6 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)]">
              <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg lucideMessageCircle class="text-[#25D366]" [size]="22"></svg>
              </div>
              <h3 class="text-[16px] font-semibold">WhatsApp directo</h3>
              <p class="text-[13px] text-[var(--color-text-secondary)] leading-[1.5] text-center">
                Atención personalizada por WhatsApp. Consultá precios y disponibilidad al instante
              </p>
            </div>
            <!-- Trust 3: Originales -->
            <div class="flex flex-col items-center gap-3 w-[280px] p-6 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)]">
              <div class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <svg lucideShield class="text-amber-600" [size]="22"></svg>
              </div>
              <h3 class="text-[16px] font-semibold">Productos originales</h3>
              <p class="text-[13px] text-[var(--color-text-secondary)] leading-[1.5] text-center">
                Todos nuestros productos son 100% originales con garantía de fábrica
              </p>
            </div>
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
  protected readonly categoryCarousel = viewChild<ElementRef>('categoryCarousel');

  protected readonly steps = [
    { number: 1, lucide: 'search', title: '1. Elegí', description: 'Navegá el catálogo y encontrá lo que buscás' },
    { number: 2, lucide: 'message-circle', title: '2. Contactá', description: 'Escribinos por WhatsApp para coordinar' },
    { number: 3, lucide: 'credit-card', title: '3. Señá', description: 'Abonás una seña para confirmar tu pedido' },
    { number: 4, lucide: 'timer', title: '4. Esperá', description: 'Tu producto llega en aproximadamente 1 semana' },
    { number: 5, lucide: 'package', title: '5. Recibí', description: 'Retirás tu producto o te lo enviamos' },
  ];

  ngOnInit(): void {
    this.seo.updatePage(
      'SelectStoreAR — Productos importados bajo pedido',
      'Productos importados premium bajo pedido. Celulares, consolas, perfumes y tecnología con precios en USD y ARS. Jujuy, Argentina.',
    );
    this.jsonLd.setOrganization();
    this.loadLanding();
  }

  protected scrollCategories(direction: 'left' | 'right'): void {
    const el = this.categoryCarousel()?.nativeElement;
    if (!el) return;
    const scrollAmount = 300;
    el.scrollBy({ left: direction === 'right' ? scrollAmount : -scrollAmount, behavior: 'smooth' });
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
