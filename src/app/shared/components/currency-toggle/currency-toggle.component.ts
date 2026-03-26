import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { PreferencesService } from '../../../core/services/preferences.service';
import { AnalyticsService } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-currency-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      (click)="onToggle()"
      [attr.aria-label]="'Moneda: ' + prefs.currency()"
      [title]="'Moneda: ' + prefs.currency()"
      class="px-2.5 py-1 rounded-lg font-mono text-sm font-bold
             hover:bg-[var(--color-surface-hover)] transition-colors
             border border-[var(--color-border)]">
      {{ prefs.currency() }}
    </button>
  `,
})
export class CurrencyToggleComponent {
  protected readonly prefs = inject(PreferencesService);
  private readonly analytics = inject(AnalyticsService);

  protected onToggle(): void {
    const from = this.prefs.currency();
    this.prefs.toggleCurrency();
    this.analytics.trackCurrencyToggle(from, this.prefs.currency());
  }
}
