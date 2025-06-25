import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TemporadasService } from '../../../servicios/temporadas.service';
import { Temporada } from '../../../modelos/temporada.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modalAgregarTemporada',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './modalAgregarTemporada.component.html',
  styleUrl: './modalAgregarTemporada.component.css'
})
export class ModalAgregarTemporadaComponent {
  @Output() temporadaCreada = new EventEmitter<Temporada>();

  nuevaTemporada: Temporada = {
    nombre: '',
    fecha_inicio: '',
    fecha_fin: '',
    valor_bulto: 0
  };

  constructor(private temporadasService: TemporadasService) {}

  crearTemporada() {
    if (this.validarFormulario()) {
      // Preparar datos para envío
      const temporadaParaEnviar = {
        ...this.nuevaTemporada
      };

      // Si fecha_fin está vacía, no la enviamos
      if (!temporadaParaEnviar.fecha_fin) {
        delete temporadaParaEnviar.fecha_fin;
      }

      this.temporadasService.crearTemporada(temporadaParaEnviar).subscribe({
        next: (temporada) => {
          this.temporadaCreada.emit(temporada);
          this.cerrarModal();
          this.limpiarFormulario();
          Swal.fire({
            title: '¡Éxito!',
            text: 'Temporada creada correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        },
        error: (error) => {
          console.error('Error al crear temporada:', error);
          let mensaje = 'Error al crear la temporada.';
          
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
    if (!this.nuevaTemporada.nombre.trim()) {
      Swal.fire({
        title: 'Error',
        text: 'El nombre de la temporada es obligatorio.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return false;
    }

    if (!this.nuevaTemporada.fecha_inicio) {
      Swal.fire({
        title: 'Error',
        text: 'La fecha de inicio es obligatoria.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return false;
    }

    if (this.nuevaTemporada.valor_bulto <= 0) {
      Swal.fire({
        title: 'Error',
        text: 'El valor por bulto debe ser mayor a 0.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return false;
    }

    // Validar que fecha_inicio no sea anterior a hoy
    const hoy = new Date();
    const fechaInicio = new Date(this.nuevaTemporada.fecha_inicio);
    hoy.setHours(0, 0, 0, 0);
    fechaInicio.setHours(0, 0, 0, 0);

    if (fechaInicio < hoy) {
      Swal.fire({
        title: 'Error',
        text: 'La fecha de inicio no puede ser anterior a hoy.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return false;
    }

    // Validar que fecha_fin sea posterior a fecha_inicio (si se especifica)
    if (this.nuevaTemporada.fecha_fin) {
      const fechaFin = new Date(this.nuevaTemporada.fecha_fin);
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
    const modalElement = document.getElementById('modalNuevaTemporada');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  limpiarFormulario() {
    this.nuevaTemporada = {
      nombre: '',
      fecha_inicio: '',
      fecha_fin: '',
      valor_bulto: 0
    };
  }

  // Función para obtener la fecha mínima (hoy)
  obtenerFechaMinima(): string {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0');
    const day = String(hoy.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
