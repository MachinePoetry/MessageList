//import { MainComponent } from './main.component';
//import { ToastsContainerComponent } from './../toasts-container/toasts-container.component';
//import { ActivatedRoute } from '@angular/router';
//import { NgForm, FormsModule, AbstractControl } from '@angular/forms';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { of } from 'rxjs';
//import { HttpService } from './../../shared/services/http-service/http.service';
//import { FileService } from './../../shared/services/file-service/file.service';
//import { ToastService } from './../../shared/services/toast-service/toast.service';
//import { TextService } from './../../shared/services/text-service/text.service';
//import { SafeUrlPipe } from './../../shared/pipes/safe-url/safe-url.pipe';
//import { MessageGroup } from './../../shared/models/messageGroup';
//import { Message } from 'src/app/shared/models/message';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { TestBed, ComponentFixture } from '@angular/core/testing';


//describe('MainComponent', () => {
//  let component: MainComponent;
//  let fixture: ComponentFixture<MainComponent>;
//  let ngForm: NgForm, emailControl: AbstractControl, passwordControl: AbstractControl, form: HTMLFormElement, messageGroup: MessageGroup;
//  let mockHttpService = { post: jasmine.createSpy('post').and.returnValue(of([messageGroup])), get: jasmine.createSpy('get').and.returnValue(of([messageGroup])) };
//  let mockFileService = { post: jasmine.createSpy('post') };
//  let mockTextService = { post: jasmine.createSpy('post') };
//  let mockRouter = { navigate: jasmine.createSpy('navigate') };
//  let mockToastService = { showDanger: jasmine.createSpy('showDanger'), showSuccess: jasmine.createSpy('showSuccess') };
//  let mockActivatedRoute = { snapshot: { data: { user: { id: 1 } } } };
//  let mockSafeUrlPipe = { transform: jasmine.createSpy('showDanger') };
//  let mockModalService = { showDanger: jasmine.createSpy('showDanger') };

//  beforeEach(async () => {
//    TestBed.configureTestingModule({
//      declarations: [MainComponent, ToastsContainerComponent, SafeUrlPipe],
//      imports: [FormsModule, NgbModule],
//      providers: [
//        NgForm,
//        { provide: HttpService, useValue: mockHttpService },
//        { provide: FileService, useValue: mockFileService },
//        { provide: TextService, useValue: mockTextService },
//        { provide: ToastService, useValue: mockToastService },
//        { provide: ActivatedRoute, useValue: mockActivatedRoute },
//        { provide: SafeUrlPipe, useValue: mockSafeUrlPipe },
//        { provide: NgbModal, useValue: mockModalService }
//      ]
//    });
//    fixture = TestBed.createComponent(MainComponent);
//    component = fixture.componentInstance;
//    mockHttpService.post.calls.reset();
//    mockRouter.navigate.calls.reset();

//    await fixture.whenStable();
//    //ngForm = component.loginForm;
//    //emailControl = ngForm.form.controls['email'];
//    //passwordControl = ngForm.form.controls['password'];
//    //form = fixture.nativeElement.querySelector('#loginForm');
//    messageGroup = new MessageGroup();
//    let message: Message = new Message();
//    messageGroup.messages = [message];
//    component.authUserMessageGroups = [messageGroup];

//    fixture.detectChanges();
//  });

//  it('should create component', () => {
//    expect(component).toBeTruthy();
//  })
//})
