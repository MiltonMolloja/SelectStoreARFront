import { Component, ChangeDetectionStrategy, inject, input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AnalyticsService } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-share-buttons',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center gap-2">
      <span class="text-sm text-[var(--color-text-secondary)]">Compartir:</span>
      <button (click)="shareWhatsApp()" title="Compartir por WhatsApp"
              class="p-2 rounded-lg hover:bg-green-50 transition-colors text-lg"
              aria-label="Compartir por WhatsApp">
        💬
      </button>
      <button (click)="shareFacebook()" title="Compartir en Facebook"
              class="p-2 rounded-lg hover:bg-blue-50 transition-colors text-lg"
              aria-label="Compartir en Facebook">
        📘
      </button>
      <button (click)="copyLink()" title="Copiar enlace"
              class="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors text-lg"
              aria-label="Copiar enlace">
        🔗
      </button>
    </div>
  `,
})
export class ShareButtonsComponent {
  readonly productId = input.required<string>();
  readonly productName = input.required<string>();
  readonly productUrl = input.required<string>();

  private readonly analytics = inject(AnalyticsService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  protected shareWhatsApp(): void {
    if (!this.isBrowser) return;
    const text = encodeURIComponent(`Mirá este producto: ${this.productName()} - ${this.productUrl()}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    this.analytics.trackShareProduct(this.productId(), 'whatsapp');
  }

  protected shareFacebook(): void {
    if (!this.isBrowser) return;
    const url = encodeURIComponent(this.productUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    this.analytics.trackShareProduct(this.productId(), 'facebook');
  }

  protected copyLink(): void {
    if (!this.isBrowser) return;
    navigator.clipboard.writeText(this.productUrl());
    this.analytics.trackShareProduct(this.productId(), 'link');
  }
}
