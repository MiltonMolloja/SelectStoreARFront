import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { OrderRequest, OrderResponse } from '../models';
import { CartService, CartItem } from './cart.service';
import { PreferencesService } from './preferences.service';
import { AnalyticsService } from './analytics.service';
import { ToastService } from './toast.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly cart = inject(CartService);
  private readonly prefs = inject(PreferencesService);
  private readonly analytics = inject(AnalyticsService);
  private readonly toast = inject(ToastService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  placeOrder(customerName: string, customerPhone: string): Observable<OrderResponse> {
    const items = this.cart.items();
    const request: OrderRequest = {
      customerName,
      customerPhone,
      items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
    };

    return this.http.post<OrderResponse>(`${environment.apiUrl}/orders`, request).pipe(
      tap((response) => {
        // Track analytics
        this.analytics.trackCheckout(response.totalUsd, items.length);

        // Open WhatsApp
        if (this.isBrowser && response.whatsappLink) {
          window.open(response.whatsappLink, '_blank');
        } else if (this.isBrowser) {
          // Fallback: generate link manually
          const link = this.buildWhatsAppLink(customerName, customerPhone, items);
          window.open(link, '_blank');
        }

        // Clear cart
        this.cart.clear();

        this.toast.success('¡Pedido enviado! Se abrió WhatsApp con tu pedido.');
      }),
    );
  }

  buildWhatsAppLink(name: string, phone: string, items: CartItem[]): string {
    const totalUsd = items.reduce((sum, i) => sum + i.priceUsd * i.quantity, 0);
    const rate = this.prefs.exchangeRate();
    const totalArs = Math.round(totalUsd * rate);

    const lines: string[] = [
      `Hola! Soy ${name} 👋`,
      'Te paso mi pedido de SelectStoreAR:',
      '',
    ];

    items.forEach((item, i) => {
      const subtotalUsd = item.priceUsd * item.quantity;
      const subtotalArs = Math.round(subtotalUsd * rate);
      lines.push(`${i + 1}. ${item.name} x${item.quantity}`);
      lines.push(`   US$ ${subtotalUsd.toFixed(2)} ($ ${subtotalArs.toLocaleString('es-AR')})`);
      lines.push('');
    });

    lines.push(`💰 Total: US$ ${totalUsd.toFixed(2)} ($ ${totalArs.toLocaleString('es-AR')})`);
    if (rate > 0) {
      lines.push(`💱 Cotización: $ ${rate.toLocaleString('es-AR')}`);
    }
    lines.push(`📱 Mi teléfono: ${phone}`);
    lines.push('');
    lines.push('Quedo a la espera para coordinar. Gracias!');

    const message = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/${environment.whatsappPhone}?text=${message}`;
  }
}
