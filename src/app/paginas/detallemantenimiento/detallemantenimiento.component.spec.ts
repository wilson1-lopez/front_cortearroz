import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallemantenimientoComponent } from './detallemantenimiento.component';

describe('DetallemantenimientoComponent', () => {
  let component: DetallemantenimientoComponent;
  let fixture: ComponentFixture<DetallemantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallemantenimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallemantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
