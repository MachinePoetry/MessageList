import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserRequestInfo } from './../../models/userRequestInfo';
import { HttpService } from './../../services/http-service/http.service';

@Component({
  selector: 'activity-history',
  templateUrl: './activity-history.modal.html',
  styleUrls: ['./activity-history.modal.css']
})

export class ActivityHistoryModal implements OnInit {
  constructor(public activeModal: NgbActiveModal, private _httpService: HttpService) { }

  @Input() authUserId: number;

  public userActivities: UserRequestInfo[] = [];

  ngOnInit() {
    this._httpService.get('api/users/getUserActivityHistory', { authUserId: this.authUserId }).subscribe((data: UserRequestInfo[]) => {
      this.userActivities = data;
    });
  }

  public cancel(closeType: string) {
    this.activeModal.close(closeType);
  }
}
