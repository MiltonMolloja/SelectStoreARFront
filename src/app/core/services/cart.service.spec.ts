import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  const mockProduct = {
    id: 'prod-1',
    name: 'Samsung Galaxy S26',
    slug: 'samsung-galaxy-s26',
    imageUrl: '/img/samsung.webp',
    finalPriceUsd: 1250,
  };

  const mockProduct2 = {
    id: 'prod-2',
    name: 'AirPods Pro 3',
    slug: 'airpods-pro-3',
    imageUrl: '/img/airpods.webp',
    finalPriceUsd: 249,
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty cart', () => {
    expect(service.items()).toEqual([]);
    expect(service.itemCount()).toBe(0);
    expect(service.totalUsd()).toBe(0);
    expect(service.isEmpty()).toBe(true);
  });

  it('should add item to cart', () => {
    service.addItem(mockProduct);
    expect(service.items().length).toBe(1);
    expect(service.items()[0].productId).toBe('prod-1');
    expect(service.items()[0].quantity).toBe(1);
    expect(service.itemCount()).toBe(1);
    expect(service.isEmpty()).toBe(false);
  });

  it('should increment quantity when adding same product', () => {
    service.addItem(mockProduct);
    service.addItem(mockProduct);
    expect(service.items().length).toBe(1);
    expect(service.items()[0].quantity).toBe(2);
    expect(service.itemCount()).toBe(2);
  });

  it('should calculate total correctly', () => {
    service.addItem(mockProduct);
    service.addItem(mockProduct2);
    service.addItem(mockProduct2);
    // 1250 + 249*2 = 1748
    expect(service.totalUsd()).toBe(1748);
  });

  it('should update quantity', () => {
    service.addItem(mockProduct);
    service.updateQuantity('prod-1', 5);
    expect(service.items()[0].quantity).toBe(5);
    expect(service.itemCount()).toBe(5);
  });

  it('should remove item when quantity set to 0', () => {
    service.addItem(mockProduct);
    service.updateQuantity('prod-1', 0);
    expect(service.items().length).toBe(0);
    expect(service.isEmpty()).toBe(true);
  });

  it('should remove specific item', () => {
    service.addItem(mockProduct);
    service.addItem(mockProduct2);
    service.removeItem('prod-1');
    expect(service.items().length).toBe(1);
    expect(service.items()[0].productId).toBe('prod-2');
  });

  it('should clear all items', () => {
    service.addItem(mockProduct);
    service.addItem(mockProduct2);
    service.clear();
    expect(service.items()).toEqual([]);
    expect(service.isEmpty()).toBe(true);
  });

  it('should persist to localStorage', () => {
    service.addItem(mockProduct);
    const stored = JSON.parse(localStorage.getItem('ssa-cart') ?? '[]');
    expect(stored.length).toBe(1);
    expect(stored[0].productId).toBe('prod-1');
  });
});
