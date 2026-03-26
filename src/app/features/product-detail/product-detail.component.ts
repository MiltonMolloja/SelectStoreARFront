import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8" style="font-family: 'Cormorant Garamond', serif">
        Detalle de Producto
      </h1>
      <p class="text-[var(--color-text-secondary)]">
        Detalle de producto — Sprint 3
      </p>
    </main>
  `,
})
export class ProductDetailComponent {}
