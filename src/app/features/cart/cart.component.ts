import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { PreferencesService } from '../../core/services/preferences.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { ToastService } from '../../core/services/toast.service';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (cart.isEmpty()) {
      <!-- Empty State -->
      <div class="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div class="w-20 h-20 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center text-4xl mb-6">
          🛒
        </div>
        <h1 class="text-2xl font-bold mb-2" style="font-family: 'Cormorant Garamond', serif">
          Tu carrito está vacío
        </h1>
        <p class="text-[var(--color-text-secondary)] mb-6">
          Agregá productos desde nuestro catálogo para empezar
        </p>
        <a routerLink="/catalogo"
           class="px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
          Ver catálogo
        </a>
      </div>
    } @else {
      <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-8" style="font-family: 'Cormorant Garamond', serif">
          Tu Carrito ({{ cart.itemCount() }} {{ cart.itemCount() === 1 ? 'producto' : 'productos' }})
        </h1>

        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Cart Items -->
          <div class="flex-1 space-y-4">
            @for (item of cart.items(); track item.productId) {
              <div class="flex gap-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
                <!-- Image -->
                <a [routerLink]="['/producto', item.slug]" class="shrink-0">
                  @if (item.imageUrl) {
                    <img [src]="item.imageUrl" [alt]="item.name"
                         class="w-20 h-20 rounded-lg object-cover" />
                  } @else {
                    <div class="w-20 h-20 rounded-lg bg-[var(--color-divider)] flex items-center justify-center">📷</div>
                  }
                </a>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <a [routerLink]="['/producto', item.slug]"
                     class="font-medium text-sm hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                    {{ item.name }}
                  </a>
                  <p class="text-[var(--color-accent)] font-bold mt-1">
                    {{ prefs.formatPrice()(item.priceUsd) }}
                  </p>
                </div>

                <!-- Quantity -->
                <div class="flex items-center gap-2 shrink-0">
                  <button (click)="onQuantityChange(item.productId, item.quantity - 1)"
                          class="w-8 h-8 rounded-lg border border-[var(--color-border)] flex items-center justify-center
                                 hover:bg-[var(--color-surface-hover)] transition-colors text-sm"
                          aria-label="Reducir cantidad">
                    −
                  </button>
                  <span class="w-8 text-center text-sm font-medium">{{ item.quantity }}</span>
                  <button (click)="onQuantityChange(item.productId, item.quantity + 1)"
                          class="w-8 h-8 rounded-lg border border-[var(--color-border)] flex items-center justify-center
                                 hover:bg-[var(--color-surface-hover)] transition-colors text-sm"
                          aria-label="Aumentar cantidad">
                    +
                  </button>
                </div>

                <!-- Remove -->
                <button (click)="onRemove(item.productId)"
                        class="p-2 text-[var(--color-error)] hover:bg-red-50 rounded-lg transition-colors shrink-0"
                        aria-label="Eliminar producto">
                  🗑️
                </button>
              </div>
            }
          </div>

          <!-- Order Summary + Checkout -->
          <div class="w-full lg:w-96 shrink-0">
            <div class="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 sticky top-20">
              <h2 class="font-semibold text-lg mb-4">Resumen del pedido</h2>

              <!-- Items summary -->
              <div class="space-y-2 mb-4 pb-4 border-b border-[var(--color-border)]">
                @for (item of cart.items(); track item.productId) {
                  <div class="flex justify-between text-sm">
                    <span class="text-[var(--color-text-secondary)] truncate mr-2">
                      {{ item.name }} x{{ item.quantity }}
                    </span>
                    <span class="font-medium shrink-0">
                      {{ prefs.formatPrice()(item.priceUsd * item.quantity) }}
                    </span>
                  </div>
                }
              </div>

              <!-- Total -->
              <div class="flex justify-between items-center mb-6">
                <span class="font-bold text-lg">Total</span>
                <span class="font-bold text-xl text-[var(--color-accent)]">
                  {{ prefs.formatPrice()(cart.totalUsd()) }}
                </span>
              </div>

              <!-- Checkout Form -->
              <form [formGroup]="checkoutForm" (ngSubmit)="onCheckout()" class="space-y-4">
                <h3 class="font-semibold text-sm">Datos para el pedido</h3>

                <div>
                  <label for="customerName" class="block text-sm font-medium mb-1">Nombre</label>
                  <input id="customerName" formControlName="customerName" type="text"
                         placeholder="Tu nombre completo"
                         class="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]
                                text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
                  @if (checkoutForm.get('customerName')?.invalid && checkoutForm.get('customerName')?.touched) {
                    <p class="text-xs text-[var(--color-error)] mt-1">El nombre es obligatorio</p>
                  }
                </div>

                <div>
                  <label for="customerPhone" class="block text-sm font-medium mb-1">Teléfono</label>
                  <input id="customerPhone" formControlName="customerPhone" type="tel"
                         placeholder="+54 388 123-4567"
                         class="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]
                                text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
                  @if (checkoutForm.get('customerPhone')?.invalid && checkoutForm.get('customerPhone')?.touched) {
                    <p class="text-xs text-[var(--color-error)] mt-1">Ingresá un teléfono válido</p>
                  }
                </div>

                <button type="submit"
                        [disabled]="checkoutForm.invalid || submitting()"
                        class="w-full py-3.5 bg-green-500 text-white rounded-lg font-medium
                               hover:opacity-90 transition-opacity disabled:opacity-50 text-sm">
                  {{ submitting() ? 'Enviando...' : '💬 Enviar pedido por WhatsApp' }}
                </button>
              </form>

              <!-- Clear cart -->
              <button (click)="onClearCart()"
                      class="w-full mt-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm
                             hover:bg-[var(--color-surface-hover)] transition-colors text-[var(--color-text-secondary)]">
                Vaciar carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class CartComponent {
  private readonly fb = inject(FormBuilder);
  private readonly analytics = inject(AnalyticsService);
  private readonly toast = inject(ToastService);
  private readonly orderService = inject(OrderService);
  protected readonly cart = inject(CartService);
  protected readonly prefs = inject(PreferencesService);
  protected readonly submitting = signal(false);

  protected readonly checkoutForm = this.fb.group({
    customerName: ['', Validators.required],
    customerPhone: ['', [Validators.required, Validators.pattern(/^\+?\d{7,15}$/)]],
  });

  protected onQuantityChange(productId: string, quantity: number): void {
    this.cart.updateQuantity(productId, quantity);
  }

  protected onRemove(productId: string): void {
    this.cart.removeItem(productId);
    this.analytics.trackRemoveFromCart(productId);
    this.toast.info('Producto eliminado del carrito');
  }

  protected onClearCart(): void {
    if (confirm('¿Vaciar el carrito?')) {
      this.cart.clear();
      this.toast.info('Carrito vaciado');
    }
  }

  protected onCheckout(): void {
    if (this.checkoutForm.invalid) return;
    this.submitting.set(true);

    const { customerName, customerPhone } = this.checkoutForm.value;

    this.orderService.placeOrder(customerName!, customerPhone!).subscribe({
      next: () => {
        this.checkoutForm.reset();
        this.submitting.set(false);
      },
      error: () => {
        // Fallback: open WhatsApp manually if API fails
        const items = this.cart.items();
        const link = this.orderService.buildWhatsAppLink(customerName!, customerPhone!, items);
        window.open(link, '_blank');
        this.cart.clear();
        this.checkoutForm.reset();
        this.submitting.set(false);
        this.toast.info('Se abrió WhatsApp directamente (el servidor no respondió).');
      },
    });
  }
}
