import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularDropComponent } from './circular-drop.component';

describe('CircularDropComponent', () => {
  let component: CircularDropComponent;
  let fixture: ComponentFixture<CircularDropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CircularDropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircularDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
