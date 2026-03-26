import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-[var(--color-bg)]">
      <p class="text-6xl mb-6">⚠️</p>
      <h1 class="text-2xl md:text-3xl font-bold mb-3">Algo salió mal</h1>
      <p class="text-[var(--color-text-secondary)] mb-8 max-w-md">
        Ocurrió un error inesperado. Intentá recargar la página o volvé al inicio.
      </p>
      <div class="flex gap-4">
        <button (click)="reload()"
                class="px-6 py-3 border border-[var(--color-border)] rounded-lg font-medium
                       hover:bg-[var(--color-surface-hover)] transition-colors">
          Recargar
        </button>
        <a routerLink="/"
           class="px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg font-medium
                  hover:opacity-90 transition-opacity">
          Ir al inicio
        </a>
      </div>
    </main>
  `,
})
export class ErrorPageComponent {
  protected reload(): void {
    window.location.reload();
  }
}
