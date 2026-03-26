import { TestBed } from '@angular/core/testing';
import { PricePipe } from './price.pipe';
import { PreferencesService } from '../../core/services/preferences.service';

describe('PricePipe', () => {
  let pipe: PricePipe;
  let prefs: PreferencesService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [PricePipe],
    });
    pipe = TestBed.inject(PricePipe);
    prefs = TestBed.inject(PreferencesService);
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format price in USD', () => {
    prefs.setCurrency('USD');
    const result = pipe.transform(1250);
    expect(result).toContain('1,250.00');
    expect(result).toContain('US$');
  });

  it('should format price in ARS', () => {
    prefs.setCurrency('ARS');
    prefs.setExchangeRate(1250);
    const result = pipe.transform(1000);
    expect(result).toContain('$');
    expect(result).toContain('1.250.000');
  });

  it('should handle zero price', () => {
    prefs.setCurrency('USD');
    const result = pipe.transform(0);
    expect(result).toContain('0.00');
  });
});
