import { Component, Input } from '@angular/core';
import { HttpService } from '../../shared/services/httpService/http-service.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  constructor(private _httpService: HttpService) { };

  @Input() public authUserInfo: any;

  public signOut(): void {
    this._httpService.get('api/account/signOut').subscribe(data => {
      this.authUserInfo = [];
    });
  }
}
