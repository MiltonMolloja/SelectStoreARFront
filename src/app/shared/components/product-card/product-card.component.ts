import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductListItem } from '../../../core/models';
import { PreferencesService } from '../../../core/services/preferences.service';
import { CartService } from '../../../core/services/cart.service';
import { AnalyticsService } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="group bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]
                    overflow-hidden hover:shadow-[var(--shadow-lg)] transition-shadow">
      <a [routerLink]="['/producto', product().slug]" class="block">
        <div class="aspect-[4/3] overflow-hidden bg-[var(--color-divider)]">
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

      <div class="p-4">
        <p class="text-xs text-[var(--color-text-secondary)] mb-1">
          {{ product().category.name }}
        </p>
        <a [routerLink]="['/producto', product().slug]" class="block">
          <h3 class="font-semibold text-sm line-clamp-2 mb-2 hover:text-[var(--color-accent)] transition-colors">
            {{ product().name }}
          </h3>
        </a>
        <p class="text-lg font-bold text-[var(--color-accent)] mb-3">
          {{ prefs.formatPrice()(product().finalPriceUsd) }}
        </p>
        <button
          (click)="onAddToCart()"
          class="w-full py-2.5 bg-[var(--color-accent)] text-white rounded-lg
                 hover:opacity-90 transition-opacity text-sm font-medium">
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
  }
}
