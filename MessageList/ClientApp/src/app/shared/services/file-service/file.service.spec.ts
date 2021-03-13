import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FileService } from './file.service';
import { UrlPreviewResponse } from './../../models/urlPreviewResponse';
import { FileCollection } from './../../models/fileCollection';
import { MessageParams } from './../../models/params/messageParams';

describe('FileService', () => {
  let service: FileService;
  let mockHttpClient = { post: jasmine.createSpy('post'), get: jasmine.createSpy('get') };
  let urlPreviews: UrlPreviewResponse[], fileCollection: FileCollection, messageParams: MessageParams;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FileService,
        { provide: HttpClient, useValue: mockHttpClient }
      ]
    });
    service = TestBed.get(FileService);
    urlPreviews = [new UrlPreviewResponse()];
    fileCollection = new FileCollection();
    messageParams = new MessageParams(1, 2, 'message text', 5);
  });

  it('should create the File service', () => {
    expect(service).toBeTruthy();
  });

  it('should create object (FormData) from given params', () => {
    expect(typeof (service.convertParamsToFormData(urlPreviews, fileCollection, messageParams))).toBe('object');
  });

  it('should create FormData object with correct values', () => {
    let fd: FormData = service.convertParamsToFormData(urlPreviews, fileCollection, messageParams);
    let result = [];
    for (var key of fd.values()) {
      result.push(key);
    }
    expect(result).toEqual(['1', '2', 'message text', '5', JSON.stringify(new UrlPreviewResponse())]);
  });

  it('should correctly validate file collection', () => {
    expect(service.isFileCollectionValid(fileCollection)).toBeFalsy();
  });

  it('should return the same url previews collection with another reference', () => {
    expect(service.getUrlPreviewsClone(urlPreviews)).not.toEqual(urlPreviews);
  });

  it('should return the same file collection with another reference', () => {
    expect(service.getFileCollectionClone(fileCollection)).not.toEqual(fileCollection);
  });

  it('should clean file collection', () => {
    let file: File = new File([""], "image.jpg", { type: "image/jpeg", lastModified: Date.now() });
    fileCollection.images.push(file);
    service.cleanFileCollection(fileCollection);
    expect(fileCollection).toEqual(new FileCollection());
  });

  it('should return correct file collection type', () => {
    let file: File = new File([""], "image.jpg", { type: "image/jpeg", lastModified: Date.now() });
    fileCollection.images.push(file);
    expect(service.getFileCollectionType(fileCollection.images)).toBe('images');
  });

  it('should return correct audio file type', () => {
    let file: File = new File([""], "audio.mp3", { type: "audio/mp3", lastModified: Date.now() });
    expect(service.isAudio(file)).toBeTruthy();
  });

  it('should return false is file is not audio', () => {
    let file: File = new File([""], "image.jpg", { type: "image/jpeg", lastModified: Date.now() });
    expect(service.isAudio(file)).toBeFalsy();
  });
})
