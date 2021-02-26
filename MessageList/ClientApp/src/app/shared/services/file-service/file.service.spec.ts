import { TestBed } from '@angular/core/testing';
import { FileService } from './file.service';
import { BlobToSrcPipe } from './../../pipes/blob-to-src/blob-to-src.pipe';
import { LinkPreviewResponse } from './../../models/linkPreviewResponse';
import { FileCollection } from './../../models/fileCollection';
import { MessageParams } from './../../models/params/messageParams';

describe('FileService', () => {
  let service: FileService;
  const fakeBlobToSrcPipe = { transform: () => 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAA' };
  let previews: LinkPreviewResponse[], fileCollection: FileCollection, messageParams: MessageParams;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FileService,
        { provide: BlobToSrcPipe, useValue: fakeBlobToSrcPipe }
      ]
    });
    service = TestBed.get(FileService);
    previews = [new LinkPreviewResponse()];
    fileCollection = new FileCollection();
    messageParams = new MessageParams(1, 2, 'message text', 5);
  });

  it('should create the File service', () => {
    expect(service).toBeTruthy();
  });

  it('should create object (FormData) from given params', () => {
    expect(typeof(service.convertParamsToFormData(previews, fileCollection, messageParams))).toBe('object');
  });

  it('should create FormData object with correct values', () => {
    let fd: FormData = service.convertParamsToFormData(previews, fileCollection, messageParams);
    let result = [];
    for (var key of fd.values()) {
      result.push(key);
    }
    expect(result).toEqual(['1', '2', 'message text', '5', JSON.stringify(new LinkPreviewResponse())]);
  });

  it('should correctly validate file collection', () => {
    expect(service.isFileCollectionValid(fileCollection)).toBeFalsy();
  });

  it('should return the same file collection with another reference', () => {
    expect(service.getCollectionClone(fileCollection)).not.toEqual(fileCollection);
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
