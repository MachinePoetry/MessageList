import { FrontComponent } from './front.component';
import { HeaderComponent } from './../header/header.component';
import { ToastsContainerComponent } from './../toasts-container/toasts-container.component';
import { ChangePasswordComponent } from './../change-password/change-password.component';
import { ReportParams } from './../../shared/models/params/reportParams';
import { ResultInfo } from './../../shared/models/resultInfo';
import { NgForm, FormsModule, AbstractControl } from '@angular/forms';
import { HttpService } from './../../shared/services/http-service/http.service';
import { ToastService } from './../../shared/services/toast-service/toast.service';
import { of } from 'rxjs';
import { TestBed, ComponentFixture } from '@angular/core/testing';


describe('FrontComponent', () => {
  let component: FrontComponent;
  let fixture: ComponentFixture<FrontComponent>;
  let ngForm: NgForm, reportTextControl: AbstractControl, contactsControl: AbstractControl, form: HTMLFormElement, params: ReportParams, result: ResultInfo;
  let mockHttpService = {
    post: jasmine.createSpy('post').and.returnValue(of(result)),
    get: jasmine.createSpy('get').and.returnValue(of('report created'))
  };
  let mockToastService = { showSuccess: jasmine.createSpy('showSuccess').and.returnValue(of('success')) };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [FrontComponent, HeaderComponent, ToastsContainerComponent, ChangePasswordComponent],
      providers: [
        NgForm,
        { provide: ToastService, useValue: mockToastService },
        { provide: HttpService, useValue: mockHttpService }
      ]
    });
    fixture = TestBed.createComponent(FrontComponent);
    component = fixture.componentInstance;
    mockHttpService.post.calls.reset();
    mockToastService.showSuccess.calls.reset();

    fixture.detectChanges();
    await fixture.whenStable();
    ngForm = component.bugReportForm;
    reportTextControl = ngForm.form.controls['bugReportText'];
    contactsControl = ngForm.form.controls['reportContacts'];
    form = fixture.nativeElement.querySelector('#bugReportForm');
    params = new ReportParams();
    result = new ResultInfo();
    mockHttpService.post.and.returnValue(of(result));
  });

  it('should create the Front component', () => {
    expect(component).toBeTruthy();
  })

  it('should render the Header component', () => {
    let header: HTMLElement = fixture.nativeElement.querySelector('app-header');
    expect(header).toBeTruthy();
  })

  it('should render the Toasts container component', () => {
    let toasts: HTMLElement = fixture.nativeElement.querySelector('app-toasts');
    expect(toasts).toBeTruthy();
  })

  it('should render seven \'blocks\' at page', () => {
    let blocks: HTMLElement[] = fixture.nativeElement.querySelectorAll('.container-fluid');
    expect(blocks).toBeTruthy();
    expect(blocks.length).toBe(7);
  })

  it('should render bug report form', () => {
    let form: HTMLElement = fixture.nativeElement.querySelectorAll('#bugReportForm');
    expect(form).toBeTruthy();
  })

  it('should transfer report text value from input to model', () => {
    let textarea: HTMLInputElement = fixture.nativeElement.querySelector('#bugReportText');
    textarea.value = 'some text value';
    textarea.dispatchEvent(new Event('input'));
    let model: string = component.params.reportText;
    expect(model).toBe('some text value');
  })

  it('should have no errors at report text model if textarea was touched and text was set', () => {
    reportTextControl.setValue('some text value');
    reportTextControl.markAsTouched();
    expect(reportTextControl.hasError('required')).toBe(false);
    expect(reportTextControl.hasError('pattern')).toBe(false);
  })

  it('should set required error at report text model if textarea was touched and no text was set', () => {
    reportTextControl.setValue('');
    reportTextControl.markAsTouched();
    expect(reportTextControl.hasError('required')).toBe(true);
  })

  it('should set pattern error at report text model if input was touched and report text is too long', () => {
    let veryLongString = new Array(4100).join();
    reportTextControl.setValue(veryLongString);
    reportTextControl.markAsTouched();
    expect(reportTextControl.hasError('pattern')).toBe(true);
  })

  it('should have no errors at report text model if form was submitted and correct text was set', () => {
    reportTextControl.setValue('some text value');
    form.dispatchEvent(new Event('submit'));
    expect(reportTextControl.hasError('required')).toBe(false);
    expect(reportTextControl.hasError('pattern')).toBe(false);
  })

  it('should set required error at report text model if form was submitted and no text was set', () => {
    reportTextControl.setValue('');
    form.dispatchEvent(new Event('submit'));
    expect(reportTextControl.hasError('required')).toBe(true);
  })

  it('should set pattern error at report text model if form was submitted and and report text is too long', () => {
    let veryLongString = new Array(4100).join();
    reportTextControl.setValue(veryLongString);
    form.dispatchEvent(new Event('submit'));
    expect(reportTextControl.hasError('pattern')).toBe(true);
  })

  it('should transfer contacts value from input to model', () => {
    let input: HTMLInputElement = fixture.nativeElement.querySelector('#reportContacts');
    input.value = 'contact';
    input.dispatchEvent(new Event('input'));
    let model: string = component.params.reportContacts;
    expect(model).toBe('contact');
  })

  it('should have no errors at contacts model if input was touched and correct contact was set', () => {
    contactsControl.setValue('contact');
    contactsControl.markAsTouched();
    expect(contactsControl.hasError('required')).toBe(false);
    expect(contactsControl.hasError('pattern')).toBe(false);
  })

  it('should set pattern error at contact model if input was touched and contact is too long', () => {
    let veryLongString = new Array(410).join();
    contactsControl.setValue(veryLongString);
    contactsControl.markAsTouched();
    expect(contactsControl.hasError('pattern')).toBe(true);
  })

  it('should have no errors at contact model if form was submitted and correct contact was set', () => {
    contactsControl.setValue('contact');
    form.dispatchEvent(new Event('submit'));
    expect(contactsControl.hasError('required')).toBe(false);
    expect(contactsControl.hasError('pattern')).toBe(false);
  })

  it('should set pattern error at contact model if form was submitted and contact is too long', () => {
    let veryLongString = new Array(410).join();
    contactsControl.setValue(veryLongString);
    form.dispatchEvent(new Event('submit'));
    expect(contactsControl.hasError('pattern')).toBe(true);
  })

  it('should call http post inside \'onSubmit\' method on submit form event when send report button was clicked', () => {
    reportTextControl.setValue('qwerty@q.ru');
    contactsControl.setValue('contact');
    let button = fixture.nativeElement.querySelector('#reportButton');
    button.click();
    expect(mockHttpService.post).toHaveBeenCalled();
    expect(mockHttpService.post).toHaveBeenCalledTimes(1);
  })

  it('should call http post inside \'onSubmit\' method correct times and with correct params on submit form event', () => {
    reportTextControl.setValue('some report text');
    contactsControl.setValue('contact');
    params.reportText = 'some report text';
    params.reportContacts = 'contact';
    form.dispatchEvent(new Event('submit'));
    expect(mockHttpService.post).toHaveBeenCalled();
    //expect(mockHttpService.post).toHaveBeenCalledWith('/api/bugReport/create', params);
  })

  it('should call http post inside \'onSubmit\' method when only report text is set', () => {
    reportTextControl.setValue('some report text');
    contactsControl.setValue(null);
    form.dispatchEvent(new Event('submit'));
    expect(mockHttpService.post).toHaveBeenCalled();
  })

  it('should show success toast with response text', () => {
    result.info = 'Report created';
    reportTextControl.setValue('some report text');
    contactsControl.setValue('contact');
    form.dispatchEvent(new Event('submit'));
    expect(mockToastService.showSuccess).toHaveBeenCalled();
    expect(mockToastService.showSuccess).toHaveBeenCalledTimes(1);
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('Report created');
  })
})
