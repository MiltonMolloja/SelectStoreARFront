import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideShoppingCart } from '@lucide/angular';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-badge',
  standalone: true,
  imports: [RouterLink, LucideShoppingCart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a routerLink="/carrito"
       class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-accent-light)]
              hover:opacity-80 transition-opacity"
       aria-label="Carrito de compras">
      <svg lucideShoppingCart [size]="16" class="text-[var(--color-accent)]"></svg>
      <span class="text-[12px] font-medium text-[var(--color-accent)]">Carrito</span>
      @if (cart.itemCount() > 0) {
        <span class="bg-[var(--color-accent)] text-white text-[11px] font-bold
                     rounded-full w-5 h-5 flex items-center justify-center">
          {{ cart.itemCount() > 9 ? '9+' : cart.itemCount() }}
        </span>
      }
    </a>
  `,
})
export class CartBadgeComponent {
  protected readonly cart = inject(CartService);
}
