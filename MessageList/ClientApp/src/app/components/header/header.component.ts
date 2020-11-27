import { Component, Input } from '@angular/core';
import { HttpService } from '../../shared/services/httpService/http-service.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private httpService: HttpService) { };

  @Input() public authUserInfo: any;

  signOut() {
    this.httpService.get('api/account/signOut').subscribe(data => {
      this.authUserInfo = [];
      // TO DO: Change this one below for routing command
      window.location.href = "/";
    });
  }
}
