import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with no toasts', () => {
    expect(service.toasts()).toEqual([]);
  });

  it('should add success toast', () => {
    service.success('Item added');
    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].message).toBe('Item added');
    expect(service.toasts()[0].type).toBe('success');
  });

  it('should add error toast', () => {
    service.error('Something failed');
    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].type).toBe('error');
  });

  it('should add info toast', () => {
    service.info('FYI');
    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].type).toBe('info');
  });

  it('should dismiss toast by id', () => {
    service.success('Toast 1');
    service.success('Toast 2');
    const id = service.toasts()[0].id;
    service.dismiss(id);
    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].message).toBe('Toast 2');
  });

  it('should auto-dismiss after 3.5 seconds', fakeAsync(() => {
    service.success('Auto dismiss');
    expect(service.toasts().length).toBe(1);
    tick(3500);
    expect(service.toasts().length).toBe(0);
  }));

  it('should support multiple toasts', () => {
    service.success('One');
    service.error('Two');
    service.info('Three');
    expect(service.toasts().length).toBe(3);
  });
});
