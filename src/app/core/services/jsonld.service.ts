import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { ProductDetail } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class JsonLdService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  setProduct(product: ProductDetail): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images.map(i => `${environment.siteUrl}${i.original}`),
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      offers: {
        '@type': 'Offer',
        url: `${environment.siteUrl}/producto/${product.slug}`,
        priceCurrency: 'USD',
        price: product.finalPriceUsd.toFixed(2),
        availability: product.availability === 'available'
          ? 'https://schema.org/PreOrder'
          : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'SelectStoreAR',
        },
      },
      category: product.category.name,
    };

    this.setJsonLd(jsonLd);
  }

  setOrganization(): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'SelectStoreAR',
      url: environment.siteUrl,
      logo: `${environment.siteUrl}/favicon.ico`,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: `+${environment.whatsappPhone}`,
        contactType: 'customer service',
        availableLanguage: 'Spanish',
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'San Salvador de Jujuy',
        addressRegion: 'Jujuy',
        addressCountry: 'AR',
      },
    };

    this.setJsonLd(jsonLd);
  }

  removeJsonLd(): void {
    const existing = this.document.getElementById('json-ld');
    if (existing) existing.remove();
  }

  private setJsonLd(data: object): void {
    this.removeJsonLd();
    const script = this.document.createElement('script');
    script.id = 'json-ld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    this.document.head.appendChild(script);
  }
}
