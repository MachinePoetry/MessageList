import { Component, Input } from '@angular/core';
import { HttpService } from '../../shared/services/http-service/http.service'
import { User } from './../../shared/models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  constructor(private _httpService: HttpService) { };

  @Input() public authUserInfo: User;

  public signOut(): void {
    sessionStorage.setItem("isGreeted", 'false');
    this._httpService.get('api/account/signOut').subscribe((data: User) => {
      this.authUserInfo = new User();
    });
  }
}
