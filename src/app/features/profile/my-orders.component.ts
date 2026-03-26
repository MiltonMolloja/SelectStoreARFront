import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { UserOrder } from '../../core/models';
import { PreferencesService } from '../../core/services/preferences.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container mx-auto px-4 py-8 max-w-3xl">
      <h1 class="text-3xl font-bold mb-8" style="font-family: 'Cormorant Garamond', serif">Mis Pedidos</h1>

      @if (orders().length > 0) {
        <div class="space-y-4">
          @for (order of orders(); track order.id) {
            <a [routerLink]="['/mis-pedidos', order.id]"
               class="block bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5
                      hover:bg-[var(--color-surface-hover)] transition-colors">
              <div class="flex items-center justify-between mb-2">
                <span class="font-mono text-sm font-medium">{{ order.orderNumber }}</span>
                <span class="px-2 py-1 rounded-full text-xs font-medium"
                      [class]="getStatusClass(order.status)">
                  {{ getStatusLabel(order.status) }}
                </span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-[var(--color-text-secondary)]">
                  {{ order.items.length }} {{ order.items.length === 1 ? 'producto' : 'productos' }}
                  · {{ formatDate(order.createdAt) }}
                </span>
                <span class="font-bold text-[var(--color-accent)]">
                  {{ prefs.formatPrice()(order.totalUsd) }}
                </span>
              </div>
            </a>
          }
        </div>
      } @else if (!loading()) {
        <div class="text-center py-16">
          <p class="text-4xl mb-4">📦</p>
          <h2 class="text-xl font-bold mb-2">No tenés pedidos todavía</h2>
          <p class="text-[var(--color-text-secondary)] mb-6">Cuando hagas tu primer pedido, aparecerá acá</p>
          <a routerLink="/catalogo"
             class="px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg font-medium hover:opacity-90">
            Ver catálogo
          </a>
        </div>
      }
    </div>
  `,
})
export class MyOrdersComponent implements OnInit {
  private readonly http = inject(HttpClient);
  protected readonly prefs = inject(PreferencesService);
  protected readonly orders = signal<UserOrder[]>([]);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.http.get<{ items: UserOrder[] }>(`${environment.apiUrl}/user/orders`).subscribe({
      next: (res) => { this.orders.set(res.items); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  protected formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  protected getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      sent: 'Enviado', deposited: 'Señado', ordered_from_supplier: 'Pedido',
      in_transit: 'En camino', ready_for_delivery: 'Listo', delivered: 'Entregado', cancelled: 'Cancelado',
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
}
