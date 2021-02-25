import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestorePasswordComponent } from './restore-password.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgForm, FormsModule, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { User } from './../../shared/models/user';
import { HttpService } from './../../shared/services/http-service/http.service';
import { ToastService } from './../../shared/services/toast-service/toast.service';
import { ResultInfo } from '../../shared/models/resultInfo';
import { ValidateKeyParams } from './../../shared/models/params/validateKeyParams';
import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({ selector: 'app-toasts', template: '' })
class ToastsContainerComponentStub {
}

@Component({ selector: 'change-password', template: '' })
class ChangePasswordComponentStub {
  @Input() public authUserInfo: any;
  @Input() public mode: any;
}


describe('RestorePasswordComponent', () => {
  let component: RestorePasswordComponent;
  let fixture: ComponentFixture<RestorePasswordComponent>;
  let ngForm: NgForm, emailControl: AbstractControl, keyControl: AbstractControl, form: HTMLFormElement, params: ValidateKeyParams, user: User, result: ResultInfo;
  let mockHttpService = { post: jasmine.createSpy('post') };
  let mockRouter = { navigate: jasmine.createSpy('navigate') };
  let mockToastService = { showDanger: jasmine.createSpy('showDanger'), showSuccess: jasmine.createSpy('showSuccess') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, NgbModule],
      declarations: [RestorePasswordComponent, ChangePasswordComponentStub, ToastsContainerComponentStub],
      providers: [
        NgForm,
        { provide: HttpService, useValue: mockHttpService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastService, useValue: mockToastService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RestorePasswordComponent);
    component = fixture.componentInstance;
    mockHttpService.post.calls.reset();

    fixture.detectChanges();
    await fixture.whenStable();

    component.step = 1;
    ngForm = component.validateKeyForm;
    emailControl = ngForm.form.controls['email'];
    keyControl = ngForm.form.controls['key'];
    form = fixture.nativeElement.querySelector('#validateKeyForm');
    params = new ValidateKeyParams();
    user = new User();
    user.email = 'qwerty@qwerty.com';
    result = new ResultInfo();
    result.status = 'Invalid key';
    result.info = 'Invalid key';
    mockHttpService.post.and.returnValue(of(result));
  });

  it('should create the RestorePassword component', () => {
    expect(component).toBeTruthy();
  });

  it('should render \'app-toasts\' component', () => {
    const toastsContainer = fixture.nativeElement.querySelector('app-toasts');
    expect(toastsContainer).toBeTruthy();
  })

  it('should render \'ngb-progressbar\' component', () => {
    const progressBar = fixture.nativeElement.querySelector('ngb-progressbar');
    expect(progressBar).toBeTruthy();
  })

  it('should render wrapper (component container div)', () => {
    const wrapper = fixture.nativeElement.querySelector('#wrapper');
    expect(wrapper).toBeTruthy();
  })

  it('should render component title', () => {
    const title = fixture.nativeElement.querySelector('h3');
    expect(title.textContent).toBe(' Восстановление пароля: ');
  })

  it('should render validate key form after opening the component', () => {
    const form = fixture.nativeElement.querySelector('#validateKeyForm');
    expect(form).toBeTruthy();
  })

  it('should transfer email value from input to model', () => {
    let input: HTMLInputElement = fixture.nativeElement.querySelector('#email');
    input.value = 'email@email.ru';
    input.dispatchEvent(new Event('input'));
    let model: string = component.validateKeyParams.email;
    expect(model).toBe('email@email.ru');
  })

  it('should have no errors at email model if input was touched and correct email was set', () => {
    emailControl.setValue('qwerty@q.ru');
    emailControl.markAsTouched();
    expect(emailControl.hasError('required')).toBe(false);
    expect(emailControl.hasError('pattern')).toBe(false);
  })

  it('should set required error at email model if input was touched and no email was set', () => {
    emailControl.setValue('');
    emailControl.markAsTouched();
    expect(emailControl.hasError('required')).toBe(true);
  })

  it('should set pattern error at email model if input was touched and email in wrong format was set', () => {
    emailControl.setValue('q@q');
    emailControl.markAsTouched();
    expect(emailControl.hasError('pattern')).toBe(true);
  })

  it('should have no errors at email model if form was submitted and correct email was set', () => {
    emailControl.setValue('qwerty@q.ru');
    form.dispatchEvent(new Event('submit'));
    expect(emailControl.hasError('required')).toBe(false);
    expect(emailControl.hasError('pattern')).toBe(false);
  })

  it('should set required error at email model if form was submitted and empty email string was set', () => {
    emailControl.setValue('');
    form.dispatchEvent(new Event('submit'));
    expect(emailControl.hasError('required')).toBe(true);
  })

  it('should set pattern error at email model if form was submitted and incorrect email was set', () => {
    emailControl.setValue('q@q');
    form.dispatchEvent(new Event('submit'));
    expect(emailControl.hasError('pattern')).toBe(true);
  })

  it('should transfer key value from input to model', () => {
    let input: HTMLInputElement = fixture.nativeElement.querySelector('#key');
    input.value = 'change password key';
    input.dispatchEvent(new Event('input'));
    let model: string = component.validateKeyParams.key;
    expect(model).toBe('change password key');
  })

  it('should have no errors at key model if input was touched and correct key was set', () => {
    keyControl.setValue('change password key');
    keyControl.markAsTouched();
    expect(keyControl.hasError('required')).toBe(false);
    expect(keyControl.hasError('pattern')).toBe(false);
  })

  it('should set required error at key model if input was touched and no key was set', () => {
    keyControl.setValue('');
    keyControl.markAsTouched();
    expect(keyControl.hasError('required')).toBe(true);
  })

  it('should set pattern error at key model if input was touched and key in wrong format was set', () => {
    keyControl.setValue('change password key change password key change password key');
    keyControl.markAsTouched();
    expect(keyControl.hasError('pattern')).toBe(true);
  })

  it('should have no errors at key model if form was submitted and correct key was set', () => {
    keyControl.setValue('change password key');
    form.dispatchEvent(new Event('submit'));
    expect(keyControl.hasError('required')).toBe(false);
    expect(keyControl.hasError('pattern')).toBe(false);
  })

  it('should set required error at key model if form was submitted and empty key string was set', () => {
    keyControl.setValue('');
    form.dispatchEvent(new Event('submit'));
    expect(keyControl.hasError('required')).toBe(true);
  })

  it('should set pattern error at key model if form was submitted and incorrect key was set', () => {
    keyControl.setValue('change password key change password key change password key');
    form.dispatchEvent(new Event('submit'));
    expect(keyControl.hasError('pattern')).toBe(true);
  })

  it('should call http post inside \'onSubmit\' method on submit form event when \'Next\' button was clicked', () => {
    emailControl.setValue('qwerty@q.ru');
    keyControl.setValue('key');
    let button = fixture.nativeElement.querySelector('#validateKeyFormButton');
    button.click();
    expect(mockHttpService.post).toHaveBeenCalled();
    expect(mockHttpService.post).toHaveBeenCalledTimes(1);
  })

  it('should call submit method on submit form event and submit method should change step variable to 2 value', () => {
    mockHttpService.post.and.returnValue(of(user));
    emailControl.setValue('qwerty@q.ru');
    keyControl.setValue('key');
    form.dispatchEvent(new Event('submit'));
    expect(component.step).toBe(2);
  })

  //it('should not show toast danger if user key is valid', () => {
  //  mockHttpService.post.and.returnValue(of(user));
  //  emailControl.setValue('qwerty@q.ru');
  //  keyControl.setValue('key');
  //  form.dispatchEvent(new Event('submit'));
  //  expect(mockToastService.showDanger).not.toHaveBeenCalled();
  //})

  it('should call submit method on submit form event and submit method should not change step variable to 2 value', () => {
    emailControl.setValue('qwerty@q.ru');
    keyControl.setValue('key');
    form.dispatchEvent(new Event('submit'));
    expect(component.step).toBe(1);
  })

  it('should show toast danger if user key is invalid', () => {
    emailControl.setValue('qwerty@q.ru');
    keyControl.setValue('key');
    form.dispatchEvent(new Event('submit'));
    expect(mockToastService.showDanger).toHaveBeenCalled();
  })

  it('should destroy change key form when step variable equals 2', () => {
    component.step = 2;
    fixture.detectChanges();
    const validateKeyForm = fixture.nativeElement.querySelector('#validateKeyForm');
    expect(validateKeyForm).toBeFalsy();
  })
});
