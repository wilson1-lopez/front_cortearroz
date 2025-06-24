import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MaquinasService } from '../../../servicios/maquinas.service';
import { Maquina } from '../../../modelos/maquina.model';

@Component({
  selector: 'app-modalagregarmaquina',
  imports: [ReactiveFormsModule,],
  templateUrl: './modalAgregarMaquina.component.html',
  styleUrl: './modalAgregarMaquina.component.css'
})
export class ModalAgregarMaquinaComponent{
  // Evento que se dispara cuando se crea una maquina nueva
  @Output() maquinaCreada = new EventEmitter<Maquina>();
  
  // Formulario para crear una maquina
  maquinaForm: FormGroup;
  
  // Variable para saber si estamos guardando una maquina en este momento
  guardando: boolean = false;

  constructor(
    // Servicio para crear formularios
    private fb: FormBuilder,
    // Servicio para interactuar con la API de maquinas
    private maquinasService: MaquinasService
  ) {
    // Inicializar el formulario para crear una maquina
    this.maquinaForm = this.fb.group({
      // Nombre de la maquina (requerido)
      nombre: ['', Validators.required],
      // Descripcion de la maquina (opcional)
      descripcion: [''],
      // Estado de la maquina (requerido, con valor predeterminado "Activa")
      estado: ['Activa', Validators.required],
    });
  }

  // Metodo para guardar una maquina
  guardarMaquina() {
    // Si ya estamos guardando o el formulario es invalido, no hacemos nada
    if (this.guardando || this.maquinaForm.invalid) {
      return;  
    }
    
    // Marcar que estamos guardando una maquina
    this.guardando = true;  
    
    // Obtener los valores del formulario
    const nuevaMaquina = this.maquinaForm.value;

    // Llamar al servicio para agregar la maquina
    this.maquinasService.agregarMaquina(nuevaMaquina).subscribe({
      next: (maquina) => {
        this.maquinaCreada.emit(maquina);
        this.maquinaForm.reset({ estado: 'Activa' });
        this.guardando = false;
        (document.getElementById('btnCerrarModal') as HTMLButtonElement)?.click();
        
        Swal.fire({
          icon: 'success',
          title: 'Máquina registrada!',
          timer: 2000,
          showConfirmButton: false,
        });
      },
      error: (err) => {
        console.error("Error al guardar máquina:", err);
        this.guardando = false;
        (document.getElementById('btnCerrarModal') as HTMLButtonElement)?.click();
        
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar máquina',
          text: 'No se pudo registrar la máquina. Por favor, intente nuevamente.',
        });
      }
    });
  }
  
}
