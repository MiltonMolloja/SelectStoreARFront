import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { CurrencyToggleComponent } from '../currency-toggle/currency-toggle.component';
import { CartBadgeComponent } from '../cart-badge/cart-badge.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ThemeToggleComponent, CurrencyToggleComponent, CartBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="sticky top-0 z-50 bg-[var(--color-surface)]/95 backdrop-blur-sm border-b border-[var(--color-border)]">
      <nav class="container mx-auto px-4 h-16 flex items-center justify-between">
        <!-- Logo -->
        <a routerLink="/" class="text-xl font-bold text-[var(--color-accent)]"
           style="font-family: 'Cormorant Garamond', serif">
          SelectStoreAR
        </a>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-6">
          <a routerLink="/catalogo" routerLinkActive="text-[var(--color-accent)] font-medium"
             class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
            Catálogo
          </a>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-1">
          <app-theme-toggle />
          <app-currency-toggle />
          <app-cart-badge />

          <!-- Mobile menu button -->
          <button
            class="md:hidden p-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
            (click)="toggleMenu()"
            [attr.aria-expanded]="menuOpen()"
            aria-label="Menú de navegación">
            {{ menuOpen() ? '✕' : '☰' }}
          </button>
        </div>
      </nav>

      <!-- Mobile Menu -->
      @if (menuOpen()) {
        <div class="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
          <a routerLink="/catalogo" (click)="menuOpen.set(false)"
             class="block py-2 text-sm hover:text-[var(--color-accent)] transition-colors">
            Catálogo
          </a>
          <a routerLink="/carrito" (click)="menuOpen.set(false)"
             class="block py-2 text-sm hover:text-[var(--color-accent)] transition-colors">
            Carrito
          </a>
        </div>
      }
    </header>
  `,
})
export class HeaderComponent {
  protected readonly menuOpen = signal(false);

  protected toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }
}
