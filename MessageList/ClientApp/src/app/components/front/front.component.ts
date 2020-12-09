import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../shared/services/httpService/http-service.service';
import { ToastService } from '../../shared/services/toastService/toast.service';
import { ResultInfo } from '../../shared/models/resultInfo';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.css']
})

export class FrontComponent implements OnInit {
  constructor(private _httpService: HttpService, private _toastService: ToastService) { }

  public params: { reportText: string, reportContacts: string } = {
    reportText: '',
    reportContacts: ''
  }

  public isDisabled: boolean = false;
  private _report: ResultInfo = new ResultInfo();

  public authUserInfo: any;

  public onSubmit(): void {
    this.isDisabled = true;
    this._httpService.post('/api/bugReport/create', this.params).subscribe((data: ResultInfo) => {
      this._report = data;
      this.isDisabled = false;
      this._toastService.showSuccess(this._report.info);
    },
      error => this._toastService.showDanger(error.message)
    );
    this.params.reportText = this.params.reportContacts = '';
  }

  ngOnInit() {
    this._httpService.get('api/users/getAuthUserInfo').subscribe(data => {
      this.authUserInfo = data;
    });
  }
}
