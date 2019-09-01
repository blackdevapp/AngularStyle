import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PublicOneComponent } from './public-one.component';

describe('PublicOneComponent', () => {
  let component: PublicOneComponent;
  let fixture: ComponentFixture<PublicOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
