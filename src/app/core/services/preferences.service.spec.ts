import { TestBed } from '@angular/core/testing';
import { PreferencesService } from './preferences.service';

describe('PreferencesService', () => {
  let service: PreferencesService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreferencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to ARS currency', () => {
    expect(service.currency()).toBe('ARS');
  });

  it('should toggle currency', () => {
    service.toggleCurrency();
    expect(service.currency()).toBe('USD');

    service.toggleCurrency();
    expect(service.currency()).toBe('ARS');
  });

  it('should set currency directly', () => {
    service.setCurrency('USD');
    expect(service.currency()).toBe('USD');
  });

  it('should persist currency to localStorage', () => {
    service.setCurrency('USD');
    expect(localStorage.getItem('ssa-currency')).toBe('USD');
  });

  it('should set exchange rate', () => {
    service.setExchangeRate(1250);
    expect(service.exchangeRate()).toBe(1250);
  });

  it('should return correct currency label', () => {
    expect(service.currencyLabel()).toBe('$');

    service.setCurrency('USD');
    expect(service.currencyLabel()).toBe('US$');
  });

  it('should format price in USD', () => {
    service.setCurrency('USD');
    const formatter = service.formatPrice();
    expect(formatter(1250)).toBe('US$ 1,250.00');
  });

  it('should format price in ARS with exchange rate', () => {
    service.setCurrency('ARS');
    service.setExchangeRate(1250);
    const formatter = service.formatPrice();
    expect(formatter(1000)).toContain('1.250.000');
  });

  it('should convert price correctly', () => {
    service.setExchangeRate(1250);

    service.setCurrency('USD');
    expect(service.convertPrice()(100)).toBe(100);

    service.setCurrency('ARS');
    expect(service.convertPrice()(100)).toBe(125000);
  });
});
