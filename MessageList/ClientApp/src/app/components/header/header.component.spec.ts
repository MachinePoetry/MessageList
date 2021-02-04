import { HeaderComponent } from './header.component';
import { HttpService } from './../../shared/services/http-service/http.service';
import { User } from './../../shared/models/user';
import { of } from 'rxjs';
import { TestBed, ComponentFixture  } from '@angular/core/testing';


describe('HeaderComponent', () => {
  let component: HeaderComponent, fixture: ComponentFixture<HeaderComponent>;
  let mockHttpService = {
    get: jasmine.createSpy('get').and.returnValue(of('report created'))
  };


  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [{ provide: HttpService, useValue: mockHttpService }]
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    mockHttpService.get.calls.reset();

    component.authUserInfo = new User();
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create the Header component', () => {
    expect(component).toBeTruthy();
  })

  it('should render continer', () => {
    let container: HTMLDivElement = fixture.nativeElement.querySelector('.container-fluid');
    expect(container).toBeTruthy();
  })

  it('should link to front component with correct text', () => {
    let link: HTMLLinkElement = fixture.nativeElement.querySelector('.header-title');
    expect(link.textContent).toBe(' Your notepad online ');
  })

  it('should render login and register links (without main menu) if user email is not set', () => {
    let titleLink: HTMLLinkElement = fixture.nativeElement.querySelector('#headerTitle');
    let registerLink: HTMLLinkElement = fixture.nativeElement.querySelector('#register');
    let loginLink: HTMLLinkElement = fixture.nativeElement.querySelector('#login');
    let menuLinks: HTMLLinkElement[] = fixture.nativeElement.querySelectorAll('[ngbDropdownItem]');
    expect(titleLink).toBeTruthy();
    expect(registerLink).toBeTruthy();
    expect(loginLink).toBeTruthy();
    expect(menuLinks.length).toBe(0);
  })

  it('should not render main menu links if authUserInfo.email is set', () => {
    component.authUserInfo.email = 'some@email.com';
    fixture.detectChanges();
    let menuLinks: HTMLLinkElement[] = fixture.nativeElement.querySelectorAll('[ngbDropdownItem]');
    expect(menuLinks.length).toBe(3);
  })

  it('should call http get to \'sign out\' route', () => {
    component.signOut();
    expect(mockHttpService.get).toHaveBeenCalled();
    expect(mockHttpService.get).toHaveBeenCalledTimes(1);
  })
})
