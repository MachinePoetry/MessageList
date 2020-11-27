import { __decorate } from "tslib";
import { Component, Input } from '@angular/core';
let HeaderComponent = class HeaderComponent {
    constructor(httpService) {
        this.httpService = httpService;
    }
    ;
    signOut() {
        this.httpService.get('api/account/signOut').subscribe(data => {
            this.authUserInfo = [];
            // TO DO: Change this one below for routing command
            window.location.href = "/";
        });
    }
};
__decorate([
    Input()
], HeaderComponent.prototype, "authUserInfo", void 0);
HeaderComponent = __decorate([
    Component({
        selector: 'app-header',
        templateUrl: './header.component.html',
        styleUrls: ['./header.component.css']
    })
], HeaderComponent);
export { HeaderComponent };
//# sourceMappingURL=header.component.js.map