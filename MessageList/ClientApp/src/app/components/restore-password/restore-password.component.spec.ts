import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestorePasswordComponent } from './restore-password.component';
import { Router } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { HttpService } from './../../shared/services/http-service/http.service';
import { ToastService } from './../../shared/services/toast-service/toast.service';

describe('RestorePasswordComponent', () => {
  let component: RestorePasswordComponent;
  let fixture: ComponentFixture<RestorePasswordComponent>;
  let mockHttpService = { post: jasmine.createSpy('post') };
  let mockRouter = { navigate: jasmine.createSpy('navigate') };
  let mockToastService = { showDanger: jasmine.createSpy('showDanger'), showSuccess: jasmine.createSpy('showSuccess') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [RestorePasswordComponent],
      providers: [
        NgForm,
        { provide: HttpService, useValue: mockHttpService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastService, useValue: mockToastService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestorePasswordComponent);
    component = fixture.componentInstance;
    mockHttpService.post.calls.reset();
    mockRouter.navigate.calls.reset();
    fixture.detectChanges();
  });

  it('should create the RestorePassword component', () => {
    expect(component).toBeTruthy();
  });
});
