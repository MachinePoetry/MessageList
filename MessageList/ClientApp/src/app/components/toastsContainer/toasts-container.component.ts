import { Component, TemplateRef } from '@angular/core';
import { ToastService } from './../../shared/services/toastService/toast.service';

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts-container.component.html',
  styleUrls: ['./toasts-container.component.css']
})

export class ToastsContainerComponent {
  constructor(public toastService: ToastService) { }

  public isTemplate(toast): boolean { return toast.textOrTpl instanceof TemplateRef; }
}
