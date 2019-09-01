import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripBuilderComponent } from './trip-builder.component';

describe('TripBuilderComponent', () => {
  let component: TripBuilderComponent;
  let fixture: ComponentFixture<TripBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
