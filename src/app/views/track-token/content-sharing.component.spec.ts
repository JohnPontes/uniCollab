import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentSharingComponent } from './content-sharing.component';


describe('TrackTokenComponent', () => {
  let component: ContentSharingComponent;
  let fixture: ComponentFixture<ContentSharingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentSharingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentSharingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
