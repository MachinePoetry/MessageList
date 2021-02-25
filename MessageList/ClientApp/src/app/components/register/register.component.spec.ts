import { RegisterComponent } from './register.component';
import { Router } from '@angular/router';
import { NgForm, FormsModule, AbstractControl } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from './../../shared/services/http-service/http.service';
import { ToastService } from './../../shared/services/toast-service/toast.service';
import { RegisterParams } from './../../shared/models/params/registerParams';
import { ResultInfo } from '../../shared/models/resultInfo';
import { ComponentFixture } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({ selector: 'app-toasts', template: '' })
class ToastsContainerComponentStub {
}


describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let ngForm: NgForm, emailControl: AbstractControl, passwordControl: AbstractControl, confirmPasswordControl: AbstractControl, form: HTMLFormElement,
    params: RegisterParams, result: ResultInfo;
  let mockHttpService = { post: jasmine.createSpy('post') };
  let mockRouter = { navigate: jasmine.createSpy('navigate') };
  let mockToastService = { showDanger: jasmine.createSpy('showDanger'), showSuccess: jasmine.createSpy('showSuccess') };
  let mockModalService = { open: jasmine.createSpy('open') };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [RegisterComponent, ToastsContainerComponentStub],
      imports: [FormsModule, NgbModule],
      providers: [
        NgForm,
        { provide: HttpService, useValue: mockHttpService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastService, useValue: mockToastService },
        { provide: NgbModal, useValue: mockModalService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    mockHttpService.post.calls.reset();
    mockRouter.navigate.calls.reset();

    fixture.detectChanges();
    await fixture.whenStable();
    ngForm = component.registerForm;
    emailControl = ngForm.form.controls['email'];
    passwordControl = ngForm.form.controls['password'];
    confirmPasswordControl = ngForm.form.controls['confirmPassword'];
    form = fixture.nativeElement.querySelector('#registerForm');
    params = new RegisterParams();
    result = new ResultInfo();
    mockHttpService.post.and.returnValue(of(result));
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  })

  it('should render \'app-toasts\' component', () => {
    const toastsContainer = fixture.nativeElement.querySelector('app-toasts');
    expect(toastsContainer).toBeTruthy();
  })

  it('should render \'ngb-progressbar\' component', () => {
    const progressBar = fixture.nativeElement.querySelector('ngb-progressbar');
    expect(progressBar).toBeTruthy();
  })

  it('should render register form title', () => {
    const formTitle = fixture.nativeElement.querySelector('h1');
    expect(formTitle.textContent).toBe(' Регистрация ');
  })

  it('should transfer email value from input to model', () => {  // async() removed from here to beforeEach()
    //fixture.whenStable().then(() => {
    let input: HTMLInputElement = fixture.nativeElement.querySelector('#registerEmail');
    input.value = 'email@email.ru';
    input.dispatchEvent(new Event('input'));
    let model: string = component.params.email;
    expect(model).toBe('email@email.ru');
    //});
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

  it('should transfer password value from input to model', () => {
    let input: HTMLInputElement = fixture.nativeElement.querySelector('#registerPassword');
    input.value = 'password';
    input.dispatchEvent(new Event('input'));
    let model: string = component.params.password;
    expect(model).toBe('password');
  })

  it('should have no errors at password model if input was touched and correct password was set', () => {
    passwordControl.setValue('password');
    passwordControl.markAsTouched();
    expect(passwordControl.hasError('required')).toBe(false);
    expect(passwordControl.hasError('pattern')).toBe(false);
  })

  it('should set required error at password model if input was touched and no password was set', () => {
    passwordControl.setValue('');
    passwordControl.markAsTouched();
    expect(passwordControl.hasError('required')).toBe(true);
  })

  it('should set pattern error at passwird model if input was touched and password in wrong format was set', () => {
    passwordControl.setValue('paaaaaassssssswwwwwwooooorrrrrrdddd');
    passwordControl.markAsTouched();
    expect(passwordControl.hasError('pattern')).toBe(true);
  })


  it('should have no errors at password model if form was submitted and correct password was set', () => {
    passwordControl.setValue('password');
    form.dispatchEvent(new Event('submit'));
    expect(passwordControl.hasError('required')).toBe(false);
    expect(passwordControl.hasError('pattern')).toBe(false);
  })

  it('should set required error at password model if form was submitted and empty password string was set', () => {
    passwordControl.setValue('');
    form.dispatchEvent(new Event('submit'));
    expect(passwordControl.hasError('required')).toBe(true);
  })

  it('should set pattern error at password model if form was submitted and incorrect password was set', () => {
    passwordControl.setValue('paaaaaassssssswwwwwwooooorrrrrrdddd');
    form.dispatchEvent(new Event('submit'));
    expect(passwordControl.hasError('pattern')).toBe(true);
  })

  it('should call http post inside \'onSubmit\' method on submit form event when register button was clicked', () => {
    emailControl.setValue('qwerty@q.ru');
    passwordControl.setValue('password');
    confirmPasswordControl.setValue('password');
    let button = fixture.nativeElement.querySelector('#registerButton');
    button.click();
    expect(mockHttpService.post).toHaveBeenCalled();
    expect(mockHttpService.post).toHaveBeenCalledTimes(1);
  })

  it('should call submit method correct times and with correct params on submit form event', () => {
    emailControl.setValue('qwerty@q.ru');
    passwordControl.setValue('password');
    confirmPasswordControl.setValue('password');
    form.dispatchEvent(new Event('submit'));
    expect(mockHttpService.post).toHaveBeenCalled();
    expect(mockHttpService.post).toHaveBeenCalledTimes(1);
    //expect(mockHttpService.post).toHaveBeenCalledWith('/api/account/register', params);
  })

  it('should call submit method on submit form event and submit method should navigate user to \'/main\' route', () => {
    result.status = 'UserCreated';
    emailControl.setValue('qwerty@q.ru');
    passwordControl.setValue('password');
    confirmPasswordControl.setValue('password');
    form.dispatchEvent(new Event('submit'));
    expect(mockRouter.navigate).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/main']);
  })

  it('should call submit method on submit form event and submit method should not navigate user to \'/main\' route', () => {
    result.status = 'UserCreationFailed';
    mockHttpService.post.and.returnValue(of(result));
    emailControl.setValue('qwerty@q.ru');
    passwordControl.setValue('password');
    confirmPasswordControl.setValue('password');
    form.dispatchEvent(new Event('submit'));
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledTimes(0);
  })

  //it('should set password mismatch error at confirm password model if passwords are not equal', () => {
  //  passwordControl.setValue('password');
  //  confirmPasswordControl.setValue('passw');
  //  form.dispatchEvent(new Event('submit'));
  //  passwordControl.markAsTouched();
  //  confirmPasswordControl.markAsTouched();
  //  console.log(passwordControl);
  //  console.log(confirmPasswordControl);
  //  expect(confirmPasswordControl.hasError('validateNotEqual')).toBe(true);
  //})
})
