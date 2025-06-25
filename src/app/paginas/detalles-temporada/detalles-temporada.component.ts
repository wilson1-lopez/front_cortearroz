import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { TemporadasService } from '../../servicios/temporadas.service';

import { Temporada } from '../../modelos/temporada.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalles-temporada',
  standalone: true,
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './detalles-temporada.component.html',
  styleUrl: './detalles-temporada.component.css'
})
export class DetallesTemporadaComponent implements OnInit {
  temporada: Temporada | null = null;
 
  estadisticasCortes: any = null;
  cargando: boolean = true;
  cargandoCortes: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private temporadasService: TemporadasService,
   
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarTemporada(parseInt(id));
    } else {
      this.router.navigate(['/temporadas']);
    }
  }

  cargarTemporada(id: number): void {
    this.cargando = true;
    this.temporadasService.obtenerTemporadaPorId(id).subscribe({
      next: (temporada) => {
        this.temporada = temporada;
        this.cargando = false;
        // Cargar cortes asociados a esta temporada
       
      },
      error: (error) => {
        console.error('Error al cargar temporada:', error);
        this.cargando = false;
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar la información de la temporada.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/temporadas']);
        });
      }
    });
  }

 

  volver(): void {
    this.router.navigate(['/temporadas']);
  }

  editarTemporada(): void {
    if (this.temporada?.id) {
      this.router.navigate(['/temporadas'], { 
        queryParams: { editar: this.temporada.id } 
      });
    }
  }

  // Función auxiliar para determinar el estado de la temporada
  obtenerEstadoTemporada(): { estado: string, clase: string, icono: string } {
    if (!this.temporada) {
      return { estado: 'Desconocido', clase: 'bg-secondary', icono: 'bi-question-circle' };
    }

    const hoy = new Date();
    const fechaInicio = new Date(this.temporada.fecha_inicio);
    const fechaFin = this.temporada.fecha_fin ? new Date(this.temporada.fecha_fin) : null;

    if (fechaFin && hoy > fechaFin) {
      return { estado: 'Finalizada', clase: 'bg-secondary', icono: 'bi-check-circle' };
    } else if (hoy >= fechaInicio && (!fechaFin || hoy <= fechaFin)) {
      return { estado: 'Activa', clase: 'bg-success', icono: 'bi-play-circle' };
    } else {
      return { estado: 'Programada', clase: 'bg-primary', icono: 'bi-clock' };
    }
  }

  // Calcular duración de la temporada
  obtenerDuracion(): string {
    if (!this.temporada) return 'No disponible';

    const fechaInicio = new Date(this.temporada.fecha_inicio);
    
    if (!this.temporada.fecha_fin) {
      return 'Temporada abierta (sin fecha de fin)';
    }

    const fechaFin = new Date(this.temporada.fecha_fin);
    const diferenciaTiempo = fechaFin.getTime() - fechaInicio.getTime();
    const diferenciaDias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));

    if (diferenciaDias === 1) {
      return '1 día';
    } else if (diferenciaDias < 30) {
      return `${diferenciaDias} días`;
    } else if (diferenciaDias < 365) {
      const meses = Math.floor(diferenciaDias / 30);
      const diasRestantes = diferenciaDias % 30;
      return diasRestantes > 0 ? `${meses} mes${meses > 1 ? 'es' : ''} y ${diasRestantes} día${diasRestantes > 1 ? 's' : ''}` 
                                : `${meses} mes${meses > 1 ? 'es' : ''}`;
    } else {
      const años = Math.floor(diferenciaDias / 365);
      const diasRestantes = diferenciaDias % 365;
      return diasRestantes > 0 ? `${años} año${años > 1 ? 's' : ''} y ${diasRestantes} día${diasRestantes > 1 ? 's' : ''}` 
                                : `${años} año${años > 1 ? 's' : ''}`;
    }
  }

  // Función para obtener el color del estado del corte
  obtenerColorEstado(estado: string): string {
    switch (estado) {
      case 'completado':
        return 'text-success';
      case 'en_proceso':
        return 'text-warning';
      case 'pendiente':
        return 'text-info';
      case 'cancelado':
        return 'text-danger';
      default:
        return 'text-secondary';
    }
  }

  // Función para obtener el ícono del estado del corte
  obtenerIconoEstado(estado: string): string {
    switch (estado) {
      case 'completado':
        return 'bi-check-circle-fill';
      case 'en_proceso':
        return 'bi-clock-fill';
      case 'pendiente':
        return 'bi-hourglass-split';
      case 'cancelado':
        return 'bi-x-circle-fill';
      default:
        return 'bi-question-circle';
    }
  }
}
