import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../shared/services/httpService/http-service.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  constructor(private httpService: HttpService) { }

  public errorText: string;
  public authUserInfo: any;

  parseDateToRussianLocale(date: string): string {
    return new Date(date).toLocaleString("ru");
  }

  ngOnInit() {
    this.httpService.get('api/users/getAuthUserInfo').subscribe(data => {
      this.authUserInfo = data;
    });
  }
}
