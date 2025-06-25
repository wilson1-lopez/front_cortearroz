import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TemporadasService } from '../../servicios/temporadas.service';
import { Temporada } from '../../modelos/temporada.model';

import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { ModalAgregarTemporadaComponent } from './modalAgregarTemporada/modalAgregarTemporada.component';
import { ModalEditarTemporadaComponent } from './modalEditarTemporada/modalEditarTemporada.component';


@Component({
  selector: 'app-temporadas',
  standalone: true,
  imports: [ModalAgregarTemporadaComponent, ModalEditarTemporadaComponent, FormsModule, DatePipe, CurrencyPipe],
  templateUrl: './temporadas.component.html',
  styleUrl: './temporadas.component.css'
})
export class TemporadasComponent implements OnInit {
  temporadas: Temporada[] = [];
  temporadaSeleccionada: Temporada | null = null;
  terminoBusqueda: string = '';

  constructor(
    private temporadasService: TemporadasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarTemporadas();
  }

  cargarTemporadas() {
    this.temporadasService.obtenerTemporadasUsuario().subscribe({
      next: (data) => this.temporadas = data,
      error: (error) => console.error('Error al cargar las temporadas:', error)
    });
  }

  agregarTemporada(temporada: Temporada) {
    // Recargar la lista completa para obtener toda la información actualizada
    this.cargarTemporadas();
  }

  actualizarLista() {
    this.cargarTemporadas();
  }

  eliminarTemporada(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la temporada de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.temporadasService.eliminarTemporada(id).subscribe({
          next: () => {
            this.cargarTemporadas();
            Swal.fire({
              title: '¡Eliminado!',
              text: 'La temporada ha sido eliminada correctamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
          },
          error: (error) => {
            console.error('Error al eliminar temporada:', error);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar la temporada.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        });
      }
    });
  }

  editarTemporada(temporada: Temporada) {
    this.temporadaSeleccionada = temporada;
    // Abrir el modal de editar
    const modalElement = document.getElementById('modalEditarTemporada');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  verDetalles(id: number) {
    this.router.navigate(['/temporadas/detalles', id]);
  }

  onTemporadaEditada(temporadaEditada: Temporada) {
    // Actualizar la lista después de editar
    this.cargarTemporadas();
    this.temporadaSeleccionada = null;
  }

  buscarTemporadas() {
    if (this.terminoBusqueda.trim() === '') {
      this.cargarTemporadas();
    } else {
      this.temporadasService.buscarTemporadas(this.terminoBusqueda).subscribe({
        next: (data) => this.temporadas = data,
        error: (error) => console.error('Error al buscar temporadas:', error)
      });
    }
  }

  limpiarBusqueda() {
    this.terminoBusqueda = '';
    this.cargarTemporadas();
  }

  // Función auxiliar para determinar el estado de la temporada
  obtenerEstadoTemporada(temporada: Temporada): { estado: string, clase: string } {
    const hoy = new Date();
    const fechaInicio = new Date(temporada.fecha_inicio);
    const fechaFin = temporada.fecha_fin ? new Date(temporada.fecha_fin) : null;

    if (fechaFin && hoy > fechaFin) {
      return { estado: 'Finalizada', clase: 'bg-secondary' };
    } else if (hoy >= fechaInicio && (!fechaFin || hoy <= fechaFin)) {
      return { estado: 'Activa', clase: 'bg-success' };
    } else {
      return { estado: 'Programada', clase: 'bg-primary' };
    }
  }
}
