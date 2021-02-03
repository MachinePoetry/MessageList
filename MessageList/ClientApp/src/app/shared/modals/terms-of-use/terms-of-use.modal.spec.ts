import { TermsOfUseModal } from './terms-of-use.modal';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';


describe('TermsOfUseModal', () => {
  let component: TermsOfUseModal;
  let fixture: ComponentFixture<TermsOfUseModal>;
  let mockNgbActiveModalService = { dismiss: jasmine.createSpy('dismiss').and.returnValue('dismissButton') };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TermsOfUseModal],
      providers: [
        { provide: NgbActiveModal, useValue: mockNgbActiveModalService }
      ]
    });
    fixture = TestBed.createComponent(TermsOfUseModal);
    component = fixture.componentInstance;
    mockNgbActiveModalService.dismiss.calls.reset();
  });

  it('should create the Terms of use modal window component', () => {
    expect(component).toBeTruthy();
  })

  it('should render modal header', () => {
    fixture.detectChanges();
    let header: HTMLElement = fixture.nativeElement.querySelector('h5');
    expect(header.textContent).toBe('Пользовательское соглашение');
  })

  it('should render modal body', () => {
    fixture.detectChanges();
    let body: HTMLBodyElement = fixture.nativeElement.querySelector('.modal-body');
    expect(body).toBeTruthy();
  })

  it('should render two buttons', () => {
    let buttons: HTMLButtonElement[] = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(2);
  })

  it('should close modal window by close button click', () => {
    let button: HTMLButtonElement = fixture.nativeElement.querySelector('.close');
    button.click();
    expect(mockNgbActiveModalService.dismiss).toHaveBeenCalled();
    expect(mockNgbActiveModalService.dismiss).toHaveBeenCalledTimes(1);
  })
})
