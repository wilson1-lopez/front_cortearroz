import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TiposTrabajadoresService } from '../../../servicios/tipos-trabajadores.service';
import { TipoTrabajador } from '../../../modelos/tipo-trabajador.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modalAgregarTipoTrabajador',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './modalAgregarTipoTrabajador.component.html',
  styleUrl: './modalAgregarTipoTrabajador.component.css'
})
export class ModalAgregarTipoTrabajadorComponent {
  @Output() tipoTrabajadorCreado = new EventEmitter<TipoTrabajador>();

  nuevoTipoTrabajador: TipoTrabajador = {
    nombre: ''
  };

  constructor(private tiposTrabajadoresService: TiposTrabajadoresService) {}

  crearTipoTrabajador() {
    if (this.validarFormulario()) {
      this.tiposTrabajadoresService.agregarTipoTrabajador(this.nuevoTipoTrabajador).subscribe({
        next: (tipoTrabajador) => {
          this.tipoTrabajadorCreado.emit(tipoTrabajador);
          this.cerrarModal();
          this.limpiarFormulario();
          Swal.fire({
            title: '¡Éxito!',
            text: 'Tipo de trabajador creado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        },
        error: (error) => {
          console.error('Error al crear tipo de trabajador:', error);
          let mensaje = 'Error al crear el tipo de trabajador.';
          
          if (error.error && error.error.message) {
            mensaje = error.error.message;
          } else if (error.error && error.error.errors) {
            // Manejar errores de validación
            const errores = Object.values(error.error.errors).flat();
            mensaje = errores.join(', ');
          }
          
          Swal.fire({
            title: 'Error',
            text: mensaje,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    }
  }

  validarFormulario(): boolean {
    if (!this.nuevoTipoTrabajador.nombre.trim()) {
      Swal.fire({
        title: 'Error',
        text: 'El nombre del tipo de trabajador es obligatorio.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return false;
    }
    return true;
  }

  cerrarModal() {
    const modalElement = document.getElementById('modalNuevoTipoTrabajador');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  limpiarFormulario() {
    this.nuevoTipoTrabajador = {
      nombre: ''
    };
  }
}
