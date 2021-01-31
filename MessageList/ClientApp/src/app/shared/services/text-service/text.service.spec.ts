import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TextService } from './text.service';
import { HttpService } from './../http-service/http.service';
import { LinkPreviewResponse } from './../../models/linkPreviewResponse';

describe('TextService', () => {
  let service: TextService;
  const returnedPreviewResponse: LinkPreviewResponse = new LinkPreviewResponse();
  returnedPreviewResponse.title = 'Link preview response';
  returnedPreviewResponse.description = 'first link preview response of two';
  returnedPreviewResponse.image = 'some image url';
  returnedPreviewResponse.url = 'https://www.someresponseurl.com';
  const receivedPreviewResponse: LinkPreviewResponse = new LinkPreviewResponse();
  receivedPreviewResponse.title = 'Link preview response';
  receivedPreviewResponse.description = 'first link preview response of two';
  receivedPreviewResponse.image = 'some image url';
  receivedPreviewResponse.url = 'https://www.anotheresponseurl.com';
  const noPreviewUrls: string[] = ['https://www.receivedPreviewResponse.com', 'https://www.anotherbannedurl.com'];
  // simple creation of Observable object https://angular.io/guide/observables
  const fakeHttpService = { get: () => of(returnedPreviewResponse) };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TextService, { provide: HttpService, useValue: fakeHttpService}]
    });
    service = TestBed.get(TextService);

  });

  it('should create the Text service', () => {
    expect(service).toBeTruthy();
  });

  it('should get all urls from text string', () => {
    let text: string = '222 https://angular.io/api/forms/NgModel  qwerty https://docs.microsoft.com/ru-ru/dotnet/core/install/linux-ubuntu'; 
    expect(service.getUrlsFromText(text).length).toBe(2);
  });

  it('should get correct url from text string', () => {
    let text: string = 'qw https://docs.microsoft.com/ru-ru/ef/core/cli/dotnet qwerty';
    expect(service.getUrlsFromText(text)[0]).toBe('https://docs.microsoft.com/ru-ru/ef/core/cli/dotnet');
  });

  it('should return empty array if there are no urls in text string', () => {
    let text: string = 'there are no urls here';
    expect(service.getUrlsFromText(text).length).toBe(0);
  });

  it('should return correct array of preview responses if no one of urls have preview already and no urls are banned to make their preview', () => {
    expect(service.getPreviewsForUrls(['https://www.testUrl.ru'], [], noPreviewUrls)[0]).toEqual(returnedPreviewResponse);
  });

  it('should return correct array of preview responses if one of urls have preview already', () => {
    expect(service.getPreviewsForUrls(['https://www.anotheresponseurl.com'], [receivedPreviewResponse], noPreviewUrls).length).toBe(1); // returns given responses without new
  });

  it('should return correct array of preview responses if one of urls should not have preview (exist in noPreviewUrls array)', () => {
    expect(service.getPreviewsForUrls(['https://www.anotherbannedurl.com'], [], noPreviewUrls).length).toBe(0);
  });
})
