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

  constructor(private _httpService: HttpService, private _router: Router) { }

  public params: { email: string, password: string } = {
    email: '',
    password: ''
  }

  public showAlert: boolean = false;
  public alertText: string = '';
  private _report: ResultInfo = new ResultInfo();

  public onSubmit(): void {
    this._httpService.post('/api/account/register', this.params).subscribe((data: ResultInfo) => {
      this._report = data;
      this.params.email = this.params.password = ''; 
      this.alertText = this._report.info;
      this.showAlert = true;
      setTimeout(() => this.showAlert = false, 5000);
      if (this._report.status == 'UserCreated') {
        this._router.navigate(['/main'])
      }
    },
      error => this.alertText = error.message);
  }
}
