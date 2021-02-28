import { ActivityHistoryModal } from './activity-history.modal';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserRequestInfo } from './../../models/userRequestInfo';
import { HttpService } from './../../services/http-service/http.service';
import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';


describe('ActivityHistoryModal', () => {
  let component: ActivityHistoryModal;
  let fixture: ComponentFixture<ActivityHistoryModal>;
  let userRequestInfo: UserRequestInfo, userRequestInfoArr: UserRequestInfo[];
  let mockNgbActiveModalService = { close: jasmine.createSpy('close').and.returnValue('cloeButton') };
  let mockHttpService = { get: jasmine.createSpy('get').and.returnValue(of(userRequestInfoArr)) };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ActivityHistoryModal],
      providers: [
        { provide: HttpService, useValue: mockHttpService },
        { provide: NgbActiveModal, useValue: mockNgbActiveModalService }
      ]
    });
    fixture = TestBed.createComponent(ActivityHistoryModal);
    component = fixture.componentInstance;
    component.authUserId = 1;
    component.userActivities = [];
    mockNgbActiveModalService.close.calls.reset();
    mockHttpService.get.calls.reset();

    userRequestInfo = new UserRequestInfo();
    userRequestInfoArr = [userRequestInfo];

    fixture.detectChanges();
  });

  it('should create the ActivityHistory modal window component', () => {
    expect(component).toBeTruthy();
  })

  it('should render correct modal header', () => {
    fixture.detectChanges();
    const header: HTMLElement = fixture.nativeElement.querySelector('h6');
    expect(header.textContent).toBe(' История активности ');
  })

  it('should render modal body', () => {
    fixture.detectChanges();
    const body: HTMLBodyElement = fixture.nativeElement.querySelector('.modal-body');
    expect(body).toBeTruthy();
  })

  it('should render modal footer', () => {
    fixture.detectChanges();
    const footer: HTMLBodyElement = fixture.nativeElement.querySelector('.modal-footer');
    expect(footer).toBeTruthy();
  })

  it('should render two buttons', () => {
    const buttons: HTMLButtonElement[] = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(2);
  })

  it('should close modal window by cancel button', () => {
    component.cancel('closeType');
    expect(mockNgbActiveModalService.close).toHaveBeenCalled();
    expect(mockNgbActiveModalService.close).toHaveBeenCalledTimes(1);
  })

  it('should close modal window by cancel button with correct params', () => {
    component.cancel('closeType');
    expect(mockNgbActiveModalService.close).toHaveBeenCalledWith('closeType');
  })

  it('should call http.get() after creating component', () => {
    expect(mockHttpService.get).toHaveBeenCalled();
    expect(mockHttpService.get).toHaveBeenCalledTimes(1);
  })
})
