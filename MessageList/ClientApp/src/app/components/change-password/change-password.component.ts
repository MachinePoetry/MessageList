import { Component, Input, Output, EventEmitter } from '@angular/core';
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

  @Input() public authUserInfo: User = new User();
  @Input() public mode: string;
  @Output() processChangePasswordResult = new EventEmitter<ResultInfo>();

  public isPasswordChanging: boolean = false;
  public changePasswordParams = new ChangePasswordParams();
  public changePasswordMode = ChangePasswordMode;
  private _report: ResultInfo = new ResultInfo();

  public onSubmit(form: NgForm): void {
    let params = {};
    if (this.mode === this.changePasswordMode.profile) {
      params = { authUserId: this.authUserInfo.id, oldPassword: this.changePasswordParams.oldPassword, newPassword: this.changePasswordParams.newPassword }
    } else if (this.mode === this.changePasswordMode.restore) {
      params = { authUserId: this.authUserInfo.id, newPassword: this.changePasswordParams.newPassword }
    }
    if (form.valid) {
      this._httpService.post('/api/users/changePassword', params).subscribe((data: ResultInfo) => {
        this._report = data;
        this.processChangePasswordResult.emit(this._report);
      },
        error => {
          this._report.status = 'ChangePasswordFailed';
          this._report.info = error.message;
          this.processChangePasswordResult.emit(this._report);
        }
      )
    }
  }
}
