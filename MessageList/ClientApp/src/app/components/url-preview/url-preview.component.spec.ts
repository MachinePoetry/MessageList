import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlPreviewComponent } from './url-preview.component';
import { UrlPreviewResponse } from './../../shared/models/urlPreviewResponse';

describe('UrlPreviewComponent', () => {
  let component: UrlPreviewComponent;
  let fixture: ComponentFixture<UrlPreviewComponent>;
  let testPreview: UrlPreviewResponse, appUrl: string;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UrlPreviewComponent]
    })
    .compileComponents();
    fixture = TestBed.createComponent(UrlPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    testPreview = new UrlPreviewResponse();
    testPreview.title = 'title';
    testPreview.description = 'some description';
    testPreview.image = '';
    testPreview.url = 'https://someurl.ru';
    appUrl = 'https://someurl.ru';
  });

  it('should create Url preview component', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect user by url', () => {
    let winSpy = spyOn(window, 'open');
    component.redirectByLink('https://url');
    expect(winSpy).toHaveBeenCalled();
    expect(winSpy).toHaveBeenCalledTimes(1);
  });

  it('should not make preview for given url', () => {
    component.previews = [testPreview];
    component.banUrlForPreview('https://someurl.ru');
    expect(component.previews.length).toBe(0);
  });
});
