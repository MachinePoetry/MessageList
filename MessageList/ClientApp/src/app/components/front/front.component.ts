import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpService } from '../../shared/services/http-service/http.service';
import { ToastService } from '../../shared/services/toast-service/toast.service';
import { ResultInfo } from '../../shared/models/resultInfo';
import { User } from './../../shared/models/user';
import { FeedbackParams } from './../../shared/models/params/feedbackParams';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.css']
})

export class FrontComponent implements OnInit {
  constructor(private _httpService: HttpService, private _toastService: ToastService) { }

  @ViewChild('feedbackForm') feedbackForm: NgForm;

  public params: FeedbackParams = new FeedbackParams();

  public isDisabled: boolean = false;
  public isSpinnerShow: boolean = false;
  private _report: ResultInfo = new ResultInfo();
  private readonly _notOnlySpaceBar = /\S/;

  public authUserInfo: User;

  public onSubmit(form: NgForm): void {
    if (form.valid && this._notOnlySpaceBar.test(this.params.feedbackText) && (this.params.feedbackContacts.length ? this._notOnlySpaceBar.test(this.params.feedbackContacts) : true)) {
      this.isDisabled = true;
      this.isSpinnerShow = true;
      this._httpService.post('/api/feedback/create', this.params).subscribe((data: ResultInfo) => {
        this._report = data;
        this.isDisabled = false;
        this.isSpinnerShow = false;
        this._report.status === 'FeedbackCreated' ? this._toastService.showSuccess(this._report.info) : this._toastService.showDanger(this._report.info);
      },
        error => this._toastService.showDanger(error.message)
      );
      form.resetForm({ feedbacktText: '', feedbackContacts: ''});
    }
  }

  ngOnInit() {
    this._httpService.get('api/users/getAuthUserInfo').subscribe((data: User) => {
      this.authUserInfo = data;
    });
  }
}
