import { Component, Input } from '@angular/core';
import { HttpService } from './../../services/httpService/http-service.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ConfirmModalParams } from './../../models/confirmModalParams';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.modal.html'
})

export class ConfirmModal {
  constructor(public activeModal: NgbActiveModal, private _httpService: HttpService) { }

  @Input() modalWindowParams: ConfirmModalParams;

  public ok(closeType: string): void {
    let request: (url: string, params: Object) => Observable<Object>;
    let requestParams: { id: number, authUserId: number | null } = {
      id: this.modalWindowParams.entityId,
      authUserId: this.modalWindowParams.authUserInfo.id
    }

    switch (this.modalWindowParams.requestMethod) {
      case 'post':
        request = this._httpService.post;
        break;
      case 'get':
        request = this._httpService.get;
        break;
      default:
        request = this._httpService.get;
    }

    let url: string = this.modalWindowParams.url;

    request(url, requestParams).subscribe(data => { this.activeModal.close(closeType); },
      error => { }
    );
  }

  public cancel(closeType: string) {
    this.activeModal.close(closeType);
  }
}
