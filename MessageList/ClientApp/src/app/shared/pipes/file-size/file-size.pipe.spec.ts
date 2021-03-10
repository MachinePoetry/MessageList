import { FileSizePipe } from './file-size.pipe';

describe('FileSizePipe', () => {
  let pipe;
  beforeEach(() => {
    pipe = new FileSizePipe();
  });

  it('should create the FileSizePipe pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform file size if size is more than 1000', () => {
    expect(pipe.transform(2000)).toBe('2 КБ');
  });

  it('should transform file size if size is less than 1000', () => {
    expect(pipe.transform(900)).toBe('900 Байт');
  });
});
