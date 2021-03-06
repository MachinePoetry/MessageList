import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()

export class HttpService {
  constructor(private _http: HttpClient) { }

  // arrow notation here is mostly to save 'this' as current object for using get/post/etc in other methods and delegates outside http-service
  public get = (url: string, queryParams?: Object) => {
    let query: Observable<Object>;

    if (queryParams) {
      let httpParams: HttpParams = new HttpParams();

      for (let param in queryParams) {
        httpParams = httpParams.set(param, queryParams[param]);
      }

      query = this._http.get(url, { params: httpParams });
    }
    else {
      query = this._http.get(url);
    }
    return query;
  }

  public post = (url: string, params: object) => {
    return this._http.post(url, params);
  }
}
