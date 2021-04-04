import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Pipe, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { ProfileComponent } from './profile.component';
import { HeaderComponent } from './../header/header.component';
import { ChangePasswordComponent } from './../change-password/change-password.component';
import { ToastsContainerComponent } from './../toasts-container/toasts-container.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from './../../shared/services/http-service/http.service';
import { ToastService } from './../../shared/services/toast-service/toast.service';
import { User } from '../../shared/models/user';
import { ResultInfo } from './../../shared/models/resultInfo';

@Pipe({ name: 'dateToLocale' })
class DateToLocalePipeStub {
  public transform() { return '01.01.1970, 00:00:00' };
}

@Pipe({ name: 'secondsToTime' })
class SecondsToTimePipeStub {
  public transform() { return '00d:00h:00m:00sec' };
}


describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let user: User, result: ResultInfo, messagesToLoadForm: HTMLFormElement, messagesToLoadAmountInput: HTMLInputElement, changeKeyForm: HTMLFormElement, changeKeyInput: HTMLInputElement;
  let mockActivatedRoute = { snapshot: { data: { user: { id: 1 } } } };
  let mockHttpService = { post: jasmine.createSpy('post'), get: jasmine.createSpy('get') };
  let mockToastService = { showDanger: jasmine.createSpy('showDanger'), showSuccess: jasmine.createSpy('showSuccess') };
  let mockRouter = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, NgbModule],
      declarations: [ProfileComponent, HeaderComponent, ChangePasswordComponent, ToastsContainerComponent, DateToLocalePipeStub, SecondsToTimePipeStub],
      providers: [
        NgForm,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: HttpService, useValue: mockHttpService },
        { provide: ToastService, useValue: mockToastService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;

    messagesToLoadForm = fixture.nativeElement.querySelector('#messagesToLoadForm');
    messagesToLoadAmountInput = fixture.nativeElement.querySelector('#messagesToLoadAmount');
    messagesToLoadAmountInput.value = '30';
    component.messagesToLoadAmount = 30;
    changeKeyForm = fixture.nativeElement.querySelector('#changeKeyForm');
    changeKeyInput = fixture.nativeElement.querySelector('#changePasswordKey');
    changeKeyInput.value = '123';
    component.keyForPasswordChange = '123';
    user = new User();
    user.email = 'some@mail.com';
    user.createdAt = '1970-01-01T00:00:00.294611';
    user.messagesToLoadAmount = 22;
    user.roles = ['User', 'Administrator'];
    component.authUserInfo = user;
    result = new ResultInfo();
    result.status = 'AmountOfLoadedMessagesChanged';
    result.info = 'Success info';
    mockHttpService.post.and.returnValue(of(result));
    mockHttpService.get.and.returnValue(of(0));
    component.ngOnInit();
    component.ngAfterViewInit();

    fixture.detectChanges();

    mockHttpService.get.calls.reset();
    mockHttpService.post.calls.reset();
    mockToastService.showSuccess.calls.reset();
    mockToastService.showDanger.calls.reset();
  });

  it('should create the Profile component', () => {
    expect(component).toBeTruthy();
  })

  it('should render <noscript>', () => {
    let header: HTMLDivElement = fixture.nativeElement.querySelectorAll('noscript');
    expect(header).toBeTruthy();
  })

  it('should render header component', () => {
    let header: HTMLDivElement = fixture.nativeElement.querySelectorAll('app-header');
    expect(header).toBeTruthy();
  })

  it('should render page container', () => {
    let header: HTMLDivElement = fixture.nativeElement.querySelectorAll('.container-fluid');
    expect(header).toBeTruthy();
  })

  it('should render toasts container', () => {
    let toastsContainer: HTMLDivElement = fixture.nativeElement.querySelectorAll('app-toasts');
    expect(toastsContainer).toBeTruthy();
  })

  it('should render progress bar', () => {
    let pBar: HTMLDivElement = fixture.nativeElement.querySelectorAll('ngb-progressbar');
    expect(pBar).toBeTruthy();
  })

  it('should render server uptime', () => {
    let serverUptime: HTMLDivElement = fixture.nativeElement.querySelector('#serverUptime');
    expect(serverUptime).toBeTruthy();
    expect(serverUptime.textContent).toBe(' 00d:00h:00m:00sec ');
  })

  it('should render user email start value', () => {
    let email: HTMLDivElement = fixture.nativeElement.querySelector('#authUserEmail');
    expect(email).toBeTruthy();
    expect(email.textContent).toBe(' Загрузка... ');
  })

  //it('should render user email changed value', () => {
  //  fixture.detectChanges();
  //  let email: HTMLDivElement = fixture.nativeElement.querySelector('#authUserEmail');
  //  expect(email).toBeTruthy();
  //  expect(email.textContent).toBe(' some@mail.com ');
  //})

  it('should render user creation date changed value', () => {
    fixture.detectChanges();
    let createdAt: HTMLDivElement = fixture.nativeElement.querySelector('#userCreatedAt');
    expect(createdAt).toBeTruthy();
    expect(createdAt.textContent).toBe(' 01.01.1970, 00:00:00 ');
  })

  it('should render amount of messages, that user wants to load once', () => {
    component.authUserInfo.messagesToLoadAmount = 50;
    fixture.detectChanges();
    let messagesAmount: HTMLElement = fixture.nativeElement.querySelector('#messagesAmount');
    expect(messagesAmount).toBeTruthy();
    expect(messagesAmount.textContent).toBe(' 50 ');
  })

  it('should render \'All\' if user wants to load all messages once', () => {
    component.authUserInfo.messagesToLoadAmount = 0;
    fixture.detectChanges();
    let messagesAmount: HTMLElement = fixture.nativeElement.querySelector('#messagesAmount');
    expect(messagesAmount).toBeTruthy();
    expect(messagesAmount.textContent).toBe(' Все ');
  })

  //it('should render \'Not set\' if user restore password key is not set', () => {
  //  let restorePasswordKey: HTMLElement = fixture.nativeElement.querySelector('#isChangePasswordKeySet');
  //  expect(restorePasswordKey).toBeTruthy();
  //  expect(restorePasswordKey.textContent).toBe(' Не задан ');
  //})

  it('should render \'Key set\' if user created restore password key', () => {
    component.authUserInfo.isChangePasswordKeySet = true;
    fixture.detectChanges();
    let restorePasswordKey: HTMLElement = fixture.nativeElement.querySelector('#isChangePasswordKeySet');
    expect(restorePasswordKey).toBeTruthy();
    expect(restorePasswordKey.textContent).toBe(' Задан ');
  })

  it('should render Change password component', () => {
    let restorePasswordKey: HTMLElement = fixture.nativeElement.querySelector('change-password');
    expect(restorePasswordKey).toBeTruthy();
  })

  it('should have no errors at messages to load change input if form was submitted and correct amount was set', () => {
    messagesToLoadAmountInput.value = '22';
    messagesToLoadForm.dispatchEvent(new Event('submit'));
    expect(messagesToLoadAmountInput.validationMessage).toBe('');
  })

  it('should have required error at messages to load change input if form was submitted and no amount was set', () => {
    messagesToLoadAmountInput.value = '';
    messagesToLoadForm.dispatchEvent(new Event('submit'));
    expect(messagesToLoadAmountInput.validationMessage).toBe('Заполните это поле.');
  })

  it('should have pattern error message at messages to load change input if form was submitted and to low amount was set', () => {
    messagesToLoadAmountInput.value = '2';
    messagesToLoadForm.dispatchEvent(new Event('submit'));
    expect(messagesToLoadAmountInput.validationMessage).toBe('Значение должно быть больше или равно 20.');
  })

  it('should have pattern error message at messages to load change input if form was submitted and to big amount was set', () => {
    messagesToLoadAmountInput.value = '100000000000';
    messagesToLoadForm.dispatchEvent(new Event('submit'));
    expect(messagesToLoadAmountInput.validationMessage).toBe('Значение должно быть меньше или равно 10000.');
  })

  it('should change input value to 0 if messages to load form was submitted and \'loadAllMessages\' is true', () => {
    component.loadAllMessages = true;
    fixture.detectChanges();
    messagesToLoadForm.dispatchEvent(new Event('submit'));
    expect(component.messagesToLoadAmount).toBe(0);
  })

  //it('should call http post when messages to load form was submitted and correct value was set', () => {
  //  fixture.detectChanges();
  //  messagesToLoadForm.dispatchEvent(new Event('submit'));
  //  expect(mockHttpService.post).toHaveBeenCalled();
  //  expect(mockHttpService.post).toHaveBeenCalledTimes(1);
  //})

  //it('should show success toast with response text after messages to load amount form was submitted', () => {
  //  fixture.detectChanges();
  //  messagesToLoadForm.dispatchEvent(new Event('submit'));
  //  expect(mockToastService.showSuccess).toHaveBeenCalled();
  //  expect(mockToastService.showSuccess).toHaveBeenCalledTimes(1);
  //  expect(mockToastService.showSuccess).toHaveBeenCalledWith('Success info');
  //})

  //it('should show danger toast with response text after messages to load amount form was submitted', () => {
  //  result.status = 'Report not created';
  //  result.info = 'Danger info';
  //  fixture.detectChanges();
  //  messagesToLoadForm.dispatchEvent(new Event('submit'));
  //  expect(mockToastService.showDanger).toHaveBeenCalled();
  //  expect(mockToastService.showDanger).toHaveBeenCalledTimes(1);
  //  expect(mockToastService.showDanger).toHaveBeenCalledWith('Danger info');
  //})

  it('should have no errors at change password key input if form was submitted and correct amount was set', () => {
    changeKeyForm.dispatchEvent(new Event('submit'));
    expect(changeKeyInput.validationMessage).toBe('');
  })

  it('should have required error at change password key input if form was submitted and no amount was set', () => {
    changeKeyInput.value = '';
    changeKeyForm.dispatchEvent(new Event('submit'));
    expect(changeKeyInput.validationMessage).toBe('Заполните это поле.');
  })

  it('should have pattern error message at change password key input if form was submitted and to long string was set', () => {
    changeKeyInput.value = 'toooooooooo loooooooooooong striiiiiiiiiiiiing';
    changeKeyForm.dispatchEvent(new Event('submit'));
    expect(changeKeyInput.validationMessage).toBe('Введите данные в указанном формате.');
  })

  it('should call http post when change password key form was submitted and correct value was set', () => {
    fixture.detectChanges();
    changeKeyForm.dispatchEvent(new Event('submit'));
    expect(mockHttpService.post).toHaveBeenCalled();
    expect(mockHttpService.post).toHaveBeenCalledTimes(1);
  })

  it('should show success toast with response text after change password key form was submitted', () => {
    result.status = 'KeySaved';
    result.info = 'Success info';
    mockHttpService.post.and.returnValue(of(result));
    fixture.detectChanges();
    changeKeyForm.dispatchEvent(new Event('submit'));
    expect(mockToastService.showSuccess).toHaveBeenCalled();
    expect(mockToastService.showSuccess).toHaveBeenCalledTimes(1);
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('Success info');
  })

  //it('should show danger toast with response text after change password key form was submitted', () => {
  //  result.status = 'Key not created';
  //  result.info = 'Danger info';
  //  fixture.detectChanges();
  //  changeKeyForm.dispatchEvent(new Event('submit'));
  //  expect(mockToastService.showDanger).toHaveBeenCalled();
  //  expect(mockToastService.showDanger).toHaveBeenCalledTimes(1);
  //  expect(mockToastService.showDanger).toHaveBeenCalledWith('Danger info');
  //})
})
