import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FocusDirective } from './focus.directive';

@Component({
  template: '<div><input type="text" id="testInput" focus></div>'
})

export class TestFocusComponent { }

describe('FocusDirective', () => {
  let container, fixture;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestFocusComponent, FocusDirective],
    });
    fixture = TestBed.createComponent(TestFocusComponent);
    container = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the Focus directive', () => {
    let directive = new FocusDirective(fixture);
    expect(directive).toBeTruthy();
  });

  it('should give focus to parent component after component was created', () => {
    let input = fixture.nativeElement.querySelector('input');
    let focusedInput = fixture.nativeElement.querySelector(':focus');
    fixture.detectChanges();
    expect(focusedInput).toBe(input);
  });
});
