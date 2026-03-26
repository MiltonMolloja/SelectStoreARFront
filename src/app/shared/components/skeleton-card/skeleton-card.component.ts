import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden animate-pulse">
      <div class="aspect-[4/3] bg-[var(--color-divider)]"></div>
      <div class="p-4 space-y-3">
        <div class="h-3 bg-[var(--color-divider)] rounded w-1/3"></div>
        <div class="h-4 bg-[var(--color-divider)] rounded w-3/4"></div>
        <div class="h-5 bg-[var(--color-divider)] rounded w-1/2"></div>
        <div class="h-10 bg-[var(--color-divider)] rounded w-full"></div>
      </div>
    </div>
  `,
})
export class SkeletonCardComponent {}
