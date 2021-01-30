import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EqualValidatorDirective } from './equal-validator.directive';

@Component({
  template: '<div>' +
              '<input type="text" id="inputWithControls" validateEqual=”inputWithError” errorToTargetControl=”true”>' +
              '<input type="text" id="inputToValidate" validateEqual=”password”>' +
            '</div>'
})

export class TestEqualValidatorComponent { }

describe('EqualValidatorDirective', () => {
  let container, fixture;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestEqualValidatorComponent, EqualValidatorDirective],
    });
    fixture = TestBed.createComponent(TestEqualValidatorComponent);
    container = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the EqualValidator directive', () => {
    let directive = new EqualValidatorDirective('inputWithError', 'true');
    expect(directive).toBeTruthy();
  });

  //it('should return error in inputWithControls with false \'errorToTargetControl\' attribute', () => {
  //  let input = fixture.nativeElement.querySelector('#inputWithControls');
  //  input.value = 'password';
  //  let inputWithError = fixture.nativeElement.querySelector('#inputToValidate');
  //  inputWithError.value = 'pass';
  //  console.log(Object.keys(input));
  //  expect(focusedInput).toBe(input);
  //});
});

