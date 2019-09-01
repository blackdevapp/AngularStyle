import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeOneHeaderComponent } from './theme-one-header.component';

describe('ThemeOneHeaderComponent', () => {
  let component: ThemeOneHeaderComponent;
  let fixture: ComponentFixture<ThemeOneHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemeOneHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeOneHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
