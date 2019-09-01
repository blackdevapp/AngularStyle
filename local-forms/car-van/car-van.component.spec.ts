import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarVanComponent } from './car-van.component';

describe('CarVanComponent', () => {
  let component: CarVanComponent;
  let fixture: ComponentFixture<CarVanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarVanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarVanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
