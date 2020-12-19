import { Injectable, TemplateRef } from '@angular/core';

@Injectable()

export class ToastService {
  toasts: any[] = [];

  public show(textOrTpl: string | TemplateRef<any>, options: any = {}): void {
    this.toasts.push({ textOrTpl, ...options });
  }

  public showSuccess(textOrTpl: string | TemplateRef<any>): void {
    this.show(textOrTpl, { classname: 'bg-success text-white', delay: 5000 });
  }

  public showDanger(textOrTpl: string | TemplateRef<any>): void {
    this.show(textOrTpl, { classname: 'bg-danger text-white', delay: 5000 });
  }

  public remove(toast): void {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
