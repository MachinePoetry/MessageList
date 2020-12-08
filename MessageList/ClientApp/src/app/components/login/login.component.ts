import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../shared/services/httpService/http-service.service';
import { ResultInfo } from '../../shared/models/resultInfo';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private _httpService: HttpService, private _router: Router) {  }

  public params: { email: string, password: string } = {
    email: '',
    password: ''
  }

  public isDisabled: boolean = false;
  public showAlert: boolean = false;
  public alertText: string = '';
  public _report: ResultInfo = new ResultInfo();

  public onSubmit(): void {
    this.isDisabled = true;
    this._httpService.post('/api/account/login', this.params).subscribe((data: ResultInfo) => {
      this._report = data;
      this.isDisabled = false;
      this.params.email = this.params.password = ''; 
      this.alertText = this._report.info;
      this.showAlert = true;
      setTimeout(() => this.showAlert = false, 5000);
      if (this._report.status == 'AuthSuccess') {
        this._router.navigate(['/main'])
      }
    },
      error => this.alertText = error.message);
  }

}
