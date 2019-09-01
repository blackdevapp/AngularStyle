import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TileTableComponent } from './tile-table.component';

describe('TileTableComponent', () => {
  let component: TileTableComponent;
  let fixture: ComponentFixture<TileTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TileTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TileTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
