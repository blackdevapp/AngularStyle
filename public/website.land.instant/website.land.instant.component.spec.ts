import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Website.Land.InstantComponent } from './website.land.instant.component';

describe('Website.Land.InstantComponent', () => {
  let component: Website.Land.InstantComponent;
  let fixture: ComponentFixture<Website.Land.InstantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Website.Land.InstantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Website.Land.InstantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
