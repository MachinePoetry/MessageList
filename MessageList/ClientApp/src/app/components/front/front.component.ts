import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../shared/services/httpService/http-service.service'
import { ResultInfo } from '../../shared/models/resultInfo';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.css']
})

export class FrontComponent implements OnInit {
  constructor(private _httpService: HttpService) { }

  public params: { reportText: string, reportContacts: string } = {
    reportText: '',
    reportContacts: ''
  }

  public isDisabled: boolean = false;
  public showAlert: boolean = false;
  public alertText: string = '';
  private _report: ResultInfo = new ResultInfo();

  public authUserInfo: any;

  public onSubmit(): void {
    this.isDisabled = true;
    this._httpService.post('/api/bugReport/create', this.params).subscribe((data: ResultInfo) => {
      this._report = data;
      this.isDisabled = false;
      this.params.reportText = this.params.reportContacts = '';
      this.alertText = this._report.info;
      this.showAlert = true;
      setTimeout(() => this.showAlert = false, 5000);
    },
      error => this.alertText = error.message
    );
  }

  ngOnInit() {
    this._httpService.get('api/users/getAuthUserInfo').subscribe(data => {
      this.authUserInfo = data;
    });
  }
}
