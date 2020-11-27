import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()

export class HttpService {

  constructor(private http: HttpClient) { }

  query: Observable<Object>;

  get(url: string): Observable<Object>
  get(url: string, queryParams: Object): Observable<Object>
  get(url: string, queryParams?: Object): Observable<Object> {

    if (queryParams) {
      let httpParams: HttpParams = new HttpParams();

      for (let param in queryParams) {
        httpParams = httpParams.set(param, queryParams[param]);
      }

      this.query = this.http.get(url, { params: httpParams });
    }
    else {
      this.query = this.http.get(url);
    }
    return this.query;
  }

  post(url: string, params: Object): Observable<Object> {
    return this.http.post(url, params);
  }
}
