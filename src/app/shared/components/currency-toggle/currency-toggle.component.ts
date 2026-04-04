import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { LucideArrowLeftRight } from '@lucide/angular';
import { PreferencesService } from '../../../core/services/preferences.service';
import { AnalyticsService } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-currency-toggle',
  standalone: true,
  imports: [LucideArrowLeftRight],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      (click)="onToggle()"
      [attr.aria-label]="'Moneda: ' + prefs.currency()"
      [title]="'Moneda: ' + prefs.currency()"
      class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-border)]
             hover:bg-[var(--color-surface-hover)] transition-colors">
      <svg lucideArrowLeftRight [size]="14" class="text-[var(--color-text-primary)]"></svg>
      <span class="text-[12px] font-semibold">{{ prefs.currencyLabel() }}</span>
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
