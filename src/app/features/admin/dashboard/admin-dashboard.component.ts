import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminApiService } from '../services/admin-api.service';
import { AdminDashboardData } from '../models/admin.models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold mb-8">Dashboard</h1>

      <!-- Metric Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 text-center">
          <p class="text-3xl font-bold">{{ data()?.products?.active ?? '—' }}</p>
          <p class="text-sm text-[var(--color-text-secondary)] mt-1">Productos activos</p>
        </div>
        <div class="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 text-center">
          <p class="text-3xl font-bold">{{ data()?.products?.draft ?? '—' }}</p>
          <p class="text-sm text-[var(--color-text-secondary)] mt-1">Borradores</p>
        </div>
        <div class="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 text-center">
          <p class="text-3xl font-bold">{{ data()?.orders?.thisWeek ?? '—' }}</p>
          <p class="text-sm text-[var(--color-text-secondary)] mt-1">Pedidos / semana</p>
        </div>
        <div class="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 text-center">
          <p class="text-3xl font-bold">{{ formatDeliveryDays() }}</p>
          <p class="text-sm text-[var(--color-text-secondary)] mt-1">Entrega promedio</p>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 mb-8">
        <h2 class="text-lg font-semibold mb-4">Pedidos recientes</h2>
        @if (data()?.recentOrders?.length) {
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-[var(--color-text-secondary)] border-b border-[var(--color-border)]">
                <th class="pb-3 font-medium">Pedido</th>
                <th class="pb-3 font-medium">Cliente</th>
                <th class="pb-3 font-medium">Estado</th>
                <th class="pb-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              @for (order of data()?.recentOrders ?? []; track order.id) {
                <tr class="border-b border-[var(--color-divider)] hover:bg-[var(--color-surface-hover)]">
                  <td class="py-3 font-mono text-xs">{{ order.orderNumber }}</td>
                  <td class="py-3">{{ order.customerName }}</td>
                  <td class="py-3">
                    <span class="px-2 py-1 rounded-full text-xs font-medium"
                          [class]="getStatusClass(order.status)">
                      {{ getStatusLabel(order.status) }}
                    </span>
                  </td>
                  <td class="py-3 text-right font-medium">US$ {{ order.totalUsd.toFixed(2) }}</td>
                </tr>
              }
            </tbody>
          </table>
        } @else {
          <p class="text-[var(--color-text-secondary)] text-center py-8">No hay pedidos recientes</p>
        }
      </div>

      <!-- Exchange Rate -->
      <div class="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-2xl">💱</span>
          <div>
            <p class="font-semibold">Cotización USD/ARS</p>
            <p class="text-sm text-[var(--color-text-secondary)]">
              $ {{ data()?.exchangeRate?.rate?.toLocaleString('es-AR') ?? '—' }}
              — actualizada {{ formatExchangeDate() }}
            </p>
          </div>
        </div>
        @if (data()?.exchangeRate?.isStale) {
          <span class="text-xs text-[var(--color-warning)] font-medium">⚠️ Desactualizada</span>
        }
        <a routerLink="/admin/configuracion"
           class="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          Actualizar
        </a>
      </div>
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  protected readonly data = signal<AdminDashboardData | null>(null);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.api.getDashboard().subscribe({
      next: (data) => {
        this.data.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  protected formatDeliveryDays(): string {
    const days = this.data()?.orders?.averageDeliveryDays;
    return days !== null && days !== undefined ? `${days.toFixed(1)}d` : '—';
  }

  protected formatExchangeDate(): string {
    const date = this.data()?.exchangeRate?.updatedAt;
    if (!date) return '';
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'hace menos de 1 hora';
    if (hours < 24) return `hace ${hours} horas`;
    return `hace ${Math.floor(hours / 24)} días`;
  }

  protected getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      sent: 'Enviado',
      deposited: 'Señado',
      ordered_from_supplier: 'Pedido',
      in_transit: 'En camino',
      ready_for_delivery: 'Listo',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    };
    return labels[status] ?? status;
  }

  protected getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      sent: 'bg-blue-100 text-blue-700',
      deposited: 'bg-yellow-100 text-yellow-700',
      ordered_from_supplier: 'bg-purple-100 text-purple-700',
      in_transit: 'bg-orange-100 text-orange-700',
      ready_for_delivery: 'bg-teal-100 text-teal-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return classes[status] ?? 'bg-gray-100 text-gray-700';
  }
}
