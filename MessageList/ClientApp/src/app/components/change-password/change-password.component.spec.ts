import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangePasswordComponent } from './change-password.component';
import { NgForm, FormsModule } from '@angular/forms';
import { HttpService } from './../../shared/services/http-service/http.service';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let mockHttpService = { post: jasmine.createSpy('post') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ChangePasswordComponent],
      providers: [
        NgForm,
        { provide: HttpService, useValue: mockHttpService },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    mockHttpService.post.calls.reset();
    fixture.detectChanges();
  });

  it('should create the ChangePassword component', () => {
    expect(component).toBeTruthy();
  });
});
