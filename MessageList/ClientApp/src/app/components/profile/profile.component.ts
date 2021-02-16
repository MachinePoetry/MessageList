import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../shared/models/user';
import { HttpService } from '../../shared/services/http-service/http.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  constructor(private _httpService: HttpService, private _route: ActivatedRoute) { }

  public authUserInfo: User = new User;
  public uptime: number = 0;

  ngOnInit() {
    this.authUserInfo = this._route.snapshot.data['user'];
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
