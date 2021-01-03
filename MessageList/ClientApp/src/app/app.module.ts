import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common"
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { FrontComponent } from './components/front/front.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MainComponent } from './components/main/main.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FilePreviewComponent } from './components/filePreview/file-preview.component';
import { NotFoundComponent } from './components/notFound/not-found.component';
import { ToastsContainer } from './components/toastsContainer/toasts-container.component';
import { AudioPlayerComponent } from './components/audioPlayer/audio-player.component';

import { HttpService } from './shared/services/httpService/http-service.service';
import { ToastService } from './shared/services/toastService/toast.service';
import { FileService } from './shared/services/fileService/file.service';
import { FocusDirective } from './shared/directives/focus/focus.directive';
import { EqualValidatorDirective } from './shared/directives/equalValidator/equal-validator.directive';
import { DateToLocalePipe } from './shared/pipes/dateToLocale/date-to-locale.pipe';
import { SafeUrl } from './shared/pipes/safeUrl/safe-url.pipe';
import { SecondsToTimePipe } from './shared/pipes/secondsToTime/seconds-to-time.pipe';

import { TermsOfUseModal } from './shared/modals/termsOfUse/terms-of-use.modal';
import { ConfirmModal } from './shared/modals/confirm/confirm.modal';
import { WarningModal } from './shared/modals/warning/warning.modal';
import { AttachFileModal } from './shared/modals/attachFile/attach-file.modal';
import { AttachFileFromWebModal } from './shared/modals/attachFileFromWeb/attach-file-from-web.modal';

import { AuthUserInfoResolver } from './shared/resolvers/auth-user-info.resolver';

const routes: Routes = [
  { path: '', component: FrontComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'main', component: MainComponent, resolve: { user: AuthUserInfoResolver } },
  { path: 'profile', component: ProfileComponent, resolve: { user: AuthUserInfoResolver } },
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  declarations: [
    AppComponent, FrontComponent, HeaderComponent, LoginComponent, RegisterComponent, MainComponent, ProfileComponent, FilePreviewComponent, NotFoundComponent,
    ToastsContainer, AudioPlayerComponent, FocusDirective, EqualValidatorDirective, DateToLocalePipe, SafeUrl, SecondsToTimePipe, TermsOfUseModal,
    ConfirmModal, WarningModal, AttachFileModal, AttachFileFromWebModal
  ],
  imports: [
    BrowserModule, HttpClientModule, RouterModule.forRoot(routes), NgbModule, FormsModule, CommonModule, BrowserAnimationsModule
  ],
  exports: [FocusDirective, EqualValidatorDirective],
  providers: [HttpService, ToastService, FileService, AuthUserInfoResolver],
  bootstrap: [AppComponent]
})

export class AppModule { }
