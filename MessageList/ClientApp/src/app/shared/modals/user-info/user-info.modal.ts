import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserInfoParams } from './../../../shared/models/params/userInfoParams';

@Component({
  selector: 'user-info-modal',
  templateUrl: './user-info.modal.html',
  styleUrls: ['./user-info.modal.css']
})

export class UserInfoModal{
  constructor(public activeModal: NgbActiveModal) { }

  public userInfo: UserInfoParams = null;
  public loadAllMessages: boolean = false;
  public isUserInfoUpdating: boolean = false;
  public newPassword: string = '';
  public confirmNewPassword: string = '';

  public onSubmit(form: NgForm): void {

  }
}
