import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WarningModalParams } from './../../models/warningModalParams';

@Component({
  selector: 'app-warning',
  templateUrl: './warning.modal.html',
  styleUrls: ['./warning.modal.css']
})

export class WarningModal {
  constructor(private _activeModal: NgbActiveModal) { }

  @Input() public modalWindowParams: WarningModalParams;

  public cancel(closeType: string): void {
    this._activeModal.close(closeType);
  }
}
