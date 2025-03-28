import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlipperBallComponent } from './flipper-ball.component';

describe('FlipperBallComponent', () => {
  let component: FlipperBallComponent;
  let fixture: ComponentFixture<FlipperBallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlipperBallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlipperBallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
