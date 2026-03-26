import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-admin-order-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold mb-8">Pedidos</h1>
      <p class="text-[var(--color-text-secondary)]">
        Gestión de pedidos — Sprint 6
      </p>
    </div>
  `,
})
export class OrderListComponent {}
