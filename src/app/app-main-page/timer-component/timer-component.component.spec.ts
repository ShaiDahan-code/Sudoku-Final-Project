import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerComponentComponent } from './timer-component.component';

describe('TimerComponentComponent', () => {
  let component: TimerComponentComponent;
  let fixture: ComponentFixture<TimerComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimerComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimerComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
