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

import { HttpService } from './shared/services/httpService/http-service.service'
import { FocusDirective } from './shared/directives/focus/focus.directive'

const routes: Routes = [
  { path: '', component: FrontComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'main', component: MainComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'restore', component: RestoreComponent },
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  declarations: [
    AppComponent, FrontComponent, HeaderComponent, LoginComponent, RegisterComponent, MainComponent, RestoreComponent, NotFoundComponent, FocusDirective
  ],
  imports: [
    BrowserModule, HttpClientModule, RouterModule.forRoot(routes), NgbModule, FormsModule, BrowserAnimationsModule
  ],
  exports: [FocusDirective],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
