import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechInterestsSetupComponent } from './tech-interests-setup.component';

describe('TechInterestsSetupComponent', () => {
  let component: TechInterestsSetupComponent;
  let fixture: ComponentFixture<TechInterestsSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechInterestsSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechInterestsSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
