import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Proveedor } from '../../../modelos/proveedor.model';
import { ProveedoresService } from '../../../servicios/proveedores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-editar-proveedor',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-editar-proveedor.component.html',
  styleUrl: './modal-editar-proveedor.component.css'
})
export class ModalEditarProveedorComponent {
@Input() proveedor!: Proveedor; // Proveedor a editar
  @Output() proveedorEditado = new EventEmitter<Proveedor>();
  proveedorForm: FormGroup;
  guardando = false;

  constructor(
    private fb: FormBuilder,
    private proveedoresService: ProveedoresService
  ) {
    this.proveedorForm = this.fb.group({
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['proveedor'] && this.proveedor) {
      this.proveedorForm.patchValue({
        nombre: this.proveedor.nombre,
        telefono: this.proveedor.telefono,
        direccion: this.proveedor.direccion
      });
    }
  }

 editarProveedor() {
  if (this.guardando || this.proveedorForm.invalid) return;
  this.guardando = true;
  const datos = this.proveedorForm.value;
  this.proveedoresService.editarProveedor(this.proveedor.id, datos).subscribe({
    next: (proveedorActualizado) => {
      this.proveedorEditado.emit(proveedorActualizado);
      (document.getElementById('CerrarModalEditarProveedor') as HTMLButtonElement)?.click();
      this.guardando = false;
      Swal.fire({
        icon: 'success',
        title: 'Actualizado',
        text: 'El proveedor fue actualizado correctamente.',
        timer: 1800,
        showConfirmButton: false
      });
    },
    error: (err) => {
      this.guardando = false;
      const mensaje = err?.error?.mensaje || 'No se pudo actualizar el proveedor.';
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: mensaje,
      });
      console.error("Error al editar proveedor:", err);
    }
  });
}
}
