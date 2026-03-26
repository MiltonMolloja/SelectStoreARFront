import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-[70vh] flex items-center justify-center px-4">
      <div class="bg-[var(--color-surface)] p-8 rounded-2xl border border-[var(--color-border)] w-full max-w-sm text-center">
        <h1 class="text-2xl font-bold text-[var(--color-accent)] mb-2"
            style="font-family: 'Cormorant Garamond', serif">
          SelectStoreAR
        </h1>
        <h2 class="text-xl font-semibold mb-2">Iniciar sesión</h2>
        <p class="text-sm text-[var(--color-text-secondary)] mb-6">
          Ingresá con tu cuenta para ver tu historial de pedidos y gestionar tu perfil
        </p>
        <div class="flex flex-col gap-3">
          <button (click)="auth.loginWithGoogle()"
                  class="flex items-center justify-center gap-3 px-4 py-3 border border-[var(--color-border)]
                         rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors text-sm font-medium">
            <span>🔵</span> Continuar con Google
          </button>
          <button (click)="auth.loginWithFacebook()"
                  class="flex items-center justify-center gap-3 px-4 py-3 bg-[var(--color-accent)] text-white
                         rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
            <span>📘</span> Continuar con Facebook
          </button>
        </div>
        <p class="text-xs text-[var(--color-text-secondary)] mt-6">
          Al continuar, aceptás nuestros Términos y Privacidad
        </p>
      </div>
    </main>
  `,
})
export class LoginComponent {
  protected readonly auth = inject(AuthService);
}
