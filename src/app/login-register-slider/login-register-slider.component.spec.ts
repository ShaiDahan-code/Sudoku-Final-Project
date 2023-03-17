import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRegisterSliderComponent } from './login-register-slider.component';

describe('LoginRegisterSliderComponent', () => {
  let component: LoginRegisterSliderComponent;
  let fixture: ComponentFixture<LoginRegisterSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginRegisterSliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginRegisterSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
