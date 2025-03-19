import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarritoLateralComponent } from './carrito-lateral.component';

describe('CarritoLateralComponent', () => {
  let component: CarritoLateralComponent;
  let fixture: ComponentFixture<CarritoLateralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarritoLateralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarritoLateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
