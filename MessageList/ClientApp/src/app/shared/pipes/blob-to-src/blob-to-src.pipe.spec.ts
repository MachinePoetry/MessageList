import { BlobToSrcPipe } from './blob-to-src.pipe';
import { AppFile } from './../../models/appFile';

describe('BlobToSrcPipe', () => {
  let pipe;
  let file;
  beforeEach(() => {
    pipe = new BlobToSrcPipe();
    file = new AppFile();
    file.type = 'image/jpeg';
    file.src = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAA';
  });

  it('should create the BlobToSrcPipe pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return value if value starts with \'data\'', () => {
    expect(pipe.transform('data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAA')).toBe('data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAA');
  });

  it('should return formatted string if string doesn\'t start with data', () => {
    expect(pipe.transform('iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAA', file)).toBe('data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAA');
  });
});
