import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CortesService } from '../../../servicios/cortes.service';
import { TiposTrabajadoresService } from '../../../servicios/tipos-trabajadores.service';
import { Corte, CorteFormData } from '../../../modelos/corte.model';
import { Cliente } from '../../../modelos/cliente.model';
import { Maquina } from '../../../modelos/maquina.model';
import { Trabajador } from '../../../modelos/trabajador.model';
import { TipoTrabajador } from '../../../modelos/tipo-trabajador.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-agregar-corte',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modalAgregarCorte.component.html',
  styleUrl: './modalAgregarCorte.component.css'
})
export class ModalAgregarCorteComponent implements OnInit {
  @Input() temporadaId!: number;
  @Input() clientes: Cliente[] = [];
  @Input() maquinas: Maquina[] = [];
  @Input() trabajadores: Trabajador[] = [];
  @Output() corteCreado = new EventEmitter<Corte>();

  corteForm: FormGroup;
  guardando: boolean = false;
  tiposTrabajadores: TipoTrabajador[] = [];

  constructor(
    private fb: FormBuilder,
    private cortesService: CortesService,
    private tiposTrabajadoresService: TiposTrabajadoresService
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
    // Establecer fecha mínima como hoy
    const hoy = new Date().toISOString().split('T')[0];
    const fechaInicioControl = this.corteForm.get('fecha_inicio');
    if (fechaInicioControl) {
      fechaInicioControl.patchValue(hoy);
    }

    // Cargar tipos de trabajadores
    this.cargarTiposTrabajadores();
  }

  private cargarTiposTrabajadores(): void {
    this.tiposTrabajadoresService.obtenerTiposTrabajadores().subscribe({
      next: (tipos) => {
        this.tiposTrabajadores = tipos;
        console.log('Tipos de trabajadores cargados:', tipos);
      },
      error: (error) => {
        console.error('Error al cargar tipos de trabajadores:', error);
      }
    });
  }

  get maquinasArray(): FormArray {
    return this.corteForm.get('maquinas') as FormArray;
  }

  get trabajadoresArray(): FormArray {
    return this.corteForm.get('trabajadores') as FormArray;
  }

  agregarMaquina(): void {
    const maquinaGroup = this.fb.group({
      maquina_id: ['', [Validators.required]],
      seleccionada: [false]
    });
    this.maquinasArray.push(maquinaGroup);
  }

  removerMaquina(index: number): void {
    this.maquinasArray.removeAt(index);
  }

  agregarTrabajador(): void {
    const trabajadorGroup = this.fb.group({
      tipo_id: ['', [Validators.required]],
      trabajador_id: ['', [Validators.required]],
      precio_acordado: ['', [Validators.required, Validators.min(0)]]
    });
    this.trabajadoresArray.push(trabajadorGroup);
  }

  removerTrabajador(index: number): void {
    this.trabajadoresArray.removeAt(index);
  }

  onTipoTrabajadorChange(index: number, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const tipoId = select.value;
    const trabajadorGroup = this.trabajadoresArray.at(index);
    if (trabajadorGroup) {
      // Limpiar selección de trabajador cuando cambia el tipo
      trabajadorGroup.get('trabajador_id')?.setValue('');
      console.log(`Tipo cambiado en index ${index} a tipo_id: ${tipoId}`);
      console.log('Trabajadores filtrados:', this.getTrabajadoresPorTipo(tipoId));
    }
  }

  getTrabajadoresPorTipo(tipoId: string | null): Trabajador[] {
    if (!tipoId || tipoId === '') {
      return [];
    }
    const tipoIdNumber = parseInt(tipoId);
    const trabajadoresFiltrados = this.trabajadores.filter(trabajador => 
      trabajador.tipo_id === tipoIdNumber
    );
    console.log(`Filtrando trabajadores para tipo_id ${tipoIdNumber}:`, trabajadoresFiltrados);
    return trabajadoresFiltrados;
  }

  onMaquinaChange(maquinaId: number, event: any): void {
    const maquinasSeleccionadas = this.maquinasArray.value.filter((m: any) => m.seleccionada);
    const yaSeleccionada = maquinasSeleccionadas.find((m: any) => m.maquina_id === maquinaId);
    
    if (event.target.checked && !yaSeleccionada) {
      this.maquinasArray.push(this.fb.group({
        maquina_id: [maquinaId],
        seleccionada: [true]
      }));
    } else if (!event.target.checked && yaSeleccionada) {
      const index = this.maquinasArray.controls.findIndex(
        control => control.get('maquina_id')?.value === maquinaId
      );
      if (index !== -1) {
        this.maquinasArray.removeAt(index);
      }
    }
  }

  isMaquinaSeleccionada(maquinaId: number): boolean {
    return this.maquinasArray.value.some((m: any) => m.maquina_id === maquinaId && m.seleccionada);
  }

  guardarCorte(): void {
    if (this.corteForm.invalid) {
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
      temporada_id: this.temporadaId,
      maquinas: this.maquinasArray.value
        .filter((m: any) => m.seleccionada)
        .map((m: any) => parseInt(m.maquina_id)),
      trabajadores: formData.trabajadores.map((t: any) => ({
        trabajador_id: parseInt(t.trabajador_id),
        precio_acordado: parseFloat(t.precio_acordado)
      }))
    };

    this.cortesService.crearCorte(corteData).subscribe({
      next: (corteCreado) => {
        this.corteCreado.emit(corteCreado);
        this.cerrarModal();
        this.resetForm();
        this.guardando = false;
        
        Swal.fire({
          title: '¡Éxito!',
          text: 'Corte creado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (error) => {
        this.guardando = false;
        console.error('Error al crear corte:', error);
        
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'No se pudo crear el corte. Inténtalo de nuevo.',
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
      Object.keys((control as FormGroup).controls).forEach(key => {
        const nestedControl = control.get(key);
        if (nestedControl && nestedControl.invalid) {
          nestedControl.markAsTouched();
        }
      });
    });
  }

  private cerrarModal(): void {
    const modalElement = document.getElementById('modalNuevoCorte');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  private resetForm(): void {
    this.corteForm.reset();
    // Limpiar arrays
    while (this.maquinasArray.length !== 0) {
      this.maquinasArray.removeAt(0);
    }
    while (this.trabajadoresArray.length !== 0) {
      this.trabajadoresArray.removeAt(0);
    }
    
    // Restablecer fecha mínima
    const hoy = new Date().toISOString().split('T')[0];
    this.corteForm.get('fecha_inicio')?.patchValue(hoy);
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
