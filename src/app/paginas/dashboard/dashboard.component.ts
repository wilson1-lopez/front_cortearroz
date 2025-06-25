import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TemporadasService } from '../../servicios/temporadas.service';
import { Temporada } from '../../modelos/temporada.model';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  temporadasActivas: number = 0;
  totalTemporadas: number = 0;

  constructor(private temporadasService: TemporadasService) {}

  ngOnInit(): void {
    this.cargarEstadisticasTemporadas();
  }

  private cargarEstadisticasTemporadas(): void {
    this.temporadasService.obtenerTemporadasUsuario().subscribe({
      next: (temporadas: Temporada[]) => {
        this.totalTemporadas = temporadas.length;
        this.temporadasActivas = this.contarTemporadasActivas(temporadas);
      },
      error: (error) => {
        console.error('Error al cargar estadísticas de temporadas:', error);
      }
    });
  }

  private contarTemporadasActivas(temporadas: Temporada[]): number {
    const hoy = new Date();
    return temporadas.filter(temporada => {
      const fechaInicio = new Date(temporada.fecha_inicio);
      const fechaFin = temporada.fecha_fin ? new Date(temporada.fecha_fin) : null;
      
      return hoy >= fechaInicio && (!fechaFin || hoy <= fechaFin);
    }).length;
  }
}
