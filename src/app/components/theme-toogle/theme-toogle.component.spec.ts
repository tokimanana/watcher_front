import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeToogleComponent } from './theme-toogle.component';

describe('ThemeToogleComponent', () => {
  let component: ThemeToogleComponent;
  let fixture: ComponentFixture<ThemeToogleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeToogleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemeToogleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
