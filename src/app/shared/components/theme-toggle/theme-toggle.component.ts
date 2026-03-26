import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { AnalyticsService } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      (click)="onToggle()"
      [attr.aria-label]="'Tema: ' + theme.label()"
      [title]="'Tema: ' + theme.label()"
      class="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors text-sm">
      {{ theme.icon() }}
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
