import { Component, Input } from '@angular/core';
import { SpinnerMode } from './../../models/componentModes/spinnerMode';

@Component({
  selector: 'round-spinner',
  templateUrl: './round.spinner.html',
  styleUrls: ['./round.spinner.css']
})

export class RoundSpinner {
  private _spinnerMode = SpinnerMode;

  @Input() public mode: string;

  public setDimension(): number {
    let result: number = 0;
    if (this.mode === this._spinnerMode.load) {
      result = 130;
    } else if (this.mode === this._spinnerMode.upLoad) {
      result = 30;
    }
    return result;
  }
}
