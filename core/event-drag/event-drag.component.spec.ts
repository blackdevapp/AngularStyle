import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDragComponent } from './event-drag.component';

describe('EventDragComponent', () => {
  let component: EventDragComponent;
  let fixture: ComponentFixture<EventDragComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventDragComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDragComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
