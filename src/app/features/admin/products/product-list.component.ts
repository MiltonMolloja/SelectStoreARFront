import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../services/admin-api.service';
import { AdminProductListItem, AdminProductCounts } from '../models/admin.models';
import { PaginationInfo } from '../../../core/models';

@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold">Productos</h1>
        <a routerLink="/admin/productos/nuevo"
           class="px-4 py-2.5 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          + Nuevo producto
        </a>
      </div>

      <!-- Search -->
      <div class="mb-6">
        <input
          type="text"
          placeholder="Buscar productos..."
          [ngModel]="searchQuery()"
          (ngModelChange)="onSearch($event)"
          class="w-full md:w-96 px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]
                 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]
                 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent" />
      </div>

      <!-- Status Tabs -->
      <div class="flex gap-2 mb-6">
        @for (tab of statusTabs; track tab.value) {
          <button
            (click)="onStatusFilter(tab.value)"
            [class.bg-[var(--color-accent)]]="activeStatus() === tab.value"
            [class.text-white]="activeStatus() === tab.value"
            class="px-3 py-1.5 rounded-lg text-sm font-medium border border-[var(--color-border)]
                   hover:bg-[var(--color-surface-hover)] transition-colors">
            {{ tab.label }}
            @if (counts()) {
              <span class="ml-1 opacity-70">({{ getCount(tab.value) }})</span>
            }
          </button>
        }
      </div>

      <!-- Table -->
      <div class="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-[var(--color-text-secondary)] border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]">
              <th class="px-4 py-3 font-medium w-12">Img</th>
              <th class="px-4 py-3 font-medium">Nombre</th>
              <th class="px-4 py-3 font-medium">Categoría</th>
              <th class="px-4 py-3 font-medium">Precio</th>
              <th class="px-4 py-3 font-medium">Estado</th>
              <th class="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (product of products(); track product.id) {
              <tr class="border-b border-[var(--color-divider)] hover:bg-[var(--color-surface-hover)] transition-colors">
                <td class="px-4 py-3">
                  @if (product.imageUrl) {
                    <img [src]="product.imageUrl" [alt]="product.name"
                         class="w-10 h-10 rounded-lg object-cover" />
                  } @else {
                    <div class="w-10 h-10 rounded-lg bg-[var(--color-divider)] flex items-center justify-center text-xs">📷</div>
                  }
                </td>
                <td class="px-4 py-3">
                  <p class="font-medium">{{ product.name }}</p>
                  <p class="text-xs text-[var(--color-text-secondary)]">{{ product.brand }}</p>
                </td>
                <td class="px-4 py-3 text-[var(--color-text-secondary)]">{{ product.category }}</td>
                <td class="px-4 py-3 font-medium">US$ {{ product.finalPriceUsd.toFixed(2) }}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 rounded-full text-xs font-medium"
                        [class]="getStatusClass(product.status)">
                    {{ getStatusLabel(product.status) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <a [routerLink]="['/admin/productos', product.id]"
                       class="p-1.5 rounded hover:bg-[var(--color-surface-hover)] transition-colors"
                       title="Editar">
                      ✏️
                    </a>
                    @if (product.status === 'draft') {
                      <button
                        (click)="onPublish(product)"
                        (keydown.enter)="onPublish(product)"
                        class="p-1.5 rounded hover:bg-green-50 transition-colors"
                        title="Publicar">
                        ✅
                      </button>
                    }
                    <button
                      (click)="onDelete(product)"
                      (keydown.enter)="onDelete(product)"
                      class="p-1.5 rounded hover:bg-red-50 transition-colors text-[var(--color-error)]"
                      title="Eliminar">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="px-4 py-12 text-center text-[var(--color-text-secondary)]">
                  No se encontraron productos
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      @if (pagination() && pagination()!.totalPages > 1) {
        <div class="flex items-center justify-center gap-2 mt-6">
          <button
            [disabled]="!pagination()!.hasPreviousPage"
            (click)="onPageChange(pagination()!.page - 1)"
            class="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-sm disabled:opacity-40">
            ← Anterior
          </button>
          <span class="text-sm text-[var(--color-text-secondary)]">
            Página {{ pagination()!.page }} de {{ pagination()!.totalPages }}
          </span>
          <button
            [disabled]="!pagination()!.hasNextPage"
            (click)="onPageChange(pagination()!.page + 1)"
            class="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-sm disabled:opacity-40">
            Siguiente →
          </button>
        </div>
      }
    </div>
  `,
})
export class ProductListComponent implements OnInit {
  private readonly api = inject(AdminApiService);

  protected readonly products = signal<AdminProductListItem[]>([]);
  protected readonly pagination = signal<PaginationInfo | null>(null);
  protected readonly counts = signal<AdminProductCounts | null>(null);
  protected readonly loading = signal(true);
  protected readonly searchQuery = signal('');
  protected readonly activeStatus = signal<string>('');
  private currentPage = 1;

  protected readonly statusTabs = [
    { label: 'Todos', value: '' },
    { label: 'Activos', value: 'active' },
    { label: 'Borradores', value: 'draft' },
    { label: 'Inactivos', value: 'inactive' },
  ];

  ngOnInit(): void {
    this.loadProducts();
  }

  protected onSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage = 1;
    this.loadProducts();
  }

  protected onStatusFilter(status: string): void {
    this.activeStatus.set(status);
    this.currentPage = 1;
    this.loadProducts();
  }

  protected onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  protected onPublish(product: AdminProductListItem): void {
    this.api.changeProductStatus(product.id, 'active').subscribe({
      next: () => this.loadProducts(),
    });
  }

  protected onDelete(product: AdminProductListItem): void {
    if (confirm(`¿Eliminar "${product.name}"?`)) {
      this.api.deleteProduct(product.id).subscribe({
        next: () => this.loadProducts(),
      });
    }
  }

  protected getCount(status: string): number {
    const c = this.counts();
    if (!c) return 0;
    if (status === '') return c.total;
    return c[status as keyof AdminProductCounts] as number ?? 0;
  }

  protected getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      draft: 'Borrador',
      active: 'Activo',
      inactive: 'Inactivo',
      deleted: 'Eliminado',
    };
    return labels[status] ?? status;
  }

  protected getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      draft: 'bg-yellow-100 text-yellow-700',
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-700',
      deleted: 'bg-red-100 text-red-700',
    };
    return classes[status] ?? 'bg-gray-100 text-gray-700';
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.api.getProducts({
      page: this.currentPage,
      status: this.activeStatus() || undefined,
      search: this.searchQuery() || undefined,
    }).subscribe({
      next: (res) => {
        this.products.set(res.items);
        this.pagination.set(res.pagination);
        this.counts.set(res.counts);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
