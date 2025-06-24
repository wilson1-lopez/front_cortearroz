import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Maquina } from '../../../modelos/maquina.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MaquinasService } from '../../../servicios/maquinas.service';

@Component({
  selector: 'app-modaleditarmaquina',
  imports: [ReactiveFormsModule],
  templateUrl: './modalEditarMaquina.component.html',
  styleUrls: ['./modalEditarMaquina.component.css']
})
export class ModaleditarMaquinaComponent implements OnChanges {
  /**
   * Maquina que se va a editar
   */
  @Input() maquina!: Maquina;

  /**
   * Evento que se emite cuando se edita la maquina
   */
  @Output() maquinaEditada = new EventEmitter<void>();

  /**
   * Formulario para editar la maquina
   */
  maquinaForm: FormGroup;
  guardando: boolean = false;

  constructor(
    /**
     * Servicio para crear formularios
     */
    private fb: FormBuilder,
    /**
     * Servicio para interactuar con la API de maquinas
     */
    private maquinasService: MaquinasService
  ) {
    /**
     * Creamos el formulario con los campos que se van a editar
     */
    this.maquinaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      estado: ['', Validators.required]
    });
  }

  /**
   * Metodo que se ejecuta cuando cambia el valor de la maquina
   */
  ngOnChanges(changes: SimpleChanges): void {
    /**
     * Si cambia la maquina, actualizamos el formulario con los datos de la maquina
     */
    if (changes['maquina'] && this.maquina) {
      this.maquinaForm.patchValue({
        nombre: this.maquina.nombre,
        descripcion: this.maquina.descripcion,
        estado: this.maquina.estado
      });
    }
  }

  /**
   * Metodo para guardar los cambios en la maquina
   */
  guardarCambios(): void {
    this.guardando = true;
    /**
     * Si el formulario es valido, actualizamos la maquina en la API
     */
    if (this.maquinaForm.valid) {
     
      const maquinaActualizada: Maquina = { ...this.maquina, ...this.maquinaForm.value };

      this.maquinasService.editarMaquina(maquinaActualizada).subscribe({
        /**
         * Si todo sale bien, emitimos el evento para que el componente padre se entere
         * y cerramos el modal
         */
        next: () => {
          this.maquinaEditada.emit();
          
          (document.getElementById('btnCerrarModaleditar') as HTMLButtonElement)?.click();
          this.guardando = false;
          Swal.fire({
            icon: 'success',
            title: 'Máquina actualizada correctamente',
            timer: 2000,
            showConfirmButton: false
          });
        },
        /**
         * Si hay un error, mostramos un mensaje de error
         */
        error: (err) => {
          console.error(err);
          this.guardando = false;
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            text: 'No se pudo actualizar la máquina.',
          });
        }
      });
    }
  }
}

