import { PulseSpinner } from './pulse.spinner';

describe('PulseSpinner', () => {
  let spinner;
  beforeEach(() => {
    spinner = new PulseSpinner();
  });

  it('should create the Pulse spinner', () => {
    expect(spinner).toBeTruthy();
  });
});
