import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaProcessComponent } from './visa-process.component';

describe('VisaProcessComponent', () => {
  let component: VisaProcessComponent;
  let fixture: ComponentFixture<VisaProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisaProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisaProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
