import { InlineSpinner } from './inline.spinner';

describe('InlineSpinner', () => {
  let spinner;
  beforeEach(() => {
    spinner = new InlineSpinner();
  });

  it('should create the Inline spinner', () => {
    expect(spinner).toBeTruthy();
  });
});
