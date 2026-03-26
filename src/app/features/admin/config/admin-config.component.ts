import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminApiService } from '../services/admin-api.service';

@Component({
  selector: 'app-admin-config',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 max-w-2xl">
      <h1 class="text-3xl font-bold mb-8">Configuración</h1>

      <!-- Exchange Rate -->
      <section class="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">💱 Cotización USD/ARS</h2>

        @if (currentRate()) {
          <div class="mb-4 p-4 rounded-lg bg-[var(--color-surface-hover)]">
            <p class="text-sm text-[var(--color-text-secondary)]">Cotización actual</p>
            <p class="text-2xl font-bold">$ {{ currentRate()!.toLocaleString('es-AR') }}</p>
            @if (rateUpdatedAt()) {
              <p class="text-xs text-[var(--color-text-secondary)] mt-1">
                Última actualización: {{ rateUpdatedAt() }}
              </p>
            }
          </div>
        }

        <form [formGroup]="rateForm" (ngSubmit)="onUpdateRate()" class="flex gap-3 items-end">
          <div class="flex-1">
            <label for="rate" class="block text-sm font-medium mb-1">Nueva cotización</label>
            <input id="rate" formControlName="rate" type="number" step="0.01" min="1"
                   placeholder="1250.00"
                   class="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]
                          focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
          </div>
          <button type="submit" [disabled]="rateForm.invalid || savingRate()"
                  class="px-6 py-2.5 bg-[var(--color-accent)] text-white rounded-lg font-medium
                         hover:opacity-90 disabled:opacity-50 transition-opacity">
            {{ savingRate() ? 'Guardando...' : 'Actualizar' }}
          </button>
        </form>

        @if (rateSuccess()) {
          <p class="text-sm text-[var(--color-success)] mt-3">✅ Cotización actualizada correctamente</p>
        }

        <div class="mt-4 text-xs text-[var(--color-text-secondary)]">
          <p class="font-medium mb-1">Fuentes de referencia:</p>
          <ul class="space-y-0.5">
            <li>
              <a href="https://dolarhoy.com" target="_blank" rel="noopener"
                 class="text-[var(--color-accent)] hover:underline">dolarhoy.com</a>
              — Dólar Blue
            </li>
            <li>
              <a href="https://dolarapi.com/v1/dolares/blue" target="_blank" rel="noopener"
                 class="text-[var(--color-accent)] hover:underline">dolarapi.com</a>
              — API gratuita
            </li>
          </ul>
        </div>
      </section>

      <!-- WhatsApp -->
      <section class="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
        <h2 class="text-lg font-semibold mb-4">📱 Número de WhatsApp</h2>

        @if (currentPhone()) {
          <div class="mb-4 p-4 rounded-lg bg-[var(--color-surface-hover)]">
            <p class="text-sm text-[var(--color-text-secondary)]">Número actual</p>
            <p class="text-lg font-bold">{{ currentPhone() }}</p>
          </div>
        }

        <form [formGroup]="phoneForm" (ngSubmit)="onUpdatePhone()" class="flex gap-3 items-end">
          <div class="flex-1">
            <label for="phone" class="block text-sm font-medium mb-1">Nuevo número</label>
            <input id="phone" formControlName="phone" type="tel"
                   placeholder="+5493881234567"
                   class="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]
                          focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
          </div>
          <button type="submit" [disabled]="phoneForm.invalid || savingPhone()"
                  class="px-6 py-2.5 bg-[var(--color-accent)] text-white rounded-lg font-medium
                         hover:opacity-90 disabled:opacity-50 transition-opacity">
            {{ savingPhone() ? 'Guardando...' : 'Actualizar' }}
          </button>
        </form>

        @if (phoneSuccess()) {
          <p class="text-sm text-[var(--color-success)] mt-3">✅ Número actualizado correctamente</p>
        }
      </section>
    </div>
  `,
})
export class AdminConfigComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AdminApiService);

  protected readonly currentRate = signal<number | null>(null);
  protected readonly rateUpdatedAt = signal<string | null>(null);
  protected readonly currentPhone = signal<string | null>(null);
  protected readonly savingRate = signal(false);
  protected readonly savingPhone = signal(false);
  protected readonly rateSuccess = signal(false);
  protected readonly phoneSuccess = signal(false);

  protected readonly rateForm = this.fb.group({
    rate: [null as number | null, [Validators.required, Validators.min(1)]],
  });

  protected readonly phoneForm = this.fb.group({
    phone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
  });

  ngOnInit(): void {
    this.loadDashboard();
  }

  protected onUpdateRate(): void {
    if (this.rateForm.invalid) return;
    this.savingRate.set(true);
    this.rateSuccess.set(false);

    this.api.updateExchangeRate(this.rateForm.value.rate!).subscribe({
      next: (res) => {
        this.currentRate.set(res.rate);
        this.rateUpdatedAt.set(new Date(res.updatedAt).toLocaleString('es-AR'));
        this.savingRate.set(false);
        this.rateSuccess.set(true);
        this.rateForm.reset();
      },
      error: () => this.savingRate.set(false),
    });
  }

  protected onUpdatePhone(): void {
    if (this.phoneForm.invalid) return;
    this.savingPhone.set(true);
    this.phoneSuccess.set(false);

    this.api.updateWhatsappPhone(this.phoneForm.value.phone!).subscribe({
      next: (res) => {
        this.currentPhone.set(res.phone);
        this.savingPhone.set(false);
        this.phoneSuccess.set(true);
        this.phoneForm.reset();
      },
      error: () => this.savingPhone.set(false),
    });
  }

  private loadDashboard(): void {
    this.api.getDashboard().subscribe({
      next: (data) => {
        this.currentRate.set(data.exchangeRate.rate);
        this.rateUpdatedAt.set(new Date(data.exchangeRate.updatedAt).toLocaleString('es-AR'));
      },
    });
  }
}
