import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to auto mode', () => {
    expect(service.mode()).toBe('auto');
  });

  it('should cycle through themes: auto → light → dark → auto', () => {
    // auto is default (loaded from localStorage which is empty)
    service.setMode('light');
    expect(service.mode()).toBe('light');

    service.cycleTheme();
    expect(service.mode()).toBe('dark');

    service.cycleTheme();
    expect(service.mode()).toBe('auto');

    service.cycleTheme();
    expect(service.mode()).toBe('light');
  });

  it('should resolve theme correctly for non-auto modes', () => {
    service.setMode('light');
    expect(service.resolvedTheme()).toBe('light');

    service.setMode('dark');
    expect(service.resolvedTheme()).toBe('dark');
  });

  it('should compute isDark correctly', () => {
    service.setMode('light');
    expect(service.isDark()).toBe(false);

    service.setMode('dark');
    expect(service.isDark()).toBe(true);
  });

  it('should return correct icon for each mode', () => {
    service.setMode('light');
    expect(service.icon()).toContain('☀');

    service.setMode('dark');
    expect(service.icon()).toContain('🌙');

    service.setMode('auto');
    expect(service.icon()).toContain('🔄');
  });

  it('should return correct label for each mode', () => {
    service.setMode('light');
    expect(service.label()).toBe('Claro');

    service.setMode('dark');
    expect(service.label()).toBe('Oscuro');

    service.setMode('auto');
    expect(service.label()).toBe('Auto');
  });

  it('should persist mode to localStorage', () => {
    service.setMode('dark');
    expect(localStorage.getItem('ssa-theme')).toBe('dark');
  });
});
