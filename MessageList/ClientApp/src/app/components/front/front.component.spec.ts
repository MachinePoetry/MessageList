import { FrontComponent } from './front.component';
import { FeedbackParams } from './../../shared/models/params/feedbackParams';
import { ResultInfo } from './../../shared/models/resultInfo';
import { NgForm, FormsModule, AbstractControl } from '@angular/forms';
import { HttpService } from './../../shared/services/http-service/http.service';
import { ToastService } from './../../shared/services/toast-service/toast.service';
import { of } from 'rxjs';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({ selector: 'app-banner', template: '' })
class HeaderComponentStub {
}

@Component({ selector: 'router-outlet', template: '' })
class ToastsContainerComponentStub {
}


describe('FrontComponent', () => {
  let component: FrontComponent;
  let fixture: ComponentFixture<FrontComponent>;
  let ngForm: NgForm, feedbackTextControl: AbstractControl, contactsControl: AbstractControl, form: HTMLFormElement, params: FeedbackParams, result: ResultInfo;
  let mockHttpService = {
    post: jasmine.createSpy('post').and.returnValue(of(result)),
    get: jasmine.createSpy('get').and.returnValue(of('Feedback created'))
  };
  let mockToastService = { showSuccess: jasmine.createSpy('showSuccess'), showDanger: jasmine.createSpy('showSuccess') };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [FrontComponent, HeaderComponentStub, ToastsContainerComponentStub],
      providers: [
        NgForm,
        { provide: ToastService, useValue: mockToastService },
        { provide: HttpService, useValue: mockHttpService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(FrontComponent);
    component = fixture.componentInstance;
    mockHttpService.post.calls.reset();
    mockToastService.showSuccess.calls.reset();
    mockToastService.showDanger.calls.reset();

    fixture.detectChanges();
    await fixture.whenStable();
    ngForm = component.feedbackForm;
    feedbackTextControl = ngForm.form.controls['feedbackText'];
    contactsControl = ngForm.form.controls['feedbackContacts'];
    form = fixture.nativeElement.querySelector('#feedbackForm');
    params = new FeedbackParams();
    result = new ResultInfo();
    result.status = 'FeedbackCreated';
    result.info = 'Success info';
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
    expect(blocks.length).toBe(6);
  })

  it('should render bug feedback form', () => {
    let form: HTMLElement = fixture.nativeElement.querySelectorAll('#bugfeedbackForm');
    expect(form).toBeTruthy();
  })

  it('should transfer feedback text value from input to model', () => {
    let textarea: HTMLInputElement = fixture.nativeElement.querySelector('#feedbackText');
    textarea.value = 'some text value';
    textarea.dispatchEvent(new Event('input'));
    let model: string = component.params.feedbackText;
    expect(model).toBe('some text value');
  })

  it('should have no errors at feedback text model if textarea was touched and text was set', () => {
    feedbackTextControl.setValue('some text value');
    feedbackTextControl.markAsTouched();
    expect(feedbackTextControl.hasError('required')).toBe(false);
    expect(feedbackTextControl.hasError('pattern')).toBe(false);
  })

  it('should set required error at feedback text model if textarea was touched and no text was set', () => {
    feedbackTextControl.setValue('');
    feedbackTextControl.markAsTouched();
    expect(feedbackTextControl.hasError('required')).toBe(true);
  })

  it('should set pattern error at feedback text model if input was touched and feedback text is too long', () => {
    let veryLongString = new Array(4100).join();
    feedbackTextControl.setValue(veryLongString);
    feedbackTextControl.markAsTouched();
    expect(feedbackTextControl.hasError('pattern')).toBe(true);
  })

  //it('should have no errors at feedback text model if form was submitted and correct text was set', () => {
  //  feedbackTextControl.setValue('some text value');
  //  let textarea: HTMLInputElement = fixture.nativeElement.querySelector('#feedbackText');
  //  textarea.value = 'some text value';
  //  params.feedbackText = 'some feedback text';
  //  form.dispatchEvent(new Event('submit'));
  //  expect(feedbackTextControl.hasError('required')).toBe(false);
  //  expect(feedbackTextControl.hasError('pattern')).toBe(false);
  //})

  it('should set required error at feedback text model if form was submitted and no text was set', () => {
    feedbackTextControl.setValue('');
    form.dispatchEvent(new Event('submit'));
    expect(feedbackTextControl.hasError('required')).toBe(true);
  })

  it('should set pattern error at feedback text model if form was submitted and and feedback text is too long', () => {
    let veryLongString = new Array(4100).join();
    feedbackTextControl.setValue(veryLongString);
    form.dispatchEvent(new Event('submit'));
    expect(feedbackTextControl.hasError('pattern')).toBe(true);
  })

  it('should transfer contacts value from input to model', () => {
    let input: HTMLInputElement = fixture.nativeElement.querySelector('#feedbackContacts');
    input.value = 'contact';
    input.dispatchEvent(new Event('input'));
    let model: string = component.params.feedbackContacts;
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

  it('should call http post inside \'onSubmit\' method on submit form event when send feedback button was clicked', () => {
    feedbackTextControl.setValue('qwerty@q.ru');
    contactsControl.setValue('contact');
    let button = fixture.nativeElement.querySelector('#feedbackButton');
    button.click();
    expect(mockHttpService.post).toHaveBeenCalled();
    expect(mockHttpService.post).toHaveBeenCalledTimes(1);
  })

  it('should call http post inside \'onSubmit\' method correct times and with correct params on submit form event', () => {
    feedbackTextControl.setValue('some feedback text');
    contactsControl.setValue('contact');
    params.feedbackText = 'some feedback text';
    params.feedbackContacts = 'contact';
    form.dispatchEvent(new Event('submit'));
    expect(mockHttpService.post).toHaveBeenCalled();
    //expect(mockHttpService.post).toHaveBeenCalledWith('/api/feedback/create', params);
  })

  it('should call http post inside \'onSubmit\' method when only feedback text is set', () => {
    feedbackTextControl.setValue('some feedback text');
    contactsControl.setValue('');
    form.dispatchEvent(new Event('submit'));
    expect(mockHttpService.post).toHaveBeenCalled();
  })

  it('should show success toast with response text', () => {
    feedbackTextControl.setValue('some feedback text');
    contactsControl.setValue('contact');
    form.dispatchEvent(new Event('submit'));
    expect(mockToastService.showSuccess).toHaveBeenCalled();
    expect(mockToastService.showSuccess).toHaveBeenCalledTimes(1);
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('Success info');
  })

  it('should show danger toast with response text', () => {
    result.status = 'feedback not created';
    result.info = 'Danger info';
    feedbackTextControl.setValue('some feedback text');
    contactsControl.setValue('contact');
    form.dispatchEvent(new Event('submit'));
    expect(mockToastService.showDanger).toHaveBeenCalled();
    expect(mockToastService.showDanger).toHaveBeenCalledTimes(1);
    expect(mockToastService.showDanger).toHaveBeenCalledWith('Danger info');
  })
})
