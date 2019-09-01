import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxIdentificationComponent } from './tax-identification.component';

describe('TaxIdentificationComponent', () => {
  let component: TaxIdentificationComponent;
  let fixture: ComponentFixture<TaxIdentificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxIdentificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxIdentificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
