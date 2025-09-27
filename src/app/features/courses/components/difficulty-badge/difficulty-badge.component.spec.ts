import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DifficultyBadgeComponent } from './difficulty-badge.component';

describe('DifficultyBadgeComponent', () => {
  let component: DifficultyBadgeComponent;
  let fixture: ComponentFixture<DifficultyBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DifficultyBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DifficultyBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
