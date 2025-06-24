import { Component, OnInit } from '@angular/core';
import { RepuestosService } from '../../servicios/repuestos.service';
import { Repuesto } from '../../modelos/repuesto.models';
import { ModalagregarRepuestoComponent } from './modalAgregarRepuesto/modalAgregarRepuesto.component';
import { ProveedoresService } from '../../servicios/proveedores.service';

@Component({
  selector: 'app-repuestos',
  imports: [ModalagregarRepuestoComponent],
  templateUrl: './repuestos.component.html',
  styleUrl: './repuestos.component.css'
})
export class RepuestosComponent implements OnInit {

repuestos: Repuesto[] = [];

constructor(private repuestosService: RepuestosService, 
 
) {  
}
  ngOnInit(): void {
    this.obtenerRepuestos();
 
  }

  obtenerRepuestos() {
    this.repuestosService.obtenerRepuestos().subscribe(
      {
        next: (data) => this.repuestos = data,
        error: (error) => console.error('Error al cargar los repuestos:', error)
      }
     
    );

  }

 

   agegarRepuesto(repuesto: Repuesto) {
      this.repuestos.push(repuesto);
    }

    eliminarRepuesto(id: number) {
  this.repuestosService.eliminarRepuesto(id).subscribe({
    next: () => {
      this.repuestos = this.repuestos.filter(r => r.id !== id);
    },
    error: (error) => console.error('Error al eliminar el repuesto:', error)
  });
}

}
