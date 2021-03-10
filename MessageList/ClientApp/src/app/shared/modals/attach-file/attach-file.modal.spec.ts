import { AttachFileModal } from './attach-file.modal';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from './../../services/file-service/file.service';
import { AttachFileModalParams } from './../../models/params/attachFileModalParams';
import { WarningModal } from './../warning/warning.modal';
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';


describe('AttachFileModal', () => {
  let component: AttachFileModal;
  let fixture: ComponentFixture<AttachFileModal>;
  let mockNgbModalService = {
    open: jasmine.createSpy('open').and.returnValue({
      result: new Promise(() => true),
      componentInstance: { modalWindowParams: {} }
    })
  };
  let mockNgbActiveModalService = { close: jasmine.createSpy('close').and.returnValue('cloeButton') };
  let mockFileService = { isImage: function ( object ) { return true }, imageMaxSize: 1000 };
  let mockWarningModal = 'mockWarningModal';
  let mockEvent = { target: { files: [] } };
  let mockFile = { size: 100, type: 'image/jpeg' };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AttachFileModal],
      providers: [
        { provide: WarningModal, useValue: mockWarningModal },
        { provide: NgbModal, useValue: mockNgbModalService },
        { provide: FileService, useValue: mockFileService },
        { provide: NgbActiveModal, useValue: mockNgbActiveModalService }
      ]
    });
    fixture = TestBed.createComponent(AttachFileModal);
    component = fixture.componentInstance;
    component.modalWindowParams = new AttachFileModalParams('image', 'Заголовок', 'image');
    mockNgbModalService.open.calls.reset();
    mockNgbActiveModalService.close.calls.reset();
  });

  it('should create Attach the Attach file modal window component', () => {
    expect(component).toBeTruthy();
  })

  it('should render modal header from value in given params', () => {
    fixture.detectChanges();
    let header: HTMLBaseElement = fixture.nativeElement.querySelector('h6');
    expect(header.textContent).toBe(' Заголовок ');
  })

  it('should render modal body', () => {
    let body: HTMLBaseElement = fixture.nativeElement.querySelector('.modal-body');
    expect(body).toBeTruthy();
  })

  it('should render modal entity from value in given params', () => {
    fixture.detectChanges();
    let entity: HTMLBaseElement = fixture.nativeElement.querySelector('li span');
    expect(entity.textContent).toBe(' image ');
  })

  it('should get correct files of type, given in params', () => {
    fixture.detectChanges();
    let input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.accept).toBe('image/*');
  })

  it('should add files to array if file collection is less than 8', () => {
    mockEvent.target.files = [mockFile, mockFile, mockFile, mockFile, mockFile];
    component.ngOnInit();
    component.onChange(mockEvent);
    expect(component.files.length).toBe(5);
    expect(mockNgbActiveModalService.close).toHaveBeenCalled();
    expect(mockNgbActiveModalService.close).toHaveBeenCalledTimes(1);
  })

  it('should close modal window with given params', () => {
    component.cancel('closeButton');
    expect(mockNgbActiveModalService.close).toHaveBeenCalled();
    expect(mockNgbActiveModalService.close).toHaveBeenCalledTimes(1);
    expect(mockNgbActiveModalService.close).toHaveBeenCalledWith('closeButton');
  })

  it('should call warning modal if file collection is more than 8', () => {
    mockEvent.target.files = [mockFile, mockFile, mockFile, mockFile, mockFile, mockFile, mockFile, mockFile, mockFile];
    component.onChange(mockEvent);
    expect(mockNgbModalService.open).toHaveBeenCalled();
    expect(mockNgbModalService.open).toHaveBeenCalledTimes(1);
  })
})
