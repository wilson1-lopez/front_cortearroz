import { Component, EventEmitter, Output } from '@angular/core';
import { Cliente } from '../../../modelos/cliente.model';
import { ClientesService } from '../../../servicios/clientes.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modalAgregarCliente',
  imports: [ReactiveFormsModule],
  templateUrl: './modalAgregarCliente.component.html',
  styleUrl: './modalAgregarCliente.component.css'
})
export class ModalAgregarClienteComponent {
  // Evento que se dispara cuando se crea un cliente nuevo
  @Output() clienteCreado = new EventEmitter<Cliente>();
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

  guardarCliente() {
    if (this.clienteForm.invalid) {
      this.mostrarErroresValidacion();
      return;
    }

    this.guardando = true;
    const nuevoCliente: Cliente = this.clienteForm.value;

    this.clientesService.agregarCliente(nuevoCliente).subscribe({
      next: (clienteCreado) => {
        this.clienteCreado.emit(clienteCreado);
        this.cerrarModal();
        this.clienteForm.reset();
        this.guardando = false;
        
        Swal.fire({
          title: '¡Éxito!',
          text: 'Cliente creado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (error) => {
        this.guardando = false;
        console.error('Error al crear cliente:', error);
        
        Swal.fire({
          title: 'Error',
          text: 'No se pudo crear el cliente. Inténtalo de nuevo.',
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
    const modalElement = document.getElementById('modalNuevoCliente');
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
