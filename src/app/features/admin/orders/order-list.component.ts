import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminApiService } from '../services/admin-api.service';
import { AdminOrderListItem } from '../models/admin.models';
import { PaginationInfo } from '../../../core/models';

@Component({
  selector: 'app-admin-order-list',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold mb-6">Pedidos</h1>

      <!-- Status Tabs -->
      <div class="flex gap-2 mb-6 flex-wrap">
        @for (tab of statusTabs; track tab.value) {
          <button
            (click)="onStatusFilter(tab.value)"
            [class.bg-[var(--color-accent)]]="activeStatus() === tab.value"
            [class.text-white]="activeStatus() === tab.value"
            class="px-3 py-1.5 rounded-lg text-sm font-medium border border-[var(--color-border)]
                   hover:bg-[var(--color-surface-hover)] transition-colors">
            {{ tab.label }}
          </button>
        }
      </div>

      <!-- Table -->
      <div class="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-[var(--color-text-secondary)] border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]">
              <th class="px-4 py-3 font-medium">Pedido</th>
              <th class="px-4 py-3 font-medium">Cliente</th>
              <th class="px-4 py-3 font-medium">Teléfono</th>
              <th class="px-4 py-3 font-medium">Estado</th>
              <th class="px-4 py-3 font-medium text-right">Total</th>
              <th class="px-4 py-3 font-medium">Fecha</th>
              <th class="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (order of orders(); track order.id) {
              <tr class="border-b border-[var(--color-divider)] hover:bg-[var(--color-surface-hover)] transition-colors">
                <td class="px-4 py-3 font-mono text-xs font-medium">{{ order.orderNumber }}</td>
                <td class="px-4 py-3">{{ order.customerName }}</td>
                <td class="px-4 py-3 text-[var(--color-text-secondary)]">{{ order.customerPhone }}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 rounded-full text-xs font-medium"
                        [class]="getStatusClass(order.status)">
                    {{ getStatusLabel(order.status) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right font-medium">US$ {{ order.totalUsd.toFixed(2) }}</td>
                <td class="px-4 py-3 text-[var(--color-text-secondary)] text-xs">{{ formatDate(order.createdAt) }}</td>
                <td class="px-4 py-3 text-right">
                  <a [routerLink]="['/admin/pedidos', order.id]"
                     class="text-[var(--color-accent)] hover:underline text-xs font-medium">
                    Ver detalle →
                  </a>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="7" class="px-4 py-12 text-center text-[var(--color-text-secondary)]">
                  No hay pedidos {{ activeStatus() ? 'con este estado' : '' }}
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      @if (pagination() && pagination()!.totalPages > 1) {
        <div class="flex items-center justify-center gap-2 mt-6">
          <button [disabled]="!pagination()!.hasPreviousPage"
                  (click)="onPageChange(currentPage() - 1)"
                  class="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-sm disabled:opacity-40">
            ← Anterior
          </button>
          <span class="text-sm text-[var(--color-text-secondary)]">
            Página {{ pagination()!.page }} de {{ pagination()!.totalPages }}
          </span>
          <button [disabled]="!pagination()!.hasNextPage"
                  (click)="onPageChange(currentPage() + 1)"
                  class="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-sm disabled:opacity-40">
            Siguiente →
          </button>
        </div>
      }
    </div>
  `,
})
export class OrderListComponent implements OnInit {
  private readonly api = inject(AdminApiService);

  protected readonly orders = signal<AdminOrderListItem[]>([]);
  protected readonly pagination = signal<PaginationInfo | null>(null);
  protected readonly activeStatus = signal('');
  protected readonly currentPage = signal(1);

  protected readonly statusTabs = [
    { label: 'Todos', value: '' },
    { label: 'Enviados', value: 'sent' },
    { label: 'Señados', value: 'deposited' },
    { label: 'Pedidos', value: 'ordered_from_supplier' },
    { label: 'En camino', value: 'in_transit' },
    { label: 'Listos', value: 'ready_for_delivery' },
    { label: 'Entregados', value: 'delivered' },
    { label: 'Cancelados', value: 'cancelled' },
  ];

  ngOnInit(): void {
    this.loadOrders();
  }

  protected onStatusFilter(status: string): void {
    this.activeStatus.set(status);
    this.currentPage.set(1);
    this.loadOrders();
  }

  protected onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadOrders();
  }

  protected formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-AR', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  }

  protected getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      sent: 'Enviado', deposited: 'Señado', ordered_from_supplier: 'Pedido al proveedor',
      in_transit: 'En camino', ready_for_delivery: 'Listo para entregar',
      delivered: 'Entregado', cancelled: 'Cancelado',
    };
    return labels[status] ?? status;
  }

  protected getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      sent: 'bg-blue-100 text-blue-700', deposited: 'bg-yellow-100 text-yellow-700',
      ordered_from_supplier: 'bg-purple-100 text-purple-700', in_transit: 'bg-orange-100 text-orange-700',
      ready_for_delivery: 'bg-teal-100 text-teal-700', delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return classes[status] ?? 'bg-gray-100 text-gray-700';
  }

  private loadOrders(): void {
    this.api.getOrders({
      page: this.currentPage(),
      status: this.activeStatus() || undefined,
    }).subscribe({
      next: (res) => {
        this.orders.set(res.items);
        this.pagination.set(res.pagination);
      },
    });
  }
}
