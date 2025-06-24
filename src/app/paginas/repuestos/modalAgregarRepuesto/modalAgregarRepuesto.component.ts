import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Repuesto } from '../../../modelos/repuesto.models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RepuestosService } from '../../../servicios/repuestos.service';
import { ProveedoresService } from '../../../servicios/proveedores.service';
import { Proveedor } from '../../../modelos/proveedor.model';

@Component({
  selector: 'app-modalagregarrepuesto',
  imports: [ReactiveFormsModule],
  templateUrl: './modalAgregarRepuesto.component.html',
  styleUrl: './modalAgregarRepuesto.component.css'
})
export class ModalagregarRepuestoComponent implements OnInit{
// Evento que se dispara cuando se crea un proveedor nuevo
@Output() repuestoCreado = new EventEmitter<Repuesto>();
repuestoForm: FormGroup;
proveedores: Proveedor[] = [];
guardando: boolean = false;
constructor(private repuestosService: RepuestosService,
  private proveedoresService: ProveedoresService,
  private fb: FormBuilder,
) {
//inicializo el formulario para crear un proveedor
  this.repuestoForm=this.fb.group({
    // Nombre del proveedor (requerido)
    nombre: ['', Validators.required], 
    descripcion:['', Validators.required],
  //  precio:['', Validators.required],
   // proveedor_id:['', Validators.required],
  });
}
  ngOnInit(): void {}
   

guardarRepuesto(){
  if (this.guardando) return;
  this.guardando=true;
  const nuevorepuesto = {
    ...this.repuestoForm.value,
    precio: null // fuerza precio a null
  };
  
  this.guardando = true; 
this.repuestosService.agregarRepuesto(nuevorepuesto).subscribe({
  next: (repuesto) => {
    this.repuestoCreado.emit(repuesto);
    this.repuestoForm.reset();
    (document.getElementById('CerrarModalRepuesto') as HTMLButtonElement)?.click();
    this.guardando = false;
    console.log("Proveedor guardado correctamente:", repuesto);
  },
  error: (err) => {
    console.error("Error al guardar proveedor:", err);
    this.guardando = false;
  }
});

      

    
  }


}
