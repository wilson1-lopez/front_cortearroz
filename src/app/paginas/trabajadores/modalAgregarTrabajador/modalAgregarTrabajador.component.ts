import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TrabajadoresService } from '../../../servicios/trabajadores.service';
import { TiposTrabajadoresService } from '../../../servicios/tipos-trabajadores.service';
import { Trabajador } from '../../../modelos/trabajador.model';
import { TipoTrabajador } from '../../../modelos/tipo-trabajador.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modalAgregarTrabajador',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './modalAgregarTrabajador.component.html',
  styleUrl: './modalAgregarTrabajador.component.css'
})
export class ModalAgregarTrabajadorComponent implements OnInit {
  @Output() trabajadorCreado = new EventEmitter<Trabajador>();

  nuevoTrabajador: Trabajador = {
    nombre: '',
    apellido: '',
    telefono: '',
    cedula: '',
    direccion: '',
    tipo_id: 0
  };

  tiposTrabajadores: TipoTrabajador[] = [];

  constructor(
    private trabajadoresService: TrabajadoresService,
    private tiposTrabajadoresService: TiposTrabajadoresService
  ) {}

  ngOnInit(): void {
    this.cargarTiposTrabajadores();
  }

  cargarTiposTrabajadores(): void {
    this.tiposTrabajadoresService.obtenerTiposTrabajadores().subscribe({
      next: (tipos) => this.tiposTrabajadores = tipos,
      error: (error) => console.error('Error al cargar tipos de trabajadores:', error)
    });
  }

  crearTrabajador() {
    if (this.validarFormulario()) {
      this.trabajadoresService.crearTrabajador(this.nuevoTrabajador).subscribe({
        next: (trabajador) => {
          this.trabajadorCreado.emit(trabajador);
          this.cerrarModal();
          this.limpiarFormulario();
          Swal.fire({
            title: '¡Éxito!',
            text: 'Trabajador creado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        },
        error: (error) => {
          console.error('Error al crear trabajador:', error);
          let mensaje = 'Error al crear el trabajador.';
          
          if (error.error && error.error.errors) {
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
          } else if (error.error && error.error.message) {
            mensaje = error.error.message;
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
    if (!this.nuevoTrabajador.nombre.trim()) {
      Swal.fire({
        title: 'Error',
        text: 'El nombre del trabajador es obligatorio.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return false;
    }

    if (!this.nuevoTrabajador.apellido.trim()) {
      Swal.fire({
        title: 'Error',
        text: 'El apellido del trabajador es obligatorio.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return false;
    }

    if (!this.nuevoTrabajador.tipo_id || this.nuevoTrabajador.tipo_id === 0) {
      Swal.fire({
        title: 'Error',
        text: 'Debe seleccionar un tipo de trabajador.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return false;
    }

    return true;
  }

  cerrarModal() {
    const modalElement = document.getElementById('modalNuevoTrabajador');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  limpiarFormulario() {
    this.nuevoTrabajador = {
      nombre: '',
      apellido: '',
      telefono: '',
      cedula: '',
      direccion: '',
      tipo_id: 0
    };
  }
}
