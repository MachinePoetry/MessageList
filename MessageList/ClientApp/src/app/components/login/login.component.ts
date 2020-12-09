import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../shared/services/httpService/http-service.service';
import { ToastService } from '../../shared/services/toastService/toast.service';
import { ResultInfo } from '../../shared/models/resultInfo';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private _httpService: HttpService, private _router: Router, private _toastService: ToastService) { }

  public params: { email: string, password: string } = {
    email: '',
    password: ''
  }

  public isDisabled: boolean = false;
  public isSpinnerShow: boolean = false;
  private _report: ResultInfo = new ResultInfo();

  public onSubmit(): void {
    this.isDisabled = true;
    this.isSpinnerShow = true;
    this._httpService.post('/api/account/login', this.params).subscribe((data: ResultInfo) => {
      this._report = data;
      this.isDisabled = false;
      this.isSpinnerShow = false;
      this._toastService.showSuccess(this._report.info);
      if (this._report.status == 'AuthSuccess') {
        this._router.navigate(['/main'])
      }
    },
      error => this._toastService.showDanger(error.message)
    );
  }
}
