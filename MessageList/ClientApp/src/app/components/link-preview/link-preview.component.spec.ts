import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LinkPreviewComponent } from './link-preview.component';
import { LinkPreviewResponse } from './../../shared/models/linkPreviewResponse';

describe('LinkPreviewComponent', () => {
  let component: LinkPreviewComponent;
  let fixture: ComponentFixture<LinkPreviewComponent>;
  let testPreview: LinkPreviewResponse, appUrl: string;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LinkPreviewComponent]
    })
    .compileComponents();
    fixture = TestBed.createComponent(LinkPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    testPreview = new LinkPreviewResponse();
    testPreview.title = 'title';
    testPreview.description = 'some description';
    testPreview.image = '';
    testPreview.url = 'https://someurl.ru';
    appUrl = 'https://someurl.ru';
  });

  it('should create Link preview component', () => {
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
