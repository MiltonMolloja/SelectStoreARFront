import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth-success',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-[70vh] flex items-center justify-center">
      <div class="text-center">
        <p class="text-4xl mb-4">✅</p>
        <h1 class="text-xl font-bold mb-2">¡Sesión iniciada!</h1>
        <p class="text-[var(--color-text-secondary)]">Redirigiendo...</p>
      </div>
    </div>
  `,
})
export class AuthSuccessComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.auth.checkAuth();
    setTimeout(() => this.router.navigate(['/']), 1500);
  }
}
