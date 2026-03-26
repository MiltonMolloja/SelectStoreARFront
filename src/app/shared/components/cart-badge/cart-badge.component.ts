import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-badge',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a routerLink="/carrito" class="relative p-2 hover:bg-[var(--color-surface-hover)] rounded-lg transition-colors"
       aria-label="Carrito de compras">
      🛒
      @if (cart.itemCount() > 0) {
        <span class="absolute -top-0.5 -right-0.5 bg-[var(--color-accent)]
                     text-white text-[10px] rounded-full w-[18px] h-[18px]
                     flex items-center justify-center font-bold leading-none">
          {{ cart.itemCount() > 9 ? '9+' : cart.itemCount() }}
        </span>
      }
    </a>
  `,
})
export class CartBadgeComponent {
  protected readonly cart = inject(CartService);
}
