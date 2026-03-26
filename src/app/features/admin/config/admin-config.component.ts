import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-admin-config',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold mb-8">Configuración</h1>
      <p class="text-[var(--color-text-secondary)]">
        Configuración del sitio — Sprint 3
      </p>
    </div>
  `,
})
export class AdminConfigComponent {}
