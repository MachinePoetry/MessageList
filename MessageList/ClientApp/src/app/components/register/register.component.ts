import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../shared/services/httpService/http-service.service';
import { ToastService } from '../../shared/services/toastService/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TermsOfUseModal } from '../../shared/modals/termsOfUse/terms-of-use.modal';
import { ResultInfo } from '../../shared/models/resultInfo';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  constructor(private _httpService: HttpService, private _router: Router, private _toastService: ToastService, private _modalService: NgbModal) { }

  public params: { email: string, password: string, confirmPassword: string } = {
    email: '',
    password: '',
    confirmPassword: ''
  }

  public isDisabled: boolean = false;
  public isSpinnerShow: boolean = false;
  public progressBarValue: number = 0;
  public isHidden: boolean = true;
  private _report: ResultInfo = new ResultInfo();
  private readonly _notOnlySpaceBar = /\S/;

  public open(): void {
    this._modalService.open(TermsOfUseModal);
  }

  public onSubmit(form: NgForm): void {
    if (form.valid && this._notOnlySpaceBar.test(this.params.email) && this._notOnlySpaceBar.test(this.params.password) &&
      this._notOnlySpaceBar.test(this.params.confirmPassword)) {
      this.isHidden = false;
      this.progressBarValue = 0;
      this.isDisabled = true;
      this.isSpinnerShow = true;
      this.progressBarValue = 30;
      this._httpService.post('/api/account/register', this.params).subscribe((data: ResultInfo) => {
        this.progressBarValue = 50;
        this._report = data;
        this.isDisabled = false;
        this.isSpinnerShow = false;
        this._toastService.showSuccess(this._report.info);
        this.progressBarValue = 100;
        if (this.progressBarValue === 100) {
          setTimeout(() => {
            this.isHidden = true;
            this.progressBarValue = 0;
          }, 700);
        }
        if (this._report.status == 'UserCreated') {
          this._router.navigate(['/main'])
        }
      },
        error => this._toastService.showDanger(error.message)
      );
      form.resetForm({ email: this.params.email, password: this.params.password, confirmPassword: this.params.confirmPassword });
    }
  }
}
