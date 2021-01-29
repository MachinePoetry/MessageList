import { SecondsToTimePipe } from './seconds-to-time.pipe';

describe('SecondsToTimePipe', () => {
  let pipe;
  beforeEach(() => {
    pipe = new SecondsToTimePipe();
  });

  it('should create the SecondsToTimePipe pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform number of seconds to formatted time string (00:00:00) if time is less than one hour', () => {
    expect(pipe.transform(600)).toBe('10:00');
  });

  it('should transform number of seconds to formatted time string (00:00:00) if time is more than one hour', () => {
    expect(pipe.transform(3700)).toBe('01:01:40');
  });

  it('should throw exception if value is not a number', () => {
    expect(() => { pipe.transform('some number') }).toThrowError('SecondsToTime can only be used with number');
  });
});
