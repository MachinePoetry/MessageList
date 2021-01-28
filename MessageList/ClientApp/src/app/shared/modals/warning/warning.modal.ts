import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../services/http-service/http.service';
import { WarningModalParams } from './../../models/params/warningModalParams';

@Component({
  selector: 'app-warning',
  templateUrl: './warning.modal.html',
  styleUrls: ['./warning.modal.css']
})

export class WarningModal {
  constructor(private _activeModal: NgbActiveModal, private _httpService: HttpService) { }

  @Input() public modalWindowParams: WarningModalParams;

  public isGreeted: boolean = false;

  public cancel(closeType: string): void {
    this._activeModal.close(closeType);
    if (this.modalWindowParams.type === 'greeting') {
      sessionStorage.setItem("isGreeted", 'true');
    }
    if (this.isGreeted) {
      let params = { id: this.modalWindowParams.id };
      this._httpService.post('/api/users/greeting', params).subscribe(data => { }, error => () => { });
    }
  }
}
