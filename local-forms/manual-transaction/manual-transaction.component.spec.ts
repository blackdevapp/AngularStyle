import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualTransactionComponent } from './manual-transaction.component';

describe('ManualTransactionComponent', () => {
  let component: ManualTransactionComponent;
  let fixture: ComponentFixture<ManualTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
