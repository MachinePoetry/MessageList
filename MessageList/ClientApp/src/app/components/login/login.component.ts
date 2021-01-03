import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../shared/services/httpService/http.service';
import { ToastService } from '../../shared/services/toastService/toast.service';
import { ResultInfo } from '../../shared/models/resultInfo';
import { ILogin } from './../../shared/models/interfaces/ILogin';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  constructor(private _httpService: HttpService, private _router: Router, private _toastService: ToastService) { }

  public params: ILogin = {
    email: '',
    password: ''
  }

  public isDisabled: boolean = false;
  public isSpinnerShow: boolean = false;
  public progressBarValue: number = 0;
  public isHidden: boolean = true;
  private _report: ResultInfo = new ResultInfo();
  private readonly _notOnlySpaceBar = /\S/;

  public onSubmit(form: NgForm): void {
    if (form.valid && this._notOnlySpaceBar.test(this.params.email) && this._notOnlySpaceBar.test(this.params.password)) {
      this.isHidden = false;
      this.progressBarValue = 0;
      this.isDisabled = true;
      this.isSpinnerShow = true;
      this.progressBarValue = 30;
      this._httpService.post('/api/account/login', this.params).subscribe((data: ResultInfo) => {
        this.progressBarValue = 50;
        this._report = data;
        this.isDisabled = false;
        this.isSpinnerShow = false;
        this._toastService.showSuccess(this._report.info);
        this.progressBarValue = 100;
        setTimeout(() => {
          this.isHidden = true;
          this.progressBarValue = 0;
        }, 700);
        if (this._report.status == 'AuthSuccess') {
          this._router.navigate(['/main'])
        }
      },
        error => this._toastService.showDanger(error.message)
      );
      form.resetForm({ email: this.params.email, password: this.params.password });
    }
  }
}
