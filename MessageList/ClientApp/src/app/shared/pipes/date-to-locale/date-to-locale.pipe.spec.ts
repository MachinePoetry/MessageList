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

  it('should throw exception if value is not a string', () => {
    expect(() => { pipe.transform({ x: 5 }, 'ru') }).toThrowError('DateToLocale can only be used with Date formatted strings');
  });
});
