import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 class="text-8xl font-bold text-[var(--color-accent)] opacity-30 mb-4">404</h1>
      <h2 class="text-2xl font-bold mb-2">Página no encontrada</h2>
      <p class="text-[var(--color-text-secondary)] mb-6">
        La página que buscás no existe o fue movida
      </p>
      <a routerLink="/"
         class="px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
        Volver al inicio
      </a>
    </main>
  `,
})
export class NotFoundComponent {}
