import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { User } from './../../shared/models/user';
import { ChangeMessagesToLoadParams } from './../../shared/models/params/ChangeMessagesToLoadParams';
import { HttpService } from './../../shared/services/http-service/http.service';
import { ToastService } from './../../shared/services/toast-service/toast.service';
import { ResultInfo } from './../../shared/models/resultInfo';
import { ChangePasswordParams } from './../../shared/models/params/changePasswordParams';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit, AfterViewInit {
  constructor(private _httpService: HttpService, private _toastService: ToastService, private _route: ActivatedRoute) { }

  public authUserInfo: User = new User;
  public messagesToLoadAmount: number = 20;
  public loadAllMessages: boolean = false;
  public isPasswordChanging: boolean = false;
  public uptime: number = 0;
  public changePasswordParams = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };
  private _report: ResultInfo = new ResultInfo();

  public onMessagesToLoadFormSubmit(form: NgForm): void {
    if (this.loadAllMessages) {
      this.messagesToLoadAmount = 0;
    }
    if (this.messagesToLoadAmount != this.authUserInfo.messagesToLoadAmount && (this.loadAllMessages || (this.messagesToLoadAmount >= 20 && this.messagesToLoadAmount <= 10000))) {
      let params: ChangeMessagesToLoadParams = new ChangeMessagesToLoadParams(this.authUserInfo.id, this.messagesToLoadAmount);
      this._httpService.post('/api/users/setMessagesToLoadCounter', params).subscribe((data: ResultInfo) => {
        this._report = data;
        if (this._report.status === 'AmountOfLoadedMessagesChanged') {
          this._toastService.showSuccess(this._report.info);
          this._httpService.get('api/users/getAuthUserInfo').subscribe((data: User) => {
            this.authUserInfo = data;
            this.loadAllMessages = (this.authUserInfo.messagesToLoadAmount === 0);
          });
        } else {
          this._toastService.showDanger(this._report.info);
        }
      },
        error => this._toastService.showDanger(error.message)
      )
    }
  }

  public onChangePasswordFormSubmit(form: NgForm): void {
    if (form.valid) {
      let params = new ChangePasswordParams(this.authUserInfo.id, this.changePasswordParams.oldPassword, this.changePasswordParams.newPassword);
      this._httpService.post('/api/users/changePassword', params).subscribe((data: ResultInfo) => {
        this._report = data;
        if (this._report.status === 'PasswordChanged') {
          this._toastService.showSuccess(this._report.info);
        } else {
          this._toastService.showDanger(this._report.info);
        }
      },
        error => this._toastService.showDanger(error.message)
      )
    }
  }

  ngOnInit() {
    this.authUserInfo = this._route.snapshot.data['user'];
    this.loadAllMessages = (this.authUserInfo.messagesToLoadAmount === 0);
    this.messagesToLoadAmount = this.authUserInfo.messagesToLoadAmount;
  }
  ngAfterViewInit() {
    this._httpService.get('/api/application/getUptime').subscribe((data: number) => {
      this.uptime = data;
      setInterval(() => {
        this.uptime += 1000;
      }, 1000);
    })
  }
}
