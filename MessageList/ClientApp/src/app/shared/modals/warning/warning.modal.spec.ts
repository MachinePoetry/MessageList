import { WarningModal } from './warning.modal';
import { WarningModalParams } from './../../models/params/warningModalParams';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../../services/http-service/http.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';


describe('WarningModal', () => {
  let component: WarningModal;
  let fixture: ComponentFixture<WarningModal>;
  let mockNgbActiveModalService = { close: jasmine.createSpy('close').and.returnValue('closeButton') };
  let mockHttpService = { post: jasmine.createSpy('post').and.returnValue(of('user greeted')) };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [WarningModal],
      providers: [
        { provide: NgbActiveModal, useValue: mockNgbActiveModalService },
        { provide: HttpService, useValue: mockHttpService }
      ]
    });
    fixture = TestBed.createComponent(WarningModal);
    component = fixture.componentInstance;
    component.modalWindowParams = new WarningModalParams('Заголовок', 'текст', 'greeting', 1);
    mockNgbActiveModalService.close.calls.reset();
    mockHttpService.post.calls.reset();
  });

  it('should create the Warning modal window component', () => {
    expect(component).toBeTruthy();
  })

  it('should render modal header', () => {
    fixture.detectChanges();
    let header: HTMLElement = fixture.nativeElement.querySelector('h6');
    expect(header.textContent).toBe(' Заголовок ');
  })

  it('should render modal body', () => {
    fixture.detectChanges();
    let body: HTMLBodyElement = fixture.nativeElement.querySelector('.modal-body');
    expect(body).toBeTruthy();
  })

  it('should render correct modal body text from given params', () => {
    fixture.detectChanges();
    let span: HTMLBodyElement = fixture.nativeElement.querySelector('#modalText');
    expect(span.textContent).toBe('текст');
  })

  it('should not render checkbox if params.type is not \'greeting\'', () => {
    component.modalWindowParams.type = 'not greeting'
    fixture.detectChanges();
    let input: HTMLBodyElement = fixture.nativeElement.querySelector('input[type=checkbox]');
    expect(input).toBeFalsy();
  })

  it('should render two buttons', () => {
    let buttons: HTMLButtonElement[] = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(2);
  })

  it('should close modal window by close button click', () => {
    let button: HTMLButtonElement = fixture.nativeElement.querySelector('.close');
    button.click();
    expect(mockNgbActiveModalService.close).toHaveBeenCalled();
    expect(mockNgbActiveModalService.close).toHaveBeenCalledTimes(1);
  })

  it('should close modal window by ok button click', () => {
    let button: HTMLButtonElement = fixture.nativeElement.querySelector('.btn-primary');
    button.click();
    expect(mockNgbActiveModalService.close).toHaveBeenCalled();
    expect(mockNgbActiveModalService.close).toHaveBeenCalledTimes(1);
  })

  it('should send post query by calling cancel function if \'isGreeted\' is true', () => {
    component.isGreeted = true;
    component.cancel('closeType');
    fixture.detectChanges();
    expect(mockHttpService.post).toHaveBeenCalled();
    expect(mockHttpService.post).toHaveBeenCalledTimes(1);
    expect(mockHttpService.post).toHaveBeenCalledWith('/api/users/greeting', { id: 1 });
  })
})
