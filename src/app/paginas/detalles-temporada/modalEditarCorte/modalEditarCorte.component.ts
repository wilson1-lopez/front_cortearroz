import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CortesService } from '../../../servicios/cortes.service';
import { Corte, CorteFormData } from '../../../modelos/corte.model';
import { Cliente } from '../../../modelos/cliente.model';
import { Maquina } from '../../../modelos/maquina.model';
import { Trabajador } from '../../../modelos/trabajador.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-editar-corte',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modalEditarCorte.component.html',
  styleUrl: './modalEditarCorte.component.css'
})
export class ModalEditarCorteComponent implements OnInit, OnChanges {
  @Input() corte: Corte | null = null;
  @Input() clientes: Cliente[] = [];
  @Input() maquinas: Maquina[] = [];
  @Input() trabajadores: Trabajador[] = [];
  @Output() corteActualizado = new EventEmitter<Corte>();

  corteForm: FormGroup;
  guardando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cortesService: CortesService
  ) {
    this.corteForm = this.fb.group({
      fecha_inicio: ['', [Validators.required]],
      fecha_fin: [''],
      valor_bulto: ['', [Validators.required, Validators.min(0)]],
      descripcion: ['', [Validators.maxLength(250)]],
      cliente_id: ['', [Validators.required]],
      maquinas: this.fb.array([]),
      trabajadores: this.fb.array([])
    });
  }

  ngOnInit(): void {
    if (this.corte) {
      this.cargarDatosCorte();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['corte'] && this.corte) {
      this.cargarDatosCorte();
    }
  }

  get maquinasArray(): FormArray {
    return this.corteForm.get('maquinas') as FormArray;
  }

  get trabajadoresArray(): FormArray {
    return this.corteForm.get('trabajadores') as FormArray;
  }

  cargarDatosCorte(): void {
    if (!this.corte) return;

    this.corteForm.patchValue({
      fecha_inicio: this.corte.fecha_inicio,
      fecha_fin: this.corte.fecha_fin || '',
      valor_bulto: this.corte.valor_bulto,
      descripcion: this.corte.descripcion || '',
      cliente_id: this.corte.cliente_id
    });

    // Limpiar arrays existentes
    while (this.maquinasArray.length !== 0) {
      this.maquinasArray.removeAt(0);
    }
    while (this.trabajadoresArray.length !== 0) {
      this.trabajadoresArray.removeAt(0);
    }

    // Cargar máquinas seleccionadas
    if (this.corte.maquinas) {
      this.corte.maquinas.forEach(maquina => {
        this.maquinasArray.push(this.fb.group({
          maquina_id: [maquina.id],
          seleccionada: [true]
        }));
      });
    }

    // Cargar trabajadores asignados
    if (this.corte.trabajadores) {
      this.corte.trabajadores.forEach(trabajador => {
        this.trabajadoresArray.push(this.fb.group({
          trabajador_id: [trabajador.id, [Validators.required]],
          precio_acordado: [trabajador.precio_acordado, [Validators.required, Validators.min(0)]]
        }));
      });
    }
  }

  agregarTrabajador(): void {
    const trabajadorGroup = this.fb.group({
      trabajador_id: ['', [Validators.required]],
      precio_acordado: ['', [Validators.required, Validators.min(0)]]
    });
    this.trabajadoresArray.push(trabajadorGroup);
  }

  removerTrabajador(index: number): void {
    this.trabajadoresArray.removeAt(index);
  }

  onMaquinaChange(maquinaId: number, event: any): void {
    const index = this.maquinasArray.controls.findIndex(
      control => control.get('maquina_id')?.value === maquinaId
    );

    if (event.target.checked && index === -1) {
      this.maquinasArray.push(this.fb.group({
        maquina_id: [maquinaId],
        seleccionada: [true]
      }));
    } else if (!event.target.checked && index !== -1) {
      this.maquinasArray.removeAt(index);
    }
  }

  isMaquinaSeleccionada(maquinaId: number): boolean {
    return this.maquinasArray.value.some((m: any) => m.maquina_id === maquinaId && m.seleccionada);
  }

  actualizarCorte(): void {
    if (this.corteForm.invalid || !this.corte?.id) {
      this.mostrarErroresValidacion();
      return;
    }

    this.guardando = true;
    const formData = this.corteForm.value;
    
    const corteData: CorteFormData = {
      fecha_inicio: formData.fecha_inicio,
      fecha_fin: formData.fecha_fin || undefined,
      valor_bulto: parseFloat(formData.valor_bulto),
      descripcion: formData.descripcion || undefined,
      cliente_id: parseInt(formData.cliente_id),
      temporada_id: this.corte.temporada_id,
      maquinas: this.maquinasArray.value
        .filter((m: any) => m.seleccionada)
        .map((m: any) => parseInt(m.maquina_id)),
      trabajadores: formData.trabajadores.map((t: any) => ({
        trabajador_id: parseInt(t.trabajador_id),
        precio_acordado: parseFloat(t.precio_acordado)
      }))
    };

    this.cortesService.actualizarCorte(this.corte.id, corteData).subscribe({
      next: (corteActualizado) => {
        this.corteActualizado.emit(corteActualizado);
        this.cerrarModal();
        this.guardando = false;
        
        Swal.fire({
          title: '¡Éxito!',
          text: 'Corte actualizado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (error) => {
        this.guardando = false;
        console.error('Error al actualizar corte:', error);
        
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'No se pudo actualizar el corte. Inténtalo de nuevo.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  private mostrarErroresValidacion(): void {
    Object.keys(this.corteForm.controls).forEach(key => {
      const control = this.corteForm.get(key);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });

    // Validar arrays anidados
    this.trabajadoresArray.controls.forEach(control => {
      Object.keys(control.value).forEach(key => {
        const nestedControl = control.get(key);
        if (nestedControl && nestedControl.invalid) {
          nestedControl.markAsTouched();
        }
      });
    });
  }

  private cerrarModal(): void {
    const modalElement = document.getElementById('modalEditarCorte');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  getErrorMessage(campo: string): string {
    const control = this.corteForm.get(campo);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getNombreCampo(campo)} es requerido`;
      }
      if (control.errors['min']) {
        return `${this.getNombreCampo(campo)} debe ser mayor a ${control.errors['min'].min}`;
      }
      if (control.errors['maxlength']) {
        return `${this.getNombreCampo(campo)} no puede exceder ${control.errors['maxlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  private getNombreCampo(campo: string): string {
    const nombres: { [key: string]: string } = {
      fecha_inicio: 'Fecha de inicio',
      fecha_fin: 'Fecha de fin',
      valor_bulto: 'Valor por bulto',
      descripcion: 'Descripción',
      cliente_id: 'Cliente'
    };
    return nombres[campo] || campo;
  }
}
