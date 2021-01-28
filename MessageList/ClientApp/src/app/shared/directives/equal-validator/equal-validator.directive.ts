import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[validateEqual]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => EqualValidatorDirective), multi: true }
  ]
})

  // [errorToTargetControl] is an additional attribute to set errors not to current control, but to target control (which is set to [validateEqual] atribute). So all validate
  // errors will be in one control of 2 or more controls.
  // _isReverse() method returns false if there is no [errorToTargetControl] set for control or it is set to false.

export class EqualValidatorDirective implements Validator {
  // somewhy value of this attributes returns with double ""__"". It looks like  ""string inside validateEqual"". That's why they are substringed.
  constructor(@Attribute('validateEqual') public validateEqual: string, @Attribute('errorToTargetControl') public errorToTargetControl: string) { }

  private get _isReverse(): boolean {
    if (!this.errorToTargetControl) return false;
    return this.errorToTargetControl.substring(1, this.errorToTargetControl.length - 1) === 'true' ? true : false;
  }

  public validate(control: AbstractControl): { [key: string]: any } {
    let validateEqualValue = this.validateEqual.substring(1, this.validateEqual.length - 1);

    let value = control.value;
    let targetControl = control.parent.controls[validateEqualValue];

    if (value !== targetControl?.value && !this._isReverse) {
      return { validateNotEqual: true }
    }
    if (value === targetControl?.value && this._isReverse) {
      delete targetControl?.errors['validateNotEqual'];
      if (!Object.keys(targetControl.errors).length) targetControl.setErrors(null);
    }
    if (value !== targetControl?.value && this._isReverse) {
      targetControl?.setErrors({ validateNotEqual: true })
    }
    return null;
  }
}
