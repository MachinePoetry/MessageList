import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
let HttpService = class HttpService {
    constructor(http) {
        this.http = http;
    }
    get(url, queryParams) {
        if (queryParams) {
            let httpParams = new HttpParams();
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
    post(url, params) {
        return this.http.post(url, params);
    }
};
HttpService = __decorate([
    Injectable()
], HttpService);
export { HttpService };
//# sourceMappingURL=http-service.service.js.map