import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyInformationComponent } from './agency-information.component';

describe('AgencyInformationComponent', () => {
  let component: AgencyInformationComponent;
  let fixture: ComponentFixture<AgencyInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
