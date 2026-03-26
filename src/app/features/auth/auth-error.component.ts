import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-error',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-[70vh] flex items-center justify-center">
      <div class="text-center">
        <p class="text-4xl mb-4">😕</p>
        <h1 class="text-xl font-bold mb-2">Error al iniciar sesión</h1>
        <p class="text-[var(--color-text-secondary)] mb-6">Algo salió mal. Intentá de nuevo.</p>
        <a routerLink="/login"
           class="px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg font-medium hover:opacity-90">
          Volver a intentar
        </a>
      </div>
    </div>
  `,
})
export class AuthErrorComponent {}
