import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService]
    });
    service = TestBed.get(ToastService);
    service.toasts = [];
  });

  it('should create the Toast service', () => {
    expect(service).toBeTruthy();
  });

  it('should push toast with options to toasts array', () => {
    service.show('<span> toast template </span>', { classname: 'bg-success text-white', delay: 5000 });
    expect(service.toasts[0]).toEqual({ textOrTpl: "<span> toast template </span>", classname: 'bg-success text-white', delay: 5000 });
  });

  it('should push success toast to toasts array', () => {
    service.showSuccess('<span> toast template </span>');
    expect(service.toasts[0]).toEqual({ textOrTpl: '<span> toast template </span>', classname: 'bg-success text-white', delay: 5000 });
  });

  it('should push danger toast to toasts array', () => {
    service.showDanger('<span> toast template </span>');
    expect(service.toasts[0]).toEqual({ textOrTpl: '<span> toast template </span>', classname: 'bg-danger text-white', delay: 5000 });
  });

  it('should delete toast from toasts array', () => {
    let toast = { textOrTpl: '<span> toast template </span>', classname: 'bg-success text-white', delay: 5000 };
    service.toasts = [toast];
    service.remove(toast);
    expect(service.toasts.length).toBe(0);
  });
});
