import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../services/admin-api.service';
import { AdminOrderDetail } from '../models/admin.models';
import { ToastService } from '../../../core/services/toast.service';

const STATUS_TRANSITIONS: Record<string, string[]> = {
  sent: ['deposited', 'cancelled'],
  deposited: ['ordered_from_supplier', 'cancelled'],
  ordered_from_supplier: ['in_transit', 'cancelled'],
  in_transit: ['ready_for_delivery'],
  ready_for_delivery: ['delivered'],
  delivered: [],
  cancelled: [],
};

const DEPOSIT_REQUIRED_STATUSES = ['deposited'];

@Component({
  selector: 'app-admin-order-detail',
  standalone: true,
  imports: [RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (order()) {
      <div class="p-8 max-w-4xl">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <a routerLink="/admin/pedidos"
               class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] mb-2 inline-block">
              ← Volver a pedidos
            </a>
            <h1 class="text-3xl font-bold">Pedido #{{ order()!.orderNumber }}</h1>
          </div>
          @if (order()!.isDelayed) {
            <span class="px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
              ⚠️ Demorado
            </span>
          }
        </div>

        <!-- Info Card -->
        <div class="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 mb-6">
          <h2 class="font-semibold mb-4">Información del pedido</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div class="flex justify-between py-2 border-b border-[var(--color-divider)]">
              <span class="text-[var(--color-text-secondary)]">Cliente</span>
              <span class="font-medium">{{ order()!.customerName }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-[var(--color-divider)]">
              <span class="text-[var(--color-text-secondary)]">Teléfono</span>
              <a [href]="'https://wa.me/' + order()!.customerPhone.replace('+', '')"
                 target="_blank" rel="noopener"
                 class="font-medium text-[var(--color-accent)] hover:underline">
                {{ order()!.customerPhone }}
              </a>
            </div>
            <div class="flex justify-between py-2 border-b border-[var(--color-divider)]">
              <span class="text-[var(--color-text-secondary)]">Total</span>
              <span class="font-bold">US$ {{ order()!.totalUsd.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-[var(--color-divider)]">
              <span class="text-[var(--color-text-secondary)]">Fecha</span>
              <span>{{ formatDate(order()!.createdAt) }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-[var(--color-divider)]">
              <span class="text-[var(--color-text-secondary)]">Cotización usada</span>
              <span>$ {{ order()!.exchangeRateUsed.toLocaleString('es-AR') }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-[var(--color-divider)]">
              <span class="text-[var(--color-text-secondary)]">Días desde último cambio</span>
              <span>{{ order()!.daysSinceLastChange }}d</span>
            </div>
          </div>
        </div>

        <!-- Products -->
        <div class="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 mb-6">
          <h2 class="font-semibold mb-4">Productos</h2>
          <div class="space-y-2 text-sm">
            @for (item of order()!.items; track item.productId) {
              <div class="flex justify-between py-2 border-b border-[var(--color-divider)] last:border-b-0">
                <div>
                  <a [routerLink]="['/producto', item.productSlug]"
                     class="text-[var(--color-accent)] hover:underline">
                    {{ item.productName }}
                  </a>
                  <span class="text-[var(--color-text-secondary)]"> x{{ item.quantity }}</span>
                </div>
                <span class="font-medium">US$ {{ item.subtotalUsd.toFixed(2) }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Change Status -->
        @if (availableTransitions().length > 0) {
          <div class="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 mb-6">
            <h2 class="font-semibold mb-4">Cambiar estado</h2>
            <div class="flex flex-col sm:flex-row gap-3 items-start">
              <select [ngModel]="selectedStatus()" (ngModelChange)="selectedStatus.set($event)"
                      class="px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]
                             text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]">
                <option value="">Seleccionar nuevo estado</option>
                @for (status of availableTransitions(); track status) {
                  <option [value]="status">{{ getStatusLabel(status) }}</option>
                }
              </select>

              @if (needsDepositType()) {
                <select [ngModel]="depositType()" (ngModelChange)="depositType.set($event)"
                        class="px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]
                               text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]">
                  <option value="">Tipo de seña</option>
                  <option value="persona">En persona</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              }

              <input type="text" placeholder="Notas (opcional)"
                     [ngModel]="notes()" (ngModelChange)="notes.set($event)"
                     class="flex-1 px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]
                            text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />

              <button (click)="onChangeStatus()" [disabled]="!canSubmitStatus() || saving()"
                      class="px-6 py-2.5 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium
                             hover:opacity-90 disabled:opacity-50 transition-opacity shrink-0">
                {{ saving() ? 'Guardando...' : 'Cambiar' }}
              </button>
            </div>
          </div>
        }

        <!-- Status History -->
        <div class="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
          <h2 class="font-semibold mb-4">Historial de estados</h2>
          <div class="space-y-3">
            @for (entry of order()!.statusHistory; track entry.changedAt) {
              <div class="flex items-start gap-3">
                <div class="w-3 h-3 rounded-full mt-1 shrink-0"
                     [class]="getStatusDotClass(entry.status)"></div>
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium">{{ getStatusLabel(entry.status) }}</span>
                    <span class="text-xs text-[var(--color-text-secondary)]">{{ formatDate(entry.changedAt) }}</span>
                  </div>
                  @if (entry.notes) {
                    <p class="text-xs text-[var(--color-text-secondary)] mt-0.5">{{ entry.notes }}</p>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    } @else if (!loading()) {
      <div class="p-8 text-center">
        <p class="text-[var(--color-text-secondary)]">Pedido no encontrado</p>
        <a routerLink="/admin/pedidos" class="text-[var(--color-accent)] hover:underline text-sm mt-2 inline-block">
          ← Volver a pedidos
        </a>
      </div>
    }
  `,
})
export class OrderDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(AdminApiService);
  private readonly toast = inject(ToastService);

  protected readonly order = signal<AdminOrderDetail | null>(null);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly selectedStatus = signal('');
  protected readonly depositType = signal('');
  protected readonly notes = signal('');

  protected readonly availableTransitions = signal<string[]>([]);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadOrder(id);
  }

  protected needsDepositType(): boolean {
    return DEPOSIT_REQUIRED_STATUSES.includes(this.selectedStatus());
  }

  protected canSubmitStatus(): boolean {
    if (!this.selectedStatus()) return false;
    if (this.needsDepositType() && !this.depositType()) return false;
    return true;
  }

  protected onChangeStatus(): void {
    const orderId = this.order()?.id;
    if (!orderId || !this.canSubmitStatus()) return;

    this.saving.set(true);
    this.api.changeOrderStatus(orderId, {
      status: this.selectedStatus(),
      depositType: this.needsDepositType() ? this.depositType() : undefined,
      notes: this.notes() || undefined,
    }).subscribe({
      next: (updated) => {
        this.order.set(updated);
        this.updateTransitions(updated.status);
        this.selectedStatus.set('');
        this.depositType.set('');
        this.notes.set('');
        this.saving.set(false);
        this.toast.success('Estado actualizado correctamente');
      },
      error: () => this.saving.set(false),
    });
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

  protected getStatusDotClass(status: string): string {
    const classes: Record<string, string> = {
      sent: 'bg-blue-500', deposited: 'bg-yellow-500', ordered_from_supplier: 'bg-purple-500',
      in_transit: 'bg-orange-500', ready_for_delivery: 'bg-teal-500',
      delivered: 'bg-green-500', cancelled: 'bg-red-500',
    };
    return classes[status] ?? 'bg-gray-500';
  }

  private loadOrder(id: string): void {
    this.api.getOrder(id).subscribe({
      next: (order) => {
        this.order.set(order);
        this.updateTransitions(order.status);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private updateTransitions(currentStatus: string): void {
    this.availableTransitions.set(STATUS_TRANSITIONS[currentStatus] ?? []);
  }
}
