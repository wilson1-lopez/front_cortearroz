import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { TemporadasService } from '../../servicios/temporadas.service';
import { CortesService } from '../../servicios/cortes.service';
import { ClientesService } from '../../servicios/clientes.service';
import { MaquinasService } from '../../servicios/maquinas.service';
import { TrabajadoresService } from '../../servicios/trabajadores.service';

import { Temporada } from '../../modelos/temporada.model';
import { Corte } from '../../modelos/corte.model';
import { Cliente } from '../../modelos/cliente.model';
import { Maquina } from '../../modelos/maquina.model';
import { Trabajador } from '../../modelos/trabajador.model';

import { ModalAgregarCorteComponent } from './modalAgregarCorte/modalAgregarCorte.component';
import { ModalEditarCorteComponent } from './modalEditarCorte/modalEditarCorte.component';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalles-temporada',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, ModalAgregarCorteComponent, ModalEditarCorteComponent],
  templateUrl: './detalles-temporada.component.html',
  styleUrl: './detalles-temporada.component.css'
})
export class DetallesTemporadaComponent implements OnInit {
  temporada: Temporada | null = null;
  cortes: Corte[] = [];
  clientes: Cliente[] = [];
  maquinas: Maquina[] = [];
  trabajadores: Trabajador[] = [];
  
  estadisticasCortes: any = null;
  cargando: boolean = true;
  cargandoCortes: boolean = false;
  corteSeleccionado: Corte | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private temporadasService: TemporadasService,
    private cortesService: CortesService,
    private clientesService: ClientesService,
    private maquinasService: MaquinasService,
    private trabajadoresService: TrabajadoresService
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
        this.cargarCortes();
        this.cargarDatosAuxiliares();
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

  cargarCortes(): void {
    if (!this.temporada?.id) return;
    
    this.cargandoCortes = true;
    this.cortesService.obtenerCortesPorTemporada(this.temporada.id).subscribe({
      next: (cortes) => {
        this.cortes = cortes;
        this.cargandoCortes = false;
        this.calcularEstadisticasCortes();
      },
      error: (error) => {
        console.error('Error al cargar cortes:', error);
        this.cargandoCortes = false;
      }
    });
  }

  cargarDatosAuxiliares(): void {
    // Cargar clientes
    this.clientesService.obtenerClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        console.log('Clientes cargados:', clientes);
      },
      error: (error) => console.error('Error al cargar clientes:', error)
    });

    // Cargar máquinas
    this.maquinasService.obtenerMaquinas().subscribe({
      next: (maquinas) => {
        this.maquinas = maquinas;
        console.log('Máquinas cargadas:', maquinas);
      },
      error: (error) => console.error('Error al cargar máquinas:', error)
    });

    // Cargar trabajadores
    console.log('Intentando cargar trabajadores...');
    this.trabajadoresService.obtenerTrabajadores().subscribe({
      next: (trabajadores) => {
        this.trabajadores = trabajadores;
        console.log('Trabajadores cargados:', trabajadores);
      },
      error: (error) => {
        console.error('Error al cargar trabajadores:', error);
        console.error('Detalles del error:', error.error);
      }
    });
  }

  calcularEstadisticasCortes(): void {
    if (!this.cortes || this.cortes.length === 0) {
      this.estadisticasCortes = {
        total: 0,
        activos: 0,
        completados: 0,
        valorTotal: 0
      };
      return;
    }

    const hoy = new Date();
    const activos = this.cortes.filter(corte => {
      const fechaFin = corte.fecha_fin ? new Date(corte.fecha_fin) : null;
      return !fechaFin || fechaFin >= hoy;
    });

    const completados = this.cortes.filter(corte => {
      const fechaFin = corte.fecha_fin ? new Date(corte.fecha_fin) : null;
      return fechaFin && fechaFin < hoy;
    });

    const valorTotal = this.cortes.reduce((sum, corte) => sum + corte.valor_bulto, 0);

    this.estadisticasCortes = {
      total: this.cortes.length,
      activos: activos.length,
      completados: completados.length,
      valorTotal: valorTotal
    };
  }

  abrirModalAgregarCorte(): void {
    const modalElement = document.getElementById('modalNuevoCorte');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  abrirModalEditarCorte(corte: Corte): void {
    this.corteSeleccionado = corte;
    const modalElement = document.getElementById('modalEditarCorte');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  onCorteCreado(corte: Corte): void {
    this.cortes.push(corte);
    this.calcularEstadisticasCortes();
  }

  onCorteActualizado(corteActualizado: Corte): void {
    const index = this.cortes.findIndex(c => c.id === corteActualizado.id);
    if (index !== -1) {
      this.cortes[index] = corteActualizado;
      this.calcularEstadisticasCortes();
    }
  }

  eliminarCorte(corte: Corte): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el corte "${corte.descripcion || 'Sin descripción'}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && corte.id) {
        this.cortesService.eliminarCorte(corte.id).subscribe({
          next: () => {
            this.cortes = this.cortes.filter(c => c.id !== corte.id);
            this.calcularEstadisticasCortes();
            Swal.fire('Eliminado', 'El corte ha sido eliminado exitosamente.', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar corte:', error);
            Swal.fire('Error', 'No se pudo eliminar el corte.', 'error');
          }
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

  obtenerEstadoCorte(corte: Corte): { estado: string, clase: string, icono: string } {
    const hoy = new Date();
    const fechaInicio = new Date(corte.fecha_inicio);
    const fechaFin = corte.fecha_fin ? new Date(corte.fecha_fin) : null;

    if (fechaFin && hoy > fechaFin) {
      return { estado: 'Completado', clase: 'bg-success', icono: 'bi-check-circle-fill' };
    } else if (hoy >= fechaInicio && (!fechaFin || hoy <= fechaFin)) {
      return { estado: 'En Proceso', clase: 'bg-warning', icono: 'bi-clock-fill' };
    } else {
      return { estado: 'Programado', clase: 'bg-primary', icono: 'bi-calendar-event' };
    }
  }
}
