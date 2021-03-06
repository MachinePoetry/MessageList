import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpService } from './../../shared/services/http-service/http.service';
import { User } from './../../shared/models/user';
import { ResultInfo } from './../../shared/models/resultInfo';
import { ChangePasswordParams } from './../../shared/models/params/changePasswordParams';
import { ChangePasswordMode } from './../../shared/models/componentModes/changePasswordMode';

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  constructor(private _httpService: HttpService) { }

  @ViewChild('changePasswordForm') changePasswordForm: NgForm;

  @Input() public authUserInfo: User = new User();
  @Input() public mode: string;
  @Output() changePasswordResult = new EventEmitter<ResultInfo>();
  @Output() changePasswordProgress = new EventEmitter<number>();

  public isPasswordChanging: boolean = false;
  public progressBarValue: number = 0;
  public changePasswordParams: ChangePasswordParams = new ChangePasswordParams();
  public changePasswordMode = ChangePasswordMode;
  private _report: ResultInfo = new ResultInfo();

  public onSubmit(form: NgForm): void {
    let params = {};
    if (this.mode === this.changePasswordMode.profile) {
      params = { authUserId: this.authUserInfo.id, oldPassword: this.changePasswordParams.oldPassword, newPassword: this.changePasswordParams.newPassword, mode: this.mode }
    } else if (this.mode === this.changePasswordMode.restore) {
      params = { authUserId: this.authUserInfo.id, newPassword: this.changePasswordParams.newPassword, mode: this.mode }
    }
    if (form.valid) {
      this.isPasswordChanging = true;
      this.changePasswordProgress.emit(30);
      this._httpService.post('/api/users/changePassword', params).subscribe((data: ResultInfo) => {
        this.changePasswordProgress.emit(50);
        this._report = data;
        this.changePasswordResult.emit(this._report);
        this.isPasswordChanging = false;
        this.changePasswordProgress.emit(100);
      },
        error => {
          this._report.status = 'ChangePasswordFailed';
          this._report.info = error.message;
          this.changePasswordResult.emit(this._report);
          this.isPasswordChanging = false;
        }
      )
    }
  }
}
