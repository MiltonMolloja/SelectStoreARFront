import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PreferencesService } from '../../core/services/preferences.service';
import { environment } from '../../../environments/environment';

interface UserOrderDetail {
  id: string;
  orderNumber: string;
  items: { productName: string; quantity: number; priceUsd: number; subtotalUsd: number }[];
  totalUsd: number;
  totalArs: number;
  status: string;
  statusHistory: { status: string; changedAt: string; notes: string | null }[];
  createdAt: string;
}

@Component({
  selector: 'app-my-order-detail',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (order()) {
      <div class="container mx-auto px-4 py-8 max-w-3xl">
        <a routerLink="/mis-pedidos" class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] mb-4 inline-block">
          ← Volver a mis pedidos
        </a>
        <h1 class="text-3xl font-bold mb-6" style="font-family: 'Cormorant Garamond', serif">
          Pedido #{{ order()!.orderNumber }}
        </h1>

        <!-- Status -->
        <div class="flex items-center gap-3 mb-6">
          <span class="px-3 py-1.5 rounded-full text-sm font-medium"
                [class]="getStatusClass(order()!.status)">
            {{ getStatusLabel(order()!.status) }}
          </span>
          <span class="text-sm text-[var(--color-text-secondary)]">{{ formatDate(order()!.createdAt) }}</span>
        </div>

        <!-- Products -->
        <div class="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 mb-6">
          <h2 class="font-semibold mb-4">Productos</h2>
          @for (item of order()!.items; track item.productName) {
            <div class="flex justify-between py-2 border-b border-[var(--color-divider)] last:border-b-0 text-sm">
              <span>{{ item.productName }} x{{ item.quantity }}</span>
              <span class="font-medium">{{ prefs.formatPrice()(item.subtotalUsd) }}</span>
            </div>
          }
          <div class="flex justify-between pt-4 mt-2 border-t border-[var(--color-border)]">
            <span class="font-bold">Total</span>
            <span class="font-bold text-[var(--color-accent)]">{{ prefs.formatPrice()(order()!.totalUsd) }}</span>
          </div>
        </div>

        <!-- Timeline -->
        <div class="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
          <h2 class="font-semibold mb-4">Seguimiento</h2>
          <div class="space-y-3">
            @for (entry of order()!.statusHistory; track entry.changedAt) {
              <div class="flex items-start gap-3">
                <div class="w-3 h-3 rounded-full mt-1 shrink-0 bg-[var(--color-accent)]"></div>
                <div>
                  <span class="text-sm font-medium">{{ getStatusLabel(entry.status) }}</span>
                  <span class="text-xs text-[var(--color-text-secondary)] ml-2">{{ formatDate(entry.changedAt) }}</span>
                  @if (entry.notes) {
                    <p class="text-xs text-[var(--color-text-secondary)] mt-0.5">{{ entry.notes }}</p>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class MyOrderDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);
  protected readonly prefs = inject(PreferencesService);
  protected readonly order = signal<UserOrderDetail | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get<UserOrderDetail>(`${environment.apiUrl}/user/orders/${id}`).subscribe({
        next: (o) => this.order.set(o),
      });
    }
  }

  protected formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  protected getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      sent: 'Enviado', deposited: 'Señado', ordered_from_supplier: 'Pedido al proveedor',
      in_transit: 'En camino', ready_for_delivery: 'Listo para entregar', delivered: 'Entregado', cancelled: 'Cancelado',
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
