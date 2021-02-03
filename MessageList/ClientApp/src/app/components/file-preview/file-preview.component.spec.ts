import { FilePreviewComponent } from './file-preview.component';
import { FileCollection } from './../../shared/models/fileCollection';
import { AppFile } from './../../shared/models/appFile';
import { FileService } from './../../shared/services/file-service/file.service';
import { BlobToSrcPipe } from './../../shared/pipes/blob-to-src/blob-to-src.pipe';
import { SafeUrlPipe } from './../../shared/pipes/safe-url/safe-url.pipe';
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';


describe('FilePreviewComponent', () => {
  let component: FilePreviewComponent;
  let fixture: ComponentFixture<FilePreviewComponent>;
  let mockBlobToSrcPipe = { transform: jasmine.createSpy('transform').and.returnValue(true) };
  let mockFileService = { isImage: jasmine.createSpy('transform').and.returnValue(true) };
  let appFile: AppFile, appFileArr: AppFile[], file: File;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [FilePreviewComponent, BlobToSrcPipe, SafeUrlPipe],
      providers: [
        { provide: BlobToSrcPipe, useValue: mockBlobToSrcPipe },
        { provide: FileService, useValue: mockFileService }
      ]
    });
    fixture = TestBed.createComponent(FilePreviewComponent);
    component = fixture.componentInstance;
    component.mode = 'preview';
    fixture.detectChanges();
    await fixture.whenStable();
    appFile = new AppFile();
    appFile.type = 'image/jpeg';
    appFile.src = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAA';
    appFileArr = [];
    const dataBase64 = "VEhJUyBJUyBUSEUgQU5TV0VSCg==";
    const arrayBuffer = Uint8Array.from(window.atob(dataBase64), c => c.charCodeAt(0));
    file = new File([arrayBuffer], "picture.jpeg", { type: 'image/jpeg' });
  });

  it('should create the File preview component', () => {
    expect(component).toBeTruthy();
  })

  it('should render image preview block', () => {
    let imageBlock: HTMLDivElement = fixture.nativeElement.querySelector('#imageBlockContainer');
    expect(imageBlock).toBeTruthy();
  })

  it('should return correct width for files', () => {
    appFileArr.push(appFile);
    appFileArr.push(appFile);
    expect(component.setPreviewWidth(appFileArr)).toBe(32);
    appFileArr.push(appFile);
    appFileArr.push(appFile);
    expect(component.setPreviewWidth(appFileArr)).toBe(24);
  })

  it('should hide and show modal preview window', () => {
    component.showImageModal(appFile, appFile);
    expect(component.isImgModalVisible).toBe(true);
    component.hideImageModal();
    expect(component.isImgModalVisible).toBe(false);
  })

  it('should delete file from file collection', () => {
    component.fileCollection.images.push(file);
    component.deleteFile(file)
    expect(component.fileCollection).toEqual(new FileCollection());
  })
})
