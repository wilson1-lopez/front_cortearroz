import { Component, EventEmitter, Output } from '@angular/core';
import { Proveedor } from '../../../modelos/proveedor.model';
import { ProveedoresService } from '../../../servicios/proveedores.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modalagregarproveedor',
  imports: [ReactiveFormsModule],
  templateUrl: './modalAgregarProveedor.component.html',
  styleUrl: './modalAgregarProveedor.component.css'
})
export class ModalagregarProveedorComponent {
// Evento que se dispara cuando se crea un proveedor nuevo
@Output() proveedorCreado = new EventEmitter<Proveedor>();
proveedorForm: FormGroup;
guardando: boolean = false;
constructor(private proveedoresService: ProveedoresService,
  private fb: FormBuilder,
) {
//inicializo el formulario para crear un proveedor
  this.proveedorForm=this.fb.group({
    // Nombre del proveedor (requerido)
    nombre: ['', Validators.required], 
    telefono:['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    direccion: ['', Validators.required],
  });
}

guardarProveedor() {
  if (this.guardando) return;
  this.guardando = true;
  const nuevoproveedor = this.proveedorForm.value;
  this.proveedoresService.agregarProveedor(nuevoproveedor).subscribe({
    next: (proveedor) => {
      this.proveedorCreado.emit(proveedor);
      this.proveedorForm.reset();
      (document.getElementById('CerrarModalProveedor') as HTMLButtonElement)?.click();
      this.guardando = false;
      Swal.fire({
        icon: 'success',
        title: 'Guardado',
        text: 'El proveedor fue guardado correctamente.',
        timer: 1800,
        showConfirmButton: false
      });
    },
    error: (err) => {
      this.guardando = false;
      const mensaje = err?.error?.mensaje || 'No se pudo guardar el proveedor.';
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text: mensaje,
      });
      console.error("Error al guardar proveedor:", err);
    }
  });
}

}
