import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpService } from './http.service';

class User {
  id: 1;
  name: 'Vladimir';
}

describe('HttpService', () => {
  let service: HttpService;
  let backend: HttpTestingController;
  const mockUser: User = new User();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpService]
    });
    service = TestBed.get(HttpService);
    backend = TestBed.get(HttpTestingController);
  });

  it('should create the Toast service', () => {
    expect(service).toBeTruthy();
  });

  it('should return data by url without params', () => {
    service.get('/users').subscribe((user: User) => {
      expect(user).toBe(mockUser);
    });

    backend.expectOne({
      method: 'GET',
      url: '/users'
    }).flush(mockUser);
  });

  it('should return data by url with id param', () => {
    service.get('/users', { id: 1 }).subscribe((user: User) => {
      expect(user).toBe(mockUser);
    });

    backend.expectOne({
      method: 'GET',
      url: '/users?id=1',
    }).flush(mockUser);
  });

  it('should post data by url with params', () => {
    service.post('/users' , mockUser).subscribe((response: string) => {
      expect(response).toBe('post successful');
    });

    backend.expectOne({
      method: 'POST',
      url: '/users'
    }).flush('post successful');
  });
});
