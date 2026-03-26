import { Injectable, signal, computed, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'ssa-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly mode = signal<ThemeMode>(this.loadMode());
  private readonly systemPrefersDark = signal(this.detectSystemTheme());

  readonly resolvedTheme = computed<ResolvedTheme>(() => {
    if (this.mode() !== 'auto') {
      return this.mode() as ResolvedTheme;
    }
    return this.systemPrefersDark() ? 'dark' : 'light';
  });

  readonly isDark = computed(() => this.resolvedTheme() === 'dark');

  readonly icon = computed(() => {
    const icons: Record<ThemeMode, string> = {
      light: '☀️',
      dark: '🌙',
      auto: '🔄',
    };
    return icons[this.mode()];
  });

  readonly label = computed(() => {
    const labels: Record<ThemeMode, string> = {
      light: 'Claro',
      dark: 'Oscuro',
      auto: 'Auto',
    };
    return labels[this.mode()];
  });

  constructor() {
    if (this.isBrowser) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e: MediaQueryListEvent) => {
        this.systemPrefersDark.set(e.matches);
      });

      effect(() => {
        document.documentElement.setAttribute('data-theme', this.resolvedTheme());
      });
    }
  }

  cycleTheme(): void {
    const next: Record<ThemeMode, ThemeMode> = {
      light: 'dark',
      dark: 'auto',
      auto: 'light',
    };
    this.mode.set(next[this.mode()]);
    this.persistMode();
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
    this.persistMode();
  }

  private persistMode(): void {
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY, this.mode());
    }
  }

  private loadMode(): ThemeMode {
    if (!this.isBrowser) {
      return 'auto';
    }
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    return saved ?? 'auto';
  }

  private detectSystemTheme(): boolean {
    if (!this.isBrowser) {
      return false;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
