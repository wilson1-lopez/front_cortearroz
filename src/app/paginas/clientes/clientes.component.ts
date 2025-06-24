import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../servicios/clientes.service';
import { Cliente } from '../../modelos/cliente.model';
import { ModalAgregarClienteComponent } from './modalAgregarCliente/modalAgregarCliente.component';
import { ModalEditarClienteComponent } from './modalEditarCliente/modalEditarCliente.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [ModalAgregarClienteComponent, ModalEditarClienteComponent],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clienteSeleccionado: Cliente | null = null;

  constructor(private clientesService: ClientesService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes() {
    this.clientesService.obtenerClientes().subscribe({
      next: (data) => this.clientes = data,
      error: (error) => console.error('Error al cargar los clientes:', error)
    });
  }

  agregarCliente(cliente: Cliente) {
    this.clientes.push(cliente);
  }

  actualizarLista() {
    this.cargarClientes();
  }

  eliminarCliente(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el cliente de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientesService.eliminarCliente(id).subscribe({
          next: () => {
            this.cargarClientes();
            Swal.fire({
              title: '¡Eliminado!',
              text: 'El cliente ha sido eliminado correctamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
          },
          error: (error) => {
            console.error('Error al eliminar cliente:', error);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar el cliente.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        });
      }
    });
  }

  editarCliente(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    // Abrir el modal de editar
    const modalElement = document.getElementById('modalEditarCliente');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  onClienteEditado(clienteEditado: Cliente) {
    // Actualizar la lista después de editar
    this.cargarClientes();
    this.clienteSeleccionado = null;
  }
}
