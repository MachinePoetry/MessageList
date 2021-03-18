import { FeedbackModal } from './feedback.modal';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Pipe, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpService } from './../../services/http-service/http.service';
import { ToastService } from './../../services/toast-service/toast.service';
import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { FeedbackParams } from '../../models/params/feedbackParams';

@Pipe({ name: 'dateToLocale' })
class DateToLocalePipeStub {
  public transform() { return '01.01.1970, 00:00:00' };
}

describe('FeedbackModal', () => {
  let component: FeedbackModal;
  let fixture: ComponentFixture<FeedbackModal>;
  let mockNgbActiveModalService = { close: jasmine.createSpy('close').and.returnValue('cloeButton') };
  let mockNgbModalService = { close: jasmine.createSpy('close').and.returnValue('cloeButton') };
  let mockHttpService = { get: jasmine.createSpy('get').and.returnValue(of()) };
  let mockToastService = { showSuccess: jasmine.createSpy('showSuccess'), showDanger: jasmine.createSpy('showSuccess') };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [FeedbackModal, DateToLocalePipeStub],
      providers: [
        { provide: HttpService, useValue: mockHttpService },
        { provide: ToastService, useValue: mockToastService },
        { provide: NgbModal, useValue: mockNgbModalService },
        { provide: NgbActiveModal, useValue: mockNgbActiveModalService }
      ]
    });
    fixture = TestBed.createComponent(FeedbackModal);
    component = fixture.componentInstance;
    component.authUserId = 1;
    let feedback1: FeedbackParams = new FeedbackParams();
    let feedback2: FeedbackParams = new FeedbackParams();
    let feedbacksArr: FeedbackParams[] = [feedback1, feedback2];
    mockNgbActiveModalService.close.calls.reset();
    mockHttpService.get.and.returnValue(of(feedbacksArr));
    mockHttpService.get.calls.reset();

    fixture.detectChanges();
  });

  it('should create the Feedback modal window component', () => {
    expect(component).toBeTruthy();
  })

  it('should render correct modal header', () => {
    const header: HTMLElement = fixture.nativeElement.querySelector('h5');
    expect(header.textContent).toBe(' Обратная связь ');
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

  it('should call http.get() after creating component', () => {
    expect(mockHttpService.get).toHaveBeenCalled();
    expect(mockHttpService.get).toHaveBeenCalledTimes(1);
  })

  it('should have 2 feedbacks in feedbacks array if 2 are returned from server', () => {
    expect(component.feedbacks.length).toBe(2);
  })
})
