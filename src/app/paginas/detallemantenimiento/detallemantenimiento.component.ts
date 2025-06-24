import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DetalleMantenimientoService } from '../../servicios/detallemantenimiento.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detallemantenimiento',
  templateUrl: './detallemantenimiento.component.html',
  styleUrls: ['./detallemantenimiento.component.css'], 
  imports: [CommonModule, RouterLink],
  standalone: true
})
export class DetallemantenimientoComponent implements OnInit {
  detalle: any = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private detalleService: DetalleMantenimientoService
  ) {}

  ngOnInit(): void {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  if (id) {
    this.detalleService.getDetalleMantenimiento(id).subscribe({
      next: data => {
        // Ordenar los mantenimientos por fecha descendente
        if (data && data.mantenimientos) {
          data.mantenimientos = data.mantenimientos.sort(
            (a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          );
        }
        this.detalle = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar los detalles de mantenimiento.';
        this.loading = false;
      }
    });
  } else {
    this.error = 'ID de máquina no válido.';
    this.loading = false;
  }
}
}
