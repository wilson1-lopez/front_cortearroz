import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TemporadasService } from '../../../servicios/temporadas.service';
import { Temporada } from '../../../modelos/temporada.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modalEditarTemporada',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './modalEditarTemporada.component.html',
  styleUrl: './modalEditarTemporada.component.css'
})
export class ModalEditarTemporadaComponent implements OnChanges {
  @Input() temporadaParaEditar: Temporada | null = null;
  @Output() temporadaEditada = new EventEmitter<Temporada>();

  temporadaEditando: Temporada = {
    nombre: '',
    fecha_inicio: '',
    fecha_fin: '',
    valor_bulto: 0
  };

  constructor(private temporadasService: TemporadasService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['temporadaParaEditar'] && this.temporadaParaEditar) {
      this.temporadaEditando = {
        ...this.temporadaParaEditar,
        fecha_fin: this.temporadaParaEditar.fecha_fin || ''
      };
    }
  }

  editarTemporada() {
    if (this.validarFormulario() && this.temporadaParaEditar?.id) {
      // Preparar datos para envío
      const temporadaParaEnviar = {
        ...this.temporadaEditando
      };

      // Si fecha_fin está vacía, no la enviamos
      if (!temporadaParaEnviar.fecha_fin) {
        delete temporadaParaEnviar.fecha_fin;
      }

      this.temporadasService.actualizarTemporada(this.temporadaParaEditar.id, temporadaParaEnviar).subscribe({
        next: (temporada) => {
          this.temporadaEditada.emit(temporada);
          this.cerrarModal();
          Swal.fire({
            title: '¡Éxito!',
            text: 'Temporada actualizada correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        },
        error: (error) => {
          console.error('Error al actualizar temporada:', error);
          let mensaje = 'Error al actualizar la temporada.';
          
          if (error.error && error.error.message) {
            mensaje = error.error.message;
          } else if (error.error && error.error.errors) {
            // Manejar errores de validación específicos del backend
            const errores = error.error.errors;
            const mensajesError: string[] = [];
            
            Object.keys(errores).forEach(campo => {
              if (Array.isArray(errores[campo])) {
                errores[campo].forEach((error: string) => {
                  mensajesError.push(`${campo}: ${error}`);
                });
              } else {
                mensajesError.push(`${campo}: ${errores[campo]}`);
              }
            });
            
            mensaje = mensajesError.join('<br>');
          } else if (error.message) {
            mensaje = error.message;
          }
          
          Swal.fire({
            title: 'Error de Validación',
            html: mensaje, // Usar html en lugar de text para permitir <br>
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    }
  }

  validarFormulario(): boolean {
    if (!this.temporadaEditando.nombre.trim()) {
      Swal.fire({
        title: 'Error',
        text: 'El nombre de la temporada es obligatorio.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return false;
    }

    if (!this.temporadaEditando.fecha_inicio) {
      Swal.fire({
        title: 'Error',
        text: 'La fecha de inicio es obligatoria.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return false;
    }

    if (this.temporadaEditando.valor_bulto <= 0) {
      Swal.fire({
        title: 'Error',
        text: 'El valor por bulto debe ser mayor a 0.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return false;
    }

    // Validar que fecha_fin sea posterior a fecha_inicio (si se especifica)
    if (this.temporadaEditando.fecha_fin) {
      const fechaInicio = new Date(this.temporadaEditando.fecha_inicio);
      const fechaFin = new Date(this.temporadaEditando.fecha_fin);
      if (fechaFin <= fechaInicio) {
        Swal.fire({
          title: 'Error',
          text: 'La fecha de fin debe ser posterior a la fecha de inicio.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return false;
      }
    }

    return true;
  }

  cerrarModal() {
    const modalElement = document.getElementById('modalEditarTemporada');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  // Función para obtener la fecha mínima
  obtenerFechaMinima(): string {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0');
    const day = String(hoy.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
