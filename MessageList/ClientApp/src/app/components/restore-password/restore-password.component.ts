import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from './../../shared/models/user';
import { HttpService } from './../../shared/services/http-service/http.service';
import { ToastService } from './../../shared/services/toast-service/toast.service';
import { ResultInfo } from './../../shared/models/resultInfo';
import { ValidateKeyParams } from './../../shared/models/params/validateKeyParams';
import { ChangePasswordMode } from './../../shared/models/componentModes/changePasswordMode';

@Component({
  selector: 'restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.css']
})

export class RestorePasswordComponent {
  constructor(private _httpService: HttpService, private _router: Router, private _toastService: ToastService) { }

  public step: number = 1;
  public isKeyValidationProcess: boolean = false;
  public validateKeyParams: ValidateKeyParams = new ValidateKeyParams();
  public changePasswordMode = ChangePasswordMode;
  private _report: ResultInfo = new ResultInfo();
  public authUserInfo: User = new User();

  public onSubmit(form: NgForm): void {
    if (form.valid) {
      this.isKeyValidationProcess = true;
      this._httpService.post('/api/users/validateChangePasswordKey', this.validateKeyParams).subscribe((data: User) => {
        this.authUserInfo = data;
        if (this.authUserInfo.email && this.authUserInfo.email.length) {
          this.step = 2;
        } else {
          this._toastService.showDanger('Неправильный email или ключ');
        }
        this.isKeyValidationProcess = false;
      },
        error => {
          this._toastService.showDanger(error.message);
          this.isKeyValidationProcess = false;
        }
      )
    }
  }

  public getChangedPasswordResult(result: ResultInfo): void {
    if (result.status === 'PasswordChanged') {
      this._toastService.showSuccess(result.info);
      this._router.navigate(['/login'])
    } else {
      this._toastService.showDanger(result.info);
    }
  }
}
