import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LucideShoppingCart, LucideTrash2, LucideMessageCircle, LucideMinus, LucidePlus } from '@lucide/angular';
import { CartService } from '../../core/services/cart.service';
import { PreferencesService } from '../../core/services/preferences.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { ToastService } from '../../core/services/toast.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, LucideShoppingCart, LucideTrash2, LucideMessageCircle, LucideMinus, LucidePlus],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (cart.isEmpty()) {
      <!-- Empty State -->
      <div class="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div class="w-20 h-20 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center mb-6">
          <svg lucideShoppingCart [size]="36" class="text-[var(--color-accent)]"></svg>
        </div>
        <h1 class="text-[24px] font-bold mb-2">Tu carrito esta vacio</h1>
        <p class="text-[15px] text-[var(--color-text-secondary)] mb-6">
          Agrega productos desde nuestro catalogo para empezar
        </p>
        <a routerLink="/catalogo"
           class="px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg text-[14px] font-semibold hover:opacity-90 transition-opacity">
          Ver catalogo
        </a>
      </div>
    } @else {
      <div style="padding: 32px 80px">
        <h1 class="text-[28px] font-bold mb-8">
          Tu Carrito ({{ cart.itemCount() }} {{ cart.itemCount() === 1 ? 'producto' : 'productos' }})
        </h1>

        <div class="flex flex-col lg:flex-row gap-10">
          <!-- Cart Items -->
          <div class="flex-1 flex flex-col gap-4">
            @for (item of cart.items(); track item.productId) {
              <div class="flex items-center gap-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
                <a [routerLink]="['/producto', item.slug]" class="shrink-0">
                  @if (item.imageUrl) {
                    <img [src]="item.imageUrl" [alt]="item.name"
                         class="w-20 h-20 rounded-lg object-cover" />
                  } @else {
                    <div class="w-20 h-20 rounded-lg bg-[var(--color-divider)] flex items-center justify-center text-2xl opacity-30">📷</div>
                  }
                </a>
                <div class="flex-1 min-w-0">
                  <a [routerLink]="['/producto', item.slug]"
                     class="text-[14px] font-medium hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                    {{ item.name }}
                  </a>
                  <p class="text-[var(--color-accent)] text-[14px] font-bold mt-1">
                    US{{ '$' }} {{ item.priceUsd.toFixed(2) }}
                  </p>
                </div>
                <div class="flex items-center shrink-0 border border-[var(--color-border)] rounded-lg">
                  <button (click)="onQuantityChange(item.productId, item.quantity - 1)"
                          class="w-9 h-9 flex items-center justify-center hover:bg-[var(--color-surface-hover)] transition-colors rounded-l-lg"
                          aria-label="Reducir cantidad">
                    <svg lucideMinus [size]="14" class="text-[var(--color-text-secondary)]"></svg>
                  </button>
                  <span class="w-8 text-center text-[13px] font-semibold">{{ item.quantity }}</span>
                  <button (click)="onQuantityChange(item.productId, item.quantity + 1)"
                          class="w-9 h-9 flex items-center justify-center hover:bg-[var(--color-surface-hover)] transition-colors rounded-r-lg"
                          aria-label="Aumentar cantidad">
                    <svg lucidePlus [size]="14" class="text-[var(--color-text-secondary)]"></svg>
                  </button>
                </div>
                <button (click)="onRemove(item.productId)"
                        class="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors shrink-0"
                        aria-label="Eliminar producto">
                  <svg lucideTrash2 [size]="16" class="text-[var(--color-error)]"></svg>
                </button>
              </div>
            }
          </div>

          <!-- Order Summary -->
          <div class="w-full lg:w-[400px] shrink-0">
            <div class="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 sticky top-20 flex flex-col gap-5">
              <h2 class="text-[18px] font-bold">Resumen del pedido</h2>

              <div class="flex flex-col gap-2">
                @for (item of cart.items(); track item.productId) {
                  <div class="flex justify-between text-[13px]">
                    <span class="text-[var(--color-text-secondary)] truncate mr-2">{{ item.name }} x{{ item.quantity }}</span>
                    <span class="font-semibold shrink-0">US{{ '$' }} {{ (item.priceUsd * item.quantity).toFixed(2) }}</span>
                  </div>
                }
              </div>

              <div class="h-px bg-[var(--color-border)]"></div>

              <div class="flex justify-between items-center">
                <span class="text-[16px] font-bold">Total</span>
                <span class="text-[18px] font-extrabold text-[var(--color-accent)]">
                  US{{ '$' }} {{ cart.totalUsd().toFixed(2) }}
                </span>
              </div>

              <div class="h-px bg-[var(--color-border)]"></div>

              <form [formGroup]="checkoutForm" (ngSubmit)="onCheckout()" class="flex flex-col gap-4">
                <h3 class="text-[14px] font-semibold">Datos para el pedido</h3>

                <div>
                  <label for="customerName" class="block text-[13px] font-medium mb-1">Nombre</label>
                  <input id="customerName" formControlName="customerName" type="text"
                         placeholder="Tu nombre completo"
                         class="w-full px-3.5 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]
                                text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
                  @if (checkoutForm.get('customerName')?.invalid && checkoutForm.get('customerName')?.touched) {
                    <p class="text-[11px] text-[var(--color-error)] mt-1">El nombre es obligatorio</p>
                  }
                </div>

                <div>
                  <label for="customerPhone" class="block text-[13px] font-medium mb-1">Telefono</label>
                  <input id="customerPhone" formControlName="customerPhone" type="tel"
                         placeholder="+54 388 XXX-XXXX"
                         class="w-full px-3.5 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]
                                text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
                  @if (checkoutForm.get('customerPhone')?.invalid && checkoutForm.get('customerPhone')?.touched) {
                    <p class="text-[11px] text-[var(--color-error)] mt-1">Ingresá un teléfono válido</p>
                  }
                </div>

                <button type="submit"
                        [disabled]="checkoutForm.invalid || submitting()"
                        class="w-full py-3 bg-[#25D366] text-white rounded-lg font-semibold
                               hover:opacity-90 transition-opacity disabled:opacity-50 text-[14px] flex items-center justify-center gap-2">
                  <svg lucideMessageCircle [size]="18"></svg>
                  {{ submitting() ? 'Enviando...' : 'Enviar pedido por WhatsApp' }}
                </button>
              </form>

              <button (click)="onClearCart()"
                      class="w-full py-3 border border-[var(--color-border)] rounded-lg text-[13px]
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
  private readonly auth = inject(AuthService);
  protected readonly cart = inject(CartService);
  protected readonly prefs = inject(PreferencesService);
  protected readonly submitting = signal(false);

  protected readonly checkoutForm = this.fb.group({
    customerName: ['', Validators.required],
    customerPhone: ['', [Validators.required, Validators.pattern(/^\+?\d{7,15}$/)]],
  });

  constructor() {
    // Validate cart items on load
    this.cart.validateCart();

    // Pre-fill from authenticated user
    const user = this.auth.user();
    if (user) {
      this.checkoutForm.patchValue({
        customerName: user.name ?? '',
        customerPhone: user.phone ?? '',
      });
    }
  }

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
