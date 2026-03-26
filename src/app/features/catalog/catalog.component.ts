import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-catalog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8" style="font-family: 'Cormorant Garamond', serif">
        Catálogo
      </h1>
      <p class="text-[var(--color-text-secondary)]">
        Catálogo de productos — Sprint 2
      </p>
    </main>
  `,
})
export class CatalogComponent {}
