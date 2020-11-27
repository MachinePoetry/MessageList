import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../shared/services/httpService/http-service.service'
import { ResultInfo } from '../../shared/models/resultInfo';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.css']
})

export class FrontComponent implements OnInit {
  constructor(private httpService: HttpService) { }

  public params: { reportText: string, reportContacts: string } = {
    reportText: '',
    reportContacts: ''
  }

  public showAlert: boolean;
  public report: ResultInfo;
  public errorText: string;

  public authUserInfo: any;

  onSubmit(): void {
    this.httpService.post('/api/bugReport/create', this.params).subscribe((data: ResultInfo) => {
      this.params.reportText = '';
      this.params.reportContacts = '';
      this.report = data;
      this.showAlert = true;
    },
      error => this.errorText = error.message
    );
  }

  ngOnInit() {
    this.httpService.get('api/users/getAuthUserInfo').subscribe(data => {
      this.authUserInfo = data;
    });
  }
}
