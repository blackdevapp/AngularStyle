import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeOneContactComponent } from './theme-one-contact.component';

describe('ThemeOneContactComponent', () => {
  let component: ThemeOneContactComponent;
  let fixture: ComponentFixture<ThemeOneContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemeOneContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeOneContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
