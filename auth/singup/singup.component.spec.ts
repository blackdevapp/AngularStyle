import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SingupComponent } from './singup.component';

describe('LoginComponent', () => {
  let component: SingupComponent;
  let fixture: ComponentFixture<SingupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  // it('should display the string "Login" in h4', () => {
  //   const el = fixture.debugElement.query(By.css('h4')).nativeElement;
  //   expect(el.textContent).toContain('Login');
  // });
});
