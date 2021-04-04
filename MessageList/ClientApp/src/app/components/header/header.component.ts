import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../shared/services/http-service/http.service'
import { User } from './../../shared/models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  constructor(private _httpService: HttpService, private _router: Router) { };

  @Input() public authUserInfo: User;

  public signOut(): void {
    sessionStorage.setItem("isGreeted", 'false');
    this._httpService.get('api/account/signOut').subscribe((data: User) => {
      this.authUserInfo = data;
      this._router.navigate(['/'])
    });
  }
}
