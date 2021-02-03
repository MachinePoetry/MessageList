import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LinkPreviewComponent } from './link-preview.component';

describe('LinkPreviewComponent', () => {
  let component: LinkPreviewComponent;
  let fixture: ComponentFixture<LinkPreviewComponent>;
  let testPreview;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LinkPreviewComponent]
    })
    .compileComponents();
    fixture = TestBed.createComponent(LinkPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    testPreview = { title: 'title', description: 'some descripyion', image: '', url: 'https://someurl.ru', bannedForPreview: false }
  });

  it('should create', () => {
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
    expect(testPreview.bannedForPreview).toBe(true);
    expect(component.previews.length).toBe(0);
  });
});
