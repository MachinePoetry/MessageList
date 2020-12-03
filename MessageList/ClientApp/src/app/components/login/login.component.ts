import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../shared/services/httpService/http-service.service';
import { ResultInfo } from '../../shared/models/resultInfo';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [HttpService]
})
export class LoginComponent {

  constructor(private httpService: HttpService, private _router: Router) {  }

  public params: { email: string, password: string } = {
    email: '',
    password: ''
  }

  public showAlert: boolean;
  public report: ResultInfo;
  public errorText: string;

  onSubmit(): void {
    this.httpService.post('/api/account/login', this.params).subscribe((data: ResultInfo) => {
      this.report = data;
      this.showAlert = true;
      if (this.report.status == 'AuthSuccess') {
        this._router.navigate(['/main'])
      }
    },
      error => this.errorText = error.message);
  }

}
