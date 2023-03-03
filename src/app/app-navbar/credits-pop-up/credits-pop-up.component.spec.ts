import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditsPopUpComponent } from './credits-pop-up.component';

describe('CreditsPopUpComponent', () => {
  let component: CreditsPopUpComponent;
  let fixture: ComponentFixture<CreditsPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditsPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditsPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
