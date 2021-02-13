import { CutLongStringPipe } from './cut-long-string.pipe';

describe('CutLongStringPipe', () => {
  let pipe;
  beforeEach(() => {
    pipe = new CutLongStringPipe();
  });

  it('should create the CutLongStringPipe pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('should cut string with specified length and with specified stub', () => {
    expect(pipe.transform('very long string', 11, ' [ ... ]')).toBe('very long s [ ... ]');
  });

  it('should not cut string if it is short enough', () => {
    expect(pipe.transform('string', 11, ' [ ... ]')).toBe('string');
  });

  it('should throw exception if value is not a string', () => {
    expect(() => { pipe.transform({ x: 5 }, 80, '[]') }).toThrowError('CutLongStringPipe can only be used with strings');
  });
});
