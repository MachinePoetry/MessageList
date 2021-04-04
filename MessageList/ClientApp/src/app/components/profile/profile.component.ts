import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { User } from './../../shared/models/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivityHistoryModal } from './../../shared/modals/activity-history/activity-history.modal';
import { UserManagementModal } from './../../shared/modals/user-management/user-management.modal';
import { FeedbackModal } from './../../shared/modals/feedback/feedback.modal';
import { ChangeMessagesToLoadParams } from './../../shared/models/params/changeMessagesToLoadParams';
import { ChangePasswordKeyParams } from './../../shared/models/params/changePasswordKeyParams';
import { HttpService } from './../../shared/services/http-service/http.service';
import { ToastService } from './../../shared/services/toast-service/toast.service';
import { ResultInfo } from './../../shared/models/resultInfo';
import { ChangePasswordMode } from './../../shared/models/componentModes/changePasswordMode';
import { UserRequestInfo } from './../../shared/models/userRequestInfo';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private _httpService: HttpService, private _toastService: ToastService, private _modalService: NgbModal, private _route: ActivatedRoute) { }

  public authUserInfo: User = new User;
  public messagesToLoadAmount: number = 20;
  public loadAllMessages: boolean = false;
  public isKeyChanging: boolean = false;
  public progressBarValue: number = 0;
  public isHidden: boolean = true;
  public keyForPasswordChange: string = '';
  public uptime: number = 0;
  public lastUserRequest: UserRequestInfo = new UserRequestInfo();
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
      this.isHidden = false;
      let params: ChangeMessagesToLoadParams = new ChangeMessagesToLoadParams(this.authUserInfo.id, this.messagesToLoadAmount);
      this.progressBarValue = 30;
      this._httpService.post('/api/users/setMessagesToLoadCounter', params).subscribe((data: ResultInfo) => {
        this.progressBarValue = 50;
        this._report = data;
        this._report.status === 'AmountOfLoadedMessagesChanged' ? this._toastService.showSuccess(this._report.info) : this._toastService.showDanger(this._report.info);
        this._refreshAuthUserInfo(() => this.loadAllMessages = (this.authUserInfo.messagesToLoadAmount === 0));  
        this.progressBarValue = 100;
        setTimeout(() => {
          this.isHidden = true;
          this.progressBarValue = 0;
        }, 700);
      },
        error => this._toastService.showDanger(error.message)
      )
    }
  }

  public onChangeKeyFormSubmit(form: NgForm): void {
    if (form.valid) {
      this.isHidden = false;
      this.isKeyChanging = true;
      let params: ChangePasswordKeyParams = new ChangePasswordKeyParams(this.authUserInfo.id, this.keyForPasswordChange);
      this.progressBarValue = 30;
      this._httpService.post('/api/users/setChangePasswordKey', params).subscribe((data: ResultInfo) => {
        this.progressBarValue = 50;
        this._report = data;
        this._report.status === 'KeySaved' ? this._toastService.showSuccess(this._report.info) : this._toastService.showDanger(this._report.info);
        this._refreshAuthUserInfo(); 
        this.progressBarValue = 100;
        this.isKeyChanging = false;
        setTimeout(() => {
          this.isHidden = true;
          this.progressBarValue = 0;
        }, 700);
      },
        error => this._toastService.showDanger(error.message)
      )
      form.resetForm();
    }
  }

  public openUserManagementModal(): void {
    let modalRef = this._modalService.open(UserManagementModal, { centered: true, size: 'lg' });
    modalRef.result.then((result) => { }, (reason) => {
      if (reason.status) {
        reason.status === 403 ? this._toastService.showDanger('Доступ запрещен!') : this._toastService.showDanger(reason.message);
      }
    });
    modalRef.componentInstance.authUserId = this.authUserInfo.id;
  }

  public openFeedbackModal(): void {
    let modalRef = this._modalService.open(FeedbackModal, { centered: true, size: 'lg' });
    modalRef.result.then((result) => { }, (reason) => {
      if (reason.status) {
        reason.status === 403 ? this._toastService.showDanger('Доступ запрещен!') : this._toastService.showDanger(reason.message);
      }
    });
  }

  public showProgressBar(value: number): void {
    if (value > 0 && value < 100) {
      this.isHidden = false;
      this.progressBarValue = value;
    } else if (value === 100) {
      this.progressBarValue = value;
      setTimeout(() => {
        this.isHidden = true;
        this.progressBarValue = 0;
      }, 700);
    }
  }

  public getChangedPasswordResult(result: ResultInfo): void {
    if (result.status === 'PasswordChanged') {
      this._toastService.showSuccess(result.info);
    } else {
      this._toastService.showDanger(result.info);
    }
  }

  public activityHistoryModalOpen(): void {
    let modalRef = this._modalService.open(ActivityHistoryModal, { centered: true });
    modalRef.result.then((result) => { }, (reason) => { });
    modalRef.componentInstance.authUserId = this.authUserInfo.id;
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
    this._httpService.get('/api/users/getLastUserActivity', { authUserId: this.authUserInfo?.id }).subscribe((data: UserRequestInfo) => {
      this.lastUserRequest = data;
    })
  }

  ngOnDestroy() {
    this._toastService.toasts = []
  }
}
