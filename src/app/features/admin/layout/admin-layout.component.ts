import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-screen bg-[var(--color-bg)]">
      <!-- Sidebar -->
      <aside
        class="w-[250px] bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col"
        [class.hidden]="!sidebarOpen()"
        [class.md:flex]="true">

        <!-- Logo -->
        <div class="p-6 pb-4 border-b border-[var(--color-border)]">
          <a routerLink="/" class="text-xl font-bold text-[var(--color-accent)]">
            SelectStoreAR
          </a>
          <p class="text-xs text-[var(--color-text-secondary)] mt-1">ADMIN</p>
        </div>

        <!-- Nav -->
        <nav class="flex-1 p-4 flex flex-col gap-1">
          <a routerLink="/admin" routerLinkActive="bg-[var(--color-accent-light)] text-[var(--color-accent)]"
             [routerLinkActiveOptions]="{ exact: true }"
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-surface-hover)] transition-colors">
            <span>📊</span> Dashboard
          </a>
          <a routerLink="/admin/productos" routerLinkActive="bg-[var(--color-accent-light)] text-[var(--color-accent)]"
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-surface-hover)] transition-colors">
            <span>📦</span> Productos
          </a>
          <a routerLink="/admin/categorias" routerLinkActive="bg-[var(--color-accent-light)] text-[var(--color-accent)]"
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-surface-hover)] transition-colors">
            <span>📁</span> Categorías
          </a>
          <a routerLink="/admin/pedidos" routerLinkActive="bg-[var(--color-accent-light)] text-[var(--color-accent)]"
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-surface-hover)] transition-colors">
            <span>🛒</span> Pedidos
          </a>
          <a routerLink="/admin/configuracion" routerLinkActive="bg-[var(--color-accent-light)] text-[var(--color-accent)]"
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-surface-hover)] transition-colors">
            <span>⚙️</span> Configuración
          </a>
        </nav>
      </aside>

      <!-- Mobile toggle -->
      <button
        class="md:hidden fixed top-4 left-4 z-50 p-2 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]"
        (click)="toggleSidebar()"
        (keydown.enter)="toggleSidebar()"
        aria-label="Toggle sidebar">
        ☰
      </button>

      <!-- Main content -->
      <main class="flex-1 overflow-y-auto">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AdminLayoutComponent {
  protected readonly sidebarOpen = signal(true);

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }
}
