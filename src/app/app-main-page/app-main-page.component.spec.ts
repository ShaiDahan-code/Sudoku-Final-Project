import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMainPageComponent } from './app-main-page.component';

describe('AppMainPageComponent', () => {
  let component: AppMainPageComponent;
  let fixture: ComponentFixture<AppMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppMainPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
