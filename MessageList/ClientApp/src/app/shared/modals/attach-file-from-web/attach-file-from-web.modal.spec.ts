import { AttachFileFromWebModal } from './attach-file-from-web.modal';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';


describe('AttachFileFromWebModal', () => {
  let component: AttachFileFromWebModal;
  let fixture: ComponentFixture<AttachFileFromWebModal>;
  let mockNgbActiveModalService = { close: jasmine.createSpy('close').and.returnValue('cloeButton') };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AttachFileFromWebModal],
      providers: [
        { provide: NgbActiveModal, useValue: mockNgbActiveModalService }
      ]
    });
    fixture = TestBed.createComponent(AttachFileFromWebModal);
    component = fixture.componentInstance;
    mockNgbActiveModalService.close.calls.reset();
  });

  it('should create the Attach file from web modal window component', () => {
    expect(component).toBeTruthy();
  })

  it('should render modal header', () => {
    fixture.detectChanges();
    let header: HTMLElement = fixture.nativeElement.querySelector('h6');
    expect(header.textContent).toBe(' Добавление видео ');
  })

  it('should render modal body', () => {
    fixture.detectChanges();
    let body: HTMLBodyElement = fixture.nativeElement.querySelector('.modal-body');
    expect(body).toBeTruthy();
  })

  it('should render one button if fileUrl is not set', () => {
    let buttons: HTMLButtonElement[] = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(1);
  })

  it('should render three buttons if fileUrl is set', () => {
    component.fileUrl = 'url';
    fixture.detectChanges();
    let buttons: HTMLButtonElement[] = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(3);
  })
})
