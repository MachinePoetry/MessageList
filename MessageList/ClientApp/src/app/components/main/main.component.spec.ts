//import { TestBed, ComponentFixture } from '@angular/core/testing';
//import { MainComponent } from './main.component';
//import { HeaderComponent } from './../header/header.component';
//import { FilePreviewComponent } from './../file-preview/file-preview.component';
//import { LinkPreviewComponent } from './../link-preview/link-preview.component';
//import { ToastsContainerComponent } from './../toasts-container/toasts-container.component';
//import { InlineSpinner } from './../../shared/spinners/inline/inline.spinner';
//import { RoundSpinner } from './../../shared/spinners/round/round.spinner';
//import { ActivatedRoute } from '@angular/router';
//import { NgForm, FormsModule, AbstractControl } from '@angular/forms';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { of } from 'rxjs';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { HttpService } from './../../shared/services/http-service/http.service';
//import { FileService } from './../../shared/services/file-service/file.service';
//import { ToastService } from './../../shared/services/toast-service/toast.service';
//import { TextService } from './../../shared/services/text-service/text.service';
//import { SafeUrlPipe } from './../../shared/pipes/safe-url/safe-url.pipe';
//import { BlobToSrcPipe } from './../../shared/pipes/blob-to-src/blob-to-src.pipe';
//import { MessageGroup } from './../../shared/models/messageGroup';
//import { Message } from 'src/app/shared/models/message';


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
//  let mockBlobToSrcPipe = { transform: jasmine.createSpy('transform').and.returnValue(true) };
//  let mockModalService = { showDanger: jasmine.createSpy('showDanger') };

//  beforeEach(async () => {
//    TestBed.configureTestingModule({
//      declarations: [MainComponent, ToastsContainerComponent, HeaderComponent, FilePreviewComponent, LinkPreviewComponent, InlineSpinner, RoundSpinner, SafeUrlPipe, BlobToSrcPipe],
//      imports: [FormsModule, NgbModule],
//      providers: [
//        NgForm,
//        { provide: HttpService, useValue: mockHttpService },
//        { provide: FileService, useValue: mockFileService },
//        { provide: TextService, useValue: mockTextService },
//        { provide: ToastService, useValue: mockToastService },
//        { provide: ActivatedRoute, useValue: mockActivatedRoute },
//        { provide: SafeUrlPipe, useValue: mockSafeUrlPipe },
//        { provide: BlobToSrcPipe, useValue: mockBlobToSrcPipe },
//        { provide: NgbModal, useValue: mockModalService }
//      ]
//    });
//    fixture = TestBed.createComponent(MainComponent);
//    component = fixture.componentInstance;
//    mockHttpService.post.calls.reset();
//    mockRouter.navigate.calls.reset();

//    //ngForm = component.loginForm;
//    //emailControl = ngForm.form.controls['email'];
//    //passwordControl = ngForm.form.controls['password'];
//    //form = fixture.nativeElement.querySelector('#loginForm');

//    messageGroup = new MessageGroup();
//    messageGroup.id = 10;
//    messageGroup.name = 'new group'; 
//    let message: Message = new Message();
//    messageGroup.messages = [message];
//    component.authUserMessageGroups = [messageGroup];
//    component.selectedGroupId = 10;
//    component.ngOnInit();
//    component.ngAfterViewInit();

//    fixture.detectChanges();
//    await fixture.whenStable();


//  });

//  it('should create the Main component', () => {
//    expect(component).toBeTruthy();
//  })
//})
