import { Component, ChangeDetectionStrategy, inject, input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LucideMessageCircle, LucideShare2, LucideLink } from '@lucide/angular';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-share-buttons',
  standalone: true,
  imports: [LucideMessageCircle, LucideShare2, LucideLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center gap-3">
      <span class="text-[13px] font-medium text-[var(--color-text-secondary)]">Compartir:</span>
      <button (click)="shareWhatsApp()" title="Compartir por WhatsApp"
              class="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label="Compartir por WhatsApp">
        <svg lucideMessageCircle [size]="16" class="text-[#25D366]"></svg>
      </button>
      <button (click)="shareFacebook()" title="Compartir en Facebook"
              class="w-9 h-9 rounded-lg bg-[var(--color-accent-light)] flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label="Compartir en Facebook">
        <svg lucideShare2 [size]="16" class="text-[var(--color-accent)]"></svg>
      </button>
      <button (click)="copyLink()" title="Copiar enlace"
              class="w-9 h-9 rounded-lg border border-[var(--color-border)] flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label="Copiar enlace">
        <svg lucideLink [size]="16" class="text-[var(--color-text-secondary)]"></svg>
      </button>
    </div>
  `,
})
export class ShareButtonsComponent {
  readonly productId = input.required<string>();
  readonly productName = input.required<string>();
  readonly productUrl = input.required<string>();

  private readonly analytics = inject(AnalyticsService);
  private readonly toast = inject(ToastService);
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
    this.toast.success('Link copiado al portapapeles');
  }
}
