import { TestBed } from '@angular/core/testing';
import { UserInfoModal } from './user-info.modal';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ComponentFixture } from '@angular/core/testing';
import { User } from '../../models/user';
import { UserInfoParams } from '../../models/params/userInfoParams';

describe('UserInfoModal', () => {
  let component: UserInfoModal;
  let fixture: ComponentFixture<UserInfoModal>;
  let mockNgbActiveModalService = { close: jasmine.createSpy('close').and.returnValue('cloeButton') };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [UserInfoModal],
      providers: [
        NgForm,
        { provide: NgbActiveModal, useValue: mockNgbActiveModalService }
      ]
    });
    fixture = TestBed.createComponent(UserInfoModal);
    component = fixture.componentInstance;
    component.userInfo = new UserInfoParams(new User(), 'create');

    mockNgbActiveModalService.close.calls.reset();

    fixture.detectChanges();
  });

  it('should create the User info modal window component', () => {
    expect(component).toBeTruthy();
  })

  it('should render correct modal header', () => {
    const header: HTMLElement = fixture.nativeElement.querySelector('h5');
    expect(header).toBeTruthy();
  })

  it('should render modal body', () => {
    const body: HTMLBodyElement = fixture.nativeElement.querySelector('.modal-body');
    expect(body).toBeTruthy();
  })

  it('should render modal footer', () => {
    const footer: HTMLBodyElement = fixture.nativeElement.querySelector('.modal-footer');
    expect(footer).toBeTruthy();
  })

  it('should render three buttons', () => {
    const buttons: HTMLButtonElement[] = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(3);
  })

  it('should close modal window by cancel button', () => {
    const closeButton: HTMLButtonElement = fixture.nativeElement.querySelector('.close');
    closeButton.click();
    expect(mockNgbActiveModalService.close).toHaveBeenCalled();
    expect(mockNgbActiveModalService.close).toHaveBeenCalledTimes(1);
  })
})
