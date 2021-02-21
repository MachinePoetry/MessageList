import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { User } from './../../shared/models/user';
import { ChangeMessagesToLoadParams } from './../../shared/models/params/changeMessagesToLoadParams';
import { ChangePasswordKeyParams } from './../../shared/models/params/changePasswordKeyParams';
import { HttpService } from './../../shared/services/http-service/http.service';
import { ToastService } from './../../shared/services/toast-service/toast.service';
import { ResultInfo } from './../../shared/models/resultInfo';
import { ChangePasswordMode } from './../../shared/models/componentModes/changePasswordMode';

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
  public isKeyChanging: boolean = false;
  public keyForPasswordChange: string = '';
  public uptime: number = 0;
  private _report: ResultInfo = new ResultInfo();
  public changePasswordMode = ChangePasswordMode;

  private _refreshAuthUserInfo(addActionsToPromise?: () => void): void {
    this._httpService.get('api/users/getAuthUserInfo').subscribe((data: User) => {
      this.authUserInfo = data;
      if (addActionsToPromise) {
        addActionsToPromise();
      }
    },
      error => this._toastService.showDanger(error.message)
    );
  }

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
          this._refreshAuthUserInfo(() => this.loadAllMessages = (this.authUserInfo.messagesToLoadAmount === 0));     
        } else {
          this._toastService.showDanger(this._report.info);
        }
      },
        error => this._toastService.showDanger(error.message)
      )
    }
  }

  public onChangeKeyFormSubmit(form: NgForm): void {
    if (form.valid) {
      this.isKeyChanging = true;
      let params: ChangePasswordKeyParams = new ChangePasswordKeyParams(this.authUserInfo.id, this.keyForPasswordChange);
      this._httpService.post('/api/users/setChangePasswordKey', params).subscribe((data: ResultInfo) => {
        this._report = data;
        this.isKeyChanging = false;
        if (this._report.status === 'KeySaved') {
          this._toastService.showSuccess(this._report.info);
          this._refreshAuthUserInfo(); 
        } else {
          this.isKeyChanging = false;
          this._toastService.showDanger(this._report.info);
        }
      },
        error => this._toastService.showDanger(error.message)
      )
      form.resetForm();
    }
  }

  public getChangedPasswordResult(result: ResultInfo): void {
    if (result.status === 'PasswordChanged') {
      this._toastService.showSuccess(result.info);
    } else {
      this._toastService.showDanger(result.info);
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
