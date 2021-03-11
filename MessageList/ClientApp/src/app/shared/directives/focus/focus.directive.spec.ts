import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FocusDirective } from './focus.directive';

@Component({
  template: '<div><input type="text" id="testInput" focus></div>'
})

export class TestFocusComponent { }

describe('FocusDirective', () => {
  let component, fixture;
  beforeEach(async() => {
    TestBed.configureTestingModule({
      declarations: [TestFocusComponent, FocusDirective],
    });
    fixture = TestBed.createComponent(TestFocusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create the Focus directive', () => {
    let directive = new FocusDirective(fixture);
    expect(directive).toBeTruthy();
  });

  // test below is flaky
  //it('should give focus to parent component after component was created', () => {
  //  let input: HTMLInputElement = fixture.nativeElement.querySelector('input');
  //  let focusedInput: HTMLInputElement = fixture.nativeElement.querySelector(':focus');
  //  fixture.detectChanges();
  //  expect(focusedInput).toBe(input);
  //});

  it('should give focus to parent component after component was created', () => {
    expect(document.activeElement.tagName).toBe('INPUT');
  });
});
