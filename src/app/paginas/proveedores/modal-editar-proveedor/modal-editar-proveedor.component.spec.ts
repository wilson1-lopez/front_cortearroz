import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarProveedorComponent } from './modal-editar-proveedor.component';

describe('ModalEditarProveedorComponent', () => {
  let component: ModalEditarProveedorComponent;
  let fixture: ComponentFixture<ModalEditarProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditarProveedorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditarProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
