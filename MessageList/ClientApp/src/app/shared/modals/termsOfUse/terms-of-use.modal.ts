import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-terms-of-use',
  templateUrl: './terms-of-use.modal.html'
})
export class TermsOfUseModal {
  constructor(public activeModal: NgbActiveModal) { }
}
