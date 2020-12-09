import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
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
import { ToastsContainer } from './components/toastsContainer/toasts-container.component';

import { HttpService } from './shared/services/httpService/http-service.service'
import { ToastService } from './shared/services/toastService/toast.service'
import { FocusDirective } from './shared/directives/focus/focus.directive'
import { DateToLocalePipe } from './shared/pipes/dateToLocale/date-to-locale.pipe'

import { AuthUserInfoResolver } from './shared/resolvers/auth-user-info.resolver'

const routes: Routes = [
  { path: '', component: FrontComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'main', component: MainComponent, resolve: { user: AuthUserInfoResolver } },
  { path: 'profile', component: ProfileComponent, resolve: { user: AuthUserInfoResolver } },
  { path: 'restore', component: RestoreComponent, resolve: { user: AuthUserInfoResolver } },
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  declarations: [
    AppComponent, FrontComponent, HeaderComponent, LoginComponent, RegisterComponent, MainComponent, ProfileComponent, RestoreComponent, NotFoundComponent,
    ToastsContainer, FocusDirective, DateToLocalePipe
  ],
  imports: [
    BrowserModule, HttpClientModule, RouterModule.forRoot(routes), NgbModule, FormsModule, BrowserAnimationsModule
  ],
  exports: [FocusDirective],
  providers: [HttpService, ToastService, AuthUserInfoResolver],
  bootstrap: [AppComponent]
})
export class AppModule { }
