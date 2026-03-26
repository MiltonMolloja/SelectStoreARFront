import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-screen flex items-center justify-center">
      <div class="bg-[var(--color-surface)] p-8 rounded-2xl border border-[var(--color-border)] w-full max-w-sm text-center">
        <h1 class="text-2xl font-bold text-[var(--color-accent)] mb-2">SelectStoreAR</h1>
        <h2 class="text-xl font-semibold mb-2">Iniciar sesión</h2>
        <p class="text-sm text-[var(--color-text-secondary)] mb-6">
          Ingresá con tu cuenta para ver tu historial de pedidos y gestionar tu perfil
        </p>
        <div class="flex flex-col gap-3">
          <button class="flex items-center justify-center gap-2 px-4 py-3 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors">
            Continuar con Google
          </button>
          <button class="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-accent)] text-white rounded-lg hover:opacity-90 transition-opacity">
            Continuar con Facebook
          </button>
        </div>
      </div>
    </main>
  `,
})
export class LoginComponent {}
