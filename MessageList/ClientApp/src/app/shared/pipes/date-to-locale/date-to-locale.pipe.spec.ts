import { DateToLocalePipe } from './date-to-locale.pipe';

describe('DateToLocalePipe', () => {
  let pipe;
  beforeEach(() => {
    pipe = new DateToLocalePipe();
  });

  it('should create the DateToLocalePipe pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform date to locale \'ru\'', () => {
    expect(pipe.transform('2021-01-13T22:33:01.294611', 'ru')).toBe('13.01.2021, 22:33:01');
  });

  it('should not transform date if string is not date formatted', () => {
    expect(pipe.transform('some string', 'ru')).toBe('Invalid Date');
  });
});
