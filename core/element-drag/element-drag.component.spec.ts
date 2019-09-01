import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementDragComponent } from './element-drag.component';

describe('ElementDragComponent', () => {
  let component: ElementDragComponent;
  let fixture: ComponentFixture<ElementDragComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementDragComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementDragComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
