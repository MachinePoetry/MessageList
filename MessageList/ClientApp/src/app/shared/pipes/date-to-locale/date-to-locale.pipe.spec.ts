import { DateToLocalePipe } from './date-to-locale.pipe';

describe('DateToLocalePipe', () => {
  let pipe;
  beforeEach(() => {
    pipe = new DateToLocalePipe();
  });

  it('should create the pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform date to locale \'ru\'', () => {
    expect(pipe.transform('')).toBe('');
  });
});
