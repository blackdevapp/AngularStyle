import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItinerarySocialComponent } from './itinerary-social.component';

describe('ItinerarySocialComponent', () => {
  let component: ItinerarySocialComponent;
  let fixture: ComponentFixture<ItinerarySocialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItinerarySocialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItinerarySocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
