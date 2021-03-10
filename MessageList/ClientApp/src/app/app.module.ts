import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from "@angular/common"
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { FrontComponent } from './components/front/front.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MainComponent } from './components/main/main.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FilePreviewComponent } from './components/file-preview/file-preview.component';
import { LinkPreviewComponent } from './components/link-preview/link-preview.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MessageComponent } from './components/message/message.component';
import { ToastsContainerComponent } from './components/toasts-container/toasts-container.component';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { RestorePasswordComponent } from './components/restore-password/restore-password.component';

import { HttpService } from './shared/services/http-service/http.service';
import { TextService } from './shared/services/text-service/text.service';
import { ToastService } from './shared/services/toast-service/toast.service';
import { FileService } from './shared/services/file-service/file.service';
import { FocusDirective } from './shared/directives/focus/focus.directive';
import { EqualValidatorDirective } from './shared/directives/equal-validator/equal-validator.directive';
import { DateToLocalePipe } from './shared/pipes/date-to-locale/date-to-locale.pipe';
import { SafeUrlPipe } from './shared/pipes/safe-url/safe-url.pipe';
import { SecondsToTimePipe } from './shared/pipes/seconds-to-time/seconds-to-time.pipe';
import { BlobToSrcPipe } from './shared/pipes/blob-to-src/blob-to-src.pipe';
import { CutLongStringPipe } from './shared/pipes/cut-long-string/cut-long-string.pipe';
import { FileSizePipe } from './shared/pipes/file-size/file-size.pipe';

import { TermsOfUseModal } from './shared/modals/terms-of-use/terms-of-use.modal';
import { ConfirmModal } from './shared/modals/confirm/confirm.modal';
import { WarningModal } from './shared/modals/warning/warning.modal';
import { AttachFileModal } from './shared/modals/attach-file/attach-file.modal';
import { AttachFileFromWebModal } from './shared/modals/attach-file-from-web/attach-file-from-web.modal';
import { ActivityHistoryModal } from './shared/modals/activity-history/activity-history.modal';

import { RoundSpinner } from './shared/spinners/round/round.spinner';
import { InlineSpinner } from './shared/spinners/inline/inline.spinner';

import { AuthUserInfoResolver } from './shared/resolvers/auth-user-info.resolver';

const routes: Routes = [
  { path: '', component: FrontComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'main', component: MainComponent, resolve: { user: AuthUserInfoResolver } },
  { path: 'profile', component: ProfileComponent, resolve: { user: AuthUserInfoResolver } },
  { path: 'restore', component: RestorePasswordComponent },
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  declarations: [
    AppComponent, FrontComponent, HeaderComponent, LoginComponent, RegisterComponent, MainComponent, ProfileComponent, FilePreviewComponent, LinkPreviewComponent, NotFoundComponent,
    MessageComponent, ToastsContainerComponent, AudioPlayerComponent, FocusDirective, EqualValidatorDirective, DateToLocalePipe, SafeUrlPipe, SecondsToTimePipe, BlobToSrcPipe,
    CutLongStringPipe, FileSizePipe, TermsOfUseModal, ConfirmModal, WarningModal, AttachFileModal, AttachFileFromWebModal, ActivityHistoryModal, RoundSpinner, InlineSpinner,
    LinkPreviewComponent, ChangePasswordComponent, RestorePasswordComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, RouterModule.forRoot(routes), NgbModule, FormsModule, NgSelectModule, CommonModule, BrowserAnimationsModule
  ],
  exports: [FocusDirective, EqualValidatorDirective],
  providers: [HttpService, TextService, ToastService, FileService, AuthUserInfoResolver, BlobToSrcPipe],
  bootstrap: [AppComponent]
})

export class AppModule { }
