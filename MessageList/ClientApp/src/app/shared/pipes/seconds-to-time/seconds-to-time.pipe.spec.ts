import { SecondsToTimePipe } from './seconds-to-time.pipe';

describe('SecondsToTimePipe', () => {
  let pipe;
  beforeEach(() => {
    pipe = new SecondsToTimePipe();
  });

  it('should create the SecondsToTimePipe pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform number of seconds to formatted time string (00:00:00) if time is less than one hour and mode is \'audioPlayer\'', () => {
    expect(pipe.transform(600, 'audioPlayer')).toBe('10:00');
  });

  it('should transform number of seconds to formatted time string (00:00:00) if time is more than one hour and mode is \'audioPlayer\'', () => {
    expect(pipe.transform(3700, 'audioPlayer')).toBe('01:01:40');
  });

  it('should transform number of seconds to formatted time string (00d:00h:00m:00sec) if time is less than one hour and mode is \'uptime\'', () => {
    expect(pipe.transform(600000, 'uptime')).toBe('00d:00h:10m:00sec');
  });

  it('should transform number of seconds to formatted time string (00d:00h:00m:00sec) if time is more than one hour and mode is \'uptime\'', () => {
    expect(pipe.transform(3700000, 'uptime')).toBe('00d:01h:01m:40sec');
  });
});
