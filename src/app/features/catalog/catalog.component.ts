import { Component, ChangeDetectionStrategy, inject, OnInit, signal, effect, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideX } from '@lucide/angular';
import { ApiService } from '../../core/services/api.service';
import { PreferencesService } from '../../core/services/preferences.service';
import { SeoService } from '../../core/services/seo.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { ProductListItem, Category, PaginationInfo } from '../../core/models';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { SkeletonCardComponent } from '../../shared/components/skeleton-card/skeleton-card.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [RouterLink, FormsModule, LucideX, ProductCardComponent, SkeletonCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="padding: 24px 80px">
      <!-- Breadcrumb -->
      <nav class="text-[13px] text-[var(--color-text-secondary)] mb-6 flex items-center gap-2">
        <a routerLink="/" class="hover:text-[var(--color-accent)]">Home</a>
        <span>›</span>
        <span class="text-[var(--color-text-primary)] font-medium">
          {{ activeCategory() ? activeCategory()!.name : 'Catalogo' }}
        </span>
      </nav>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Filters -->
        <aside class="w-full lg:w-[260px] shrink-0">
          <h2 class="text-[18px] font-bold mb-4">Filtros</h2>

          <!-- Active Filter Chips -->
          @if (activeFilters().length > 0) {
            <div class="mb-6 flex flex-col gap-2">
              <div class="flex flex-wrap gap-1.5">
                @for (filter of activeFilters(); track filter.label) {
                  <button (click)="removeFilter(filter.type)"
                          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-border)]
                                 bg-[var(--color-surface)] text-[13px] font-medium hover:bg-[var(--color-surface-hover)] transition-colors">
                    {{ filter.label }}
                    <svg lucideX [size]="14" class="text-[var(--color-text-secondary)]"></svg>
                  </button>
                }
              </div>
              <button (click)="clearAllFilters()"
                      class="text-[12px] font-medium text-[var(--color-accent)] hover:underline text-left w-fit">
                Limpiar filtros
              </button>
            </div>
          }

          <!-- Categories -->
          <div class="mb-6">
            <h3 class="text-[14px] font-semibold mb-3">Categorias</h3>
            <div class="flex flex-col gap-2.5">
              @for (cat of categories(); track cat.id) {
                <a [routerLink]="['/categoria', cat.slug]"
                   class="flex items-center gap-2 text-[13px] hover:text-[var(--color-accent)] transition-colors">
                  <span class="w-[18px] h-[18px] rounded border shrink-0 flex items-center justify-center"
                        [class.bg-[var(--color-accent)]]="activeCategorySlug() === cat.slug"
                        [class.border-[var(--color-accent)]]="activeCategorySlug() === cat.slug"
                        [class.border-[var(--color-border)]]="activeCategorySlug() !== cat.slug"
                        [class.bg-[var(--color-surface)]]="activeCategorySlug() !== cat.slug">
                    @if (activeCategorySlug() === cat.slug) {
                      <span class="text-white text-[10px]">✓</span>
                    }
                  </span>
                  <span [class.font-semibold]="activeCategorySlug() === cat.slug">
                    {{ cat.name }} ({{ cat.productCount }})
                  </span>
                </a>
              }
            </div>
          </div>

          <!-- Brands -->
          @if (brands().length > 0) {
            <div class="mb-6">
              <h3 class="text-[14px] font-semibold mb-3">Marca</h3>
              <div class="flex flex-col gap-2.5 max-h-[200px] overflow-y-auto">
                @for (brand of brands(); track brand) {
                  <button (click)="onBrandFilter(brand)"
                     class="flex items-center gap-2 text-[13px] hover:text-[var(--color-accent)] transition-colors text-left">
                    <span class="w-[18px] h-[18px] rounded border shrink-0 flex items-center justify-center"
                          [class.bg-[var(--color-accent)]]="activeBrand() === brand"
                          [class.border-[var(--color-accent)]]="activeBrand() === brand"
                          [class.border-[var(--color-border)]]="activeBrand() !== brand"
                          [class.bg-[var(--color-surface)]]="activeBrand() !== brand">
                      @if (activeBrand() === brand) {
                        <span class="text-white text-[10px]">✓</span>
                      }
                    </span>
                    <span [class.font-semibold]="activeBrand() === brand">{{ brand }}</span>
                  </button>
                }
              </div>
            </div>
          }

          <!-- Price Range -->
          <div class="mb-6">
            <h3 class="text-[14px] font-semibold mb-3">Rango de precio</h3>
            <div class="flex gap-2 items-center">
              <input type="number" placeholder="US$ 0" [ngModel]="minPrice()" (ngModelChange)="minPrice.set($event)"
                     class="w-full px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[13px]
                            focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
              <span class="text-[var(--color-text-secondary)] text-[13px]">—</span>
              <input type="number" placeholder="US$ 2,000" [ngModel]="maxPrice()" (ngModelChange)="maxPrice.set($event)"
                     class="w-full px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[13px]
                            focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1">
          <!-- Search + Sort -->
          <div class="flex items-center gap-4 mb-5">
            <div class="flex-1 relative">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] text-[13px]">🔍</span>
              <input type="text" placeholder="Buscar productos..."
                     [ngModel]="searchQuery()" (ngModelChange)="onSearch($event)"
                     class="w-full pl-10 pr-4 py-2.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]
                            text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-[13px] text-[var(--color-text-secondary)] font-medium">Ordenar:</span>
              <select [ngModel]="sortBy()" (ngModelChange)="onSort($event)"
                      class="px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]
                             text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]">
                <option value="recent">Mas recientes</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="name-asc">Nombre A-Z</option>
              </select>
            </div>
          </div>

          <!-- Results count -->
          @if (pagination()) {
            <p class="text-[13px] text-[var(--color-text-secondary)] mb-5">
              Mostrando {{ pagination()!.totalItems }} productos
            </p>
          }

          <!-- Product Grid -->
          @if (loading()) {
            <div class="grid grid-cols-2 md:grid-cols-3 gap-5">
              @for (i of [1,2,3,4,5,6]; track i) {
                <app-skeleton-card />
              }
            </div>
          } @else if (products().length > 0) {
            <div class="grid grid-cols-2 md:grid-cols-3 gap-5">
              @for (product of products(); track product.id) {
                <app-product-card [product]="product" />
              }
            </div>
          } @else {
            <div class="text-center py-16">
              <p class="text-4xl mb-4">🔍</p>
              <h3 class="text-xl font-semibold mb-2">No se encontraron productos</h3>
              <p class="text-[var(--color-text-secondary)] mb-6">
                Intentá con otros filtros o términos de búsqueda
              </p>
              <a routerLink="/catalogo"
                 class="px-6 py-2.5 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:opacity-90">
                Ver todo el catálogo
              </a>
            </div>
          }

          <!-- Pagination -->
          @if (pagination() && pagination()!.totalPages > 1) {
            <div class="flex items-center justify-center gap-1 mt-8 pt-4">
              @for (page of getPageNumbers(); track page) {
                <button
                  (click)="onPageChange(page)"
                  [class.bg-[var(--color-accent)]]="page === currentPage()"
                  [class.text-white]="page === currentPage()"
                  class="w-9 h-9 rounded-lg border border-[var(--color-border)] text-[13px] font-medium
                         hover:bg-[var(--color-surface-hover)] transition-colors">
                  {{ page }}
                </button>
              }
              @if (pagination()!.hasNextPage) {
                <button (click)="onPageChange(currentPage() + 1)"
                        class="w-9 h-9 rounded-lg border border-[var(--color-border)] text-[13px] hover:bg-[var(--color-surface-hover)]
                               flex items-center justify-center">
                  ›
                </button>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class CatalogComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly prefs = inject(PreferencesService);
  private readonly seo = inject(SeoService);
  private readonly analytics = inject(AnalyticsService);

  protected readonly products = signal<ProductListItem[]>([]);
  protected readonly categories = signal<Category[]>([]);
  protected readonly pagination = signal<PaginationInfo | null>(null);
  protected readonly loading = signal(true);
  protected readonly searchQuery = signal('');
  protected readonly sortBy = signal('recent');
  protected readonly currentPage = signal(1);
  protected readonly minPrice = signal<number | null>(null);
  protected readonly maxPrice = signal<number | null>(null);
  protected readonly activeCategorySlug = signal<string | null>(null);
  protected readonly activeCategory = signal<Category | null>(null);
  protected readonly brands = signal<string[]>([]);
  protected readonly activeBrand = signal<string | null>(null);

  protected readonly activeFilters = computed(() => {
    const filters: { type: string; label: string }[] = [];
    const cat = this.activeCategory();
    if (cat) filters.push({ type: 'category', label: cat.name });
    const brand = this.activeBrand();
    if (brand) filters.push({ type: 'brand', label: brand });
    const min = this.minPrice();
    const max = this.maxPrice();
    if (min !== null || max !== null) {
      const label = `${min ?? 0} — ${max ?? '∞'}`;
      filters.push({ type: 'price', label });
    }
    const q = this.searchQuery();
    if (q) filters.push({ type: 'search', label: `"${q}"` });
    return filters;
  });

  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Reset price filter when currency changes
    effect(() => {
      this.prefs.currency(); // track dependency
      this.minPrice.set(null);
      this.maxPrice.set(null);
    });
  }

  ngOnInit(): void {
    this.loadCategories();

    const slug = this.route.snapshot.paramMap.get('slug');
    const query = this.route.snapshot.queryParamMap.get('q');
    const brand = this.route.snapshot.queryParamMap.get('brand');

    if (slug) {
      this.activeCategorySlug.set(slug);
      this.analytics.trackCategoryView(slug);
    }
    if (query) {
      this.searchQuery.set(query);
    }
    if (brand) {
      this.activeBrand.set(brand);
    }

    this.seo.updatePage(
      slug ? `${slug} | Catálogo | SelectStoreAR` : 'Catálogo | SelectStoreAR',
      'Explorá nuestro catálogo de productos importados. Celulares, consolas, perfumes y tecnología.',
    );

    this.loadProducts();
  }

  protected removeFilter(type: string): void {
    switch (type) {
      case 'category':
        this.activeCategorySlug.set(null);
        this.activeCategory.set(null);
        this.router.navigate(['/catalogo']);
        break;
      case 'brand':
        this.activeBrand.set(null);
        break;
      case 'price':
        this.minPrice.set(null);
        this.maxPrice.set(null);
        break;
      case 'search':
        this.searchQuery.set('');
        break;
    }
    this.currentPage.set(1);
    this.loadProducts();
  }

  protected clearAllFilters(): void {
    this.activeCategorySlug.set(null);
    this.activeCategory.set(null);
    this.activeBrand.set(null);
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.searchQuery.set('');
    this.currentPage.set(1);
    this.router.navigate(['/catalogo']);
    this.loadProducts();
  }

  protected onSearch(query: string): void {
    this.searchQuery.set(query);
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.currentPage.set(1);
      this.loadProducts();
    }, 300);
  }

  protected onBrandFilter(brand: string): void {
    this.activeBrand.update(current => current === brand ? null : brand);
    this.currentPage.set(1);
    this.loadProducts();
  }

  protected onSort(sort: string): void {
    this.sortBy.set(sort);
    this.currentPage.set(1);
    this.loadProducts();
  }

  protected onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected applyPriceFilter(): void {
    this.currentPage.set(1);
    this.loadProducts();
  }

  protected getPageNumbers(): number[] {
    const total = this.pagination()?.totalPages ?? 1;
    const current = this.currentPage();
    const pages: number[] = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  private loadProducts(): void {
    this.loading.set(true);
    const query = this.searchQuery();

    if (query) {
      this.api.searchProducts({ q: query, page: this.currentPage() }).subscribe({
        next: (res) => this.handleProductsResponse(res),
        error: () => this.loading.set(false),
      });
    } else {
      this.api.getProducts({
        page: this.currentPage(),
        category: this.activeCategorySlug() ?? undefined,
        brand: this.activeBrand() ?? undefined,
        sort: this.sortBy(),
        minPrice: this.minPrice() ?? undefined,
        maxPrice: this.maxPrice() ?? undefined,
        currency: this.prefs.currency(),
      }).subscribe({
        next: (res) => {
          this.handleProductsResponse(res);
          if (res.exchangeRate) {
            this.prefs.setExchangeRate(res.exchangeRate);
          }
        },
        error: () => this.loading.set(false),
      });
    }
  }

  private handleProductsResponse(res: { items: ProductListItem[]; pagination: PaginationInfo }): void {
    this.products.set(res.items);
    this.pagination.set(res.pagination);
    this.loading.set(false);

    // Extract unique brands from results (only if no brand filter active)
    if (!this.activeBrand()) {
      const uniqueBrands = [...new Set(res.items.map(p => p.brand).filter(Boolean))].sort();
      if (uniqueBrands.length > 0) {
        this.brands.set(uniqueBrands);
      }
    }
  }

  private loadCategories(): void {
    this.api.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        const slug = this.activeCategorySlug();
        if (slug) {
          const found = categories.find(c => c.slug === slug);
          if (found) this.activeCategory.set(found);
        }
      },
    });
  }
}
