import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { HttpService } from '../../shared/services/httpService/http-service.service';
let LoginComponent = class LoginComponent {
    constructor(httpService) {
        this.httpService = httpService;
        this.params = {
            email: '',
            password: ''
        };
    }
    onSubmit() {
        this.httpService.post('/api/account/login', this.params).subscribe((data) => {
            this.report = data;
            this.showAlert = true;
            if (this.report.status == 'AuthSuccess') {
                // TO DO: Change tis one below for routing command
                window.location.href = "/main";
            }
        }, error => this.errorText = error.message);
    }
};
LoginComponent = __decorate([
    Component({
        selector: 'app-login',
        templateUrl: './login.component.html',
        styleUrls: ['./login.component.css'],
        providers: [HttpService]
    })
], LoginComponent);
export { LoginComponent };
//# sourceMappingURL=login.component.js.map