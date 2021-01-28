import { Component, Input } from '@angular/core';
import { HttpService } from './../../services/http-service/http.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ConfirmModalParams } from './../../models/params/confirmModalParams';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.modal.html'
})

export class ConfirmModal {
  constructor(public activeModal: NgbActiveModal, private _httpService: HttpService) { }

  @Input() modalWindowParams: ConfirmModalParams;

  public ok(closeType: string): void {
    let request: (url: string, params: Object) => Observable<Object>;
    let requestParams: any = this.modalWindowParams.params;

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
    this.activeModal.close(request(url, requestParams));
  }

  public cancel(closeType: string) {
    this.activeModal.close(closeType);
  }
}
