import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoatShipComponent } from './boat-ship.component';

describe('BoatShipComponent', () => {
  let component: BoatShipComponent;
  let fixture: ComponentFixture<BoatShipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoatShipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoatShipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
