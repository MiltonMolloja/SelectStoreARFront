import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Dashboard</h1>
      <p class="text-[var(--color-text-secondary)]">
        Panel de administración — Sprint 1
      </p>
    </main>
  `,
})
export class AdminDashboardComponent {}
