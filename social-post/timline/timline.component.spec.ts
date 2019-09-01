import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimlineComponent } from './timline.component';

describe('TimlineComponent', () => {
  let component: TimlineComponent;
  let fixture: ComponentFixture<TimlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
