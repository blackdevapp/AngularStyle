import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingTourComponent } from './landing-tour.component';

describe('LandingTourComponent', () => {
  let component: LandingTourComponent;
  let fixture: ComponentFixture<LandingTourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingTourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
