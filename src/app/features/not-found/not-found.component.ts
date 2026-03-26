import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-[var(--color-bg)]">
      <h1 class="text-[120px] md:text-[160px] font-bold text-[var(--color-accent)] opacity-20 leading-none mb-2"
          style="font-family: 'Cormorant Garamond', serif">
        404
      </h1>
      <h2 class="text-2xl md:text-3xl font-bold mb-3">Página no encontrada</h2>
      <p class="text-[var(--color-text-secondary)] mb-8 max-w-md">
        La página que buscás no existe o fue movida
      </p>
      <a routerLink="/"
         class="px-8 py-3.5 bg-[var(--color-accent)] text-white rounded-lg font-medium
                hover:opacity-90 transition-opacity">
        Volver al inicio
      </a>
    </main>
  `,
})
export class NotFoundComponent {}
