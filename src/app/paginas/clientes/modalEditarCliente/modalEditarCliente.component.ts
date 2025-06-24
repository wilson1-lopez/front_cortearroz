import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Cliente } from '../../../modelos/cliente.model';
import { ClientesService } from '../../../servicios/clientes.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modalEditarCliente',
  imports: [ReactiveFormsModule],
  templateUrl: './modalEditarCliente.component.html',
  styleUrl: './modalEditarCliente.component.css'
})
export class ModalEditarClienteComponent implements OnChanges {
  @Input() clienteParaEditar: Cliente | null = null;
  @Output() clienteEditado = new EventEmitter<Cliente>();
  
  clienteForm: FormGroup;
  guardando: boolean = false;

  constructor(
    private clientesService: ClientesService,
    private fb: FormBuilder,
  ) {
    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      cedula: ['', [Validators.required, Validators.pattern(/^[0-9]{8,10}$/)]],
      direccion: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['clienteParaEditar'] && this.clienteParaEditar) {
      this.cargarDatosCliente();
    }
  }

  private cargarDatosCliente() {
    if (this.clienteParaEditar) {
      this.clienteForm.patchValue({
        nombre: this.clienteParaEditar.nombre,
        apellido: this.clienteParaEditar.apellido,
        telefono: this.clienteParaEditar.telefono,
        cedula: this.clienteParaEditar.cedula,
        direccion: this.clienteParaEditar.direccion
      });
    }
  }

  guardarCambios() {
    if (this.clienteForm.invalid) {
      this.mostrarErroresValidacion();
      return;
    }

    if (!this.clienteParaEditar?.id) {
      return;
    }

    this.guardando = true;
    const clienteActualizado: Cliente = {
      ...this.clienteForm.value,
      id: this.clienteParaEditar.id
    };

    this.clientesService.editarCliente(this.clienteParaEditar.id, clienteActualizado).subscribe({
      next: (cliente: Cliente) => {
        this.clienteEditado.emit(cliente);
        this.cerrarModal();
        this.guardando = false;
        
        Swal.fire({
          title: '¡Éxito!',
          text: 'Cliente actualizado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (error: any) => {
        this.guardando = false;
        console.error('Error al actualizar cliente:', error);
        
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el cliente. Inténtalo de nuevo.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  private mostrarErroresValidacion() {
    Object.keys(this.clienteForm.controls).forEach(key => {
      const control = this.clienteForm.get(key);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  private cerrarModal() {
    const modalElement = document.getElementById('modalEditarCliente');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  getErrorMessage(campo: string): string {
    const control = this.clienteForm.get(campo);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) {
        return `${campo.charAt(0).toUpperCase() + campo.slice(1)} es requerido`;
      }
      if (control.errors['minlength']) {
        return `${campo.charAt(0).toUpperCase() + campo.slice(1)} debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`;
      }
      if (control.errors['pattern']) {
        if (campo === 'telefono') {
          return 'El teléfono debe tener 10 dígitos';
        }
        if (campo === 'cedula') {
          return 'La cédula debe tener entre 8 y 10 dígitos';
        }
      }
    }
    return '';
  }
}
