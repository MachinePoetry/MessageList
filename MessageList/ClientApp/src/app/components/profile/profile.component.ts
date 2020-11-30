import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../shared/services/httpService/http-service.service';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  constructor(private httpService: HttpService, private _route: ActivatedRoute) { }

  public errorText: string;
  public authUserInfo: User; 

  parseDateToRussianLocale(date: string): string {
    return new Date(date).toLocaleString("ru");
  }

  ngOnInit() {
    this.authUserInfo = this._route.snapshot.data['user'];
  }
}
