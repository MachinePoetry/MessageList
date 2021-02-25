import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangePasswordComponent } from './change-password.component';
import { NgForm, FormsModule, AbstractControl } from '@angular/forms';
import { of } from 'rxjs';
import { HttpService } from './../../shared/services/http-service/http.service';
import { ChangePasswordMode } from './../../shared/models/componentModes/changePasswordMode';
import { ResultInfo } from '../../shared/models/resultInfo';
import { ChangePasswordParams } from './../../shared/models/params/changePasswordParams';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  const changePasswordMode = ChangePasswordMode;
  let ngForm: NgForm, oldPasswordControl: AbstractControl, newPasswordControl: AbstractControl, confirmNewPasswordControl: AbstractControl, form: HTMLFormElement,
      params: ChangePasswordParams, result: ResultInfo;
  let mockHttpService = { post: jasmine.createSpy('post') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ChangePasswordComponent],
      providers: [
        NgForm,
        { provide: HttpService, useValue: mockHttpService },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    mockHttpService.post.calls.reset();
    component.mode = changePasswordMode.profile;

    fixture.detectChanges();
    await fixture.whenStable();

    ngForm = component.changePasswordForm;
    oldPasswordControl = ngForm.form.controls['oldPassword'];
    newPasswordControl = ngForm.form.controls['newPassword'];
    confirmNewPasswordControl = ngForm.form.controls['confirmNewPassword'];
    form = fixture.nativeElement.querySelector('#changePasswordForm');
    params = new ChangePasswordParams();
    result = new ResultInfo();
    mockHttpService.post.and.returnValue(of(result));
  });

  it('should create the ChangePassword component', () => {
    expect(component).toBeTruthy();
  });

  it('should render change password form', () => {
    const form = fixture.nativeElement.querySelector('#changePasswordForm');
    expect(form).toBeTruthy();
  })

  it('should render \'old password\' input if mode is profile', () => {
    const input = fixture.nativeElement.querySelector('#oldPassword');
    expect(input).toBeTruthy();
  })

  it('should not render \'old password\' input if mode is restore', () => {
    component.mode = changePasswordMode.restore;
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('#oldPassword');
    expect(input).toBeFalsy();
  })

  it('should transfer old password value from input to model', () => {
    let input: HTMLInputElement = fixture.nativeElement.querySelector('#oldPassword');
    input.value = 'password';
    input.dispatchEvent(new Event('input'));
    let model: string = component.changePasswordParams.oldPassword;
    expect(model).toBe('password');
  })

  it('should have no errors at old password model if input was touched and correct password was set', () => {
    oldPasswordControl.setValue('password');
    oldPasswordControl.markAsTouched();
    expect(oldPasswordControl.hasError('required')).toBe(false);
    expect(oldPasswordControl.hasError('pattern')).toBe(false);
  })

  it('should set required error at old password model if input was touched and no password was set', () => {
    oldPasswordControl.setValue('');
    oldPasswordControl.markAsTouched();
    expect(oldPasswordControl.hasError('required')).toBe(true);
  })

  it('should set pattern error at old password model if input was touched and password in wrong format was set', () => {
    oldPasswordControl.setValue('paaaaaassssssswwwwwwooooorrrrrrdddd');
    oldPasswordControl.markAsTouched();
    expect(oldPasswordControl.hasError('pattern')).toBe(true);
  })

  it('should have no errors at old password model if form was submitted and correct password was set', () => {
    oldPasswordControl.setValue('password');
    form.dispatchEvent(new Event('submit'));
    expect(oldPasswordControl.hasError('required')).toBe(false);
    expect(oldPasswordControl.hasError('pattern')).toBe(false);
  })

  it('should set required error at old password model if form was submitted and empty password string was set', () => {
    oldPasswordControl.setValue('');
    form.dispatchEvent(new Event('submit'));
    expect(oldPasswordControl.hasError('required')).toBe(true);
  })

  it('should set pattern error at old password model if form was submitted and incorrect password was set', () => {
    oldPasswordControl.setValue('paaaaaassssssswwwwwwooooorrrrrrdddd');
    form.dispatchEvent(new Event('submit'));
    expect(oldPasswordControl.hasError('pattern')).toBe(true);
  })

  it('should transfer new password value from input to model', () => {
    let input: HTMLInputElement = fixture.nativeElement.querySelector('#newPassword');
    input.value = 'password';
    input.dispatchEvent(new Event('input'));
    let model: string = component.changePasswordParams.newPassword;
    expect(model).toBe('password');
  })

  it('should have no errors at new password model if input was touched and correct password was set', () => {
    newPasswordControl.setValue('password');
    newPasswordControl.markAsTouched();
    expect(newPasswordControl.hasError('required')).toBe(false);
    expect(newPasswordControl.hasError('pattern')).toBe(false);
  })

  it('should set required error at new password model if input was touched and no password was set', () => {
    newPasswordControl.setValue('');
    newPasswordControl.markAsTouched();
    expect(newPasswordControl.hasError('required')).toBe(true);
  })

  it('should set pattern error at new password model if input was touched and password in wrong format was set', () => {
    newPasswordControl.setValue('paaaaaassssssswwwwwwooooorrrrrrdddd');
    newPasswordControl.markAsTouched();
    expect(newPasswordControl.hasError('pattern')).toBe(true);
  })

  it('should have no errors at new password model if form was submitted and correct password was set', () => {
    newPasswordControl.setValue('password');
    form.dispatchEvent(new Event('submit'));
    expect(newPasswordControl.hasError('required')).toBe(false);
    expect(newPasswordControl.hasError('pattern')).toBe(false);
  })

  it('should set required error at new password model if form was submitted and empty password string was set', () => {
    newPasswordControl.setValue('');
    form.dispatchEvent(new Event('submit'));
    expect(newPasswordControl.hasError('required')).toBe(true);
  })

  it('should set pattern error at new password model if form was submitted and incorrect password was set', () => {
    newPasswordControl.setValue('paaaaaassssssswwwwwwooooorrrrrrdddd');
    form.dispatchEvent(new Event('submit'));
    expect(newPasswordControl.hasError('pattern')).toBe(true);
  })

  it('should transfer confirm new password value from input to model', () => {
    let input: HTMLInputElement = fixture.nativeElement.querySelector('#confirmNewPassword');
    input.value = 'password';
    input.dispatchEvent(new Event('input'));
    let model: string = component.changePasswordParams.confirmNewPassword;
    expect(model).toBe('password');
  })

  it('should have no errors at confirm new password model if input was touched and correct password was set', () => {
    confirmNewPasswordControl.setValue('password');
    confirmNewPasswordControl.markAsTouched();
    expect(confirmNewPasswordControl.hasError('required')).toBe(false);
    expect(confirmNewPasswordControl.hasError('pattern')).toBe(false);
  })

  it('should set required error at confirm new password model if input was touched and no password was set', () => {
    confirmNewPasswordControl.setValue('');
    confirmNewPasswordControl.markAsTouched();
    expect(confirmNewPasswordControl.hasError('required')).toBe(true);
  })

  it('should set pattern error at confirm new password model if input was touched and password in wrong format was set', () => {
    confirmNewPasswordControl.setValue('paaaaaassssssswwwwwwooooorrrrrrdddd');
    confirmNewPasswordControl.markAsTouched();
    expect(confirmNewPasswordControl.hasError('pattern')).toBe(true);
  })

  it('should have no errors at confirm new password model if form was submitted and correct password was set', () => {
    confirmNewPasswordControl.setValue('password');
    form.dispatchEvent(new Event('submit'));
    expect(confirmNewPasswordControl.hasError('required')).toBe(false);
    expect(confirmNewPasswordControl.hasError('pattern')).toBe(false);
  })

  it('should set required error at confirm new password model if form was submitted and empty password string was set', () => {
    confirmNewPasswordControl.setValue('');
    form.dispatchEvent(new Event('submit'));
    expect(confirmNewPasswordControl.hasError('required')).toBe(true);
  })

  it('should set pattern error at confirm new password model if form was submitted and incorrect password was set', () => {
    confirmNewPasswordControl.setValue('paaaaaassssssswwwwwwooooorrrrrrdddd');
    form.dispatchEvent(new Event('submit'));
    expect(confirmNewPasswordControl.hasError('pattern')).toBe(true);
  })

  it('should call http post inside \'onSubmit\' method on submit form event when submit button was clicked', () => {
    oldPasswordControl.setValue('password');
    newPasswordControl.setValue('new password');
    confirmNewPasswordControl.setValue('new password');
    let button = fixture.nativeElement.querySelector('#changePasswordFormButton');
    button.click();
    expect(mockHttpService.post).toHaveBeenCalled();
    expect(mockHttpService.post).toHaveBeenCalledTimes(1);
  })
});
