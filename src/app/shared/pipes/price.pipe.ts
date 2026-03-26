import { Pipe, PipeTransform, inject } from '@angular/core';
import { PreferencesService } from '../../core/services/preferences.service';

@Pipe({ name: 'price', standalone: true })
export class PricePipe implements PipeTransform {
  private readonly prefs = inject(PreferencesService);

  transform(priceUsd: number): string {
    return this.prefs.formatPrice()(priceUsd);
  }
}
