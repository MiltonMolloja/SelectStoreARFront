import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { AuthUser, UserProfile } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly user = signal<AuthUser | null>(null);
  readonly isAuthenticated = computed(() => this.user() !== null);
  readonly isAdmin = computed(() => this.user()?.role === 'admin');
  readonly userName = computed(() => this.user()?.name ?? '');
  readonly userInitial = computed(() => this.userName().charAt(0).toUpperCase());

  /** Call on app init to check if user has valid session cookie */
  checkAuth(): void {
    if (!this.isBrowser) return;
    this.http.get<AuthUser>(`${environment.apiUrl}/auth/me`).pipe(
      catchError(() => of(null)),
    ).subscribe(user => this.user.set(user));
  }

  loginWithGoogle(): void {
    if (this.isBrowser) {
      window.location.href = `${environment.apiUrl}/auth/google`;
    }
  }

  loginWithFacebook(): void {
    if (this.isBrowser) {
      window.location.href = `${environment.apiUrl}/auth/facebook`;
    }
  }

  logout(): void {
    this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe({
      next: () => {
        this.user.set(null);
        this.router.navigate(['/']);
      },
      error: () => {
        this.user.set(null);
        this.router.navigate(['/']);
      },
    });
  }

  getProfile() {
    return this.http.get<UserProfile>(`${environment.apiUrl}/user/profile`);
  }

  updateProfile(data: { name: string; phone: string }) {
    return this.http.put<{ name: string; phone: string }>(`${environment.apiUrl}/user/profile`, data).pipe(
      tap(() => {
        const current = this.user();
        if (current) {
          this.user.set({ ...current, name: data.name, phone: data.phone });
        }
      }),
    );
  }
}
