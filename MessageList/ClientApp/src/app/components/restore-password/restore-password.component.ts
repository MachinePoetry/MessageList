import { Component, ViewChild } from '@angular/core';
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

  @ViewChild('validateKeyForm') validateKeyForm: NgForm;

  public step: number = 1;
  public isKeyValidationProcess: boolean = false;
  public progressBarValue: number = 0;
  public isHidden: boolean = true;
  public validateKeyParams: ValidateKeyParams = new ValidateKeyParams();
  public changePasswordMode = ChangePasswordMode;
  public authUserInfo: User = new User();
  private _result: ResultInfo = new ResultInfo();

  public onSubmit(form: NgForm): void {
    if (form.valid) {
      this.isHidden = false;
      this.isKeyValidationProcess = true;
      this.progressBarValue = 30;
      this._httpService.post('/api/users/validateChangePasswordKey', this.validateKeyParams).subscribe((data: any) => {
        this.progressBarValue = 50;
        if (data.email && data.email.length) {
          this.authUserInfo = data;
          this.step = 2;
        } else if (data.status && data.info) {
          this._result = data;
          this._toastService.showDanger(this._result.info);
        }
        this.isKeyValidationProcess = false;
        this.progressBarValue = 100;
        setTimeout(() => {
          this.isHidden = true;
          this.progressBarValue = 0;
        }, 700);
      },
        error => {
          this._toastService.showDanger(error.message);
          this.isKeyValidationProcess = false;
        }
      )
    }
  }

  public showProgressBar(value: number): void {
    if (value > 0 && value < 100) {
      this.isHidden = false;
      this.progressBarValue = value;
    } else if (value === 100) {
      this.progressBarValue = value;
      setTimeout(() => {
        this.isHidden = true;
        this.progressBarValue = 0;
      }, 700);
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
