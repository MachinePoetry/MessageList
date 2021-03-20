import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { HttpService } from './../../services/http-service/http.service';
import { ToastService } from '../../services/toast-service/toast.service';
import { FeedbackParams } from './../../models/params/feedbackParams';
import { ResultInfo } from './../../models/resultInfo';
import { ConfirmModal } from './../confirm/confirm.modal';
import { ConfirmModalParams } from './../../models/params/confirmModalParams';

@Component({
  selector: 'feedback-modal',
  templateUrl: './feedback.modal.html',
  styleUrls: ['./feedback.modal.css']
})

export class FeedbackModal implements OnInit {
  constructor(private _modalService: NgbModal, public activeModal: NgbActiveModal, private _httpService: HttpService, private _toastService: ToastService) { }

  public authUserId: number | null = null;
  public feedbacks: FeedbackParams[] = [];
  public selectedIds: number[] = [];

  public toggleSelection(id: number): void {
    const idIndex = this.selectedIds.indexOf(id);
    idIndex > -1 ? this.selectedIds.splice(idIndex, 1) : this.selectedIds.push(id);
  }

  private _getFeedbackInfo() {
    this._httpService.get('api/feedback/get').subscribe((data: FeedbackParams[]) => {
      this.feedbacks = data;
    },
      error => this.activeModal.dismiss(error))
  }

  public deleteFeedbacks(): void {
    if (this.selectedIds.length) {
      let modalRef = this._modalService.open(ConfirmModal);
      modalRef.result.then((result) => {
        if (result instanceof Observable) {
          result.subscribe((data: ResultInfo) => {
            const report: ResultInfo = data;
            if (report.status === 'FeedbacksDeleted') {
              this._toastService.showSuccess(report.info);
              this._getFeedbackInfo();
            } else {
              this._toastService.showDanger(report.info);
            }
          },
            error => this._toastService.showDanger(error.message)
          );
        }
      }, (reason) => { });
      modalRef.componentInstance.modalWindowParams = new ConfirmModalParams('post', 'Удаление обратной связи', 'Вы действительно хотите удалить выбранную информацию?', null, 0,
        'api/feedback/delete', { ids: this.selectedIds });
    } else {
      this._toastService.showDanger('Не выбраны строки для удаления');
    }
  }

  ngOnInit() {
    this._getFeedbackInfo();
  }
}
