import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from './../../services/http-service/http.service';
import { UserInfoModal } from './../user-info/user-info.modal';
import { User } from './../../../shared/models/user';
import { UserInfoParams } from './../../../shared/models/params/userInfoParams';

@Component({
  selector: 'user-management-modal',
  templateUrl: './user-management.modal.html',
  styleUrls: ['./user-management.modal.css']
})

export class UserManagementModal implements OnInit {
  constructor(private _modalService: NgbModal, public activeModal: NgbActiveModal, private _httpService: HttpService) { }

  public authUserId: number | null = null;
  public users: User[] = [];
  public selectedIds: number[] = [];

  public toggleSelection(id: number): void {
    const idIndex = this.selectedIds.indexOf(id);
    idIndex > -1 ? this.selectedIds.splice(idIndex, 1) : this.selectedIds.push(id);
  }

  public openUserInfoModal(type: string): void {
    let modalRef = this._modalService.open(UserInfoModal);
    modalRef.result.then((result) => { }, (reason) => { });
    let selectedUser: User = this.users.find(u => u.id === this.selectedIds[0]);
    type === 'update' ? modalRef.componentInstance.userInfo = new UserInfoParams(selectedUser, 'update') : modalRef.componentInstance.userInfo = new UserInfoParams(new User(), 'create');
  }

  ngOnInit() {
    this._httpService.get('api/admin/getUsers').subscribe((data: User[]) => {
      this.users = data;
    })
  }
}
