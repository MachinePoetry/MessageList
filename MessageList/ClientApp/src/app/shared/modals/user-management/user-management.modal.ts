import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from './../../services/http-service/http.service';
import { ToastService } from '../../services/toast-service/toast.service';
import { ResultInfo } from './../../models/resultInfo';
import { UserInfoModal } from './../user-info/user-info.modal';
import { User } from './../../../shared/models/user';
import { UserInfoParams } from './../../../shared/models/params/userInfoParams';

@Component({
  selector: 'user-management-modal',
  templateUrl: './user-management.modal.html',
  styleUrls: ['./user-management.modal.css']
})

export class UserManagementModal implements OnInit {
  constructor(private _modalService: NgbModal, public activeModal: NgbActiveModal, private _httpService: HttpService, private _toastService: ToastService) { }

  public authUserId: number | null = null;
  public users: User[] = [];
  public selectedIds: number[] = [];
  private _report: ResultInfo = new ResultInfo();

  public toggleSelection(id: number): void {
    const idIndex = this.selectedIds.indexOf(id);
    idIndex > -1 ? this.selectedIds.splice(idIndex, 1) : this.selectedIds.push(id);
  }

  private _getUsersInfo() {
    this._httpService.get('api/admin/getUsers').subscribe((data: User[]) => {
      this.users = data;
    })
  }

  public openUserInfoModal(type: string): void {
    let modalRef = this._modalService.open(UserInfoModal);
    modalRef.result.then((userInfo: UserInfoParams) => {
      if (userInfo) {
        const url: string = type === 'create' ? 'api/admin/createUser' : 'api/admin/updateUser';
        this._httpService.post(url, userInfo).subscribe((data: ResultInfo) => {
          this._report = data;
          if (this._report.status === 'UserCreated' || this._report.status === 'UserUpdated') {
            this._toastService.showSuccess(this._report.info);
            this._getUsersInfo();
          } else {
            this._toastService.showDanger(this._report.info);
          }
        },
          error => this._toastService.showDanger(error.message)
        );
      } else {
        this._toastService.showDanger('Произошла ошибка при получении данных о пользователе');
      }
    }, (reason) => { });
    let selectedUser: User = this.users.find(u => u.id === this.selectedIds[0]);
    type === 'update' ? modalRef.componentInstance.userInfo = new UserInfoParams(selectedUser, 'update') : modalRef.componentInstance.userInfo = new UserInfoParams(new User(), 'create');
  }

  ngOnInit() {
    this._getUsersInfo();
  }
}
