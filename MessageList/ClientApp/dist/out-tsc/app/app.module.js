import { __decorate } from "tslib";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { FrontComponent } from './components/front/front.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MainComponent } from './components/main/main.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RestoreComponent } from './components/restore/restore.component';
import { NotFoundComponent } from './components/notFound/not-found.component';
import { HttpService } from './shared/services/httpService/http-service.service';
const routes = [
    { path: '', component: FrontComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'main', component: MainComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'restore', component: RestoreComponent },
    { path: '**', component: NotFoundComponent }
];
let AppModule = class AppModule {
};
AppModule = __decorate([
    NgModule({
        declarations: [
            AppComponent, FrontComponent, HeaderComponent, LoginComponent, RegisterComponent, MainComponent, RestoreComponent, NotFoundComponent
        ],
        imports: [
            BrowserModule, HttpClientModule, RouterModule.forRoot(routes), NgbModule, FormsModule, BrowserAnimationsModule
        ],
        exports: [],
        providers: [HttpService],
        bootstrap: [AppComponent]
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map