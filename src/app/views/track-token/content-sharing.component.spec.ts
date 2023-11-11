import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackTokenComponent } from './content-sharing.component';

describe('TrackTokenComponent', () => {
  let component: TrackTokenComponent;
  let fixture: ComponentFixture<TrackTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackTokenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
