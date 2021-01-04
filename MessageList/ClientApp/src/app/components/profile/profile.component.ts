import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../shared/models/User';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  constructor(private _route: ActivatedRoute) { }

  public authUserInfo: User; 

  parseDateToRussianLocale(date: string): string {
    return new Date(date).toLocaleString("ru");
  }

  ngOnInit() {
    this.authUserInfo = this._route.snapshot.data['user'];
  }
}
