import { ConfirmModal } from './confirm.modal';
import { ConfirmModalParams } from './../../models/params/confirmModalParams';
import { User } from './../../models/user';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from './../../services/http-service/http.service';
import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';


describe('ConfirmModal', () => {
  let component: ConfirmModal;
  let fixture: ComponentFixture<ConfirmModal>;
  let mockNgbActiveModalService = { close: jasmine.createSpy('close').and.returnValue('cloeButton') };
  let mockHttpService = { get: () => of('get successful'), post: () => of('post successful') };
  let user = new User();

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ConfirmModal],
      providers: [
        { provide: HttpService, useValue: mockHttpService },
        { provide: NgbActiveModal, useValue: mockNgbActiveModalService }
      ]
    });
    fixture = TestBed.createComponent(ConfirmModal);
    component = fixture.componentInstance;
    component.modalWindowParams = new ConfirmModalParams('get', 'Заголовок', 'тело', user, 1, 'https://someurl.ru', '');
    mockNgbActiveModalService.close.calls.reset();
  });

  it('should create the Confirm modal window component', () => {
    expect(component).toBeTruthy();
  })

  it('should render correct modal header from value in given params', () => {
    fixture.detectChanges();
    let header: HTMLElement = fixture.nativeElement.querySelector('h5');
    expect(header.textContent).toBe(' Заголовок ');
  })

  it('should render modal body', () => {
    fixture.detectChanges();
    let body: HTMLBodyElement = fixture.nativeElement.querySelector('.modal-body');
    expect(body).toBeTruthy();
  })

  it('should render three buttons', () => {
    let buttons: HTMLButtonElement[] = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(3);
  })

  it('should close modal window', () => {
    component.ok('closeType');
    expect(mockNgbActiveModalService.close).toHaveBeenCalled();
    expect(mockNgbActiveModalService.close).toHaveBeenCalledTimes(1);
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
})
