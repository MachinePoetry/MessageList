import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { HttpService } from './../../services/http-service/http.service';
import { ToastService } from '../../services/toast-service/toast.service';
import { ResultInfo } from './../../models/resultInfo';
import { UserInfoModal } from './../user-info/user-info.modal';
import { ConfirmModal } from './../confirm/confirm.modal';
import { ConfirmModalParams } from './../../models/params/confirmModalParams';
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

  public toggleSelection(id: number): void {
    const idIndex = this.selectedIds.indexOf(id);
    idIndex > -1 ? this.selectedIds.splice(idIndex, 1) : this.selectedIds.push(id);
  }

  private _getUsersInfo() {
    this._httpService.get('api/admin/getUsers').subscribe((data: User[]) => {
      this.users = data;
      this.users = this.users.filter(user => user.id !== this.authUserId);
    })
  }

  private _showToast(firstStringToCheck: string, secondStringToCheck: string, report: ResultInfo) {
    if (report.status === firstStringToCheck || report.status === secondStringToCheck) {
      this._toastService.showSuccess(report.info);
      this._getUsersInfo();
    } else {
      this._toastService.showDanger(report.info);
    }
  }

  public openUserInfoModal(type: string): void {
    let modalRef = this._modalService.open(UserInfoModal);
    modalRef.result.then((userInfo: UserInfoParams) => {
      if (userInfo) {
        const url: string = type === 'create' ? 'api/admin/createUser' : 'api/admin/updateUser';
        this._httpService.post(url, userInfo).subscribe((data: ResultInfo) => {
          const report: ResultInfo = data;
          this._showToast('UserCreated', 'UserUpdated', report);
        },
          error => this._toastService.showDanger(error.message)
        );
      }
    }, (reason) => { });
    let selectedUser: User = this.users.find(u => u.id === this.selectedIds[0]);
    type === 'update' ? modalRef.componentInstance.userInfo = new UserInfoParams(selectedUser, 'update') : modalRef.componentInstance.userInfo = new UserInfoParams(new User(), 'create');
  }

  public deleteUsers(): void {
    if (this.selectedIds.length) {
      let modalRef = this._modalService.open(ConfirmModal);
      modalRef.result.then((result) => {
        if (result instanceof Observable) {
          result.subscribe((data: ResultInfo) => {
            const report: ResultInfo = data;
            this._showToast('UsersDeleted', 'UsersDeleted', report);
          },
            error => this._toastService.showDanger(error.message)
          );
        }
      }, (reason) => { });
      modalRef.componentInstance.modalWindowParams = new ConfirmModalParams('post', 'Удаление пользователей', 'Вы действительно хотите удалить выбранных пользователей?', null, 0,
        'api/admin/deleteUsers', { ids: this.selectedIds });
    } else {
      this._toastService.showDanger('Не выбраны пользователи для удаления');
    }
  }

  ngOnInit() {
    this._getUsersInfo();
  }
}
