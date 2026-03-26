import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
  imports: [RouterLink, FormsModule, ProductCardComponent, SkeletonCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Breadcrumb -->
      <nav class="text-sm text-[var(--color-text-secondary)] mb-6">
        <a routerLink="/" class="hover:text-[var(--color-accent)]">Home</a>
        <span class="mx-2">›</span>
        <span class="text-[var(--color-text-primary)]">
          {{ activeCategory() ? activeCategory()!.name : 'Catálogo' }}
        </span>
      </nav>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Filters -->
        <aside class="w-full lg:w-64 shrink-0">
          <h2 class="font-bold text-lg mb-4">Filtros</h2>

          <!-- Categories -->
          <div class="mb-6">
            <h3 class="font-semibold text-sm mb-2">Categorías</h3>
            <ul class="space-y-1">
              @for (cat of categories(); track cat.id) {
                <li>
                  <a [routerLink]="['/categoria', cat.slug]"
                     [class.text-[var(--color-accent)]]="activeCategorySlug() === cat.slug"
                     [class.font-medium]="activeCategorySlug() === cat.slug"
                     class="text-sm hover:text-[var(--color-accent)] transition-colors">
                    {{ cat.name }} ({{ cat.productCount }})
                  </a>
                </li>
              }
            </ul>
          </div>

          <!-- Price Range -->
          <div class="mb-6">
            <h3 class="font-semibold text-sm mb-2">Rango de precio</h3>
            <div class="flex gap-2 items-center">
              <input type="number" placeholder="Min" [ngModel]="minPrice()" (ngModelChange)="minPrice.set($event)"
                     class="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm
                            focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
              <span class="text-[var(--color-text-secondary)]">—</span>
              <input type="number" placeholder="Max" [ngModel]="maxPrice()" (ngModelChange)="maxPrice.set($event)"
                     class="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm
                            focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
            </div>
            <button (click)="applyPriceFilter()"
                    class="mt-2 text-xs text-[var(--color-accent)] hover:underline">
              Aplicar filtro
            </button>
          </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1">
          <!-- Search + Sort -->
          <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div class="flex-1 relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">🔍</span>
              <input type="text" placeholder="Buscar productos..."
                     [ngModel]="searchQuery()" (ngModelChange)="onSearch($event)"
                     class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]
                            text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-[var(--color-text-secondary)]">Ordenar:</span>
              <select [ngModel]="sortBy()" (ngModelChange)="onSort($event)"
                      class="px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]
                             text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]">
                <option value="recent">Más recientes</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="name-asc">Nombre A-Z</option>
              </select>
            </div>
          </div>

          <!-- Results count -->
          @if (pagination()) {
            <p class="text-sm text-[var(--color-text-secondary)] mb-4">
              Mostrando {{ products().length }} de {{ pagination()!.totalItems }} productos
            </p>
          }

          <!-- Product Grid -->
          @if (loading()) {
            <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
              @for (i of [1,2,3,4,5,6]; track i) {
                <app-skeleton-card />
              }
            </div>
          } @else if (products().length > 0) {
            <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
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
            <div class="flex items-center justify-center gap-2 mt-8">
              @for (page of getPageNumbers(); track page) {
                <button
                  (click)="onPageChange(page)"
                  [class.bg-[var(--color-accent)]]="page === currentPage()"
                  [class.text-white]="page === currentPage()"
                  class="w-10 h-10 rounded-lg border border-[var(--color-border)] text-sm font-medium
                         hover:bg-[var(--color-surface-hover)] transition-colors">
                  {{ page }}
                </button>
              }
              @if (pagination()!.hasNextPage) {
                <button (click)="onPageChange(currentPage() + 1)"
                        class="px-3 h-10 rounded-lg border border-[var(--color-border)] text-sm hover:bg-[var(--color-surface-hover)]">
                  →
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

  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.loadCategories();

    const slug = this.route.snapshot.paramMap.get('slug');
    const query = this.route.snapshot.queryParamMap.get('q');

    if (slug) {
      this.activeCategorySlug.set(slug);
      this.analytics.trackCategoryView(slug);
    }
    if (query) {
      this.searchQuery.set(query);
    }

    this.seo.updatePage(
      slug ? `${slug} | Catálogo | SelectStoreAR` : 'Catálogo | SelectStoreAR',
      'Explorá nuestro catálogo de productos importados. Celulares, consolas, perfumes y tecnología.',
    );

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
  }

  private loadCategories(): void {
    this.api.getCategories().subscribe({
      next: (res) => {
        this.categories.set(res.categories);
        const slug = this.activeCategorySlug();
        if (slug) {
          const found = res.categories.find(c => c.slug === slug);
          if (found) this.activeCategory.set(found);
        }
      },
    });
  }
}
