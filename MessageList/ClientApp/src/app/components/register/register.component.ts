import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../shared/services/httpService/http-service.service';
import { ResultInfo } from '../../shared/models/resultInfo';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private httpService: HttpService, private _router: Router) { }

  public params: { email: string, password: string } = {
    email: '',
    password: ''
  }

  public showAlert: boolean;
  public report: ResultInfo;
  public errorText: string;

  onSubmit(): void {
    this.httpService.post('/api/account/register', this.params).subscribe((data: ResultInfo) => {
      this.params.email = '';
      this.params.password = '';
      this.report = data;
      this.showAlert = true;
      if (this.report.status == 'UserCreated') {
        this._router.navigate(['/main'])
      }
    },
      error => this.errorText = error.message);
  }
}
