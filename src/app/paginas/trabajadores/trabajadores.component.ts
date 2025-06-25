import { Component, OnInit } from '@angular/core';
import { TrabajadoresService } from '../../servicios/trabajadores.service';
import { Trabajador } from '../../modelos/trabajador.model';

import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ModalAgregarTrabajadorComponent } from './modalAgregarTrabajador/modalAgregarTrabajador.component';
import { ModalEditarTrabajadorComponent } from './modalEditarTrabajador/modalEditarTrabajador.component';

@Component({
  selector: 'app-trabajadores',
  standalone: true,
  imports: [ModalAgregarTrabajadorComponent, ModalEditarTrabajadorComponent, FormsModule, DatePipe],
  templateUrl: './trabajadores.component.html',
  styleUrl: './trabajadores.component.css'
})
export class TrabajadoresComponent implements OnInit {
  trabajadores: Trabajador[] = [];
  trabajadorSeleccionado: Trabajador | null = null;
  terminoBusqueda: string = '';

  constructor(private trabajadoresService: TrabajadoresService) {}

  ngOnInit(): void {
    this.cargarTrabajadores();
  }

  cargarTrabajadores() {
    this.trabajadoresService.obtenerTrabajadores().subscribe({
      next: (data) => this.trabajadores = data,
      error: (error) => console.error('Error al cargar los trabajadores:', error)
    });
  }

  agregarTrabajador(trabajador: Trabajador) {
    // Recargar la lista completa para obtener toda la información actualizada
    this.cargarTrabajadores();
  }

  actualizarLista() {
    this.cargarTrabajadores();
  }

  eliminarTrabajador(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el trabajador de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.trabajadoresService.eliminarTrabajador(id).subscribe({
          next: () => {
            this.cargarTrabajadores();
            Swal.fire({
              title: '¡Eliminado!',
              text: 'El trabajador ha sido eliminado correctamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
          },
          error: (error) => {
            console.error('Error al eliminar trabajador:', error);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar el trabajador.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        });
      }
    });
  }

  editarTrabajador(trabajador: Trabajador) {
    this.trabajadorSeleccionado = trabajador;
    // Abrir el modal de editar
    const modalElement = document.getElementById('modalEditarTrabajador');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  onTrabajadorEditado(trabajadorEditado: Trabajador) {
    // Actualizar la lista después de editar
    this.cargarTrabajadores();
    this.trabajadorSeleccionado = null;
  }

  buscarTrabajadores() {
    if (this.terminoBusqueda.trim() === '') {
      this.cargarTrabajadores();
    } else {
      this.trabajadoresService.buscarTrabajadores(this.terminoBusqueda).subscribe({
        next: (data) => this.trabajadores = data,
        error: (error) => console.error('Error al buscar trabajadores:', error)
      });
    }
  }

  limpiarBusqueda() {
    this.terminoBusqueda = '';
    this.cargarTrabajadores();
  }
}