import { Directive, AfterViewInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[focus]'
})

export class FocusDirective implements AfterViewInit {
  constructor(private _elementRef: ElementRef) { };

  ngAfterViewInit(): void {
    this._elementRef.nativeElement.focus();
  }
}
