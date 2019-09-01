import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkdinComponent } from './linkdin.component';

describe('LinkdinComponent', () => {
  let component: LinkdinComponent;
  let fixture: ComponentFixture<LinkdinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkdinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkdinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
