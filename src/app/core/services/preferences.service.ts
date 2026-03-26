import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Currency = 'USD' | 'ARS';

const STORAGE_KEY = 'ssa-currency';

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly currency = signal<Currency>(this.loadCurrency());
  readonly exchangeRate = signal<number>(0);

  readonly currencyLabel = computed(() => {
    return this.currency() === 'USD' ? 'US$' : '$';
  });

  readonly formatPrice = computed(() => {
    const rate = this.exchangeRate();
    return this.currency() === 'USD'
      ? (priceUsd: number): string => `US$ ${priceUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : (priceUsd: number): string => `$ ${Math.round(priceUsd * rate).toLocaleString('es-AR')}`;
  });

  readonly convertPrice = computed(() => {
    const rate = this.exchangeRate();
    return this.currency() === 'USD'
      ? (priceUsd: number): number => priceUsd
      : (priceUsd: number): number => Math.round(priceUsd * rate);
  });

  toggleCurrency(): void {
    this.currency.update(c => (c === 'USD' ? 'ARS' : 'USD'));
    this.persistCurrency();
  }

  setCurrency(currency: Currency): void {
    this.currency.set(currency);
    this.persistCurrency();
  }

  setExchangeRate(rate: number): void {
    this.exchangeRate.set(rate);
  }

  private persistCurrency(): void {
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY, this.currency());
    }
  }

  private loadCurrency(): Currency {
    if (!this.isBrowser) {
      return 'ARS';
    }
    const saved = localStorage.getItem(STORAGE_KEY) as Currency | null;
    return saved ?? 'ARS';
  }
}
