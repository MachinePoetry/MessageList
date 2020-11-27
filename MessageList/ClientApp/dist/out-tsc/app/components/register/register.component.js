import { __decorate } from "tslib";
import { Component } from '@angular/core';
let RegisterComponent = class RegisterComponent {
    constructor(httpService) {
        this.httpService = httpService;
        this.params = {
            email: '',
            password: ''
        };
    }
    onSubmit() {
        this.httpService.post('/api/account/register', this.params).subscribe((data) => {
            this.params.email = '';
            this.params.password = '';
            this.report = data;
            this.showAlert = true;
            if (this.report.status == 'UserCreated') {
                // TO DO: Change tis one below for routing command
                window.location.href = "/main";
            }
        }, error => this.errorText = error.message);
    }
};
RegisterComponent = __decorate([
    Component({
        selector: 'app-register',
        templateUrl: './register.component.html',
        styleUrls: ['./register.component.css']
    })
], RegisterComponent);
export { RegisterComponent };
//# sourceMappingURL=register.component.js.map