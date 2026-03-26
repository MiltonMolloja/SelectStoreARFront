import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-landing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-screen">
      <section class="container mx-auto px-4 py-20 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6" style="font-family: 'Cormorant Garamond', serif">
          Tu tienda de productos importados premium
        </h1>
        <p class="text-lg text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto">
          Celulares, consolas, perfumes y tecnología. Todos los productos son bajo pedido —
          señás y coordinás directamente por WhatsApp.
        </p>
        <div class="flex gap-4 justify-center">
          <a routerLink="/catalogo"
             class="px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
            Ver Catálogo
          </a>
          <a href="https://wa.me/5493881234567" target="_blank" rel="noopener"
             class="px-6 py-3 border border-[var(--color-border)] rounded-lg font-medium hover:bg-[var(--color-surface-hover)] transition-colors">
            Contactar por WhatsApp
          </a>
        </div>
      </section>
    </main>
  `,
})
export class LandingComponent {}
