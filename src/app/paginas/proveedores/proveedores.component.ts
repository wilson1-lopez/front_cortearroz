import { Component, OnInit } from '@angular/core';
import { ProveedoresService } from '../../servicios/proveedores.service';
import { Proveedor } from '../../modelos/proveedor.model';
import { ModalagregarProveedorComponent } from './modalAgregarProveedor/modalAgregarProveedor.component';
import { ModalEditarProveedorComponent } from './modal-editar-proveedor/modal-editar-proveedor.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [ModalagregarProveedorComponent, ModalEditarProveedorComponent],
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.css'
})
export class ProveedoresComponent implements OnInit {
  proveedor: Proveedor[] = [];
  proveedorSeleccionado: Proveedor | null = null;

  constructor(private proveedoresService: ProveedoresService) {}

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores() {
    this.proveedoresService.obtenerProveedores().subscribe({
      next: (data) => this.proveedor = data,
      error: (error) => console.error('Error al cargar los proveedores:', error)
    });
  }

  agegarProveedor(proveedor: Proveedor) {
    this.proveedor.push(proveedor);
  }

  actualizarLista() {
    this.cargarProveedores();
  }

 eliminarProveedor(id: number) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el proveedor de forma permanente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.proveedoresService.eliminarProveedor(id).subscribe({
        next: () => {
          this.actualizarLista();
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'El proveedor fue eliminado correctamente.',
            timer: 1800,
            showConfirmButton: false
          });
        },
        error: (error) => {
          const mensaje = error?.error?.mensaje || 'No se pudo eliminar el proveedor.';
          Swal.fire({
            icon: 'error',
            title: 'Error al eliminar',
            text: mensaje,
          });
          console.error('Error al eliminar el proveedor:', error);
        }
      });
    }
  });
}
  abrirModalEditar(proveedor: Proveedor) {
    this.proveedorSeleccionado = { ...proveedor }; 
  }
}