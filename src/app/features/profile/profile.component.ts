import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { UserProfile } from '../../core/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container mx-auto px-4 py-8 max-w-2xl">
      <h1 class="text-3xl font-bold mb-8" style="font-family: 'Cormorant Garamond', serif">Mi Perfil</h1>

      @if (profile()) {
        <div class="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 mb-6">
          <div class="flex items-center gap-4 mb-6">
            @if (profile()!.pictureUrl) {
              <img [src]="profile()!.pictureUrl" [alt]="profile()!.name"
                   class="w-16 h-16 rounded-full" referrerpolicy="no-referrer" />
            } @else {
              <div class="w-16 h-16 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center text-2xl font-bold">
                {{ profile()!.name.charAt(0).toUpperCase() }}
              </div>
            }
            <div>
              <p class="font-semibold text-lg">{{ profile()!.name }}</p>
              <p class="text-sm text-[var(--color-text-secondary)]">{{ profile()!.email }}</p>
              <p class="text-xs text-[var(--color-text-secondary)] mt-1">
                Conectado con {{ profile()!.providers.join(', ') }}
              </p>
            </div>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSave()" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium mb-1">Nombre</label>
              <input id="name" formControlName="name" type="text"
                     class="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]
                            text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
            </div>
            <div>
              <label for="phone" class="block text-sm font-medium mb-1">Teléfono</label>
              <input id="phone" formControlName="phone" type="tel" placeholder="+54 388 123-4567"
                     class="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]
                            text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
            </div>
            <button type="submit" [disabled]="form.invalid || saving()"
                    class="px-6 py-2.5 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium
                           hover:opacity-90 disabled:opacity-50">
              {{ saving() ? 'Guardando...' : 'Guardar cambios' }}
            </button>
          </form>
        </div>

        <a routerLink="/mis-pedidos"
           class="block bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4
                  hover:bg-[var(--color-surface-hover)] transition-colors">
          <span class="font-medium">📦 Ver mis pedidos →</span>
        </a>
      }
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  protected readonly profile = signal<UserProfile | null>(null);
  protected readonly saving = signal(false);

  protected readonly form = this.fb.group({
    name: ['', Validators.required],
    phone: [''],
  });

  ngOnInit(): void {
    this.auth.getProfile().subscribe({
      next: (p) => {
        this.profile.set(p);
        this.form.patchValue({ name: p.name, phone: p.phone ?? '' });
      },
    });
  }

  protected onSave(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    this.auth.updateProfile({
      name: this.form.value.name!,
      phone: this.form.value.phone ?? '',
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success('Perfil actualizado');
      },
      error: () => this.saving.set(false),
    });
  }
}
