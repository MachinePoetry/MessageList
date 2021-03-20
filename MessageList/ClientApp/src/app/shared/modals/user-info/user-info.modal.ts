import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpService } from './../../services/http-service/http.service';
import { TextService } from './../../services/text-service/text.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserInfoParams } from './../../../shared/models/params/userInfoParams';
import { Role } from './../../../shared/models/role';

@Component({
  selector: 'user-info-modal',
  templateUrl: './user-info.modal.html',
  styleUrls: ['./user-info.modal.css']
})

export class UserInfoModal implements OnInit {
  constructor(public activeModal: NgbActiveModal, private _httpService: HttpService, public textService: TextService) { }

  public userInfo: UserInfoParams = null;
  public loadAllMessages: boolean = false;
  public newPassword: string = '';
  public confirmNewPassword: string = '';
  public roles: Role[] = [];

  public onSubmit(form: NgForm): void {
    if (form.valid && (this.loadAllMessages || (this.userInfo.messagesToLoadAmount >= 20 && this.userInfo.messagesToLoadAmount <= 10000)) && this.userInfo.rolesIds.includes(1)) {
      this.userInfo.messagesToLoadAmount = this.loadAllMessages ? 0 : this.userInfo.messagesToLoadAmount;
      this.userInfo.password = this.newPassword;
      this.activeModal.close(this.userInfo);
    }
  }

  ngOnInit() {
    this._httpService.get('api/admin/getRoles').subscribe((data: Role[]) => {
      this.roles = data;
      if (this.userInfo.mode === 'create' && this.userInfo && this.roles.length > 0) {
        this.userInfo.rolesIds = [this.roles[0].id];
      } else if (this.userInfo.mode === 'update' && this.userInfo && this.roles.length > 0) {
        this.userInfo.roles.length <= 1 ? this.userInfo.rolesIds = [this.roles[0].id] : this.userInfo.rolesIds = [this.roles[0].id, this.roles[1].id];
      }
    })
    this.loadAllMessages = (this.userInfo.messagesToLoadAmount === 0);
  }
}
