import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
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
  tiposTrabajadores: TipoTrabajador[] = [];

  constructor(
    private fb: FormBuilder,
    private cortesService: CortesService,
    private tiposTrabajadoresService: TiposTrabajadoresService,
    private cdr: ChangeDetectorRef
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
    // Cargar tipos de trabajadores
    this.cargarTiposTrabajadores();
    
    // Si ya tenemos un corte y los datos auxiliares están disponibles, cargar los datos
    if (this.corte && this.trabajadores.length > 0) {
      this.cargarDatosCorte();
    }
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

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges ejecutado:', changes);
    
    // Si cambian los tipos de trabajadores y tenemos un corte, recargar
    if (changes['tiposTrabajadores'] && this.corte) {
      console.log('Cambio detectado en tipos de trabajadores, recargando datos del corte');
      this.cargarDatosCorte();
    }
    
    // Si cambian los trabajadores y ya tenemos un corte cargado, recargar datos
    if (changes['trabajadores'] && this.corte && this.trabajadores.length > 0) {
      console.log('Cambio detectado en trabajadores, recargando datos del corte');
      this.cargarDatosCorte();
    }
    
    // Si cambia el corte y tenemos datos auxiliares, cargar datos del corte
    if (changes['corte'] && this.corte) {
      console.log('Cambio detectado en corte:', this.corte);
      // Solo cargar si ya tenemos los datos auxiliares necesarios
      if (this.trabajadores.length > 0 && this.tiposTrabajadores.length > 0) {
        this.cargarDatosCorte();
      }
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

    console.log('Cargando datos del corte:', this.corte);
    console.log('Trabajadores disponibles:', this.trabajadores);
    console.log('Tipos de trabajadores disponibles:', this.tiposTrabajadores);

    // Formatear fechas correctamente para inputs de tipo date
    const fechaInicio = this.corte.fecha_inicio ? new Date(this.corte.fecha_inicio).toISOString().split('T')[0] : '';
    const fechaFin = this.corte.fecha_fin ? new Date(this.corte.fecha_fin).toISOString().split('T')[0] : '';

    this.corteForm.patchValue({
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      valor_bulto: this.corte.valor_bulto,
      descripcion: this.corte.descripcion || '',
      cliente_id: this.corte.cliente_id
    });

    console.log('Valores asignados al form:', {
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      valor_bulto: this.corte.valor_bulto,
      descripcion: this.corte.descripcion,
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
    if (this.corte.trabajadores && this.corte.trabajadores.length > 0) {
      console.log('Trabajadores del corte:', this.corte.trabajadores);
      
      this.corte.trabajadores.forEach(trabajadorCorte => {
        // Buscar el trabajador completo en la lista para obtener su tipo_id
        const trabajadorCompleto = this.trabajadores.find(t => t.id === trabajadorCorte.id);
        
        console.log(`Procesando trabajador del corte:`, trabajadorCorte);
        console.log(`Trabajador completo encontrado:`, trabajadorCompleto);
        
        if (trabajadorCompleto) {
          const grupoTrabajador = this.fb.group({
            tipo_id: [trabajadorCompleto.tipo_id, [Validators.required]],
            trabajador_id: [trabajadorCorte.id, [Validators.required]],
            precio_acordado: [trabajadorCorte.precio_acordado, [Validators.required, Validators.min(0)]]
          });
          
          console.log('Agregando trabajador al form:', {
            tipo_id: trabajadorCompleto.tipo_id,
            trabajador_id: trabajadorCorte.id,
            precio_acordado: trabajadorCorte.precio_acordado
          });
          
          this.trabajadoresArray.push(grupoTrabajador);
        } else {
          console.warn(`No se encontró el trabajador completo para ID: ${trabajadorCorte.id}`);
          // Si no encontramos el trabajador completo, creamos el grupo con los datos disponibles
          const grupoTrabajador = this.fb.group({
            tipo_id: ['', [Validators.required]],
            trabajador_id: [trabajadorCorte.id, [Validators.required]],
            precio_acordado: [trabajadorCorte.precio_acordado, [Validators.required, Validators.min(0)]]
          });
          
          this.trabajadoresArray.push(grupoTrabajador);
        }
      });
    }
    
    console.log('Estado final del form trabajadores:', this.trabajadoresArray.value);
    console.log('Estado completo del form:', this.corteForm.value);
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
      
      // Forzar detección de cambios
      this.trabajadoresArray.updateValueAndValidity();
      this.cdr.detectChanges();
    }
  }

  getTrabajadoresPorTipo(tipoId: string | null): Trabajador[] {
    if (!tipoId || tipoId === '' || tipoId === '0') {
      console.log('Tipo ID vacío o inválido:', tipoId);
      return [];
    }
    
    const tipoIdNumber = parseInt(tipoId.toString());
    if (isNaN(tipoIdNumber)) {
      console.log('Tipo ID no es un número válido:', tipoId);
      return [];
    }
    
    const trabajadoresFiltrados = this.trabajadores.filter(trabajador => {
      const match = trabajador.tipo_id === tipoIdNumber;
      console.log(`Trabajador ${trabajador.nombre} (tipo_id: ${trabajador.tipo_id}) ${match ? 'coincide' : 'no coincide'} con tipo ${tipoIdNumber}`);
      return match;
    });
    
    console.log(`Filtrando trabajadores para tipo_id ${tipoIdNumber}:`, trabajadoresFiltrados);
    console.log('Todos los trabajadores disponibles:', this.trabajadores);
    return trabajadoresFiltrados;
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
      Object.keys((control as FormGroup).controls).forEach(key => {
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

  // Método para reinicializar el modal cuando se abre
  inicializarModal(): void {
    console.log('Inicializando modal con datos actuales');
    console.log('Corte seleccionado:', this.corte);
    console.log('Trabajadores disponibles:', this.trabajadores);
    console.log('Tipos de trabajadores disponibles:', this.tiposTrabajadores);
    
    if (this.corte && this.trabajadores.length > 0 && this.tiposTrabajadores.length > 0) {
      this.cargarDatosCorte();
    }
  }

  trackByTrabajadorId(index: number, trabajador: Trabajador): number {
    return trabajador.id || index;
  }

  trackByTipoId(index: number, tipo: TipoTrabajador): number {
    return tipo.id || index;
  }
}
