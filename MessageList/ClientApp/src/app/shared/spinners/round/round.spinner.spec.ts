import { RoundSpinner } from './round.spinner';

describe('RoundSpinner', () => {
  let spinner;
  beforeEach(() => {
    spinner = new RoundSpinner();
    spinner.mode = 'load';
  });

  it('should create the Round spinner', () => {
    expect(spinner).toBeTruthy();
  });

  it('should set right spinner size according to selected mode', () => {
    expect(spinner.setDimension()).toBe(130);
  });
});
