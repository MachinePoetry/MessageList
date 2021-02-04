import { ToastsContainerComponent } from './toasts-container.component';
import { ToastService } from './../../shared/services/toast-service/toast.service';
import { TestBed, ComponentFixture } from '@angular/core/testing';


describe('ToastsContainerComponent', () => {
  let component: ToastsContainerComponent;
  let fixture: ComponentFixture<ToastsContainerComponent>;
  let mockToastService = { get: jasmine.createSpy('get').and.returnValue('report created') };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ToastsContainerComponent],
      providers: [
        { provide: ToastService, useValue: mockToastService }
      ]
    });
    fixture = TestBed.createComponent(ToastsContainerComponent);
    component = fixture.componentInstance;

    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create the Toasts container component', () => {
    expect(component).toBeTruthy();
  })

  it('should render toast container', () => {
    let toastContainer: HTMLDivElement = fixture.nativeElement.querySelectorAll('ngb-toast');
    expect(toastContainer).toBeTruthy();
  })
})
