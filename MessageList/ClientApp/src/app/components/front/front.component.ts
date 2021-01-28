import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpService } from '../../shared/services/http-service/http.service';
import { ToastService } from '../../shared/services/toast-service/toast.service';
import { ResultInfo } from '../../shared/models/resultInfo';
import { User } from './../../shared/models/User';
import { ReportParams } from './../../shared/models/params/reportParams';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.css']
})

export class FrontComponent implements OnInit {
  constructor(private _httpService: HttpService, private _toastService: ToastService) { }

  public params: ReportParams = new ReportParams();

  public isDisabled: boolean = false;
  public isSpinnerShow: boolean = false;
  private _report: ResultInfo = new ResultInfo();
  private readonly _notOnlySpaceBar = /\S/;

  public authUserInfo: User;

  public onSubmit(form: NgForm): void {
    if (form.valid && this._notOnlySpaceBar.test(this.params.reportText) && this._notOnlySpaceBar.test(this.params.reportContacts)) {
      this.isDisabled = true;
      this.isSpinnerShow = true;
      this._httpService.post('/api/bugReport/create', this.params).subscribe((data: ResultInfo) => {
        this._report = data;
        this.isDisabled = false;
        this.isSpinnerShow = false;
        this._toastService.showSuccess(this._report.info);
      },
        error => this._toastService.showDanger(error.message)
      );
      form.resetForm();
    }
  }

  ngOnInit() {
    this._httpService.get('api/users/getAuthUserInfo').subscribe((data: User) => {
      this.authUserInfo = data;
    });
  }
}
