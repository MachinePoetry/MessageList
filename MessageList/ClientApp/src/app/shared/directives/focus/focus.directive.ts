import { Directive, AfterViewInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[focus]'
})
export class FocusDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) { };

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.focus();
  }

}
