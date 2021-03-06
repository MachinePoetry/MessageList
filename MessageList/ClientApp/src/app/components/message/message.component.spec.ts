import { MessageComponent } from './message.component';
import { FileService } from '../../shared/services/file-service/file.service';
import { DateToLocalePipe } from './../../shared/pipes/date-to-locale/date-to-locale.pipe';
import { BlobToSrcPipe } from '../../shared/pipes/blob-to-src/blob-to-src.pipe';
import { SafeUrlPipe } from '../../shared/pipes/safe-url/safe-url.pipe';
import { Message } from './../../shared/models/message';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileCollection } from '../../shared/models/fileCollection';
import { Component, Input, Pipe, NO_ERRORS_SCHEMA } from '@angular/core';

@Pipe({ name: 'dateToLocale' })
class DateToLocalePipeStub {
  public transform() { return '01.01.1970, 00:00:00' };
}

@Pipe({ name: 'blobToSrc' })
class BlobToSrcPipeStub {
  public transform() { };
}

@Pipe({ name: 'safeUrl' })
class SafeUrlPipeStub {
  public transform() { };
}

@Component({ selector: 'app-file-preview', template: '' })
class FilePreviewComponentStub {
  @Input() public fileCollection: FileCollection = new FileCollection();
  @Input() public mode: string;
}


describe('MessageComponent', () => {
  let component: MessageComponent, fixture: ComponentFixture<MessageComponent>, file: File;
  let mockFileService = { isFileCollectionValid: jasmine.createSpy('isFileCollectionValid').and.returnValue(true) };
  let mockBlobToSrcPipe = { transform: jasmine.createSpy('transform').and.returnValue(true) };
  let mockDateToLocalePipe = { transform: jasmine.createSpy('transform').and.returnValue('01.01.1970') };
  let mockSafeUrlPipe = { transform: jasmine.createSpy('transform').and.returnValue(true) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageComponent, FilePreviewComponentStub, DateToLocalePipeStub, BlobToSrcPipeStub, SafeUrlPipeStub],
      providers: [
        { provide: FileService, useValue: mockFileService },
        { provide: BlobToSrcPipe, useValue: mockBlobToSrcPipe },
        { provide: DateToLocalePipe, useValue: mockDateToLocalePipe },
        { provide: SafeUrlPipe, useValue: mockSafeUrlPipe }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
    mockFileService.isFileCollectionValid.calls.reset();

    component.message = new Message();
    component.message.id = 1;
    component.message.text = 'some message text';
    component.message.createdAt = '01.01.1970';
    component.message.fileCollection = new FileCollection();
    const dataBase64 = "VEhJUyBJUyBUSEUgQU5TV0VSCg==";
    const arrayBuffer = Uint8Array.from(window.atob(dataBase64), c => c.charCodeAt(0));
    file = new File([arrayBuffer], "picture.jpeg", { type: 'image/jpeg' });
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create the Message component', () => {
    expect(component).toBeTruthy();
  });

  it('should render message markup', () => {
    let container: HTMLDivElement = fixture.nativeElement.querySelector('.message');
    expect(container).toBeTruthy();
  })

  it('should render correct message creation date', () => {
    let dateSpan: HTMLSpanElement = fixture.nativeElement.querySelector('.message-created-at');
    expect(dateSpan).toBeTruthy();
    expect(dateSpan.textContent).toBe(' 01.01.1970, 00:00:00 ');
  })

  it('should render two message control buttons with \'mdi\'', () => {
    let buttons: HTMLSpanElement[] = fixture.nativeElement.querySelectorAll('.mdi');
    expect(buttons).toBeTruthy();
    expect(buttons.length).toBe(2);
  })

  it('should render message text if it is in message', () => {
    let text: HTMLSpanElement = fixture.nativeElement.querySelector('#messageText');
    expect(text).toBeTruthy();
    expect(text.textContent).toBe(' some message text ');
  })

  it('should not render message text if it is not in message', () => {
    component.message.text = null;
    fixture.detectChanges();
    let text: HTMLSpanElement = fixture.nativeElement.querySelector('#messageText');
    expect(text).toBeFalsy();
  })

  it('should render file collection if it is in message', () => {
    mockFileService.isFileCollectionValid.and.returnValue(true);
    fixture.detectChanges();
    let filePreviewComponent: HTMLElement = fixture.nativeElement.querySelector('file-preview');
    expect(filePreviewComponent).toBeTruthy();
  })

  it('should not render file collection if it is empty in message', () => {
    mockFileService.isFileCollectionValid.and.returnValue(false);
    fixture.detectChanges();
    let filePreviewComponent: HTMLElement = fixture.nativeElement.querySelector('file-preview');
    expect(filePreviewComponent).toBeFalsy();
  })
});
