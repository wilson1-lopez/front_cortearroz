import { Component, OnInit } from '@angular/core';
import { TiposTrabajadoresService } from '../../servicios/tipos-trabajadores.service';
import { TipoTrabajador } from '../../modelos/tipo-trabajador.model';
import { ModalAgregarTipoTrabajadorComponent } from './modalAgregarTipoTrabajador/modalAgregarTipoTrabajador.component';
import { ModalEditarTipoTrabajadorComponent } from './modalEditarTipoTrabajador/modalEditarTipoTrabajador.component';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tipos-trabajadores',
  standalone: true,
  imports: [ModalAgregarTipoTrabajadorComponent, ModalEditarTipoTrabajadorComponent, FormsModule, DatePipe],
  templateUrl: './tipos-trabajadores.component.html',
  styleUrl: './tipos-trabajadores.component.css'
})
export class TiposTrabajadoresComponent implements OnInit {
  tiposTrabajadores: TipoTrabajador[] = [];
  tipoTrabajadorSeleccionado: TipoTrabajador | null = null;
  terminoBusqueda: string = '';

  constructor(private tiposTrabajadoresService: TiposTrabajadoresService) {}

  ngOnInit(): void {
    this.cargarTiposTrabajadores();
  }

  cargarTiposTrabajadores() {
    this.tiposTrabajadoresService.obtenerTiposTrabajadores().subscribe({
      next: (data) => this.tiposTrabajadores = data,
      error: (error) => console.error('Error al cargar los tipos de trabajadores:', error)
    });
  }

  agregarTipoTrabajador(tipoTrabajador: TipoTrabajador) {
    this.tiposTrabajadores.push(tipoTrabajador);
  }

  actualizarLista() {
    this.cargarTiposTrabajadores();
  }

  eliminarTipoTrabajador(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el tipo de trabajador de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tiposTrabajadoresService.eliminarTipoTrabajador(id).subscribe({
          next: () => {
            this.cargarTiposTrabajadores();
            Swal.fire({
              title: '¡Eliminado!',
              text: 'El tipo de trabajador ha sido eliminado correctamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
          },
          error: (error) => {
            console.error('Error al eliminar tipo de trabajador:', error);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar el tipo de trabajador.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        });
      }
    });
  }

  editarTipoTrabajador(tipoTrabajador: TipoTrabajador) {
    this.tipoTrabajadorSeleccionado = tipoTrabajador;
    // Abrir el modal de editar
    const modalElement = document.getElementById('modalEditarTipoTrabajador');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  onTipoTrabajadorEditado(tipoTrabajadorEditado: TipoTrabajador) {
    // Actualizar la lista después de editar
    this.cargarTiposTrabajadores();
    this.tipoTrabajadorSeleccionado = null;
  }

  buscarTiposTrabajadores() {
    if (this.terminoBusqueda.trim() === '') {
      this.cargarTiposTrabajadores();
    } else {
      this.tiposTrabajadoresService.buscarTiposTrabajadores(this.terminoBusqueda).subscribe({
        next: (data) => this.tiposTrabajadores = data,
        error: (error) => console.error('Error al buscar tipos de trabajadores:', error)
      });
    }
  }

  limpiarBusqueda() {
    this.terminoBusqueda = '';
    this.cargarTiposTrabajadores();
  }
}
