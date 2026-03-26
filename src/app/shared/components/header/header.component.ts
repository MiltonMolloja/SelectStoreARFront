import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { CurrencyToggleComponent } from '../currency-toggle/currency-toggle.component';
import { CartBadgeComponent } from '../cart-badge/cart-badge.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, ThemeToggleComponent, CurrencyToggleComponent, CartBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="sticky top-0 z-50 bg-[var(--color-surface)]/95 backdrop-blur-sm border-b border-[var(--color-border)]">
      <nav class="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <!-- Logo -->
        <a routerLink="/" class="text-xl font-bold text-[var(--color-accent)] shrink-0"
           style="font-family: 'Cormorant Garamond', serif">
          SelectStoreAR
        </a>

        <!-- Desktop Nav + Search -->
        <div class="hidden md:flex items-center gap-4 flex-1 max-w-xl">
          <a routerLink="/catalogo" routerLinkActive="text-[var(--color-accent)] font-medium"
             class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors shrink-0">
            Catálogo
          </a>
          <div class="relative flex-1">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] text-sm">🔍</span>
            <input type="text" placeholder="Buscar productos..."
                   [ngModel]="searchQuery()"
                   (ngModelChange)="searchQuery.set($event)"
                   (keydown.enter)="onSearch()"
                   class="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]
                          text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent" />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-1 shrink-0">
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
        <div class="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 space-y-2">
          <!-- Mobile Search -->
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] text-sm">🔍</span>
            <input type="text" placeholder="Buscar productos..."
                   [ngModel]="searchQuery()"
                   (ngModelChange)="searchQuery.set($event)"
                   (keydown.enter)="onSearch(); menuOpen.set(false)"
                   class="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]
                          text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
          </div>
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
  private readonly router = inject(Router);
  protected readonly menuOpen = signal(false);
  protected readonly searchQuery = signal('');

  protected toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  protected onSearch(): void {
    const q = this.searchQuery().trim();
    if (q) {
      this.router.navigate(['/buscar'], { queryParams: { q } });
      this.searchQuery.set('');
    }
  }
}
