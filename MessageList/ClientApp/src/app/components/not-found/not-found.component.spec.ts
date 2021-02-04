import { NotFoundComponent } from './not-found.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';


describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [NotFoundComponent],
    });
    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
  });

  it('should create the Not found component', () => {
    expect(component).toBeTruthy();
  })

  it('should render wrapper', () => {
    let wrapper: HTMLDivElement = fixture.nativeElement.querySelectorAll('#wrapper');
    expect(wrapper).toBeTruthy();
  })

  it('should render error image', () => {
    let img: HTMLImageElement = fixture.nativeElement.querySelectorAll('img');
    expect(img).toBeTruthy();
  })

  it('should render error text', () => {
    let span: HTMLSpanElement = fixture.nativeElement.querySelectorAll('#errorCode');
    expect(span).toBeTruthy();
  })
})
