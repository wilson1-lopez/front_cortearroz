import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TiposTrabajadoresService } from '../../../servicios/tipos-trabajadores.service';
import { TipoTrabajador } from '../../../modelos/tipo-trabajador.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modalEditarTipoTrabajador',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './modalEditarTipoTrabajador.component.html',
  styleUrl: './modalEditarTipoTrabajador.component.css'
})
export class ModalEditarTipoTrabajadorComponent implements OnChanges {
  @Input() tipoTrabajadorParaEditar: TipoTrabajador | null = null;
  @Output() tipoTrabajadorEditado = new EventEmitter<TipoTrabajador>();

  tipoTrabajadorEditando: TipoTrabajador = {
    nombre: ''
  };

  constructor(private tiposTrabajadoresService: TiposTrabajadoresService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tipoTrabajadorParaEditar'] && this.tipoTrabajadorParaEditar) {
      this.tipoTrabajadorEditando = { ...this.tipoTrabajadorParaEditar };
    }
  }

  editarTipoTrabajador() {
    if (this.validarFormulario() && this.tipoTrabajadorEditando.id) {
      this.tiposTrabajadoresService.editarTipoTrabajador(this.tipoTrabajadorEditando.id, this.tipoTrabajadorEditando).subscribe({
        next: (tipoTrabajador) => {
          this.tipoTrabajadorEditado.emit(tipoTrabajador);
          this.cerrarModal();
          Swal.fire({
            title: '¡Éxito!',
            text: 'Tipo de trabajador actualizado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        },
        error: (error) => {
          console.error('Error al editar tipo de trabajador:', error);
          let mensaje = 'Error al actualizar el tipo de trabajador.';
          
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
    if (!this.tipoTrabajadorEditando.nombre.trim()) {
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
    const modalElement = document.getElementById('modalEditarTipoTrabajador');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }
}
