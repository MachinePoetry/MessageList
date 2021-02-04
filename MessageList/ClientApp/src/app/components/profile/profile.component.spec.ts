import { ProfileComponent } from './profile.component';
import { HeaderComponent } from './../header/header.component';
import { HttpService } from './../../shared/services/http-service/http.service';
import { User } from '../../shared/models/user';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { TestBed, ComponentFixture } from '@angular/core/testing';


describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockActivatedRoute = { snapshot: { data: { user: { id: 1 } } } };
  let mockHttpService = {
    get: jasmine.createSpy('get').and.returnValue(of('report created'))
  };
  let user: User = new User();

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ProfileComponent, HeaderComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: HttpService, useValue: mockHttpService }
      ]
    });
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;

    await fixture.whenStable();
    user.email = 'some@mail.com';
    user.createdAt = '1970-01-01T00:00:00.294611';
    component.authUserInfo = user;
    fixture.detectChanges();
  });

  it('should create the Profile component', () => {
    expect(component).toBeTruthy();
  })

  it('should render <noscript>', () => {
    let header: HTMLDivElement = fixture.nativeElement.querySelectorAll('noscript');
    expect(header).toBeTruthy();
  })

  it('should render header component', () => {
    let header: HTMLDivElement = fixture.nativeElement.querySelectorAll('app-header');
    expect(header).toBeTruthy();
  })

  it('should render page container', () => {
    let header: HTMLDivElement = fixture.nativeElement.querySelectorAll('.container-fluid');
    expect(header).toBeTruthy();
  })

  it('should render user email start value', () => {
    let email: HTMLDivElement = fixture.nativeElement.querySelector('#authUserEmail');
    expect(email).toBeTruthy();
    expect(email.textContent).toBe(' Загрузка... ');
  })

  it('should render user email changed value', () => {
    component.authUserInfo = user;
    fixture.detectChanges();
    let email: HTMLDivElement = fixture.nativeElement.querySelector('#authUserEmail');
    expect(email).toBeTruthy();
    expect(email.textContent).toBe(' some@mail.com ');
  })

  it('should render user creation changed value', () => {
    component.authUserInfo = user;
    fixture.detectChanges();
    let createdAt: HTMLDivElement = fixture.nativeElement.querySelector('#userCreatedAt');
    expect(createdAt).toBeTruthy();
    expect(createdAt.textContent).toBe(' 01.01.1970, 00:00:00 ');
  })
})
