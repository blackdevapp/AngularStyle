import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeOneFooterComponent } from './theme-one-footer.component';

describe('ThemeOneFooterComponent', () => {
  let component: ThemeOneFooterComponent;
  let fixture: ComponentFixture<ThemeOneFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemeOneFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeOneFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
