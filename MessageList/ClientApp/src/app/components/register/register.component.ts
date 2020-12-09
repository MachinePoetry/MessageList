import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../shared/services/httpService/http-service.service';
import { ToastService } from '../../shared/services/toastService/toast.service';
import { ResultInfo } from '../../shared/models/resultInfo';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private _httpService: HttpService, private _router: Router, private _toastService: ToastService) { }

  public params: { email: string, password: string, confirmPassword: string } = {
    email: '',
    password: '',
    confirmPassword: ''
  }

  public isDisabled: boolean = false;
  public isSpinnerShow: boolean = false;
  private _report: ResultInfo = new ResultInfo();

  public onSubmit(): void {
    this.isDisabled = true;
    this.isSpinnerShow = true;
    this._httpService.post('/api/account/register', this.params).subscribe((data: ResultInfo) => {
      this._report = data;
      this.isDisabled = false;
      this.isSpinnerShow = false;
      this._toastService.showSuccess(this._report.info);
      if (this._report.status == 'UserCreated') {
        this._router.navigate(['/main'])
      }
    },
      error => this._toastService.showDanger(error.message)
    );
  }
}
