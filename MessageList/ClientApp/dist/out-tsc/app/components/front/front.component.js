import { __decorate } from "tslib";
import { Component } from '@angular/core';
let FrontComponent = class FrontComponent {
    constructor(httpService) {
        this.httpService = httpService;
        this.params = {
            reportText: '',
            reportContacts: ''
        };
    }
    onSubmit() {
        this.httpService.post('/api/bugReport/create', this.params).subscribe((data) => {
            this.params.reportText = '';
            this.params.reportContacts = '';
            this.report = data;
            this.showAlert = true;
        }, error => this.errorText = error.message);
    }
    ngOnInit() {
        this.httpService.get('api/users/getAuthUserInfo').subscribe(data => {
            this.authUserInfo = data;
        });
    }
};
FrontComponent = __decorate([
    Component({
        selector: 'app-front',
        templateUrl: './front.component.html',
        styleUrls: ['./front.component.css']
    })
], FrontComponent);
export { FrontComponent };
//# sourceMappingURL=front.component.js.map