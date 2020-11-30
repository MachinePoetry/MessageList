import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot  } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from '../../shared/services/httpService/http-service.service';
import { map } from 'rxjs/operators'

@Injectable()
export class AuthUserInfoResolver implements Resolve<Object> {
  constructor(private httpService: HttpService, private _router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Object> {
    return this.httpService.get('api/users/getAuthUserInfo').pipe(map(data => data ? data = data : this._router.navigate(['/login'])));
  }
}
