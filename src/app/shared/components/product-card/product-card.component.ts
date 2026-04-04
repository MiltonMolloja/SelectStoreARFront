import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucidePackage } from '@lucide/angular';
import { ProductListItem } from '../../../core/models';
import { PreferencesService } from '../../../core/services/preferences.service';
import { CartService } from '../../../core/services/cart.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, LucidePackage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="group bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]
                    overflow-hidden hover:shadow-[var(--shadow-lg)] transition-shadow w-full">
      <a [routerLink]="['/producto', product().slug]" class="block">
        <div class="h-[210px] overflow-hidden bg-[var(--color-divider)]">
          @if (product().imageUrl) {
            <img [src]="product().imageUrl"
                 [alt]="product().name"
                 loading="lazy"
                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          } @else {
            <div class="w-full h-full flex items-center justify-center text-4xl opacity-30">📷</div>
          }
        </div>
      </a>

      <div class="p-4 flex flex-col gap-2">
        <p class="text-[12px] font-medium text-[var(--color-text-secondary)]">
          {{ product().category?.name ?? '' }}
        </p>
        <span class="inline-flex items-center gap-1 w-fit px-2 py-0.5 rounded-full bg-blue-50 text-[var(--color-accent)]">
          <svg lucidePackage [size]="12"></svg>
          <span class="text-[11px] font-medium">Bajo pedido · ~1 sem</span>
        </span>
        <a [routerLink]="['/producto', product().slug]" class="block">
          <h3 class="text-[15px] font-semibold line-clamp-2 hover:text-[var(--color-accent)] transition-colors">
            {{ product().name }}
          </h3>
        </a>
        <p class="text-[18px] font-bold text-[var(--color-accent)]">
          {{ prefs.formatPrice()(product().finalPriceUsd) }}
        </p>
        <button
          (click)="onAddToCart()"
          class="w-full py-2.5 bg-[var(--color-accent)] text-white rounded-lg
                 hover:opacity-90 transition-opacity text-[13px] font-semibold">
          Agregar al carrito
        </button>
      </div>
    </article>
  `,
})
export class ProductCardComponent {
  readonly product = input.required<ProductListItem>();
  protected readonly prefs = inject(PreferencesService);
  private readonly cart = inject(CartService);
  private readonly analytics = inject(AnalyticsService);
  private readonly toast = inject(ToastService);

  protected onAddToCart(): void {
    const p = this.product();
    this.cart.addItem({
      id: p.id,
      name: p.name,
      slug: p.slug,
      imageUrl: p.imageUrl,
      finalPriceUsd: p.finalPriceUsd,
    });
    this.analytics.trackAddToCart({ id: p.id, name: p.name, price: p.finalPriceUsd });
    this.toast.success(`${p.name} agregado al carrito`);
  }
}
