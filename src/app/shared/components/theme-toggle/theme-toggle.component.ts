import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { LucideSun, LucideMoon, LucideMonitor } from '@lucide/angular';
import { ThemeService } from '../../../core/services/theme.service';
import { AnalyticsService } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [LucideSun, LucideMoon, LucideMonitor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      (click)="onToggle()"
      [attr.aria-label]="'Tema: ' + theme.label()"
      [title]="'Tema: ' + theme.label()"
      class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-border)]
             hover:bg-[var(--color-surface-hover)] transition-colors">
      @if (theme.mode() === 'light') {
        <svg lucideSun [size]="16" class="text-[var(--color-text-primary)]"></svg>
      } @else if (theme.mode() === 'dark') {
        <svg lucideMoon [size]="16" class="text-[var(--color-text-primary)]"></svg>
      } @else {
        <svg lucideMonitor [size]="16" class="text-[var(--color-text-primary)]"></svg>
      }
      <span class="text-[12px] font-medium">{{ theme.label() }}</span>
    </button>
  `,
})
export class ThemeToggleComponent {
  protected readonly theme = inject(ThemeService);
  private readonly analytics = inject(AnalyticsService);

  protected onToggle(): void {
    const from = this.theme.mode();
    this.theme.cycleTheme();
    this.analytics.trackThemeToggle(from, this.theme.mode());
  }
}
