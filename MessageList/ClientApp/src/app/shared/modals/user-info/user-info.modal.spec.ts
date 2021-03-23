import { TestBed } from '@angular/core/testing';
import { UserInfoModal } from './user-info.modal';
import { FormsModule, NgForm } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { ComponentFixture } from '@angular/core/testing';
import { HttpService } from './../../services/http-service/http.service';
import { TextService } from './../../services/text-service/text.service';
import { User } from '../../models/user';
import { UserInfoParams } from '../../models/params/userInfoParams';
import { Role } from './../../../shared/models/role';

describe('UserInfoModal', () => {
  let component: UserInfoModal;
  let fixture: ComponentFixture<UserInfoModal>;
  let mockHttpService = { get: jasmine.createSpy('get') };
  let mockNgbActiveModalService = { close: jasmine.createSpy('close').and.returnValue('cloeButton') };
  let mockTextService = { rolesTranslation: { 'User': 'Пользователь', 'Administrator': 'Администратор' } };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FormsModule, NgSelectModule],
      declarations: [UserInfoModal],
      providers: [
        NgForm,
        { provide: HttpService, useValue: mockHttpService },
        { provide: TextService, useValue: mockTextService },
        { provide: NgbActiveModal, useValue: mockNgbActiveModalService }
      ]
    });
    fixture = TestBed.createComponent(UserInfoModal);
    component = fixture.componentInstance;
    component.userInfo = new UserInfoParams(new User(), 'create');
    let userRole: Role = new Role(1, 'User');
    let adminRole: Role = new Role(1, 'Administrator'); 
    let roles: Role[] = [userRole, adminRole];

    mockNgbActiveModalService.close.calls.reset();
    mockHttpService.get.and.returnValue(of(roles));

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
