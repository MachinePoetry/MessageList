import { Pipe, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UserManagementModal } from './user-management.modal';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ComponentFixture } from '@angular/core/testing';
import { HttpService } from './../../services/http-service/http.service';
import { ToastService } from './../../services/toast-service/toast.service';
import { of } from 'rxjs';
import { User } from './../../../shared/models/user';

@Pipe({ name: 'dateToLocale' })
class DateToLocalePipeStub {
  public transform() { return '01.01.1970, 00:00:00' };
}

describe('UserManagementModal', () => {
  let component: UserManagementModal;
  let fixture: ComponentFixture<UserManagementModal>;
  let mockNgbActiveModalService = { close: jasmine.createSpy('close').and.returnValue('cloeButton') };
  let mockNgbModalService = { close: jasmine.createSpy('close').and.returnValue('cloeButton') };
  let mockHttpService = { get: jasmine.createSpy('get').and.returnValue(of()) };
  let mockToastService = { showSuccess: jasmine.createSpy('showSuccess'), showDanger: jasmine.createSpy('showSuccess') };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [UserManagementModal, DateToLocalePipeStub],
      providers: [
        { provide: HttpService, useValue: mockHttpService },
        { provide: ToastService, useValue: mockToastService },
        { provide: NgbModal, useValue: mockNgbModalService },
        { provide: NgbActiveModal, useValue: mockNgbActiveModalService }
      ]
    });
    fixture = TestBed.createComponent(UserManagementModal);
    component = fixture.componentInstance;
    component.authUserId = 1;

    mockNgbActiveModalService.close.calls.reset();
    mockHttpService.get.and.returnValue(of());
    mockHttpService.get.calls.reset();

    fixture.detectChanges();
  });

  it('should create the User management modal window component', () => {
    expect(component).toBeTruthy();
  })

  it('should render correct modal header', () => {
    const header: HTMLElement = fixture.nativeElement.querySelector('h5');
    expect(header.textContent).toBe(' Редактирование пользователей ');
  })

  it('should render modal body', () => {
    const body: HTMLBodyElement = fixture.nativeElement.querySelector('.modal-body');
    expect(body).toBeTruthy();
  })

  it('should render modal footer', () => {
    const footer: HTMLBodyElement = fixture.nativeElement.querySelector('.modal-footer');
    expect(footer).toBeTruthy();
  })

  it('should render five buttons', () => {
    const buttons: HTMLButtonElement[] = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(5);
  })

  it('should close modal window by cancel button', () => {
    const closeButton: HTMLButtonElement = fixture.nativeElement.querySelector('.close');
    closeButton.click();
    expect(mockNgbActiveModalService.close).toHaveBeenCalled();
    expect(mockNgbActiveModalService.close).toHaveBeenCalledTimes(1);
  })

  it('should call http.get() after creating component', () => {
    expect(mockHttpService.get).toHaveBeenCalled();
    expect(mockHttpService.get).toHaveBeenCalledTimes(1);
  })

  it('should filter authenticated user from users array', () => {
    component.authUserId = 2;
    const authenticatedUser = new User();
    authenticatedUser.id = 2;
    let users: User[] = [new User(), new User(), authenticatedUser];
    mockHttpService.get.and.returnValue(of(users));
    component.ngOnInit();
    expect(component.users.length).toBe(2);
  })
})
